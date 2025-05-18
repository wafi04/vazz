"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { DialogDepositAndMembership } from "./dialogMembership";

export function FormTopupContent() {
  const [selectedNominal, setSelectedNominal] = useState<string | null>(
    "50000"
  ); // Allow null for custom
  const [customNominal, setCustomNominal] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState("virtual-account");
  const [selectedBank, setSelectedBank] = useState<{
    code: string;
    name: string;
  } | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const NOMINAL_OPTIONS = [
    { value: "50000", label: "Rp 50.000" },
    { value: "100000", label: "Rp 100.000" },
    { value: "200000", label: "Rp 200.000" },
    { value: "500000", label: "Rp 500.000" },
    { value: "1000000", label: "Rp 1.000.000" },
  ];

  const PAYMENT_METHODS = [
    { value: "virtual-account", label: "Virtual Account", icon: "🏦" },
    { value: "e-walet", label: "E-Wallet", icon: "💳" },
    { value: "qris", label: "QRIS", icon: "📱" },
  ];

  const { data: methodData } = trpc.method.getAll.useQuery({
    isActive: "Active",
    isAll: true,
    type: selectedPayment,
  });

  // Handle custom nominal input
  const handleCustomNominalChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setCustomNominal(value);
      setSelectedNominal(null); // Deselect predefined nominal
    }
  };

  const handleNominalSelect = (value: string) => {
    setSelectedNominal(value);
    setCustomNominal("");
  };

  // Determine the final nominal value
  const finalNominal = selectedNominal || customNominal;

  const isCustomNominalValid = customNominal
    ? parseInt(customNominal) >= 1000
    : true;

  return (
    <>
      <div className="space-y-8 p-2 bg-card rounded-[var(--radius)] shadow-sm max-w-2xl mx-auto">
        {/* Nominal Selection */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold text-foreground">
            Pilih Nominal
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {NOMINAL_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={
                  selectedNominal === option.value ? "default" : "outline"
                }
                onClick={() => handleNominalSelect(option.value)}
                className={`w-full py-3 text-sm font-medium transition-all duration-200 ${
                  selectedNominal === option.value
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-card text-muted-foreground border-border hover:bg-blue-700 hover:text-secondary-foreground"
                } rounded-[var(--radius)]`}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <div className="mt-4">
            <Label className="text-sm font-medium text-foreground">
              Atau Masukkan Nominal Lain
            </Label>
            <Input
              type="text"
              placeholder="Masukkan nominal (misal: 1000)"
              value={customNominal}
              onChange={handleCustomNominalChange}
              className={`mt-1 ${
                customNominal && !isCustomNominalValid
                  ? "border-red-500"
                  : "border-border"
              }`}
            />
            {customNominal && !isCustomNominalValid && (
              <p className="text-red-500 text-sm mt-1">
                Nominal minimal Rp 1.000
              </p>
            )}
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold text-foreground">
            Metode Pembayaran
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {PAYMENT_METHODS.map((method) => (
              <Button
                key={method.value}
                type="button"
                variant={
                  selectedPayment === method.value ? "default" : "outline"
                }
                onClick={() => {
                  setSelectedPayment(method.value);
                  setSelectedBank(null);
                }}
                className={`w-full py-3 text-sm font-medium transition-all duration-200 ${
                  selectedPayment === method.value
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-card text-muted-foreground border-border hover:bg-blue-700 hover:text-secondary-foreground"
                } rounded-[var(--radius)]`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{method.icon}</span>
                  <span className="hidden sm:inline">{method.label}</span>
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Bank Selection (for Virtual Accounts) */}
        {selectedPayment && methodData && methodData.data.length > 0 && (
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-foreground">
              Pilih Metode
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {methodData.data.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() =>
                    setSelectedBank({
                      code: method.code,
                      name: method.name,
                    })
                  }
                  className={`w-full p-4 text-left border border-border rounded-[var(--radius)] shadow-sm transition-all duration-200 ${
                    selectedBank?.code === method.code
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-blue-700 hover:text-secondary-foreground"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={method.images}
                      alt={method.name}
                      className="w-12 h-12 object-contain"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {method.name}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          className="w-full py-3 text-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 rounded-[var(--radius)] disabled:bg-muted disabled:text-muted-foreground"
          onClick={() => setOpen(true)}
          disabled={!selectedBank || !finalNominal || !isCustomNominalValid}
        >
          Lanjutkan Deposit
        </Button>
      </div>
      {open && (
        <DialogDepositAndMembership
          type="deposit"
          open={open}
          amount={parseInt(finalNominal)}
          onClose={() => setOpen(!open)}
          payment={{
            code: selectedBank?.code as string,
            name: selectedBank?.name as string,
          }}
        />
      )}
    </>
  );
}
