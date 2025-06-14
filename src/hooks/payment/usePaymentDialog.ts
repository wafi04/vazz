"use client";
import { useState, useEffect } from "react";
import { useDuitkuPayment } from "@/hooks/payment/use-payment";
import { toast } from "sonner";
import { CheckNickName } from "@/lib/check-nickname";
import { GAMES_WITH_VALIDATION, GameType } from "@/data/check-code";
import { PaymentMethod, useOrderStore } from "../use-order";

interface ProductDetails {
  name: string;
  code: string;
}

interface PaymentDialogProps {
  userId: string | undefined;
  zone: string | undefined;
  method: PaymentMethod | undefined;
  productDetails: ProductDetails | undefined;
  voucherCode: string | undefined;
  whatsAppNumber: string | undefined;
  name: GameType;
  resetOrder: () => void;
}

export const usePaymentDialog = ({
  userId,
  zone,
  method,
  productDetails,
  voucherCode,
  whatsAppNumber,
  name,
  resetOrder,
}: PaymentDialogProps) => {
  const payment = useDuitkuPayment();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const { setHistory, discount, finalPrice, price, nickname, cheking } =
    useOrderStore();

  const handlePayment = async (): Promise<void> => {
    if (!whatsAppNumber || !method?.code || !productDetails?.code) {
      setError("Missing required payment information");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await payment.initiatePayment({
        noWa: whatsAppNumber,
        paymentCode: method.code,
        productCode: productDetails.code,
        userId: userId as string,
        zone: zone ?? "",
        voucherCode: voucherCode ?? "",
        nickname,
      });

      // Add to history
      setHistory({
        userId: userId as string,
        zone,
        discount,
        finalPrice,
        method,
        price,
        product: productDetails,
        whatsAppNumber,
      });

      if (response.success) {
        if (response.data.paymentUrl) {
          window.open(response.data.paymentUrl, "_blank");
        }
        resetOrder();
        toast.success("Payment created successfully!");
        setIsDialogOpen(false);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to create payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isPaymentDisabled = isLoading || !whatsAppNumber;

  return {
    isDialogOpen,
    setIsDialogOpen,
    isLoading,
    error,
    nicknameData: nickname,
    isCheckingNickname: cheking.isChecking,
    withoutChecking: cheking.withoutCheking,
    isPaymentDisabled,
    handlePayment,
  } as const;
};
