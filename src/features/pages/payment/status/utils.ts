import { Transaksi } from "@/types/pembayaran";
import { useCallback, useEffect, useMemo, useState } from "react";

export const getStatusConfig = (status: string) => {
  switch (status) {
    case "PAID":
      return {
        color: "bg-emerald-500",
        textColor: "text-emerald-700",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        pulseColor: "bg-emerald-400",
      };
    case "PROCESS":
      return {
        color: "bg-amber-500",
        textColor: "text-amber-700",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        pulseColor: "bg-amber-400",
      };
    case "PENDING":
      return {
        color: "bg-blue-500",
        textColor: "text-blue-700",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        pulseColor: "bg-blue-400",
      };
    case "SUCCESS":
      return {
        color: "bg-emerald-500",
        textColor: "text-emerald-700",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        pulseColor: "bg-emerald-400",
      };
    case "FAILED":
      return {
        color: "bg-red-500",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        pulseColor: "bg-red-400",
      };
    default:
      return {
        color: "bg-gray-500",
        textColor: "text-gray-700",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        pulseColor: "bg-gray-400",
      };
  }
};

export function useLogicTransaksi({ data }: { data: Transaksi }) {
  const [copied, setCopied] = useState<{ id: string; value: boolean }>({
    id: "",
    value: false,
  });
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Memoize payment type calculation to avoid repeated computation
  const paymentType = useMemo((): "VA" | "URL" | "QRIS" | "OTHER" => {
    if (!data.pembayaran) return "OTHER";

    const { noPembayaran, metode } = data.pembayaran;

    // Early return if no payment number
    if (!noPembayaran) return "OTHER";

    // Check for QRIS code pattern (most specific check first)
    if (
      noPembayaran.startsWith("00020101") ||
      (noPembayaran.length > 100 && noPembayaran.includes("ID.CO.QRIS"))
    ) {
      return "QRIS";
    }

    // Check if the reference field contains a URL
    if (noPembayaran.startsWith("https") || noPembayaran.includes("://")) {
      return "URL";
    }

    // Check payment method categories
    const uppercaseMethod = metode.toUpperCase();

    // Common Virtual Account methods
    const vaPatterns = [
      "VA",
      "VIRTUAL ACCOUNT",
      "BCA",
      "BNI",
      "BRI",
      "MANDIRI",
      "PERMATA",
      "CIMB",
      "BR",
    ];
    if (vaPatterns.some((pattern) => uppercaseMethod.includes(pattern))) {
      return "VA";
    }

    const urlPatterns = ["OVO", "GOPAY", "DANA", "LINKAJA", "SHOPEEPAY"];
    if (urlPatterns.some((pattern) => uppercaseMethod.includes(pattern))) {
      return "URL";
    }

    return "OTHER";
  }, [data.pembayaran?.noPembayaran, data.pembayaran?.metode]);

  // Memoize expiration times to avoid recalculation
  const expirationTimes = useMemo(() => {
    if (!data.pembayaran?.createdAt) return null;

    const createTime = new Date(data.pembayaran.createdAt).getTime();
    const expireTime3h = createTime + 3 * 60 * 60 * 1000; // for ewallet & QRIS
    const expireTime24h = createTime + 24 * 60 * 60 * 1000; // for VA

    return {
      va: expireTime24h,
      other: expireTime3h,
    };
  }, [data.pembayaran?.createdAt]);

  // Calculate payment expiration time
  useEffect(() => {
    if (!expirationTimes) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const targetExpiry =
        paymentType === "VA" ? expirationTimes.va : expirationTimes.other;
      const difference = targetExpiry - now;

      if (difference <= 0) {
        return "Kedaluwarsa";
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    // Set initial time
    setTimeLeft(calculateTimeLeft());

    // Set up interval
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expirationTimes, paymentType]);

  // Memoize copy function to prevent unnecessary re-renders
  const copyToClipboard = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied({ id, value: true });
    setTimeout(() => setCopied({ id: "", value: false }), 2000);
  }, []);

  // Memoize URL opener function
  const openPaymentUrl = useCallback(() => {
    if (data.pembayaran?.noPembayaran && paymentType === "URL") {
      window.open(data.pembayaran.noPembayaran as string, "_blank");
    }
  }, [data.pembayaran?.noPembayaran, paymentType]);

  return {
    url: openPaymentUrl,
    copy: copyToClipboard,
    copied,
    timeLeft,
    paymentType,
  };
}
