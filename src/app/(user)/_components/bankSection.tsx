"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PAYMENT_METHODS } from "@/constants";
import type { BankMethod, PaymentMethodCode } from "@/constants";
import { PaymentMethod } from "@/types/payment";
import Image from "next/image";

interface BankSelectProps {
  onChange: (method: PaymentMethodCode) => void;
  selectedPayment: PaymentMethodCode | undefined;
}

export function BankSelect({ onChange, selectedPayment }: BankSelectProps) {
  const handlePaymentSelect = (methodValue: PaymentMethodCode) => {
    onChange(methodValue);
  };

  return (
    <section className="space-y-3">
      <Label className="text-lg font-semibold">Metode Pembayaran</Label>
      <div className="grid grid-cols-3 gap-3">
        {PAYMENT_METHODS.map((method) => (
          <Button
            key={method.value}
            type="button"
            variant={selectedPayment === method.value ? "default" : "outline"}
            onClick={() =>
              handlePaymentSelect(method.value as PaymentMethodCode)
            }
            className="w-full py-3 text-sm font-medium transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{method.icon}</span>
              <span className="hidden sm:inline">{method.label}</span>
            </span>
          </Button>
        ))}
      </div>
    </section>
  );
}

interface BankSectionProps {
  methodData: PaymentMethod[];
  selectedBank: BankMethod | null;
  setSelectedBank: (bank: BankMethod | null) => void;
}

export function BankSection({
  methodData,
  selectedBank,
  setSelectedBank,
}: BankSectionProps) {
  return (
    <section className="space-y-3">
      <Label className="text-lg font-semibold">Pilih Metode</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {methodData?.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() =>
              setSelectedBank({ code: method.code, name: method.name })
            }
            className={`w-full p-4 text-left border rounded-lg shadow-sm transition-colors ${
              selectedBank?.code === method.code
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card hover:bg-accent border-border"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12">
                <Image
                  src={method.images }
                  alt={method.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{method.name}</p>
                {selectedBank?.code === method.code && (
                  <p className="text-xs mt-1 opacity-80">Dipilih</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
