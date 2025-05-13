import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { FormBasicVoucherProps } from "./basic";
import { Switch } from "@/components/ui/switch";

export interface FormDiscountVoucher extends FormBasicVoucherProps {
  discountType: "PERCENTAGE" | "FIXED";
  handleDiscount: (disc: boolean) => void;
}

export function FormDiscountVoucher({
  errors,
  register,
  setValue,
  watch,
  discountType,
  handleDiscount,
}: FormDiscountVoucher) {
  return (
    <TabsContent value="discount" className="space-y-6">
      {/* Jenis Diskon */}
      <div className="space-y-3">
        <Label>Jenis Diskon</Label>
        <div className="flex items-center justify-between">
          <span className="text-sm">
            {discountType === "PERCENTAGE" ? "Persentase (%)" : "Jumlah Tetap"}
          </span>
          <Switch
            checked={discountType === "PERCENTAGE"}
            onCheckedChange={handleDiscount}
          />
        </div>
        {errors.discountType && (
          <p className="text-sm font-medium text-destructive">
            {errors.discountType.message}
          </p>
        )}
      </div>

      {/* Nilai Diskon */}
      <div className="space-y-2">
        <Label htmlFor="discountValue">
          {discountType === "PERCENTAGE"
            ? "Persentase Diskon"
            : "Jumlah Diskon"}
        </Label>
        <Input
          id="discountValue"
          type="number"
          placeholder={discountType === "PERCENTAGE" ? "10" : "100"}
          {...register("discountValue", {
            valueAsNumber: true,
            onChange: (e) =>
              setValue("discountValue", Number.parseFloat(e.target.value) || 0),
          })}
        />
        <p className="text-sm text-muted-foreground">
          {discountType === "PERCENTAGE"
            ? "Masukkan diskon dalam persen (contoh: 10 => 10%)"
            : "Masukkan diskon dalam jumlah tetap"}
        </p>
        {errors.discountValue && (
          <p className="text-sm font-medium text-destructive">
            {errors.discountValue.message}
          </p>
        )}
      </div>

      {/* Diskon Maksimum (hanya untuk persentase) */}
      {discountType === "PERCENTAGE" && (
        <div className="space-y-2">
          <Label htmlFor="maxDiscount">Diskon Maksimum</Label>
          <Input
            id="maxDiscount"
            type="number"
            placeholder="Opsional"
            {...register("maxDiscount", {
              setValueAs: (v) =>
                v === "" ? null : Number.parseFloat(v) || null,
            })}
          />
          <p className="text-sm text-muted-foreground">
            Diskon maksimum yang digunakan (opsional)
          </p>
          {errors.maxDiscount && (
            <p className="text-sm font-medium text-destructive">
              {errors.maxDiscount.message}
            </p>
          )}
        </div>
      )}

      {/* Pembelian Minimum */}
      <div className="space-y-2">
        <Label htmlFor="minPurchase">Pembelian Minimum</Label>
        <Input
          id="minPurchase"
          type="number"
          placeholder="Opsional"
          {...register("minPurchase", {
            setValueAs: (v) => (v === "" ? null : Number.parseFloat(v) || null),
          })}
        />
        <p className="text-sm text-muted-foreground">
          Jumlah pembelian minimum yang diperlukan untuk menggunakan voucher ini
          (opsional)
        </p>
        {errors.minPurchase && (
          <p className="text-sm font-medium text-destructive">
            {errors.minPurchase.message}
          </p>
        )}
      </div>
    </TabsContent>
  );
}
