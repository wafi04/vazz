"use client";

import { useState, useEffect } from "react";
import { DialogPayment } from "@/features/pages/payment/dialog-payment";
import { useOrderStore } from "@/hooks/use-order";
import { cn } from "@/lib/utils";
import { FormatPrice } from "@/utils/formatPrice";
import { ShoppingCart, ChevronUp, ChevronDown } from "lucide-react";

export function CartDetails() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const {
    method,
    price,
    voucherCode,
    zone,
    userId,
    productDetails,
    whatsAppNumber,
  } = useOrderStore();

  // Handle showing card only after scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't show if no userID
  if (!userId) {
    return null;
  }

  const isProductSelected = Boolean(productDetails?.name);
  const isPaymentMethodSelected = Boolean(method?.name);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 md:right-1/2 md:translate-x-1/2 transition-all duration-300 z-50 max-w-full md:max-w-xl w-auto md:w-full",
        hasScrolled ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
    >
      <div className="bg-card border border-primary/30 rounded-xl shadow-lg shadow-primary/20 overflow-hidden">
        {/* Card Header - Always visible */}
        <div
          className="bg-accent hover:bg-accent/90 text-accent-foreground p-4 flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="font-medium">
              {isProductSelected
                ? price > 0
                  ? `${productDetails.name} - ${FormatPrice(price)}`
                  : `${productDetails.name} - Lihat Order`
                : "Mulai Order"}
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronUp className="w-5 h-5" />
          )}
        </div>

        {/* Expandable Content */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            isExpanded ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          {/* Content */}
          <div className="space-y-4 text-sm p-4 overflow-y-auto pr-4 pb-4">
            {/* Order Details */}
            <div className="rounded-lg bg-background/50 p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1">
                  Produk
                </span>
                {isProductSelected && (
                  <span className="font-medium text-foreground flex items-center gap-1">
                    {productDetails?.name}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1">
                  Metode Pembayaran
                </span>
                {isPaymentMethodSelected ? (
                  <span className="font-medium text-foreground flex items-center gap-1">
                    {method.name}
                  </span>
                ) : (
                  <span className="text-muted-foreground italic">
                    Belum dipilih
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1">
                  User ID
                </span>
                <span className="font-medium text-foreground">{userId}</span>
              </div>

              {zone && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Zone
                  </span>
                  <span className="font-medium text-foreground">{zone}</span>
                </div>
              )}
              {whatsAppNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Whatsapp
                  </span>
                  <span className="font-medium text-foreground">
                    {whatsAppNumber}
                  </span>
                </div>
              )}

              {voucherCode.trim() !== "" && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Voucher
                  </span>
                  <span className="font-medium text-foreground">
                    {voucherCode}
                  </span>
                </div>
              )}
            </div>

            {/* Price Detail */}
            {isProductSelected && (
              <div className="rounded-lg bg-primary/10 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Harga</span>
                  <span className="font-semibold text-primary text-lg">
                    {price > 0 ? FormatPrice(price) : "-"}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2">
              {isProductSelected && isPaymentMethodSelected ? (
                <DialogPayment />
              ) : (
                <button
                  className="w-full py-3 flex items-center justify-center gap-2 bg-primary/30 text-primary-foreground rounded-lg font-medium cursor-not-allowed"
                  disabled
                >
                  Lengkapi Order Dulu
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
