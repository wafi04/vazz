import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  // Debug log

  const handleToggleAllCategories = (forAll: boolean) => {
    // Gunakan setValue untuk update isForAllCategories

    if (forAll) {
      setValue("categoryIds", []);
    }
  };

  return (
    <TabsContent value="categories" className="space-y-6">
      {/* Toggle Button untuk Semua Kategori atau Pilih Kategori */}
      <div className="space-y-4">
        <Label>Penerapan Kategori</Label>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant={isForAllCategories ? "default" : "outline"}
            onClick={() => handleToggleAllCategories(true)}
            className="w-full justify-center"
          >
            Semua Kategori
          </Button>

          <Button
            type="button"
            variant={!isForAllCategories ? "default" : "outline"}
            onClick={() => handleToggleAllCategories(false)}
            className="w-full justify-center"
          >
            Pilih Kategori
          </Button>
        </div>

        {/* Info Card */}
        <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
          <CardContent className="p-4">
            <p className="text-sm text-blue-700">
              {isForAllCategories
                ? "Voucher ini akan berlaku untuk semua kategori produk"
                : "Voucher ini hanya berlaku untuk kategori yang dipilih"}
            </p>
          </CardContent>
        </Card>
      </div>

      {!isForAllCategories && (
        <div className="space-y-2">
          <Label htmlFor="categoryIds">
            Pilih Kategori Spesifik
            <span className="text-destructive ml-1">*</span>
          </Label>

          {/* Debug info */}

          {categories && categories.length > 0 ? (
            <MultiSelect
              options={categories.map((cat) => ({
                value: cat.id.toString(),
                label: cat.nama,
              }))}
              selected={watch("categoryIds")?.map((id) => id.toString()) || []}
              onChange={(values) => {
                console.log("MultiSelect onChange:", values);
                setValue(
                  "categoryIds",
                  values.map((v) => Number.parseInt(v))
                );
              }}
              placeholder="Pilih kategori yang berlaku"
            />
          ) : (
            <div className="p-4 text-center text-gray-500 border border-dashed rounded">
              {categories === undefined
                ? "Loading categories..."
                : "No categories available"}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{watch("categoryIds")?.length || 0} kategori dipilih</span>
          </div>

          {errors.categoryIds && (
            <p className="text-sm font-medium text-destructive">
              {errors.categoryIds.message}
            </p>
          )}
        </div>
      )}

      {/* Summary Card */}
      <Card className="bg-gray-50/50">
        <CardContent className="p-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Ringkasan Kategori:</h4>
            {isForAllCategories ? (
              <p className="text-sm text-green-600">
                ✓ Berlaku untuk semua kategori ({categories?.length || 0}{" "}
                kategori)
              </p>
            ) : (
              <p className="text-sm">
                {watch("categoryIds")?.length || 0} kategori dipilih dari{" "}
                {categories?.length || 0} kategori tersedia
                {watch("categoryIds")?.length === 0 && (
                  <span className="text-destructive ml-1">
                    (Pilih minimal 1 kategori)
                  </span>
                )}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
