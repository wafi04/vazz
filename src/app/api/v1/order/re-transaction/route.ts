import { DIGI_KEY, DIGI_USERNAME } from "@/constants";
import { Digiflazz } from "@/lib/digiflazz";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const digiflazz = new Digiflazz(DIGI_USERNAME, DIGI_KEY);
  const { orderId, createdBy, reason } = body;
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

    const reorder = await tx.pembelianManual.create({
      data: {
        orderId,
        pembelianManualId: `RE${orderId}`,
        status: "PENDING",
        reason,
        createdBy,
      },
    });

    const toDigi = await digiflazz.TopUp({
      productCode: pembelian.providerOrderId as string,
      userId: pembelian.userId as string,
      reference: pembelian.refId as string,
      serverId: pembelian.zone ?? "",
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
}
