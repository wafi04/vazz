import { DIGI_KEY, DIGI_USERNAME } from "@/constants";
import { Digiflazz } from "@/lib/digiflazz";
import { handleOrderStatusChange } from "@/lib/whatsapp-message";
import { TRANSACTION_FLOW } from "@/types/transaction";
import { Prisma } from "@prisma/client";

export async function PaymentUsingSaldo({
  amount,
  noWa,
  username,
  productCode,
  productName,
  userId,
  serverId,
  tx,
  orderId,
}: {
  username: string;
  amount: number;
  noWa: string;
  productName: string;
  productCode: string;
  userId: string;
  serverId?: string;
  orderId: string;
  tx: Prisma.TransactionClient;
}) {
  const digi = new Digiflazz(DIGI_USERNAME, DIGI_KEY);

  // Create payment record
  const pembayaran = await tx.pembayaran.create({
    data: {
      harga: amount.toString(),
      metode: "SALDO",
      noPembeli: noWa,
      status: "PENDING",
      orderId,
      createdAt: new Date(),
    },
  });

  // Process payment through Digiflazz
  const ToDigi = await digi.TopUp({
    productCode,
    userId,
    serverId,
    reference: orderId,
  });

  const digiData = ToDigi?.data;

  if (!digiData) {
    await handleOrderStatusChange({
      orderData: {
        amount: amount,
        link: `https://vazzuniverse.id/invoice?invoice=${orderId}`,
        productName,
        status: "FAILED",
        customerName: username,
        method: "SALDO",
        orderId,
        whatsapp: noWa.toString(),
      },
    });

    return {
      status: false,
      code: 400,
      message: "Failed to process payment. No response from payment gateway.",
      data: {
        pembayaran,
        orderId,
        timestamp: new Date().toISOString(),
      },
    };
  }

  const status: string =
    digiData.status === "Pending"
      ? TRANSACTION_FLOW.PROCESS
      : digiData.status === "Sukses"
      ? TRANSACTION_FLOW.SUCCESS
      : TRANSACTION_FLOW.FAILED;

  if (status !== TRANSACTION_FLOW.FAILED) {
    const updatedUser = await tx.users.update({
      where: {
        username,
      },
      data: {
        balance: { decrement: amount },
      },
      select: {
        id: true,
        username: true,
        balance: true,
      },
    });

    // Send success notification
    await handleOrderStatusChange({
      orderData: {
        amount: amount,
        link: `https://vazzuniverse.id/invoice?invoice=${orderId}`,
        productName,
        status: "PAID",
        customerName: username,
        method: "SALDO",
        orderId,
        whatsapp: noWa.toString(),
      },
    });

    return {
      status: true,
      code: 201,
      message: digiData.message || "Payment processed successfully",
      data: {
        pembayaran,
        transaction: {
          orderId,
          productName,
          amount,
          digiflazzRef: digiData.ref_id || null,
          serial: digiData.sn || null,
          status,
        },
        user: {
          username,
          newBalance: updatedUser.balance,
        },
        timestamp: new Date().toISOString(),
      },
    };
  } else {
    await handleOrderStatusChange({
      orderData: {
        amount: amount,
        link: `https://vazzuniverse.id/invoice?invoice=${orderId}`,
        productName,
        status: "FAILED",
        customerName: username,
        method: "SALDO",
        orderId,
        whatsapp: noWa.toString(),
      },
    });

    return {
      status: false,
      code: 400,
      message: digiData.message || "Transaction failed",
      data: {
        pembayaran,
        error: digiData.rc || "UNKNOWN_ERROR",
        errorMessage: digiData.message || null,
        orderId,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
