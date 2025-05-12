import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { DataTypeCategory } from "@/data/data-category-form";
import { FormValuesCategory } from "@/types/schema/categories";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

interface BasicInformationFormCategoryProps {
    register : UseFormRegister<FormValuesCategory>
    errors : FieldErrors<FormValuesCategory>
    watch : UseFormWatch<FormValuesCategory>
    setValue : UseFormSetValue<FormValuesCategory>
}

export function  BasicInformationFormCategory({register,watch,errors,setValue} : BasicInformationFormCategoryProps) : JSX.Element{
    return (
        <TabsContent value="basic" className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Kategori</Label>
            <Input
              id="nama"
              placeholder="Masukkan nama kategori"
              {...register('nama')}
            />
            {errors.nama && (
              <p className="text-sm font-medium text-destructive">
                {errors.nama.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subName">Sub Nama</Label>
            <Input
              id="subName"
              placeholder="Masukkan sub nama"
              {...register('subNama')}
            />
            {errors.subNama && (
              <p className="text-sm font-medium text-destructive">
                {errors.subNama.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              placeholder="Masukkan brand"
              {...register('brand')}
            />
            {errors.brand && (
              <p className="text-sm font-medium text-destructive">
                {errors.brand.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="kode">Kode</Label>
            <Input
              id="kode"
              placeholder="Masukkan kode"
              {...register('kode')}
            />
            {errors.kode && (
              <p className="text-sm font-medium text-destructive">
                {errors.kode.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipe</Label>
            <Select
              onValueChange={(value) => setValue('tipe', value)}
              value={watch('tipe')}
            >
              <SelectTrigger id="tipe">
                <SelectValue placeholder="Pilih tipe kategori" />
              </SelectTrigger>
              <SelectContent>
              {
                DataTypeCategory.map((item,idx) => (
                <SelectItem key={idx} value={item.value}>{item.name}</SelectItem>
                ))
            }
            </SelectContent>
            </Select>
            {errors.tipe && (
              <p className="text-sm font-medium text-destructive">
                {errors.tipe.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) => setValue('status', value)}
              value={watch('status')}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm font-medium text-destructive">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>
      </TabsContent>
    )
}