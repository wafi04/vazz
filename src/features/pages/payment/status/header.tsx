"use client";
import {
  CheckCircle2,
  AlertCircle,
  Wallet,
  CreditCard,
  Cog,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface HeaderPaymentStatusProps {
  status: string;
}

export function HeaderPaymentStatus({ status }: HeaderPaymentStatusProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (status === "PENDING") {
      const interval = setInterval(() => {
        setAnimate((prev) => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const getStatusConfig = (status: string) => {
    const configs = {
      PENDING: {
        color: "text-yellow-500",
        bg: "bg-card",
        border: "border-blue-800",
        text: "Menunggu Pembayaran",
        desc: "Silahkan melakukan pembayaran dengan metode yang dipilih",
        icon: Wallet,
      },
      PAID: {
        color: "text-blue-500",
        bg: "bg-card",
        border: "border-blue-200",
        text: "Pembayaran Diterima",
        desc: null,
        icon: CreditCard,
      },
      PROCESS: {
        color: "text-amber-500",
        bg: "bg-card",
        border: "border-amber-200",
        text: "Pembayaran Diproses",
        desc: null,
        icon: Cog,
      },
      SUCCESS: {
        color: "text-green-500",
        bg: "bg-card",
        border: "border-green-200",
        text: "Pembayaran Berhasil",
        desc: null,
        icon: CheckCircle2,
      },
      FAILED: {
        color: "text-red-500",
        bg: "bg-card",
        border: "border-red-200",
        text: "Pembayaran Gagal",
        desc: null,
        icon: AlertCircle,
      },
    };
    return (
      configs[status as keyof typeof configs] || {
        color: "text-gray-500",
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "Status Pembayaran",
        desc: null,
        icon: AlertCircle,
      }
    );
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <section
      className={cn(
        "w-full rounded-lg border p-6 text-center transition-all duration-300",
        config.bg,
        config.border
      )}
    >
      {/* Icon */}
      <div className={cn("flex justify-center mb-4", config.color)}>
        <div
          className={cn(
            "transition-transform duration-500",
            status === "PENDING" && animate && "scale-110",
            status === "PROCESS" && "animate-spin",
            status === "SUCCESS" && "animate-bounce"
          )}
        >
          <IconComponent className="h-16 w-16" strokeWidth={1.5} />
        </div>
      </div>

      {/* Status text */}
      <div>
        <h2 className={cn("text-xl font-semibold mb-2", config.color)}>
          {config.text}
        </h2>
        {config.desc && (
          <p className={cn("text-sm", config.color, "opacity-80")}>
            {config.desc}
          </p>
        )}
      </div>

      {/* Simple progress indicator */}
      <div className="flex justify-center items-center space-x-2 mt-6">
        <div
          className={cn(
            "h-2 w-8 rounded-full transition-colors duration-300",
            ["PENDING", "PAID", "PROCESS", "SUCCESS"].includes(status)
              ? "bg-yellow-400"
              : "bg-gray-200"
          )}
        ></div>
        <div
          className={cn(
            "h-2 w-8 rounded-full transition-colors duration-300",
            ["PAID", "PROCESS", "SUCCESS"].includes(status)
              ? "bg-blue-400"
              : "bg-gray-200"
          )}
        ></div>
        <div
          className={cn(
            "h-2 w-8 rounded-full transition-colors duration-300",
            status === "SUCCESS" ? "bg-green-400" : "bg-gray-200"
          )}
        ></div>
      </div>
    </section>
  );
}
