import { Prisma } from "@prisma/client";

export async function ValidationMethodPayment({
  paymentCode,
  amount,
  tx,
}: {
  amount: number;
  paymentCode: string;
  tx: Prisma.TransactionClient;
}) {
  const method = await tx.method.findFirst({
    where: {
      code: paymentCode,
      isActive: true,
    },
  });
  let message: string;
  let status: boolean;
  if (!method) {
    status = false;
    message = "Metode Pemabayaran  tidak tersedia";
  }

  if (method && method.min && amount < method.min) {
    status = false;
    message = `Harga kurang dari ${method.min}`;
  }

  if (method && method.max && amount > method.max) {
    status = false;
    message = `Batas Harga telah limit ${method.max}`;
  }

  let taxAmount = 0;
  if (method && method.typeTax && method.taxAdmin) {
    if (method && method.typeTax === "PERCENTAGE") {
      taxAmount = (amount * method.taxAdmin) / 100;
    } else if (method.typeTax === "FIXED") {
      taxAmount = method.taxAdmin;
    }
  }

  return {
    valid: true,
    method,
    taxAmount,
    totalAmount: amount + taxAmount,
    expireMinutes: method?.minExpired || 0,
  };
}
