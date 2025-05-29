import { DIGI_KEY, DIGI_USERNAME } from "@/constants";
import { Digiflazz } from "@/lib/digiflazz";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/types/transaction";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { CalculatePricingWithProfitLogic } from "../create/calculateProfit";
import { ProductData } from "@/types/product";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const digiflazz = new Digiflazz(DIGI_USERNAME, DIGI_KEY);
    const {
      orderId,
      createdBy,
      reason,
      whatsapp,
      userId,
      nickname,
      zone,
      productCode,
      productName,
    } = body;

    // Validate required fields berdasarkan mode (dengan atau tanpa orderId)
    if (orderId) {
      // Mode reorder dari pembelian yang sudah ada
      if (!orderId) {
        return NextResponse.json(
          {
            message: "Missing Required orderId for reorder mode",
            code: 400,
            success: false,
          },
          {
            status: 400,
          }
        );
      }
    } else {
      if (!userId || !productCode || !whatsapp) {
        return NextResponse.json(
          {
            message:
              "Missing required fields: userId, productCode, and whatsapp are required for new order",
            code: 400,
            success: false,
          },
          {
            status: 400,
          }
        );
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      let data: any;
      let referenceId: string;

      if (orderId) {
        // Mode reorder - ambil data dari pembelian yang sudah ada
        const pembelian = await tx.pembelian.findUnique({
          where: {
            orderId,
          },
        });

        if (!pembelian) {
          throw new Error("Failed To Find Pembelian");
        }

        data = {
          productName: productName ?? pembelian.layanan,
          userId: userId ?? pembelian.userId,
          whatsapp: whatsapp ?? "99072072",
          zone: zone ?? pembelian.zone,
          nickname: nickname ?? pembelian.nickname,
        };

        referenceId = `RE${orderId}`;

        // Buat record pembelian manual
        const reorder = await tx.pembelianManual.create({
          data: {
            ...data,
            orderId,
            pembelianManualId: referenceId,
            status: "PENDING",
            reason: reason ?? "Reorder from existing purchase",
            createdBy,
          },
        });

        // Panggil API Digiflazz
        const toDigi = await digiflazz.TopUp({
          productCode: (pembelian.providerOrderId as string) ?? productCode,
          userId: data.userId,
          reference: referenceId,
          serverId: data.zone,
        });

        return await handleDigiflazzResponse(tx, toDigi, reorder);
      } else {
        // Mode pembelian baru tanpa orderId
        const product = await tx.layanan.findFirst({
          where: {
            providerId: productCode,
          },
        });

        if (!product) {
          throw new Error("Product not found");
        }

        const calculateProfit = CalculatePricingWithProfitLogic(
          product as ProductData
        );
        let profitRupiah = calculateProfit.profitRupiah;

        data = {
          productName: productName ?? product.layanan ?? "Manual Order",
          userId,
          profit: product.profit,
          harga: product.harga,
          profitRupiah,
          whatsapp,
          zone,
          nickname,
        };

        // Generate reference ID unik untuk pembelian baru
        const timestamp = Date.now();
        referenceId = `MO${timestamp}`;

        // Buat record pembelian manual
        const newOrder = await tx.pembelianManual.create({
          data: {
            ...data,
            orderId: null, // Tidak ada orderId karena ini pembelian baru
            pembelianManualId: referenceId,
            status: "PENDING",
            reason: reason ?? "New manual order",
            createdBy,
          },
        });

        // Panggil API Digiflazz
        const toDigi = await digiflazz.TopUp({
          productCode,
          userId,
          reference: referenceId,
          serverId: zone,
        });

        return await handleDigiflazzResponse(tx, toDigi, newOrder);
      }
    });

    // Handle the result from transaction
    if (result.success as any) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : error,
        code: 500,
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

// Helper function untuk handle response dari Digiflazz
async function handleDigiflazzResponse(
  tx: Prisma.TransactionClient,
  toDigi: TransactionType | undefined,
  orderRecord: any
) {
  const Success = toDigi?.data.status === "Pending";

  if (toDigi && toDigi.data && Success) {
    await tx.pembelianManual.update({
      where: {
        id: orderRecord.id,
      },
      data: {
        status: "PAID",
      },
    });

    return {
      success: true,
      message: orderRecord.orderId
        ? "Reorder Successfully"
        : "New Order Created Successfully",
      statusCode: 201,
      data: orderRecord,
    };
  } else {
    await tx.pembelianManual.update({
      where: {
        id: orderRecord.id,
      },
      data: {
        status: "FAILED",
      },
    });

    return {
      success: false,
      message: orderRecord.orderId
        ? "Failed To Create Reorder"
        : "Failed To Create New Order",
      statusCode: 400,
    };
  }
}
