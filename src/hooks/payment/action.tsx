"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const PaymentActions = ({
  handlePayment,
  isPaymentDisabled,
  isLoading,
}: {
  handlePayment: () => void;
  isPaymentDisabled: boolean;
  isLoading: boolean;
}) => {
  return (
    <div className="p-6 pt-3">
      <Button
        onClick={handlePayment}
        disabled={isPaymentDisabled}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-6 rounded-md transition-all shadow-lg disabled:opacity-70 h-12"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Proceed to Payment"
        )}
      </Button>
    </div>
  );
};
