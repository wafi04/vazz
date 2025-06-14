import { useState } from "react";
import { trpc } from "@/utils/trpc"; // Sesuaikan path import

// Type untuk voucher yang valid
export type ValidatedVoucher = {
  voucherId: number;
  discountAmount: number;
  finalPrice: number;
  message: string;
};

export function useVoucherValidation(amount: number) {
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [validVoucher, setValidVoucher] = useState<ValidatedVoucher | null>(
    null
  );
  const [discountedAmount, setDiscountedAmount] = useState<number | null>(null);

  const validateVoucherMutation = trpc.voucher.validateVoucher.useMutation({
    onMutate: () => {
      setIsValidatingVoucher(true);
      setVoucherError(null);
    },

    onSuccess: (data) => {
      setIsValidatingVoucher(false);

      if (data.status) {
        const validatedVoucher: ValidatedVoucher = {
          voucherId: data.voucherId,
          discountAmount: data.discountAmount,
          finalPrice: data.finalPrice,
          message: data.message,
        };

        setValidVoucher(validatedVoucher);
        setDiscountedAmount(data.finalPrice);
        setVoucherError(null);
      } else {
        // Voucher tidak valid
        setVoucherError(data.message);
        setValidVoucher(null);
        setDiscountedAmount(null);
      }
    },

    onError: (error) => {
      // Reset all states on error
      setVoucherError(error.message);
      setValidVoucher(null);
      setDiscountedAmount(null);
      setIsValidatingVoucher(false);
    },
  });

  // Function untuk validate voucher
  const validateVoucher = (code: string, categoryCode: string) => {
    validateVoucherMutation.mutate({
      code,
      categoryCode,
      amount,
    });
  };

  // Function untuk reset voucher state
  const resetVoucher = () => {
    setValidVoucher(null);
    setDiscountedAmount(null);
    setVoucherError(null);
    setIsValidatingVoucher(false);
  };

  // Function untuk clear error
  const clearVoucherError = () => {
    setVoucherError(null);
  };

  return {
    // Mutation object
    validateVoucherMutation,

    // Helper functions
    validateVoucher,
    resetVoucher,
    clearVoucherError,

    // States
    isValidatingVoucher,
    voucherError,
    validVoucher,
    discountedAmount,

    // Computed values
    isVoucherApplied: validVoucher !== null,
    originalAmount: amount,
    savings: validVoucher?.discountAmount || 0,
  };
}
