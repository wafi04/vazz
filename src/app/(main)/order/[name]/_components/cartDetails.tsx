"use client";

import { useState, useEffect } from "react";
import { useOrderStore } from "@/hooks/use-order";
import { cn } from "@/lib/utils";
import { FormatPrice } from "@/utils/formatPrice";
import {
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Loader2,
  Check,
  X,
  Clock,
} from "lucide-react";
import { useVoucherValidator } from "@/hooks/payment/use-payment";
import { usePaymentDialog } from "@/hooks/payment/usePaymentDialog";
import { GameType } from "@/data/check-code";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CartDetails() {
  // State management
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Store and hooks
  const {
    method,
    price,
    voucherCode,
    zone,
    userId,
    finalPrice,
    productDetails,
    whatsAppNumber,
    tax,
    discount,
    resetOrder,
  } = useOrderStore();

  const { name } = useParams();

  const {
    isLoading: isVoucherLoading,
    isValidating,
    error: voucherValidationError,
    hasValidVoucher,
    isVoucherTooShort,
    validationComplete,
    lastValidatedVoucher,
    lastValidatedProduct,
  } = useVoucherValidator();

  const {
    isLoading,
    error,
    nicknameData,
    isCheckingNickname,
    isPaymentDisabled,
    handlePayment,
  } = usePaymentDialog({
    userId,
    zone,
    method,
    productDetails,
    voucherCode,
    whatsAppNumber,
    name: name as GameType,
    resetOrder,
  });

  // Computed values
  const isProductSelected = Boolean(productDetails?.name);
  const isPaymentMethodSelected = Boolean(method?.name);
  const hasValidPrice = price > 0;
  const displayPrice = (finalPrice as number) || method?.finalPrice || price;

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!userId) {
    return null;
  }

  // Render helpers
  const renderHeaderTitle = () => {
    if (!isProductSelected) return "Mulai Order";
    if (!hasValidPrice) return `${productDetails.name} - Lihat Order`;
    return `${productDetails.name} - ${FormatPrice(displayPrice)}`;
  };

  const renderOrderDetailRow = (
    label: string,
    value: string | null,
    showWhenEmpty = false
  ) => {
    if (!value && !showWhenEmpty) return null;

    return (
      <div className="flex justify-between items-center">
        <span className="text-white/70">{label}</span>
        <span
          className={cn(
            "font-medium",
            value ? "text-white" : "text-white/50 italic"
          )}
        >
          {value || "Belum dipilih"}
        </span>
      </div>
    );
  };

  // Enhanced voucher status with validation state tracking
  const renderVoucherStatus = () => {
    if (!voucherCode?.trim()) return null;

    const currentVoucher = voucherCode.trim();
    const currentProduct = productDetails?.name || "";

    // Check if this voucher + product combo has been validated
    const isCurrentComboValidated =
      validationComplete &&
      currentVoucher === lastValidatedVoucher &&
      currentProduct === lastValidatedProduct;

    return (
      <div className="flex justify-between items-center">
        <span className="text-white/70">Voucher</span>
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{voucherCode}</span>

          {/* Status indicators */}
          {isValidating && (
            <div className="flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
              <span className="text-xs text-blue-400">Checking...</span>
            </div>
          )}

          {!isValidating && hasValidVoucher && isCurrentComboValidated && (
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">Valid</span>
            </div>
          )}

          {!isValidating &&
            voucherValidationError &&
            !isVoucherTooShort &&
            isCurrentComboValidated && (
              <div className="flex items-center gap-1">
                <X className="w-3 h-3 text-red-400" />
                <span className="text-xs text-red-400">Invalid</span>
              </div>
            )}
        </div>
      </div>
    );
  };

  // Enhanced price detail with validation state
  const renderPriceDetail = () => {
    if (!isProductSelected) return null;

    const currentVoucher = voucherCode?.trim() || "";
    const currentProduct = productDetails?.name || "";
    const isCurrentComboValidated =
      validationComplete &&
      currentVoucher === lastValidatedVoucher &&
      currentProduct === lastValidatedProduct;

    return (
      <div className="rounded-lg bg-blue-500/10 backdrop-blur-sm p-4 space-y-2 border border-blue-400/20">
        {/* Original Price */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-white/70">Harga</span>
          <span className="text-white">{FormatPrice(price)}</span>
        </div>

        {/* Tax */}
        {tax && tax > 1 ? (
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/70">Pajak</span>
            <span className="text-white">+{FormatPrice(tax as number)}</span>
          </div>
        ) : null}

        {discount && discount > 0 && hasValidVoucher && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-green-400">Diskon Voucher</span>
            <span className="text-green-400">-{FormatPrice(discount)}</span>
          </div>
        )}

        {/* Divider */}
        {((tax && tax > 0) ||
          (discount &&
            discount > 0 &&
            hasValidVoucher &&
            isCurrentComboValidated)) && <hr className="border-white/20" />}

        {/* Final Price */}
        <div className="flex justify-between items-center">
          <span className="text-white/70 font-medium">Total Harga</span>
          <div className="text-right">
            {/* Show original price crossed out if there's discount */}

            <span className="font-semibold text-blue-300 text-lg">
              {finalPrice && finalPrice > 0 && FormatPrice(finalPrice)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderActionButton = () => {
    if (!isProductSelected || !isPaymentMethodSelected) {
      return (
        <button
          className="w-full py-3 flex items-center justify-center gap-2 bg-white/10 text-white/50 rounded-lg font-medium cursor-not-allowed backdrop-blur-sm border border-white/10"
          disabled
        >
          Lengkapi Order Dulu
        </button>
      );
    }

    const currentVoucher = voucherCode?.trim() || "";
    const currentProduct = productDetails?.name || "";
    const isCurrentComboValidated =
      validationComplete &&
      currentVoucher === lastValidatedVoucher &&
      currentProduct === lastValidatedProduct;

    return (
      <div className="space-y-2">
        <Button
          onClick={handlePayment}
          disabled={isPaymentDisabled || isVoucherLoading || isValidating}
          className="w-full bg-gradient-to-br from-blue-500/80 to-indigo-600/80 backdrop-blur-sm hover:from-blue-400/90 hover:to-indigo-500/90 text-white py-2 rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent flex items-center justify-center border border-white/10"
        >
          {isLoading ? (
            <>
              <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
              Processing...
            </>
          ) : isValidating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
              Checking Voucher...
            </>
          ) : (
            "Pay Now"
          )}
        </Button>

        {/* Error Messages - only show if validation is complete for current combo */}
        {(error || (voucherValidationError && isCurrentComboValidated)) && (
          <div className="px-3 py-1.5 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded">
            <p className="text-red-300 text-xs flex items-center">
              <AlertCircle className="h-3 w-3 mr-1.5" />
              {error || voucherValidationError}
            </p>
          </div>
        )}

        {/* Success message for valid voucher - only show if validation is complete */}
        {hasValidVoucher &&
          isCurrentComboValidated &&
          !error &&
          !voucherValidationError && (
            <div className="px-3 py-1.5 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded">
              <p className="text-green-300 text-xs flex items-center">
                <Check className="h-3 w-3 mr-1.5" />
                Voucher berhasil diterapkan!
              </p>
            </div>
          )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 md:right-1/2 md:translate-x-1/2 transition-all duration-300 z-50 max-w-full md:max-w-xl w-auto md:w-full",
        hasScrolled ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
    >
      <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl shadow-lg shadow-black/20 overflow-hidden">
        {/* Card Header */}
        <div
          className="bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white p-4 flex items-center justify-between cursor-pointer transition-colors duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">{renderHeaderTitle()}</span>

            {/* Header voucher indicator */}
            {voucherCode?.trim() && (
              <div className="flex items-center gap-1">
                {isValidating && (
                  <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                )}
                {!isValidating &&
                  voucherValidationError &&
                  !isVoucherTooShort &&
                  validationComplete && <X className="w-3 h-3 text-red-400" />}
              </div>
            )}
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
          <div className="p-4 space-y-4 text-sm overflow-y-auto">
            {/* Order Details */}
            <div className="rounded-lg bg-white/5 backdrop-blur-sm p-4 space-y-3 border border-white/10">
              {renderOrderDetailRow("User ID", userId)}
              {zone && renderOrderDetailRow("Zone", zone as string, true)}
              {!isCheckingNickname &&
                renderOrderDetailRow("Nickname", nicknameData ?? "-")}
              {renderOrderDetailRow("Produk", productDetails?.name)}
              {renderOrderDetailRow("Metode Pembayaran", method?.name, true)}
              {renderOrderDetailRow("WhatsApp", whatsAppNumber)}
              {renderVoucherStatus()}
            </div>
            {renderPriceDetail()}

            {/* Action Button */}
            <div className="pt-2">{renderActionButton()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
