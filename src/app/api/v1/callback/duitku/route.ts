import { DIGI_KEY, DIGI_USERNAME } from "@/constants";
import { Digiflazz } from "@/lib/digiflazz";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let callbackData;
    const digiflazz = new Digiflazz(DIGI_USERNAME, DIGI_KEY);

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      callbackData = await req.json();
    } else {
      const formData = await req.formData();
      callbackData = Object.fromEntries(formData.entries());
      if (callbackData.amount) {
        callbackData.amount = callbackData.amount.toString();
      }
    }
    const {
      merchantCode,
      amount,
      refId,
      merchantOrderId,
      resultCode,
      signature,
    } = callbackData;
    if (
      !merchantCode ||
      !merchantOrderId ||
      !amount ||
      !signature ||
      !resultCode
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const pembelian = await tx.pembelian.findUnique({
        where: {
          orderId: merchantOrderId,
        },
      });

      if (!pembelian) {
        return NextResponse.json(
          {
            success: false,
            message: "Purchases not found",
          },
          {
            status: 400,
          }
        );
      }

      await tx.pembelian.update({
        where: {
          orderId: merchantOrderId,
        },
        data: {
          refId,
          status: "PAID",
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
        const toDigi = await digiflazz.TopUp({
          productCode: pembelian.providerOrderId as string,
          reference: merchantOrderId,
          userId: pembelian.userId as string,
          serverId: pembelian.zone as string,
        });

        if (toDigi && toDigi?.data) {
          if (
            toDigi.data.status === "Pending" ||
            toDigi.data.status === "Success"
          ) {
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
            return NextResponse.json({
              message: "Create Transaction to duitku successfully",
              success: true,
              data: toDigi,
            });
          } else {
            if (pembelian.username) {
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
              return NextResponse.json(
                {
                  message: "Order Failed,Silahkan Hubungi Admin",
                  success: false,
                  data: pembelian,
                },
                {
                  status: 400,
                }
              );
            } else {
              await tx.pembelian.update({
                where: {
                  orderId: merchantOrderId,
                },
                data: {
                  log: "Pembayaran Gagal,Silahkan Hubungi Admin",
                  status: "FAILED",
                },
              });
              return NextResponse.json(
                {
                  message: "Order Failed,Silahkan Hubungi Admin",
                  success: false,
                  data: pembelian,
                },
                {
                  status: 400,
                }
              );
            }
          }
        }
      } else {
        if (pembelian.tipeTransaksi === "DEPOSIT") {
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
                increment: amount,
              },
            },
          });

          return NextResponse.json(
            {
              message: "Deposit Berhasil",
              success: true,
            },
            {
              status: 201,
            }
          );
        } else {
          const membershipFields = await tx.membership.findFirst({
            where: {
              price: parseInt(amount),
            },
          });
          await tx.users.update({
            where: {
              username: pembelian.username as string,
            },
            data: {
              role: membershipFields?.name,
            },
          });
          return NextResponse.json(
            {
              message: "Membership Successfully",
              success: true,
            },
            {
              status: 201,
            }
          );
        }
      }
    });
  } catch (error) {
    console.error("Callback processing error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error processing callback",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 }
    );
  }
}
