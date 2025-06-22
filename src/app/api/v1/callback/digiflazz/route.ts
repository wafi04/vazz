import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { messageLogs } from "@/data/messages/messageLog";

interface TransactionData {
  id: number;
  payment: {
    orderId: string;
    price: string;
  } | null;
  orderId: string;
  username: string | null;
  price: number;
  successReportSent: string;
}

export async function POST(req: NextRequest) {
  let referenceId: string = "UNKNOWN";

  try {
    // Parse the callback data from Digiflazz
    const callbackData = await req.json();

    // Validasi data callback yang diterima
    if (!callbackData || !callbackData.data) {
      return NextResponse.json(
        {
          success: false,
          messaxge: "Invalid callback data format",
        },
        { status: 400 }
      );
    }

    const { ref_id, buyer_sku_code, customer_no, status, message, sn } =
      callbackData.data;

    if (!ref_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing reference ID",
        },
        { status: 400 }
      );
    }

    referenceId = ref_id;

    const normalizedStatus = status ? status.trim().toLowerCase() : "";
    const purchaseStatus = normalizedStatus === "sukses" ? "SUCCESS" : "FAILED";

    // Use transaction to ensure data integrity
    return await prisma.$transaction(
      async (tx) => {
        // Find the pembelian record
        const pembelian: TransactionData | null =
          await tx.transaction.findFirst({
            where: { refId: referenceId },
            select: {
              id: true,
              orderId: true,
              username: true,
              successReportSent: true,
              price: true,
              payment: {
                select: {
                  orderId: true,
                  price: true,
                },
              },
            },
          });

        if (!pembelian) {
          return NextResponse.json(
            {
              success: false,
              data: {
                message: "Pembelian Not Found",
                rc: "14",
              },
            },
            { status: 400 }
          );
        }

        // Prepare log message based on transaction status
        let logMessage = message || "";
        let refundProcessed = false;

        // For successful transactions, especially vouchers, include SN in the log
        if (purchaseStatus === "SUCCESS" && sn) {
          logMessage = messageLogs("SUCCESS", `SN/Kode Voucher: ${sn}`);
        }
        // If transaction fails, check for username and attempt to refund
        else if (purchaseStatus === "FAILED" && pembelian.username) {
          // Find user by username from pembelian record
          const user = await tx.transaction.findFirst({
            where: {
              username: pembelian.username as string,
            },
          });

          if (user && pembelian) {
            // Refund balance - pastikan harga dikonversi ke number
            const harga =
              typeof pembelian.price === "string"
                ? parseInt(pembelian.price, 10)
                : pembelian.price;

            await tx.user.update({
              where: { id: user.id },
              data: {
                balance: { increment: harga },
              },
            });
            logMessage = messageLogs("FAILED");
            refundProcessed = true;
          } else if (!user) {
            logMessage = messageLogs("FAILED");
          }
        }

        // Update pembelian record with final status
        await tx.transaction.update({
          where: { id: pembelian.id },
          data: {
            status: purchaseStatus,
            serialNumber: sn || null,
            log: logMessage,
            updatedAt: new Date(),
          },
        });

        // Trigger WhatsApp notification for status change

        // Handle success report flag update
        if (purchaseStatus === "SUCCESS" && !pembelian.successReportSent) {
          await tx.transaction.update({
            where: { id: pembelian.id },
            data: { successReportSent: "DONE" },
          });
        }

        return NextResponse.json({
          success: true,
          message: "Callback processed successfully",
          data: {
            ...pembelian,
          },
        });
      },
      {
        maxWait: 15000,
        timeout: 30000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "System error",
    });
  } finally {
    await prisma.$disconnect();
  }
}
