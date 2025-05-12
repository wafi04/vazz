import { getProfile } from "@/app/(auth)/auth/components/server";
import {
  DUITKU_API_KEY,
  DUITKU_CALLBACK_URL,
  DUITKU_MERCHANT_CODE,
} from "@/constants";
import { ValidationMethodPayment } from "@/features/transaction/method/validation";
import { PaymentUsingSaldo } from "@/features/transaction/payment/saldo";
import { checkingVoucher } from "@/features/transaction/voucher/checkingVoucher";
import { Duitku } from "@/lib/duitku/duitku";
import { prisma } from "@/lib/prisma";
import { handleOrderStatusChange } from "@/lib/whatsapp-message";
import { TRANSACTION_FLOW } from "@/types/transaction";
import { GenerateRandomId } from "@/utils/generateRandomId";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const CreateOrder = z.object({
  nickname: z.string().optional(),
  userId: z.string().min(3),
  voucherCode: z.string().optional().default(""),
  zone: z.string(),
  productCode: z.string(),
  paymentCode: z.string(),
  noWa: z.string(),
});

export type OrderInput = z.infer<typeof CreateOrder>;

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validationResult = CreateOrder.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          status: false,
          message: "Invalid request data",
          errors: validationResult.error.flatten().fieldErrors,
          code: 400,
        },
        { status: 400 }
      );
    }

    const {
      nickname,
      productCode,
      userId,
      voucherCode,
      zone,
      noWa,
      paymentCode,
    } = validationResult.data;

    // Get authenticated user
    const user = await getProfile();
    const merchantOrderId = GenerateRandomId();

    // Initialize Duitku
    const duitku = new Duitku(
      DUITKU_API_KEY as string,
      DUITKU_MERCHANT_CODE as string,
      DUITKU_CALLBACK_URL as string
    );

    return await prisma.$transaction(async (tx) => {
      // Find product
      const product = await tx.layanan.findFirst({
        where: {
          providerId: productCode,
        },
      });

      if (!product) {
        return NextResponse.json(
          {
            status: false,
            message: "Product not found",
            code: 404,
          },
          { status: 404 }
        );
      }

      // Calculate price based on user role
      let price: number;
      let profit: number;

      if (user && user.session.role === "Platinum") {
        price = product.hargaPlatinum;
        profit = product.profitPlatinum;
      } else if (user && user.session.role === "Reseller") {
        price = product.hargaReseller;
        profit = product.profitReseller;
      } else {
        price = product.harga;
        profit = product.profit;
      }

      // Process voucher if provided
      let discountAmount = 0;
      let appliedVoucherId = null;

      if (voucherCode) {
        const validated = await checkingVoucher(tx, {
          amount: price,
          voucherCode,
          categoryId: product?.kategoriId,
        });

        if (validated.status) {
          await tx.voucher.update({
            where: { id: validated.voucherId },
            data: { usageCount: { increment: 1 } },
          });

          price = validated.finalPrice as number;
          discountAmount = validated.discountAmount as number;
          appliedVoucherId = validated.voucherId;
        } else {
          return NextResponse.json(
            {
              status: false,
              message: validated.message,
              code: 400,
            },
            { status: 400 }
          );
        }
      }

      // Create purchase record
      await tx.pembelian.create({
        data: {
          harga: price,
          profit,
          isDigi: true,
          layanan: product.layanan,
          status: TRANSACTION_FLOW.PENDING,
          successReportSended: false,
          log: "Pembelian Pending",
          nickname,
          orderId: merchantOrderId,
          tipeTransaksi: "TOPUP",
          userId,
          zone,
          providerOrderId: productCode,
          username: user?.session.username ?? "Anonymous",
          createdAt: new Date(),
        },
      });

      // Process payment using balance if applicable
      if (user?.session.username && paymentCode === "SALDO") {
        const data = await PaymentUsingSaldo({
          amount: price,
          noWa,
          orderId: merchantOrderId,
          productCode: productCode,
          productName: product.layanan,
          tx,
          userId: userId,
          username: user.session.username,
          serverId: zone,
        });

        return NextResponse.json(
          {
            status: data.status,
            message: data.message,
            code: data.status ? 200 : 400,
            data: {
              orderId: merchantOrderId,
              productName: product.layanan,
              amount: price,
              discount: discountAmount,
              finalAmount: price,
              paymentMethod: "SALDO",
              timestamp: new Date().toISOString(),
              transactionDetails: data.data,
            },
          },
          { status: data.status ? 200 : 400 }
        );
      }

      // Process payment using Duitku
      else {
        // Validate payment method
        const method = await ValidationMethodPayment({
          amount: price,
          paymentCode,
          tx,
        });

        price = method.totalAmount;

        // Get base URL
        const baseUrl = new URL(req.url).origin;

        // Create Duitku transaction
        const toDuitku = await duitku.CreateTransaction({
          paymentAmount: price,
          paymentCode,
          merchantOrderId,
          productDetails: product.layanan,
          baseUrl,
          cust: user?.session.username ?? "Anonymous",
          noWa,
        });

        if (!toDuitku.status) {
          return NextResponse.json(
            {
              status: false,
              message: "Failed to create payment gateway transaction",
              code: 500,
              error: toDuitku.message,
            },
            { status: 500 }
          );
        }

        // Determine payment details based on payment method
        const urlPaymentMethods = ["DA", "OV", "SA"];
        const vaPaymentMethods = ["I1", "BR", "B1", "BT", "FT", "M2", "VA"];

        let paymentDetails = {};
        let noPembayaran = "";

        if (urlPaymentMethods.includes(paymentCode)) {
          noPembayaran = toDuitku.data.paymentUrl;
          paymentDetails = { paymentUrl: toDuitku.data.paymentUrl };
        } else if (vaPaymentMethods.includes(paymentCode)) {
          noPembayaran = toDuitku.data.vaNumber || "";
          paymentDetails = {
            vaNumber: toDuitku.data.vaNumber,
            bankName: toDuitku.data.bankName || "",
          };
        } else {
          noPembayaran = toDuitku.data.qrString || toDuitku.data.qr_string;
          paymentDetails = {
            qrString: toDuitku.data.qrString,
            qrCode: toDuitku.data.qrCode,
          };
        }

        // Create payment record
        await tx.pembayaran.create({
          data: {
            orderId: merchantOrderId,
            harga: price.toString(),
            metode: paymentCode,
            noPembeli: noWa,
            status: "PENDING",
            reference: toDuitku.data.reference,
            noPembayaran,
            createdAt: new Date(),
          },
        });

        const invoiceUrl = `${baseUrl}/invoice?invoice=${merchantOrderId}`;

        // Send WhatsApp notification
        await handleOrderStatusChange({
          orderData: {
            amount: price,
            link: invoiceUrl,
            productName: product.layanan,
            status: "PENDING",
            customerName: user?.session.username || "Anonymous",
            method: paymentCode,
            orderId: merchantOrderId,
            whatsapp: noWa,
          },
        });

        // Return successful response
        return NextResponse.json(
          {
            status: true,
            message: "Transaction created successfully",
            code: 201,
            data: {
              orderId: merchantOrderId,
              reference: toDuitku.data.reference,
              transactionId: merchantOrderId,
              productName: product.layanan,
              discount: discountAmount,
              finalAmount: price,
              paymentMethod: paymentCode,
              paymentUrl: invoiceUrl,
              timestamp: new Date().toISOString(),
              ...paymentDetails,
            },
          },
          { status: 201 }
        );
      }
    });
  } catch (error) {
    console.error("Transaction error:", error);
    return NextResponse.json(
      {
        status: false,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while processing your request",
        code: 500,
      },
      { status: 500 }
    );
  }
}
