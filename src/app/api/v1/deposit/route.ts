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

    // Raw SQL untuk cari payment method - lebih cepat
    const methodResult = (await prisma.$queryRaw`
      SELECT name, code, tax_type AS "taxType", tax_admin AS "taxAdmin"
      FROM payment_methods 
      WHERE code = ${code} 
      LIMIT 1
    `) as Array<{
      name: string;
      code: string;
      taxType: string;
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
    let feeAmount = 0;

    if (method.taxType === "PERCENTAGE") {
      fee = (amount * method.taxAdmin) / 100;
      feeAmount = fee;
    } else if (method.taxType === "FIXED") {
      fee = method.taxAdmin;
      feeAmount = method.taxAdmin;
    } else {
      fee = method.taxAdmin;
      feeAmount = method.taxAdmin;
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

    // Tentukan paymentNumber dari response Duitku
    const urlPaymentMethods = ["DA", "OV", "SA"];
    const vaPaymentMethods = ["I1", "BR", "B1", "BT", "SP", "FT", "M2", "VA"];
    let paymentNumber = "";

    if (urlPaymentMethods.includes(method.code)) {
      paymentNumber = paymentData.data.paymentUrl;
    } else if (vaPaymentMethods.includes(method.code)) {
      paymentNumber = paymentData.data.vaNumber || "";
    } else {
      paymentNumber = paymentData.data.qrString || "";
    }

    const currentTime = getWIBTime();
    const logData = JSON.stringify(paymentData.data);

    // Raw SQL Transaction - jauh lebih cepat
    const result = await prisma.$transaction(async (tx) => {
      // Insert deposit jika tipe DEPOSIT
      if (type === "DEPOSIT") {
        await tx.$executeRaw`
          INSERT INTO deposits (
            username, method, status, amount,
            payment_reference, deposit_id, created_at, updated_at, log
          )
          VALUES (
            ${user.username}, ${method.name}, 'PENDING', ${amount}, 
            ${paymentNumber}, ${merchantOrderId}, 
            ${currentTime}, ${currentTime}, ${logData}
          )
        `;
      }

      // Insert transaction
      const transactionResult = (await tx.$queryRaw`
        INSERT INTO transactions (
          profit, profit_amount, username, price, transaction_type, 
          service_name, order_id, status, is_digi, success_report_sent, log, message,
          created_at, updated_at
        )
        VALUES (
          ${amount}, ${amount}, ${user.username}, ${amount}, ${type}, 
          ${
            type === "Membership"
              ? `Membership ${user.username}`
              : `Deposit ${user.username}`
          }, 
          ${merchantOrderId}, 'PENDING', 'false', 'false', ${logData}, 'Transaction Pending',
          ${currentTime}, ${currentTime}
        )
        RETURNING *
      `) as Array<any>;

      // Insert payment
      await tx.$executeRaw`
        INSERT INTO payments (
          price, method, buyer_number, status, order_id, 
          payment_number, reference, fee_amount, total_amount, created_at, updated_at
        )
        VALUES (
          ${amount.toString()}, ${method.name}, ${user.whatsapp}, 'PENDING', 
          ${merchantOrderId}, ${paymentNumber}, 
          ${paymentData.data.reference || ""}, 
          ${feeAmount}, ${amount + feeAmount},
          ${currentTime}, ${currentTime}
        )
      `;

      return transactionResult[0];
    });

    return NextResponse.json({
      data: {
        ...result,
        fee: feeAmount,
        totalAmount: totalAmount,
        originalAmount: amount,
        paymentNumber: paymentNumber,
      },
      status: true,
      statusCode: 201,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
