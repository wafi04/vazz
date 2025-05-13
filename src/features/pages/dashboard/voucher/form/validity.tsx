import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { FormBasicVoucherProps } from "./basic";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface FormValidityProps extends FormBasicVoucherProps {}

export function FormValidity({
  errors,
  register,
  setValue,
  watch,
}: FormValidityProps) {
  const defaultStartDate = new Date();
  const defaultExpiryDate = new Date();
  defaultExpiryDate.setMonth(defaultExpiryDate.getMonth() + 1);

  function safeDateInputValue(date: Date | string | null | undefined) {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  }

  return (
    <TabsContent value="validity" className="space-y-10 p-4">
      {/* Section: Rentang Tanggal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Start Date */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="startDate" className="text-base font-semibold">
            Tanggal Mulai
          </Label>
          <Input
            id="date-picker"
            type="date"
            className="rounded-md border bg-card px-3 py-2 text-sm"
            value={safeDateInputValue(watch("startDate"))}
            onChange={(e) => {
              if (e.target.value) {
                setValue("startDate", new Date(e.target.value));
              }
            }}
            min={new Date().toISOString().split("T")[0]}
          />
          {errors.startDate && (
            <p className="text-xs text-destructive mt-1">
              {errors.startDate.message}
            </p>
          )}
        </div>

        {/* Expiry Date */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="expiryDate" className="text-base font-semibold">
            Tanggal Selesei
          </Label>
          <Input
            id="expiry-date-picker"
            type="date"
            className="rounded-md border bg-card px-3 py-2 text-sm"
            value={safeDateInputValue(watch("expiryDate"))}
            onChange={(e) => {
              if (e.target.value) {
                setValue("expiryDate", new Date(e.target.value));
              }
            }}
            min={(() => {
              try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const startDateValue = watch("startDate");
                const startDate =
                  startDateValue instanceof Date &&
                  !isNaN(startDateValue.getTime())
                    ? startDateValue
                    : new Date(startDateValue || defaultStartDate);

                if (isNaN(startDate.getTime())) {
                  return today.toISOString().split("T")[0];
                }
                return startDate > today
                  ? startDate.toISOString().split("T")[0]
                  : today.toISOString().split("T")[0];
              } catch {
                return new Date().toISOString().split("T")[0];
              }
            })()}
          />

          {errors.expiryDate && (
            <p className="text-xs text-destructive mt-1">
              {errors.expiryDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Section: Batas Penggunaan */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="usageLimit" className="text-base font-semibold">
          Batas Penggunaan
        </Label>
        <Input
          id="usageLimit"
          type="number"
          placeholder="Opsional"
          className="rounded-md border px-3 py-2 text-sm"
          {...register("usageLimit", {
            setValueAs: (v) => (v === "" ? null : Number.parseInt(v) || null),
          })}
        />
        <p className="text-xs text-muted-foreground">
          Jumlah maksimum voucher ini dapat digunakan (opsional)
        </p>
        {errors.usageLimit && (
          <p className="text-xs text-destructive mt-1">
            {errors.usageLimit.message}
          </p>
        )}
      </div>
    </TabsContent>
  );
}
