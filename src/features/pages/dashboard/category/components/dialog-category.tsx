"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormCategory, FormValuesCategory } from "@/types/schema/categories";
import { Category } from "@/types/category";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { BasicInformationFormCategory } from "./form/basic";
import { ImageFormCategory } from "./form/image";

export function DialogCreateCategory({
  children,
  req,
}: {
  children: ReactNode;
  req?: Category;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValuesCategory>({
    defaultValues: {
      nama: req?.nama || "",
      subNama: req?.subNama || "",
      brand: req?.brand || "",
      kode: req?.kode || "",
      status: req?.status || "",
      thumbnail: req?.thumbnail ?? "",
      tipe: req?.tipe ?? "",
      petunjuk: req?.petunjuk ?? "",
      ketLayanan: req?.ketLayanan ?? "",
      placeholder1: req?.placeholder1 ?? "",
      placeholder2: req?.placeholder2 ?? "",
      bannerLayanan: req?.bannerLayanan ?? "",
      ketId: "1",
      serverId: 0,
    },
  });

  // Inside your component:
  const queryClient = useQueryClient();

  const { mutate: create, isLoading: createLoading } =
    trpc.main.createCategory.useMutation({
      onSuccess: () => {
        toast.success("Category created successfully");
        reset();
        setOpen(false);
      },
      onError: (err) => {
        toast.error(
          `Error creating category: ${err?.message || "Unknown error"}`
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: [["main", "getCategoriesAll"]],
        });
      },
    });

  const { mutate: update, isLoading: updateLoading } =
    trpc.main.updateCategory.useMutation({
      onSuccess: () => {
        toast.success("Category updated successfully");
        reset();
        setOpen(false);
      },
      onError: (err) => {
        toast.error(
          `Error updating category: ${err?.message || "Unknown error"}`
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: [["main", "getCategoriesAll"]],
        });
      },
    });

  const onSubmit = async (data: FormValuesCategory) => {
    create(data);
    refreshData();
  };

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Kategori Baru</DialogTitle>
          <DialogDescription>
            Isi form berikut untuk menambahkan kategori baru.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
              <TabsTrigger value="display">Tampilan</TabsTrigger>
              <TabsTrigger value="additional">Informasi Tambahan</TabsTrigger>
            </TabsList>

            <BasicInformationFormCategory
              errors={errors}
              register={register}
              setValue={setValue}
              watch={watch}
            />
            <ImageFormCategory
              errors={errors}
              register={register}
              setValue={setValue}
              watch={watch}
            />

            {/* Additional Information Tab */}
            <TabsContent value="additional" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="petunjuk">Petunjuk</Label>
                <Textarea
                  id="petunjuk"
                  placeholder="Masukkan petunjuk penggunaan (opsional)"
                  className="min-h-[100px]"
                  {...register("petunjuk")}
                />
                {errors.petunjuk && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.petunjuk.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ketLayanan">Keterangan Layanan</Label>
                <Textarea
                  id="ketLayanan"
                  placeholder="Masukkan keterangan layanan (opsional)"
                  className="min-h-[100px]"
                  {...register("ketLayanan")}
                />
                {errors.ketLayanan && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.ketLayanan.message}
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Batal
            </Button>
            <Button type="submit" className="w-full">
              {createLoading || updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : req?.id ? (
                "Update"
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
