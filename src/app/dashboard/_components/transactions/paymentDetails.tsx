"use client";
import { PaymentDetails } from "@/types/transaction";
import { CreditCard } from "lucide-react";

interface PaymentDetailsProps {
  payment: PaymentDetails;
}

export function PaymentDetails({ payment }: PaymentDetailsProps) {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-card-foreground flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-primary" />
        Payment Details
      </h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Payment ID:</span>
          <span className="font-medium">{payment.orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Methode:</span>
          <span className="font-medium">{payment.metode}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Buyer Number:</span>
          <span className="font-medium">{payment.noPembeli}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Harga:</span>
          <span className="font-medium">{payment.harga}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fee:</span>
          <span className="font-medium">{payment.fee}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">FeeRupiah:</span>
          <span className="font-medium">{payment.feeRupiah}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total:</span>
          <span className="font-medium">{payment.totalAmount}</span>
        </div>
        {payment.reference && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reference:</span>
            <span className="font-medium">{payment.reference}</span>
          </div>
        )}
      </div>
    </div>
  );
}
