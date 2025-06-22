import { Prisma } from "@prisma/client";

export type CheckingVoucherInput = {
  voucherCode: string;
  amount: number;
  categoryId?: number;
};

// Alternative: Using discriminated union for cleaner type safety
export type CheckingVoucherResult = {
  status: boolean;
  message: string;
  discountAmount: number;
  finalPrice: number;
  voucherId: number;
};

export async function checkingVoucher(
  tx: Prisma.TransactionClient,
  { voucherCode, amount, categoryId }: CheckingVoucherInput
): Promise<CheckingVoucherResult> {
  if (!voucherCode || !amount || amount < 0) {
    return {
      status: false,
      message: "Missing Required Data",
      discountAmount: 0,
      finalPrice: 0,
      voucherId: 0,
    };
  }

  let discountAmount = 0;
  const voucher = await tx.voucher.findFirst({
    where: {
      code: voucherCode,
      isActive: "active",
      expiryDate: { gt: new Date() },
      startDate: { lte: new Date() },
    },
    include: {
      categories: true,
    },
  });

  if (!voucher) {
    return {
      status: false,
      message: "Invalid or expired voucher code",
      discountAmount: 0,
      finalPrice: 0,
      voucherId: 0,
    };
  }

  // Check usage limits
  if (voucher.usageLimit && voucher.usageCount >= voucher.usageLimit) {
    return {
      status: false,
      message: "Voucher usage limit reached",
      discountAmount: 0,
      finalPrice: 0,
      voucherId: 0,
    };
  }

  if (voucher.minPurchase && amount < voucher.minPurchase) {
    return {
      status: false,
      message: `Minimum purchase of ${voucher.minPurchase} required for this voucher`,
      discountAmount: 0,
      finalPrice: 0,
      voucherId: 0,
    };
  }

  const isApplicable =
    voucher.isForAllCategories ||
    (categoryId &&
      voucher.categories.some((vc) => vc.categoryId === categoryId));

  if (!voucher.isForAllCategories && categoryId && !isApplicable) {
    return {
      status: false,
      message: "Voucher not applicable to this product category",
      discountAmount: 0,
      finalPrice: 0,
      voucherId: 0,
    };
  }

  discountAmount = (amount * voucher.discountValue) / 100;
  if (voucher.discountType === "PERCENTAGE") {
    if (voucher.maxDiscount) {
      discountAmount = Math.min(discountAmount, voucher.maxDiscount);
    }
  } else {
    discountAmount = voucher.discountValue;
  }

  const finalPrice = Math.max(0, amount - discountAmount);

  return {
    status: true,
    message: "Voucher is valid and applicable",
    discountAmount,
    finalPrice,
    voucherId: voucher.id,
  };
}
