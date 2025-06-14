import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

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
          data: {
            message: "Invalid callback data format",
            rc: "30",
          },
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
          data: {
            message: "Missing reference ID",
            rc: "31",
          },
        },
        { status: 400 }
      );
    }

    referenceId = ref_id;

    // Normalize status - Digiflazz menggunakan "sukses" untuk transaksi berhasil
    const normalizedStatus = status ? status.trim().toLowerCase() : "";
    const purchaseStatus = normalizedStatus === "sukses" ? "SUCCESS" : "FAILED";

    // Use transaction to ensure data integrity
    return await prisma.$transaction(
      async (tx) => {
        // Find the pembelian record
        const pembelian = await tx.pembelian.findFirst({
          where: { refId: referenceId },
        });

        if (!pembelian) {
          return NextResponse.json(
            {
              success: "1",
              data: {
                message: "Pembelian Not Found",
                rc: "14",
              },
            },
            { status: 400 }
          );
        }

        // Find associated pembayaran
        const pembayaran = await tx.pembayaran.findFirst({
          where: { orderId: pembelian?.orderId },
        });

        // Prepare log message based on transaction status
        let logMessage = message || "";
        let refundProcessed = false;

        // For successful transactions, especially vouchers, include SN in the log
        if (purchaseStatus === "SUCCESS" && sn) {
          logMessage = `Transaksi berhasil. SN/Kode Voucher: ${sn}`;
        }
        // If transaction fails, check for username and attempt to refund
        else if (purchaseStatus === "FAILED" && pembelian.username) {
          // Find user by username from pembelian record
          const user = await tx.users.findFirst({
            where: {
              username: pembelian.username as string,
            },
          });

          if (user && pembayaran) {
            // Refund balance - pastikan harga dikonversi ke number
            const harga =
              typeof pembayaran.harga === "string"
                ? parseInt(pembayaran.harga, 10)
                : pembayaran.harga;

            await tx.users.update({
              where: { id: user.id },
              data: {
                balance: { increment: harga },
              },
            });

            // Update log message with refund information
            logMessage = `Transaksi gagal: ${
              message || "unknown error"
            }. Saldo telah dikembalikan ke Saldo Akun.`;
            refundProcessed = true;
          } else if (!user) {
            logMessage = `Transaksi gagal: ${
              message || "unknown error"
            }. Refund gagal: User ${pembelian.username} tidak ditemukan.`;
          } else if (!pembayaran) {
            logMessage = `Transaksi gagal: ${
              message || "unknown error"
            }. Refund gagal: Pembayaran untuk order ${
              pembelian.orderId
            } tidak ditemukan.`;
          }
        }

        // Update pembelian record with final status
        await tx.pembelian.update({
          where: { id: pembelian.id },
          data: {
            status: purchaseStatus,
            sn: sn || null,
            log: logMessage,
            updatedAt: new Date(),
          },
        });

        // Trigger WhatsApp notification for status change

        // Handle success report flag update
        if (purchaseStatus === "SUCCESS" && !pembelian.successReportSended) {
          await tx.pembelian.update({
            where: { id: pembelian.id },
            data: { successReportSended: true },
          });
        }

        return NextResponse.json({
          success: true,
          data: {
            message: "Callback processed successfully",
            rc: "00",
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
      success: "2",
      data: {
        message: error instanceof Error ? error.message : "System error",
        rc: "99",
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
