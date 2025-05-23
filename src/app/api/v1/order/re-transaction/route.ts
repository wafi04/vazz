import { DIGI_KEY, DIGI_USERNAME } from "@/constants";
import { Digiflazz } from "@/lib/digiflazz";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
    if (!body) {
      return NextResponse.json(
        {
          message: "Missing required orderId",
          success: false,
          statusCode: 400,
        },
        {
          status: 400,
        }
      );
    }

    await prisma.$transaction(async (tx) => {
      const pembelian = await tx.pembelian.findUnique({
        where: {
          orderId,
        },
      });

      if (!pembelian) {
        return NextResponse.json(
          {
            message: "Failed To Find Pembelian",
            success: false,
            statusCode: 400,
          },
          {
            status: 400,
          }
        );
      }
      let data = {
        productName: productName ?? pembelian.layanan,
        userId: userId ?? pembelian.userId,
        whatsapp,
        zone: pembelian.zone ?? zone,
        nickname: pembelian.nickname ?? nickname,
      };
      const reorder = await tx.pembelianManual.create({
        data: {
          ...data,
          orderId,
          pembelianManualId: `RE${orderId}`,
          status: "PENDING",
          reason,
          createdBy,
        },
      });

      const toDigi = await digiflazz.TopUp({
        productCode: (pembelian.providerOrderId as string) ?? productCode,
        userId: (pembelian.userId as string) ?? userId,
        reference: pembelian.refId as string,
        serverId: pembelian.zone ?? zone,
      });

      if (toDigi && toDigi.data) {
        await tx.pembelianManual.update({
          where: {
            id: reorder.id,
          },
          data: {
            status: "PAID",
          },
        });

        return NextResponse.json(
          {
            message: "Reorder Successfully",
            statusCode: 201,
            succes: true,
            data: reorder,
          },
          {
            status: 201,
          }
        );
      } else {
        await tx.pembelianManual.update({
          where: {
            id: reorder.id,
          },
          data: {
            status: "FAILED",
          },
        });
        return NextResponse.json(
          {
            message: "Failed To Create Reorder",
            success: false,
            statusCode: 400,
          },
          {
            status: 400,
          }
        );
      }
    });
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
