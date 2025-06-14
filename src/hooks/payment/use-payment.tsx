/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreditCard, Store, Wallet } from "lucide-react";
import { JSX, useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import axios from "axios";
import { PaymentDetails } from "@/types/payment";
import { useOrderStore } from "../use-order";
import { CreateOrderType } from "@/app/api/v1/order/create/route";
import { useVoucherValidation } from "@/features/pages/payment/components/useVoucherValidation";
import { useParams } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";

/**
 * Labels for payment types
 */
export const typeLabels: Record<string, string> = {
  "virtual-account": "Virtual Account",
  "e-walet": "E-Wallet",
  "convenience-store": "Convenience Store",
};

/**
 * Icons for payment types
 */
export const typeIcons: Record<string, JSX.Element> = {
  "virtual-account": <CreditCard className="h-5 w-5 text-blue-300" />,
  "e-walet": <Wallet className="h-5 w-5 text-blue-300" />,
  "convenience-store": <Store className="h-5 w-5 text-blue-300" />,
};

/**
 * Interface for voucher check request
 */
export interface VoucherCheckRequest {
  voucherCode: string;
  productCode: string;
  methodCode: string;
}

/**
 * Hook for handling Midtrans payment integration
 */
export function useDuitkuPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initiates a payment transaction
   * @param orderDetails - Payment request details
   * @returns Promise with payment details
   */
  const initiatePayment = async (
    orderDetails: CreateOrderType
  ): Promise<PaymentDetails> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<PaymentDetails>(
        "/api/v1/order/create",
        orderDetails
      );
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Payment initiation failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initiatePayment,
    isLoading,
    error,
  };
}

/**
 * Hook for validating voucher codes against product and payment method
 */
export function useVoucherValidator() {
  const {
    voucherCode,
    setDiscount,
    setFinalPrice,
    price,
    tax,
    method,
    productDetails,
  } = useOrderStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // NEW: Track validation state to prevent unnecessary re-validation
  const [validationComplete, setValidationComplete] = useState(false);
  const [lastValidatedVoucher, setLastValidatedVoucher] = useState<string>("");
  const [lastValidatedProduct, setLastValidatedProduct] = useState<string>("");

  const { name } = useParams();

  // Refs untuk debounce dan cancel
  const debounceRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  // Create mutation instance
  const voucherMutation = trpc.voucher.validateVoucher.useMutation({
    onSuccess: (data) => {
      if (data.status) {
        setDiscount(data.discountAmount);
        setFinalPrice(price - data.discountAmount + ((tax as number) ?? 0));
        setError(null);

        setValidationComplete(true);
        setLastValidatedVoucher(voucherCode?.trim() || "");
        setLastValidatedProduct(productDetails?.code || "");
      } else {
        toast.error(data.message);
      }
    },
    onError: (err) => {
      const errorMessage = err?.message || "Voucher validation failed";
      setError(errorMessage);

      // NEW: Mark validation as complete (even if failed)
      setValidationComplete(true);
      setLastValidatedVoucher(voucherCode?.trim() || "");
      setLastValidatedProduct(productDetails?.code || "");
    },
  });

  /**
   * Auto-validation dengan debounce - dipanggil saat user mengetik
   * NEW: Enhanced with validation state tracking
   */
  const validateVoucherDebounced = useCallback(async () => {
    const currentVoucher = voucherCode?.trim() || "";
    const currentProduct = productDetails?.code || "";

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Clear error saat user mulai mengetik lagi
    if (error && currentVoucher) {
      setError(null);
    }

    // Reset validation state if voucher or product changed
    if (
      currentVoucher !== lastValidatedVoucher ||
      currentProduct !== lastValidatedProduct
    ) {
      setValidationComplete(false);
    }

    // NEW: Don't validate if already validated for same voucher + product
    if (
      validationComplete &&
      currentVoucher === lastValidatedVoucher &&
      currentProduct === lastValidatedProduct
    ) {
      return;
    }

    // Jangan validasi jika voucher terlalu pendek
    if (!currentVoucher || currentVoucher.length < 4) {
      return;
    }

    // Guard clauses
    if (!name || !price || price <= 0) {
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    // Set debounce timer
    debounceRef.current = setTimeout(async () => {
      setIsValidating(true);

      try {
        const result = await voucherMutation.mutateAsync({
          amount: price,
          categoryCode: name as string,
          code: currentVoucher,
        });
        return result;
      } catch (err: any) {
        // Hanya set error jika bukan karena abort
        if (!abortControllerRef.current?.signal.aborted) {
          const errorMessage = err?.message || "Voucher tidak valid";
          setError(errorMessage);
        }
      } finally {
        setIsValidating(false);
      }
    }, 1000);
  }, [
    voucherCode,
    productDetails?.name,
    name,
    price,
    voucherMutation,
    setDiscount,
    setFinalPrice,
    error,
    validationComplete,
    lastValidatedVoucher,
    lastValidatedProduct,
  ]);

  /**
   * Reset voucher state
   */
  const resetVoucher = useCallback(() => {
    setError(null);
    setDiscount(0);
    setFinalPrice(price);

    // NEW: Reset validation tracking
    setValidationComplete(false);
    setLastValidatedVoucher("");
    setLastValidatedProduct("");

    // Cancel any pending validation
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [price, setDiscount, setFinalPrice]);

  /**
   * Clear error only
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // NEW: Reset validation state when voucher is cleared
  useEffect(() => {
    if (!voucherCode?.trim()) {
      setValidationComplete(false);
      setLastValidatedVoucher("");
      setLastValidatedProduct("");
    }
  }, [voucherCode]);

  // Auto-validate ketika voucher code atau product berubah (dengan debounce)
  // NEW: Enhanced with better dependency tracking
  useEffect(() => {
    validateVoucherDebounced();

    // Cleanup
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [validateVoucherDebounced]);

  // Cleanup saat component unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // Manual validation (untuk onBlur/onSubmit)
    validateVoucherDebounced,

    // State
    isLoading: isLoading || voucherMutation.isLoading,
    isValidating,
    error,

    // Actions
    clearError,
    resetVoucher,

    // Status helpers
    hasValidVoucher:
      !error && voucherCode?.trim().length >= 4 && validationComplete,
    isVoucherTooShort:
      voucherCode?.trim().length > 0 && voucherCode.trim().length < 4,

    // NEW: Expose validation state for external components
    validationComplete,
    lastValidatedVoucher,
    lastValidatedProduct,
  };
}
