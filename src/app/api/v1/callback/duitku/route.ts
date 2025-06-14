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

interface Deposit {
  depositId: string;
  username: string;
  status: string;
  noPembayaran: string | null;
}

interface Membership {
  name: string | null;
  price: number;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    console.log("🚀 === DUITKU CALLBACK DEBUG START ===");
    console.log("⏰ Timestamp:", new Date().toISOString());

    // Log method dan URL
    console.log("📡 Method:", req.method);
    console.log("🔗 URL:", req.url);

    // Log semua headers
    const headers: { [key: string]: string } = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log("📋 Request Headers:", JSON.stringify(headers, null, 2));

    let callbackData: CallbackData;
    const digiflazz = new Digiflazz(DIGI_USERNAME, DIGI_KEY);

    const contentType: string = req.headers.get("content-type") || "";
    console.log("📄 Content-Type:", contentType);

    // Clone request untuk multiple reads
    const reqClone = req.clone();
    let rawBody: string = "";

    try {
      rawBody = await reqClone.text();
      console.log("📝 Raw Body:", rawBody);
      console.log("📏 Body Length:", rawBody.length);
    } catch (e) {
      console.log("⚠️ Could not read raw body:", e);
    }

    // Handle berbagai format data dari Duitku
    if (contentType.includes("application/json")) {
      console.log("🔍 Processing as JSON...");
      try {
        callbackData = (await req.json()) as CallbackData;
        console.log(
          "✅ JSON Data received:",
          JSON.stringify(callbackData, null, 2)
        );
      } catch (e) {
        console.log("❌ JSON Parse Error:", e);
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
      console.log("🔍 Processing as Form URL-encoded...");
      try {
        const formData = await req.formData();
        const formObject: { [key: string]: any } = {};

        for (const [key, value] of formData.entries()) {
          formObject[key] = value;
          console.log(`  📝 ${key}: ${value}`);
        }

        console.log(
          "✅ Form Data Object:",
          JSON.stringify(formObject, null, 2)
        );

        // Map form fields ke CallbackData (handle different naming conventions)
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

        console.log("🔄 Mapped Data:", JSON.stringify(callbackData, null, 2));
      } catch (e) {
        console.log("❌ Form Data Parse Error:", e);
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
      console.log("🔍 Processing as URL-encoded string...");
      try {
        const urlParams = new URLSearchParams(rawBody);
        const paramObject: { [key: string]: string } = {};

        for (const [key, value] of urlParams.entries()) {
          paramObject[key] = value;
          console.log(`  📝 ${key}: ${value}`);
        }

        console.log(
          "✅ URL Params Object:",
          JSON.stringify(paramObject, null, 2)
        );

        // Map URL params ke CallbackData
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

        console.log("🔄 Mapped Data:", JSON.stringify(callbackData, null, 2));
      } catch (e) {
        console.log("❌ URL Params Parse Error:", e);
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
      console.log("❌ Unsupported Content-Type:", contentType);
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

    console.log(
      "🎯 Final Processed Data:",
      JSON.stringify(callbackData, null, 2)
    );

    // Detailed field validation
    const {
      merchantCode,
      amount,
      refId,
      merchantOrderId,
      resultCode,
      signature,
    }: CallbackData = callbackData;

    console.log("🔍 Field Validation:");
    console.log(
      `  📋 merchantCode: "${merchantCode}" (${typeof merchantCode}) - ${
        merchantCode ? "✅" : "❌"
      }`
    );
    console.log(
      `  💰 amount: "${amount}" (${typeof amount}) - ${
        amount && amount > 0 ? "✅" : "❌"
      }`
    );
    console.log(
      `  🔗 refId: "${refId}" (${typeof refId}) - ${refId ? "✅" : "❌"}`
    );
    console.log(
      `  📦 merchantOrderId: "${merchantOrderId}" (${typeof merchantOrderId}) - ${
        merchantOrderId ? "✅" : "❌"
      }`
    );
    console.log(
      `  📊 resultCode: "${resultCode}" (${typeof resultCode}) - ${
        resultCode ? "✅" : "❌"
      }`
    );
    console.log(
      `  🔐 signature: "${signature}" (${typeof signature}) - ${
        signature ? "✅" : "❌"
      }`
    );

    const missingFields: string[] = [];
    if (!merchantCode) missingFields.push("merchantCode");
    if (!merchantOrderId) missingFields.push("merchantOrderId");
    if (!amount || amount <= 0) missingFields.push("amount");
    if (!signature) missingFields.push("signature");
    if (!resultCode) missingFields.push("resultCode");

    if (missingFields.length > 0) {
      console.log("❌ Missing Fields:", missingFields);
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

    console.log("✅ All fields validated successfully");
    console.log("🗄️ Starting database transaction...");

    const result: TransactionResult = await prisma.$transaction(async (tx) => {
      console.log("🔍 Looking for pembelian with orderId:", merchantOrderId);

      const pembelian: Pembelian | null = await tx.pembelian.findUnique({
        where: {
          orderId: merchantOrderId,
        },
      });

      if (!pembelian) {
        console.log("❌ Pembelian not found for orderId:", merchantOrderId);
        throw new Error("Purchases not found");
      }

      console.log("✅ Pembelian found:", JSON.stringify(pembelian, null, 2));

      console.log("📝 Updating pembelian status to PAID...");
      await tx.pembelian.update({
        where: {
          orderId: merchantOrderId,
        },
        data: {
          refId,
          status: "PAID",
          log: "Payment successful",
        },
      });

      console.log("💳 Updating pembayaran status to PAID...");
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

      console.log("🔀 Transaction Type:", pembelian.tipeTransaksi);

      if (pembelian.tipeTransaksi === "TOPUP") {
        console.log("🎮 Processing TOPUP transaction...");

        const topUpParams = {
          productCode: pembelian.providerOrderId as string,
          reference: merchantOrderId,
          userId: pembelian.userId as string,
          serverId: pembelian.zone as string,
        };
        console.log("📤 TopUp Params:", JSON.stringify(topUpParams, null, 2));

        const toDigi = await digiflazz.TopUp(topUpParams);
        console.log("📥 Digiflazz Response:", JSON.stringify(toDigi, null, 2));

        if (toDigi && toDigi?.data) {
          console.log("📊 Digiflazz Status:", toDigi.data.status);

          if (
            toDigi.data.status === "Pending" ||
            toDigi.data.status === "Success"
          ) {
            console.log("✅ TopUp successful, updating to PROCESS...");
            await tx.pembelian.update({
              where: {
                orderId: merchantOrderId,
              },
              data: {
                refId: toDigi.data.ref_id,
                log: "Pesanan Sedang Dalam Pemrosesan",
                status: "PROCESS",
              },
            });
            return {
              type: "success" as const,
              message: "Create Transaction to duitku successfully",
              data: toDigi,
            };
          } else {
            console.log("❌ TopUp failed, processing refund...");
            if (pembelian.username) {
              console.log(
                "💰 Refunding to user:",
                pembelian.username,
                "Amount:",
                pembelian.harga
              );
              await tx.pembelian.update({
                where: {
                  orderId: merchantOrderId,
                },
                data: {
                  log: "Pembayaran Gagal,Uang Sudah Menjadi Saldo Akun",
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
              console.log("⚠️ No username found for refund");
              await tx.pembelian.update({
                where: {
                  orderId: merchantOrderId,
                },
                data: {
                  log: "Pembayaran Gagal,Silahkan Hubungi Admin",
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
        console.log("❌ No response from Digiflazz");
        throw new Error("Failed to process top-up transaction");
      } else if (pembelian.tipeTransaksi === "DEPOSIT") {
        console.log("💳 Processing DEPOSIT transaction...");

        const deposit = await tx.deposits.update({
          where: {
            depositId: merchantOrderId,
          },
          data: {
            status: "PAID",
            noPembayaran: merchantOrderId,
          },
        });

        console.log("✅ Deposit updated for user:", deposit.username);
        console.log("💰 Adding balance amount:", amount);

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
        console.log("👑 Processing MEMBERSHIP transaction...");

        const membershipFields: Membership | null =
          await tx.membership.findFirst({
            where: {
              price: parseInt(amount.toString()),
            },
          });

        console.log(
          "🔍 Membership found:",
          JSON.stringify(membershipFields, null, 2)
        );

        if (membershipFields && pembelian.username) {
          console.log("🔄 Updating user role to:", membershipFields.name);
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

    console.log("✅ Transaction completed successfully");
    console.log("📊 Final Result:", JSON.stringify(result, null, 2));

    // Handle the result from the transaction
    if (result.type === "success") {
      console.log("🎉 SUCCESS RESPONSE");
      return NextResponse.json(
        {
          message: result.message,
          success: true,
          data: result.data || undefined,
        },
        { status: 201 }
      );
    } else {
      console.log("⚠️ ERROR RESPONSE");
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
