"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/utils/trpc";
import { DialogDepositAndMembership } from "./dialogMembership";
import { FormatPrice } from "@/utils/formatPrice";
import {
  BankMethod,
  MINIMUM_CUSTOM_AMOUNT,
  NOMINAL_OPTIONS,
  TAX_RATE,
  PaymentMethodCode,
} from "@/constants";
import { BankSection, BankSelect } from "./bankSection";

export function FormTopupContent() {
  const [selectedNominal, setSelectedNominal] = useState<string | null>(
    "50000"
  );
  const [customNominal, setCustomNominal] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<
    PaymentMethodCode | undefined
  >(undefined);
  const [selectedBank, setSelectedBank] = useState<BankMethod | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { data: methodData } = trpc.method.getAll.useQuery({
    isActive: "Active",
    isAll: true,
    type: selectedPayment,
  });

  const { baseAmount, taxAmount, totalAmount } = useMemo(() => {
    const finalNominal = selectedNominal || customNominal;
    if (!finalNominal) return { baseAmount: 0, taxAmount: 0, totalAmount: 0 };

    const numericAmount = Number(finalNominal);
    if (isNaN(numericAmount))
      return { baseAmount: 0, taxAmount: 0, totalAmount: 0 };

    const tax = Math.round(numericAmount * TAX_RATE);
    const total =
      selectedBank?.code === "NQ" ? numericAmount + tax : numericAmount;

    return { baseAmount: numericAmount, taxAmount: tax, totalAmount: total };
  }, [selectedNominal, customNominal, selectedBank]);

  const handleCustomNominalChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "");
    setCustomNominal(value);
    if (value) setSelectedNominal(null);
  };

  const handleNominalSelect = (value: string) => {
    setSelectedNominal(value);
    setCustomNominal("");
  };

  const handlePaymentMethodChange = (method: PaymentMethodCode) => {
    setSelectedPayment(method);
    setSelectedBank(null);
  };

  const isCustomNominalValid =
    !customNominal || Number(customNominal) >= MINIMUM_CUSTOM_AMOUNT;
  const isFormValid =
    selectedBank &&
    (selectedNominal || (customNominal && isCustomNominalValid));

  return (
    <>
      <div className="space-y-8 p-4 bg-card rounded-lg shadow-sm max-w-2xl mx-auto">
        {/* Nominal Selection */}
        <section className="space-y-3">
          <Label className="text-lg font-semibold">Pilih Nominal</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {NOMINAL_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={
                  selectedNominal === option.value ? "default" : "outline"
                }
                onClick={() => handleNominalSelect(option.value)}
                className="w-full py-3 text-sm font-medium transition-colors"
              >
                {option.label}
              </Button>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <Label className="text-sm font-medium">
              Atau Masukkan Nominal Lain
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                Rp
              </span>
              <Input
                type="text"
                placeholder="Masukkan nominal (minimal 1.000)"
                value={customNominal}
                onChange={handleCustomNominalChange}
                className={`pl-10 ${
                  !isCustomNominalValid ? "border-destructive" : ""
                }`}
              />
            </div>
            {!isCustomNominalValid && (
              <p className="text-destructive text-sm">
                Nominal minimal Rp{" "}
                {MINIMUM_CUSTOM_AMOUNT.toLocaleString("id-ID")}
              </p>
            )}
          </div>
        </section>

        {/* Payment Method Selection */}
        <BankSelect
          onChange={handlePaymentMethodChange}
          selectedPayment={selectedPayment}
        />

        {/* Bank Selection */}
        {selectedPayment && methodData && methodData.data?.length > 0 && (
          <BankSection
            methodData={methodData.data}
            selectedBank={selectedBank}
            setSelectedBank={setSelectedBank}
          />
        )}

        {/* Summary and Submit */}
        <div className="space-y-4">
          <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nominal:</span>
              <span>{FormatPrice(baseAmount)}</span>
            </div>
            {selectedBank?.code === "NQ" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Biaya Admin ({Math.round(TAX_RATE * 100)}%):
                </span>
                <span>{FormatPrice(taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total:</span>
              <span>{FormatPrice(totalAmount)}</span>
            </div>
          </div>

          <Button
            className="w-full py-6 text-md "
            onClick={() => setOpenDialog(true)}
            disabled={!isFormValid}
          >
            Lanjutkan Deposit - {FormatPrice(totalAmount)}
          </Button>
        </div>
      </div>

      <DialogDepositAndMembership
        type="DEPOSIT"
        open={openDialog}
        amount={totalAmount}
        onClose={() => setOpenDialog(false)}
        payment={{
          code: selectedBank?.code || "",
          name: selectedBank?.name || "",
        }}
      />
    </>
  );
}
