import { Prisma } from "@prisma/client";
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export async function ValidationMethodPayment({
  paymentCode,
  amount,
  tx,
}: {
  amount: number;
  paymentCode: string;
  tx: Prisma.TransactionClient;
}) {
  const method = await tx.paymentMethod.findFirst({
    where: {
      code: paymentCode,
      isActive: "active",
    },
  });

  let message: string = "";
  let status: boolean = true;

  if (!method) {
    status = false;
    message = "Metode Pembayaran tidak tersedia";
    return {
      valid: false,
      message,
      method: null,
      taxAmount: 0,
      taxAmountFormatted: formatRupiah(0),
      totalAmount: amount,
      totalAmountFormatted: formatRupiah(amount),
      expireMinutes: 0,
    };
  }

  // Validasi min/max
  if (method.minAmount && amount < method.minAmount) {
    status = false;
    message = `Harga kurang dari ${formatRupiah(method.minAmount)}`;
  }

  if (method.maxAmount && amount > method.maxAmount) {
    status = false;
    message = `Batas Harga telah limit ${formatRupiah(method.maxAmount)}`;
  }

  // Jika tidak valid, return early
  if (!status) {
    return {
      valid: false,
      message,
      method,
      taxAmount: 0,
      taxAmountFormatted: formatRupiah(0),
      totalAmount: amount,
      totalAmountFormatted: formatRupiah(amount),
      expireMinutes: method.minExpired || 0,
    };
  }

  // Hitung pajak
  let taxAmount = 0;
  if (method.taxType && method.taxAdmin) {
    if (method.taxType === "PERCENTAGE") {
      // Hitung pajak percentage
      const rawTax = (amount * method.taxAdmin) / 100;
      taxAmount = Math.round(rawTax);
    } else if (method.taxType === "FIXED") {
      taxAmount = method.taxAdmin;
    }
  } else {
    console.log("No tax applied (typeTax or taxAdmin is null)");
  }

  const totalAmount = Math.round(amount + taxAmount);

  return {
    valid: true,
    method,
    // 🚨 BUG FIX: Return calculated taxAmount instead of method.taxAdmin
    taxAmount: taxAmount, // ← This was the problem!
    taxAmountFormatted: formatRupiah(taxAmount),
    totalAmount,
    methodTax: method.taxAdmin,
    totalAmountFormatted: formatRupiah(totalAmount),
    expireMinutes: method.minExpired || 0,
  };
}
