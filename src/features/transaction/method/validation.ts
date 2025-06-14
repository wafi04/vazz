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
  console.log("=== DEBUG PAYMENT CALCULATION ===");
  console.log("Input amount:", amount, formatRupiah(amount));
  console.log("Payment code:", paymentCode);

  const method = await tx.method.findFirst({
    where: {
      code: paymentCode,
      isActive: true,
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

  console.log("Method found:", {
    name: method.name,
    typeTax: method.typeTax,
    taxAdmin: method.taxAdmin,
    min: method.min,
    max: method.max,
  });

  // Validasi min/max
  if (method.min && amount < method.min) {
    status = false;
    message = `Harga kurang dari ${formatRupiah(method.min)}`;
  }

  if (method.max && amount > method.max) {
    status = false;
    message = `Batas Harga telah limit ${formatRupiah(method.max)}`;
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
  if (method.typeTax && method.taxAdmin) {
    console.log("Calculating tax...");
    console.log("Tax type:", method.typeTax);
    console.log("Tax admin:", method.taxAdmin);

    if (method.typeTax === "PERCENTAGE") {
      // Hitung pajak percentage
      const rawTax = (amount * method.taxAdmin) / 100;
      taxAmount = Math.round(rawTax);

      console.log("Raw tax calculation:", rawTax);
      console.log("Rounded tax:", taxAmount);
    } else if (method.typeTax === "FIXED") {
      taxAmount = method.taxAdmin;
      console.log("Fixed tax:", taxAmount);
    }
  } else {
    console.log("No tax applied (typeTax or taxAdmin is null)");
  }

  const totalAmount = Math.round(amount + taxAmount);

  console.log("Final calculation:");
  console.log("- Original amount:", amount, formatRupiah(amount));
  console.log("- Tax amount:", taxAmount, formatRupiah(taxAmount));
  console.log("- Total before round:", amount + taxAmount);
  console.log("- Total after round:", totalAmount, formatRupiah(totalAmount));
  console.log("=== END DEBUG ===");

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
