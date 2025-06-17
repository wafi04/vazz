"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { GameType } from "@/data/check-code";
import { useOrderStore } from "@/hooks/use-order";
import { usePaymentDialog } from "@/hooks/payment/usePaymentDialog";
import { useVoucherValidator } from "@/hooks/payment/use-payment";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { PaymentSummary } from "@/hooks/payment/paymentSummary";
import { AccountInfoSection } from "@/hooks/payment/accountInfoSection";
export function DialogPayment({ className }: { className?: string }) {
  const {
    userId,
    zone,
    method,
    price,
    productDetails,
    voucherCode,
    whatsAppNumber,
    resetOrder,
    discount,
    tax,
    finalPrice,
  } = useOrderStore();

  const { name } = useParams();

  const [voucherApplied, setVoucherApplied] = useState(false);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [isCheckingVoucher, setIsCheckingVoucher] = useState(false);

  const formatCategoryName = (name: string) => {
    return name.toUpperCase().replace("-", " ");
  };

  const {
    validateVoucher,
    isLoading: isVoucherLoading,
    error: voucherValidationError,
  } = useVoucherValidator();

  const {
    isDialogOpen,
    setIsDialogOpen,
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

  // Check voucher when dialog opens and voucher code exists
  useEffect(() => {
    let isCancelled = false;

    async function checkVoucher() {
      if (!isDialogOpen) return;
      if (!voucherCode?.trim()) return;
      if (voucherApplied) return;
      if (isCheckingVoucher) return;
      if (!productDetails?.code || !method?.code) return;

      try {
        setIsCheckingVoucher(true);
        setVoucherError(null);

        await validateVoucher();

        // Check if effect was cancelled during async operation
        if (!isCancelled) {
          setVoucherApplied(true);
        }
      } catch (err: any) {
        if (!isCancelled) {
          const errorMessage = err.message || "Failed to validate voucher";
          setVoucherError(errorMessage);
          console.error("Voucher validation failed:", errorMessage);
        }
      } finally {
        if (!isCancelled) {
          setIsCheckingVoucher(false);
        }
      }
    }

    checkVoucher();

    // Cleanup function
    return () => {
      isCancelled = true;
    };
  }, [
    isDialogOpen,
    voucherCode,
    productDetails?.code,
    method?.code,
    validateVoucher,
  ]);

  // Reset voucher status when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      setVoucherApplied(false);
      setVoucherError(null);
      setIsCheckingVoucher(false);
    }
  }, [isDialogOpen]);

  return (
    <Dialog onOpenChange={(open) => setIsDialogOpen(open)} open={isDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full mt-4 bg-gradient-to-br from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white py-2 px-4 rounded-lg transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed font-medium"
          disabled={!userId || (name === "mobile-legend" && !zone)}
        >
          Continue To Payment
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "bg-gradient-to-b from-slate-900 to-indigo-950 border border-indigo-500/30 text-white p-0 max-w-md rounded-xl shadow-2xl backdrop-blur-sm overflow-y-auto max-h-[90vh]",
          className
        )}
      >
        <DialogHeader className="pt-6 pb-2 px-4 text-center">
          <DialogTitle className="text-lg font-bold text-white">
            Complete Your Payment
          </DialogTitle>
          <p className="text-blue-200 text-xs">
            Verify your details and proceed to payment
          </p>
        </DialogHeader>

        {/* Content Container with compact spacing */}
        <div className="space-y-2">
          {/* Game info section */}
          {productDetails?.name && (
            <div className="px-4 py-2 bg-white/5 border-t border-b border-indigo-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white text-sm capitalize">
                    {formatCategoryName(name as string)}
                  </h3>
                  <p className="text-xs text-blue-200">
                    {productDetails.name || "Product"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Account Information Section - Compact */}
          <AccountInfoSection
            isCheckingNickname={isCheckingNickname}
            method={method}
            nicknameData={nicknameData ?? ""}
            requiresValidation={requiresValidation}
            userId={userId}
            voucherCode={voucherCode}
            whatsAppNumber={whatsAppNumber}
            zone={zone}
          />

          {/* Voucher status section - horizontal layout for compactness */}
          {voucherCode && (
            <div className="px-4 py-2 bg-white/5 border-t border-b border-indigo-500/20">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <Sparkles className="h-3 w-3 text-indigo-300 mr-1.5" />
                  <span className="text-xs font-medium text-indigo-200">
                    Voucher: {voucherCode}
                  </span>
                </div>

                {voucherApplied && discount && discount > 0 && (
                  <span className="text-xs font-medium text-green-400">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(discount)}
                  </span>
                )}
              </div>

              {voucherError && (
                <div className="flex items-center text-red-400 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1.5" />
                  {voucherError}
                </div>
              )}
            </div>
          )}

          {/* Payment Summary - Horizontal layout for key items */}
          <PaymentSummary
            price={price}
            tax={tax as number}
            discount={discount}
            finalPrice={finalPrice || (method.finalPrice as number) || price}
          />
          {/* Payment Action Button */}
          <div className="px-4 pb-4 pt-1">
            <Button
              onClick={handlePayment}
              disabled={isPaymentDisabled || isVoucherLoading}
              className="w-full bg-gradient-to-br from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white py-2 rounded-lg transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed font-medium text-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-900 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>Pay Now</>
              )}
            </Button>

            {error && (
              <div className="mt-2 px-3 py-1.5 bg-red-900/30 border border-red-500/30 rounded">
                <p className="text-red-400 text-xs flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1.5" />
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
