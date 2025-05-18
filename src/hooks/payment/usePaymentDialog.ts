"use client";
import { useState, useEffect } from "react";
import { useDuitkuPayment } from "@/hooks/payment/use-payment";
import { toast } from "sonner";
import { CheckNickName } from "@/lib/check-nickname";
import { GAMES_WITH_VALIDATION, GameType } from "@/data/check-code";
import { useOrderStore } from "../use-order";
import { string } from "zod";

interface PaymentMethod {
  name: string;
  code: string;
}

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

interface NicknameResult {
  success: boolean;
  name?: string;
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
  const [nicknameData, setNicknameData] = useState<string | null>(null);
  const [isCheckingNickname, setIsCheckingNickname] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [requiresValidation, setRequiresValidation] = useState<boolean>(false);
  const { setHistory, discount, finalPrice, price } = useOrderStore();

  // Determine if game needs validation
  useEffect(() => {
    const gameType = name;
    const needsValidation = GAMES_WITH_VALIDATION.includes(gameType);
    setRequiresValidation(needsValidation);
  }, [name]);

  // Check nickname validity when dialog opens
  useEffect(() => {
    async function checkNickname() {
      if (!isDialogOpen || !userId || !requiresValidation) {
        return;
      }

      if (requiresValidation && name === "mobile-legend" && !zone) {
        setError("Server ID is required for this game");
        return;
      }

      try {
        setIsCheckingNickname(true);
        setNicknameData(null);
        setError(null);

        const nicknameResult: NicknameResult = await CheckNickName({
          type: name,
          userId: userId,
          serverId: zone,
        });

        if (nicknameResult.success) {
          setNicknameData(nicknameResult.name || "Account found");
        } else {
          setError("User account not found");
        }
      } catch (err) {
        setError("Failed to check nickname. Please try again.");
      } finally {
        setIsCheckingNickname(false);
      }
    }

    checkNickname();
  }, [isDialogOpen, userId, zone, name, requiresValidation]);

  const handlePayment = async (): Promise<void> => {
    if (!whatsAppNumber || !method?.code || !productDetails?.code) {
      setError("Missing required payment information");
      return;
    }

    if (requiresValidation && !nicknameData && !isCheckingNickname) {
      setError("Please wait for account verification or try again");
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
        nickname: nicknameData ?? "not-found",
      });
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
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed To Create Payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isPaymentDisabled =
    isLoading ||
    !whatsAppNumber ||
    (requiresValidation && isCheckingNickname) ||
    (requiresValidation && !nicknameData && !error);

  return {
    isDialogOpen,
    setIsDialogOpen,
    isLoading,
    error,
    nicknameData,
    isCheckingNickname,
    requiresValidation,
    isPaymentDisabled,
    handlePayment,
  } as const;
};
