"use client";
import { FC } from "react";
import { FormatPrice } from "@/utils/formatPrice";

interface PaymentSummaryProps {
  price: number;
  discount?: number;
  finalPrice?: number;
}

export const PaymentSummary: FC<PaymentSummaryProps> = ({
  price,
  discount = 0,
  finalPrice,
}) => {
  return (
    <div className="px-4 py-2">
      <h3 className="text-xs font-medium text-indigo-200 mb-1.5 flex items-center">
        <span className="w-1 h-1 bg-indigo-400 rounded-full mr-1.5"></span>
        Payment Summary
      </h3>

      <div className="bg-indigo-900/30 rounded p-3 border border-indigo-500/20">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-indigo-200">Subtotal</span>
          <span className="text-xs font-medium text-white">
            {FormatPrice(price)}
          </span>
        </div>

        {discount && discount > 0 && (
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-indigo-200">Discount</span>
            <span className="text-xs font-medium text-green-400">
              -{FormatPrice(discount)}
            </span>
          </div>
        )}

        <div className="border-t border-indigo-500/20 my-1.5"></div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-white">Total Payment</span>
          <span className="text-base font-bold text-white">
            {FormatPrice(finalPrice || 0)}
          </span>
        </div>
      </div>
    </div>
  );
};
