import { getProfile } from "@/app/(auth)/auth/components/server";
import { DUITKU_API_KEY, DUITKU_MERCHANT_CODE } from "@/constants";
import { ValidationMethodPayment } from "@/features/transaction/method/validation";
import { PaymentUsingSaldo } from "@/features/transaction/payment/saldo";
import { checkingVoucher } from "@/features/transaction/voucher/checkingVoucher";
import { Duitku } from "@/app/api/v1/duitku/duitku/duitku";
import { prisma } from "@/lib/prisma";
import { TRANSACTION_FLOW } from "@/types/transaction";
import { GenerateRandomId } from "@/utils/generateRandomId";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ProductData } from "@/types/product";
import { CalculatePricingWithProfitLogic } from "./calculateProfit";

export const CreateOrder = z.object({
  nickname: z.string().optional(),
  userId: z.string().min(3),
  voucherCode: z.string().optional(),
  zone: z.string(),
  productCode: z.string(),
  paymentCode: z.string(),
  noWa: z.string(),
});

export type CreateOrderType = z.infer<typeof CreateOrder>;

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
    const merchantOrderId = GenerateRandomId("VAZZ");

    // Initialize Duitku with proper error handling
    const duitku = new Duitku(
      DUITKU_API_KEY as string,
      DUITKU_MERCHANT_CODE as string
    );

    // Use a timeout to prevent long-running transactions
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Transaction timeout")), 10000);
    });

    const transactionPromise = prisma.$transaction(
      async (tx) => {
        // Find product with explicit locking
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

        const calculatePricing = CalculatePricingWithProfitLogic(
          product as ProductData,
          user?.session.role
        );

        let price: number = Math.round(calculatePricing.price);
        let total: number = calculatePricing.price;
        let fee: number | null;
        let feeRupiah: number | null;
        let profit: number = calculatePricing.profitRupiah;

        // Process voucher if provided
        let discountAmount = 0;
        let appliedVoucherId = null;

        if (voucherCode) {
          const voucher = await tx.voucher.findUnique({
            where: { code: voucherCode },
            select: { id: true },
          });

          if (voucher) {
            await tx.$executeRaw`SELECT 1 FROM vouchers WHERE id = ${voucher.id} FOR UPDATE`;
          }

          const validated = await checkingVoucher(tx, {
            amount: price,
            voucherCode,
            categoryId: product?.kategoriId,
          });

          if (validated && validated.status && validated.voucherId) {
            await tx.voucher.update({
              where: { id: validated.voucherId },
              data: { usageCount: { increment: 1 } },
            });

            profit = calculatePricing.profitRupiah - validated.discountAmount;
            discountAmount = validated.discountAmount as number;
            appliedVoucherId = validated.voucherId;
            total = validated.finalPrice;
            await tx.voucherUsage.create({
              data: {
                amount: discountAmount,
                orderId: merchantOrderId,
                voucherId: validated.voucherId as number,
                username: user?.session.username,
                whatsapp: noWa,
              },
            });
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

          return {
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
          };
        } else {
          const method = await ValidationMethodPayment({
            amount: total,
            paymentCode,
            tx,
          });

          total = method.totalAmount;
          fee = method.methodTax ?? 0;
          feeRupiah = method.taxAmount;

          const baseUrl = req.headers.get("origin") || new URL(req.url).origin;

          const toDuitku = await duitku.CreateTransaction({
            paymentAmount: Math.round(total),
            paymentCode,
            merchantOrderId,
            productDetails: product.layanan,
            callbackUrl: `${baseUrl}/api/v1/callback/duitku`,
            returnUrl: `${baseUrl}/invoice?invoice=${merchantOrderId}`,
            cust: user?.session.username,
            noWa,
          });

          if (!toDuitku || !toDuitku.status) {
            return {
              status: false,
              message: "Failed to create payment gateway transaction",
              code: 500,
              error: toDuitku?.message || "API connection error",
            };
          }

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
            noPembayaran = toDuitku.data.qrString;
            paymentDetails = {
              qrString: toDuitku.data.qrString,
              qrCode: toDuitku.data.qrCode,
            };
          }

          const log = {
            ...toDuitku.data,
            message: "Pemblian Pending",
          };

          let pembelian;
          try {
            pembelian = await tx.pembelian.create({
              data: {
                profitRupiah: profit,
                harga: price,
                profit: calculatePricing.profit,
                isDigi: true,
                layanan: product.layanan,
                status: TRANSACTION_FLOW.PENDING,
                successReportSended: false,
                log: JSON.stringify(log),
                discount: discountAmount,
                priceBuy: product.hargaFromDigi,
                nickname,
                orderId: merchantOrderId,
                tipeTransaksi: "TOPUP",
                userId,
                zone,
                providerOrderId: productCode,
                username: user?.session.username as string,
                createdAt: new Date(),
              },
            });
          } catch (e) {
            return NextResponse.json(
              {
                status: false,
                message: "Failed to create purchase record",
                code: 500,
              },
              { status: 500 }
            );
          }

          // Create payment record
          await tx.pembayaran.create({
            data: {
              totalAmount: total,
              orderId: merchantOrderId,
              harga: price.toString(),
              metode: method.method?.name ?? "",
              noPembeli: noWa,
              feeRupiah: feeRupiah,
              fee,
              status: TRANSACTION_FLOW.PENDING,
              reference: toDuitku.data.reference,
              noPembayaran,
              createdAt: new Date(),
            },
          });

          const invoiceUrl = `${baseUrl}/invoice?invoice=${merchantOrderId}`;

          return {
            success: true,
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
          };
        }
      },
      { timeout: 15000 }
    );
    const result = await Promise.race([transactionPromise, timeoutPromise]);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
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
