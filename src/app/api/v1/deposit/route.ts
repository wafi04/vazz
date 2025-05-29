import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { DUITKU_API_KEY, DUITKU_MERCHANT_CODE } from "@/constants";
import { findUserById, getProfile } from "@/app/(auth)/auth/components/server";
import { GenerateRandomId } from "@/utils/generateRandomId";
import { Duitku } from "@/app/api/v1/duitku/duitku/duitku";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, code, type } = body;

    const session = await getProfile();
    if (!session?.session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserById(session.session.id);
    if (!user) {
      return NextResponse.json({ error: "User not Found" }, { status: 404 });
    }

    const method = await prisma.method.findFirst({
      where: { code },
      select: { name: true, code: true },
    });

    if (!method) {
      return NextResponse.json(
        { error: "Payment method not found" },
        { status: 404 }
      );
    }

    // Generate unique ID for merchant order
    const merchantOrderId = GenerateRandomId(
      type === "Membership" ? "MEM" : "DEP"
    );
    const paymentAmount = amount.toString();

    const duitku = new Duitku(
      DUITKU_API_KEY as string,
      DUITKU_MERCHANT_CODE as string
    );

    // Request payment to Duitku
    const paymentData = await duitku.CreateTransaction({
      paymentAmount,
      paymentCode: code,
      merchantOrderId,
      productDetails:
        type === "Membership"
          ? `Membership ${user.username}`
          : `Deposit  ${user.username}`,
      noWa: user.whatsapp as string,
      cust: user.username,
      returnUrl: `${process.env.NEXTAUTH_URL}/profile`,
    });

    console.log(paymentData);

    if (paymentData.data.statusCode !== "00") {
      return NextResponse.json(
        {
          error: `Failed to create payment: ${paymentData.data.statusMessage}`,
        },
        { status: 400 }
      );
    }

    // Tentukan noPembayaran dari response Duitku
    const urlPaymentMethods = ["DA", "OV", "SA", "QR"];
    const vaPaymentMethods = ["I1", "BR", "B1", "BT", "SP", "FT", "M2", "VA"];
    let noPayment = "";

    if (urlPaymentMethods.includes(method.code)) {
      noPayment = paymentData.data.paymentUrl;
    } else if (vaPaymentMethods.includes(method.code)) {
      noPayment = paymentData.data.vaNumber || "";
    } else {
      noPayment =
        paymentData.data.vaNumber || paymentData.data.paymentUrl || "";
    }

    // Jalankan interactive transaction
    const result = await prisma.$transaction(async (tx) => {
      if (type === "DEPOSIT") {
        const deposit = await tx.deposits.create({
          data: {
            username: user.username,
            metode: method.name,
            status: "PENDING",
            jumlah: amount,
            noPembayaran: noPayment,
            depositId: merchantOrderId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      const pembelian = await tx.pembelian.create({
        data: {
          profit: amount,
          profitRupiah: amount,
          username: user.username,
          harga: amount,
          tipeTransaksi: type,
          layanan:
            type === "Membership"
              ? `Membership ${user.username}`
              : `Deposit  ${user.username}`,
          orderId: merchantOrderId,
          status: "PENDING",
          isDigi: false,
          successReportSended: false,
        },
      });

      await tx.pembayaran.create({
        data: {
          harga: paymentAmount,
          metode: method.name,
          noPembeli: user.whatsapp as string,
          status: "PENDING",
          orderId: merchantOrderId,
          noPembayaran: noPayment,
          reference: paymentData.data.reference || paymentData.data.ref_id,
        },
      });

      return pembelian;
    });

    return NextResponse.json({
      data: result,
      status: true,
      statusCode: 201,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
