import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { MultiSelect } from "../multi-select";
import { FormBasicVoucherProps } from "./basic";

interface FormCategoriesProps extends FormBasicVoucherProps {
  isForAllCategories: boolean;
  categories: {
    id: number;
    nama: string;
  }[];
}
export function FormCategories({
  categories,
  isForAllCategories,
  errors,
  setValue,
  watch,
}: FormCategoriesProps) {
  return (
    <TabsContent value="categories" className="space-y-6">
      {/* Kategori (hanya jika tidak berlaku untuk semua kategori) */}
      {!isForAllCategories && categories && (
        <div className="space-y-2">
          <Label htmlFor="categoryIds">Kategori</Label>
          <MultiSelect
            options={categories.map((cat) => ({
              value: cat.id.toString(),
              label: cat.nama,
            }))}
            selected={watch("categoryIds")?.map((id) => id.toString()) || []}
            onChange={(values) =>
              setValue(
                "categoryIds",
                values.map((v) => Number.parseInt(v))
              )
            }
            placeholder="Pilih kategori"
          />
          <p className="text-sm text-muted-foreground">
            Pilih kategori yang berlaku untuk voucher ini
          </p>
          {errors.categoryIds && (
            <p className="text-sm font-medium text-destructive">
              {errors.categoryIds.message}
            </p>
          )}
        </div>
      )}
    </TabsContent>
  );
}
