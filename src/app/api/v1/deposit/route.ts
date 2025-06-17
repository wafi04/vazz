import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { DUITKU_API_KEY, DUITKU_MERCHANT_CODE } from "@/constants";
import { findUserById, getProfile } from "@/app/(auth)/auth/components/server";
import { GenerateRandomId } from "@/utils/generateRandomId";
import { Duitku } from "@/app/api/v1/duitku/duitku/duitku";
import { getWIBTime } from "@/utils/helpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, totalAmount, code, type } = body;

    const session = await getProfile();
    if (!session?.session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserById(session.session.id);
    if (!user) {
      return NextResponse.json({ error: "User not Found" }, { status: 404 });
    }

    // Raw SQL untuk cari method - lebih cepat
    const methodResult = (await prisma.$queryRaw`
      SELECT name, code, type_tax AS "typeTax", tax_admin AS "taxAdmin"
      FROM methods 
      WHERE code = ${code} 
      LIMIT 1
    `) as Array<{
      name: string;
      code: string;
      typeTax: string;
      taxAdmin: number;
    }>;

    if (methodResult.length === 0) {
      return NextResponse.json(
        { error: "Payment method not found" },
        { status: 404 }
      );
    }

    const method = methodResult[0];

    // Generate unique ID for merchant order
    const merchantOrderId = GenerateRandomId(
      type === "Membership" ? "MEM" : "DEP"
    );

    let fee = 0;
    let feeRupiah = 0;

    if (method.typeTax === "PERCENTAGE") {
      fee = (amount * method.taxAdmin) / 100;
      feeRupiah = fee;
    } else if (method.typeTax === "FIXED") {
      fee = method.taxAdmin;
      feeRupiah = method.taxAdmin;
    } else {
      fee = method.taxAdmin;
      feeRupiah = method.taxAdmin;
    }

    const duitku = new Duitku(
      DUITKU_API_KEY as string,
      DUITKU_MERCHANT_CODE as string
    );

    const paymentData = await duitku.CreateTransaction({
      paymentAmount: amount,
      paymentCode: code,
      merchantOrderId,
      productDetails:
        type === "Membership"
          ? `Membership ${user.username}`
          : `Deposit ${user.username}`,
      noWa: user.whatsapp as string,
      cust: user.username,
      returnUrl: `${process.env.NEXTAUTH_URL}/profile`,
      callbackUrl: `${process.env.NEXTAUTH_URL}/api/v1/callback/duitku`,
    });

    if (paymentData.data.statusCode !== "00") {
      return NextResponse.json(
        {
          error: `Failed to create payment: ${paymentData.data.statusMessage}`,
        },
        { status: 400 }
      );
    }

    // Tentukan noPembayaran dari response Duitku
    const urlPaymentMethods = ["DA", "OV", "SA"];
    const vaPaymentMethods = ["I1", "BR", "B1", "BT", "SP", "FT", "M2", "VA"];
    let noPayment = "";

    if (urlPaymentMethods.includes(method.code)) {
      noPayment = paymentData.data.paymentUrl;
    } else if (vaPaymentMethods.includes(method.code)) {
      noPayment = paymentData.data.vaNumber || "";
    } else {
      noPayment = paymentData.data.qrString || "";
    }

    const currentTime = getWIBTime();
    const logData = JSON.stringify(paymentData.data);

    // Raw SQL Transaction - jauh lebih cepat
    const result = await prisma.$transaction(async (tx) => {
      // Insert deposit jika tipe DEPOSIT
      if (type === "DEPOSIT") {
        await tx.$executeRaw`
          INSERT INTO deposits (
            username, metode, status, jumlah,
            no_pembayaran, deposit_id, created_at, updated_at, log
          )
          VALUES (
            ${user.username}, ${method.name}, 'PENDING', ${amount}, 
            ${noPayment}, ${merchantOrderId}, 
            ${currentTime}, ${currentTime}, ${logData}
          )
        `;
      }

      // Insert pembelian
      const pembelianResult = (await tx.$queryRaw`
        INSERT INTO pembelians (
          profit, profit_rupiah, username, harga, tipe_transaksi, 
          layanan, order_id, status, is_digi, success_report_sended,log,message
        )
        VALUES (
          ${amount}, ${amount}, ${user.username}, ${amount}, ${type}, 
          ${
            type === "Membership"
              ? `Membership ${user.username}`
              : `Deposit ${user.username}`
          }, 
          ${merchantOrderId}, 'PENDING', false, false,${logData},"Pembelian Pending"
        )
        RETURNING *
      `) as Array<any>;

      await tx.$executeRaw`
        INSERT INTO pembayarans (
          harga, metode, no_pembeli, status, order_id, 
          no_pembayaran, reference, fee, total_amount,created_at
        )
        VALUES (
          ${amount}, ${method.name}, ${user.whatsapp}, 'PENDING', 
          ${merchantOrderId}, ${noPayment}, 
          ${paymentData.data.reference || ""}, 
          ${feeRupiah}, ${amount + feeRupiah},
          ${currentTime}
        )
      `;

      return pembelianResult[0];
    });

    return NextResponse.json({
      data: {
        ...result,
        fee: feeRupiah,
        totalAmount: totalAmount,
        originalAmount: amount,
        noPayment: noPayment,
      },
      status: true,
      statusCode: 201,
    });
  } catch (error) {
    console.error("Payment API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
