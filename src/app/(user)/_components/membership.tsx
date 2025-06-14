import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FormatPrice } from "@/utils/formatPrice";
import { trpc } from "@/utils/trpc";
import { Loader2 } from "lucide-react";
import { ErrorState } from "@/app/dashboard/pesanan-manual/_components/state";
import { PaymentMethodCode, BankMethod, TAX_RATE } from "@/constants";
import { BankSelect, BankSection } from "./bankSection";
import { DialogDepositAndMembership } from "./dialogMembership";

export function MembershipContent() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<
    PaymentMethodCode | undefined
  >(undefined);
  const [selectedBank, setSelectedBank] = useState<BankMethod | null>(null);

  const { data, isLoading, error } = trpc.membership.getAll.useQuery();
  const { data: methodData } = trpc.method.getAll.useQuery({
    isActive: "Active",
    isAll: true,
    type: selectedPayment,
  });

  const dataMembership = data?.data || [];
  const selectedMembershipData = dataMembership.find(
    (plan) => plan.name === selectedPlan
  );

  const { baseAmount, taxAmount, totalAmount } = useMemo(() => {
    if (!selectedMembershipData)
      return { baseAmount: 0, taxAmount: 0, totalAmount: 0 };

    const numericAmount = Number(selectedMembershipData.price);
    if (isNaN(numericAmount))
      return { baseAmount: 0, taxAmount: 0, totalAmount: 0 };

    const tax = Math.round(numericAmount * TAX_RATE);
    const total =
      selectedBank?.code === "NQ" ? numericAmount + tax : numericAmount;

    return { baseAmount: numericAmount, taxAmount: tax, totalAmount: total };
  }, [selectedMembershipData, selectedBank]);

  const handlePaymentMethodChange = (method: PaymentMethodCode) => {
    setSelectedPayment(method);
    // Reset selected bank when payment method changes
    setSelectedBank(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center space-y-4 min-h-[200px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="animate-spin h-4 w-4" />
          <span>Memuat data membership...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorState error={error} />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 p-4 bg-card rounded-lg shadow-sm max-w-2xl mx-auto">
        {/* Membership Plans */}
        <section className="space-y-3">
          <Label className="text-lg font-semibold">
            Pilih Paket Membership
          </Label>
          <div className="space-y-3">
            {dataMembership.map((plan) => (
              <div
                key={plan.id || plan.name}
                className={cn(
                  "rounded-lg border p-4 cursor-pointer transition-colors",
                  selectedPlan === plan.name
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                )}
                onClick={() => setSelectedPlan(plan.name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-lg font-semibold cursor-pointer">
                        {plan.name}
                      </Label>
                      {selectedPlan === plan.name && (
                        <Badge variant="default">Dipilih</Badge>
                      )}
                    </div>
                    <p className="text-xl font-bold text-primary mt-1">
                      {FormatPrice(plan.price)}
                    </p>
                    {plan.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {plan.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Method Selection - Only show if plan is selected */}
        {selectedPlan && (
          <BankSelect
            onChange={handlePaymentMethodChange}
            selectedPayment={selectedPayment}
          />
        )}

        {/* Bank Selection - Only show if payment method is selected and method data is available */}
        {selectedPayment && methodData && methodData.data?.length > 0 && (
          <BankSection
            methodData={methodData.data}
            selectedBank={selectedBank}
            setSelectedBank={setSelectedBank}
          />
        )}

        {/* Summary */}
        {selectedPlan && selectedMembershipData && (
          <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paket:</span>
              <span className="font-medium">{selectedMembershipData.name}</span>
            </div>
            {selectedBank && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Metode Pembayaran:
                </span>
                <span className="font-medium">{selectedBank.name}</span>
              </div>
            )}
            {selectedBank && selectedBank.code === "NQ" && taxAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">{FormatPrice(baseAmount)}</span>
              </div>
            )}
            {selectedBank && selectedBank.code === "NQ" && taxAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pajak (0,7%):</span>
                <span className="font-medium">{FormatPrice(taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total:</span>
              <span>
                {FormatPrice(totalAmount || selectedMembershipData.price)}
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          className="w-full py-6 text-md font-semibold"
          onClick={() => setOpen(true)}
          disabled={!selectedPlan || !selectedPayment || !selectedBank}
        >
          {selectedPlan
            ? `Beli Membership - ${
                selectedMembershipData
                  ? FormatPrice(totalAmount || selectedMembershipData.price)
                  : ""
              }`
            : "Pilih Paket Membership"}
        </Button>
      </div>

      {/* Dialog */}
      {selectedMembershipData && selectedBank && (
        <DialogDepositAndMembership
          type="MEMBERSHIP"
          open={open}
          amount={totalAmount || selectedMembershipData.price}
          onClose={() => setOpen(false)}
          payment={{
            code: selectedBank.code,
            name: selectedBank.name,
          }}
        />
      )}
    </>
  );
}
