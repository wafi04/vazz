/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreditCard, Store, Wallet } from "lucide-react";
import { JSX } from "react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { PaymentDetails, checkingVoucher } from "@/types/payment";
import { useOrderStore } from "../use-order";
import { CreateOrderType } from "@/app/api/v1/order/create/route";

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
  const { voucherCode, productDetails, method, setDiscount, setFinalPrice } =
    useOrderStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Validates a voucher code
   * @returns Promise with voucher validation result
   */
  const validateVoucher = async (): Promise<checkingVoucher> => {
    // Don't proceed if voucher code is empty
    if (!voucherCode?.trim()) {
      setError("Voucher code is required");
      throw new Error("Voucher code is required");
    }

    // Don't proceed if product details or payment method are missing
    if (!productDetails?.code || !method?.code) {
      setError("Product and payment method must be selected first");
      throw new Error("Product and payment method must be selected first");
    }

    setIsLoading(true);
    setError(null);

    const payload: VoucherCheckRequest = {
      voucherCode,
      productCode: productDetails.code,
      methodCode: method.code,
    };

    try {
      const response = await axios.post<checkingVoucher>(
        "/api/v1/order/check",
        payload
      );

      // Store discount and final price in the order store
      if (response.data.status && response.data.data.discountAmount) {
        setDiscount(Math.round(response.data.data.discountAmount));
        setFinalPrice(Math.round(response.data.data.finalPrice));
      }

      return response.data;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Voucher validation failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    validateVoucher,
    isLoading,
    error,
  };
}
