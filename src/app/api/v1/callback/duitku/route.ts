import { DIGI_KEY, DIGI_USERNAME } from "@/constants";
import { Digiflazz } from "@/lib/digiflazz";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Type definitions
interface CallbackData {
  merchantCode: string;
  amount: number;
  refId: string;
  merchantOrderId: string;
  resultCode: string;
  signature: string;
}

interface TransactionResult {
  type: "success" | "error";
  message: string;
  data?: any;
}

interface Pembelian {
  orderId: string;
  tipeTransaksi: string;
  providerOrderId: string | null;
  userId: string | null;
  zone: string | null;
  username: string | null;
  harga: number;
}

interface Membership {
  name: string | null;
  price: number;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const headers: { [key: string]: string } = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });

    let callbackData: CallbackData;
    const digiflazz = new Digiflazz(DIGI_USERNAME, DIGI_KEY);

    const contentType: string = req.headers.get("content-type") || "";
    const reqClone = req.clone();
    let rawBody: string = "";

    try {
      rawBody = await reqClone.text();
    } catch (e) {
      console.log("⚠️ Could not read raw body:", e);
    }

    // Handle berbagai format data dari Duitku
    if (contentType.includes("application/json")) {
      try {
        callbackData = (await req.json()) as CallbackData;
      } catch (e) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid JSON format",
            rawBody: rawBody,
            error: e instanceof Error ? e.message : "Unknown JSON error",
          },
          { status: 400 }
        );
      }
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      try {
        const formData = await req.formData();
        const formObject: { [key: string]: any } = {};

        for (const [key, value] of formData.entries()) {
          formObject[key] = value;
        }

        callbackData = {
          merchantCode: String(
            formObject.merchantCode || formObject.merchant_code || ""
          ),
          amount: parseFloat(String(formObject.amount || 0)),
          refId: String(formObject.refId || formObject.ref_id || ""),
          merchantOrderId: String(
            formObject.merchantOrderId || formObject.merchant_order_id || ""
          ),
          resultCode: String(
            formObject.resultCode || formObject.result_code || ""
          ),
          signature: String(formObject.signature || ""),
        };
      } catch (e) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid form data format",
            rawBody: rawBody,
            error: e instanceof Error ? e.message : "Unknown form error",
          },
          { status: 400 }
        );
      }
    } else if (!contentType || contentType.includes("text/plain")) {
      try {
        const urlParams = new URLSearchParams(rawBody);
        const paramObject: { [key: string]: string } = {};

        for (const [key, value] of urlParams.entries()) {
          paramObject[key] = value;
        }

        callbackData = {
          merchantCode:
            paramObject.merchantCode || paramObject.merchant_code || "",
          amount: parseFloat(paramObject.amount || "0"),
          refId: paramObject.refId || paramObject.ref_id || "",
          merchantOrderId:
            paramObject.merchantOrderId || paramObject.merchant_order_id || "",
          resultCode: paramObject.resultCode || paramObject.result_code || "",
          signature: paramObject.signature || "",
        };
      } catch (e) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid URL-encoded format",
            rawBody: rawBody,
            error: e instanceof Error ? e.message : "Unknown URL params error",
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          message: `Unsupported content type: ${contentType}`,
          rawBody: rawBody,
          contentType: contentType,
          availableHeaders: headers,
        },
        { status: 400 }
      );
    }

    // Detailed field validation
    const {
      merchantCode,
      amount,
      refId,
      merchantOrderId,
      resultCode,
      signature,
    }: CallbackData = callbackData;

    const missingFields: string[] = [];
    if (!merchantCode) missingFields.push("merchantCode");
    if (!merchantOrderId) missingFields.push("merchantOrderId");
    if (!amount || amount <= 0) missingFields.push("amount");
    if (!signature) missingFields.push("signature");
    if (!resultCode) missingFields.push("resultCode");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
          missingFields: missingFields,
          receivedData: callbackData,
          rawBody: rawBody,
        },
        { status: 400 }
      );
    }

    const result: TransactionResult = await prisma.$transaction(async (tx) => {
      const pembelian: Pembelian | null = await tx.pembelian.findUnique({
        where: {
          orderId: merchantOrderId,
        },
      });

      if (!pembelian) {
        throw new Error("Purchases not found");
      }

      await tx.pembelian.update({
        where: {
          orderId: merchantOrderId,
        },
        data: {
          refId,
          status: "PAID",
          log: JSON.stringify(callbackData),
          message: "Payment successful",
        },
      });

      await tx.pembayaran.update({
        where: {
          orderId: merchantOrderId,
        },
        data: {
          reference: refId,
          status: "PAID",
          updatedAt: new Date(),
        },
      });

      if (pembelian.tipeTransaksi === "TOPUP") {
        const topUpParams = {
          productCode: pembelian.providerOrderId as string,
          reference: merchantOrderId,
          userId: pembelian.userId as string,
          serverId: pembelian.zone as string,
        };

        const toDigi = await digiflazz.TopUp(topUpParams);

        if (toDigi && toDigi?.data) {
          if (
            toDigi.data.status === "Pending" ||
            toDigi.data.status === "Success"
          ) {
            const log = {
              ...callbackData,
              message: "Pesanan Sedang Dalam Pemrosesan",
            };
            await tx.pembelian.update({
              where: {
                orderId: merchantOrderId,
              },
              data: {
                refId: toDigi.data.ref_id,
                log: JSON.stringify(log),
                message: log.message,
                status: "PROCESS",
              },
            });
            return {
              type: "success" as const,
              message: "Create Transaction to duitku successfully",
              data: toDigi,
            };
          } else {
            if (pembelian.username) {
              const log = {
                ...callbackData,
                message: "Pembayaran Gagal,Uang Sudah Menjadi Saldo Akun",
              };
              await tx.pembelian.update({
                where: {
                  orderId: merchantOrderId,
                },
                data: {
                  log: JSON.stringify(log),
                  message:
                    "Pesanan Anda Gagal,Uang Anda Sudah Masuk Saldo Akun",
                  status: "FAILED",
                },
              });
              await tx.users.update({
                where: {
                  username: pembelian.username,
                },
                data: {
                  balance: {
                    increment: pembelian.harga,
                  },
                },
              });
              return {
                type: "error" as const,
                message: "Order Failed,Silahkan Hubungi Admin",
                data: pembelian,
              };
            } else {
              const log = {
                ...callbackData,
                message: "Pembayaran Gagal,Silahkan Hubungi Admin",
              };
              await tx.pembelian.update({
                where: {
                  orderId: merchantOrderId,
                },
                data: {
                  log: JSON.stringify(log),
                  message: "Pesanan Anda Gagal,Silahkan Hubungi Admin",
                  status: "FAILED",
                },
              });
              return {
                type: "error" as const,
                message: "Order Failed,Silahkan Hubungi Admin",
                data: pembelian,
              };
            }
          }
        }
        throw new Error("Failed to process top-up transaction");
      } else if (pembelian.tipeTransaksi === "DEPOSIT") {
        const deposit = await tx.deposits.update({
          where: {
            depositId: merchantOrderId,
          },
          data: {
            status: "PAID",
            noPembayaran: merchantOrderId,
          },
        });

        await tx.users.update({
          where: {
            username: deposit.username,
          },
          data: {
            balance: {
              increment: parseInt(amount.toString()),
            },
          },
        });

        return {
          type: "success" as const,
          message: "Deposit Berhasil",
        };
      } else {
        const membershipFields: Membership | null =
          await tx.membership.findFirst({
            where: {
              price: parseInt(amount.toString()),
            },
          });

        if (membershipFields && pembelian.username) {
          await tx.users.update({
            where: {
              username: pembelian.username as string,
            },
            data: {
              role: membershipFields?.name as string,
            },
          });
        } else {
          console.log("⚠️ No membership found or no username");
        }

        return {
          type: "success" as const,
          message: "Membership Successfully",
        };
      }
    });

    if (result.type === "success") {
      return NextResponse.json(
        {
          message: result.message,
          success: true,
          data: result.data || undefined,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        {
          message: result.message,
          success: false,
          data: result.data || undefined,
        },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("💥 === CALLBACK PROCESSING ERROR ===");
    console.error("Error:", error);
    console.error(
      "Stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    return NextResponse.json(
      {
        success: false,
        message: "Error processing callback",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  } finally {
    console.log("🏁 === DUITKU CALLBACK DEBUG END ===");
  }
}
