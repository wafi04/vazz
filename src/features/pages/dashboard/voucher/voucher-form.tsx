"use client";
import { trpc } from "@/utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Info,
  Percent,
  Tag,
  CalendarPlus2Icon as CalendarIcon2,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Voucher } from "@/types/voucher";
import { FormBasicVoucher } from "./form/basic";
import { FormDiscountVoucher } from "./form/disc";
import { FormValidity } from "./form/validity";
import { FormCategories } from "./form/categories";
import { useVoucherForm } from "@/hooks/useVoucherForm";

interface VoucherFormProps {
  initialData?: Voucher;
  onSuccess?: () => void;
}

export function VoucherForm({ initialData, onSuccess }: VoucherFormProps) {
  const { data: categories } = trpc.main.getCategories.useQuery({
    fields: ["id", "nama"],
  });
  const queryClient = useQueryClient();

  const { mutate, isLoading: isPending } = trpc.voucher.create.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voucher", "getAll"] });
      toast.success("created voucher successfully");
      if (onSuccess) onSuccess();
    },
    onError: () => {
      queryClient.cancelQueries({ queryKey: ["voucher", "getAll"] });
      toast.error("failed to create voucher");
    },
  });

  const { mutate: update, isLoading: updatePending } =
    trpc.voucher.update.useMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    discountType,
    isForAllCategories,
    handleDiscountTypeChange,
    validateAndPrepareSubmission,
  } = useVoucherForm(initialData);

  function onSubmit(
    values: Parameters<typeof validateAndPrepareSubmission>[0]
  ) {
    try {
      const submissionData = validateAndPrepareSubmission(values);

      if (initialData) {
        update({ data: submissionData, id: initialData.id });
      } else {
        mutate(submissionData);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  const isLoading = initialData ? updatePending : isPending;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="discount" className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              <span>Discount</span>
            </TabsTrigger>
            <TabsTrigger value="validity" className="flex items-center gap-2">
              <CalendarIcon2 className="h-4 w-4" />
              <span>Validity</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>Categories</span>
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <FormBasicVoucher
            errors={errors}
            register={register}
            setValue={setValue}
            watch={watch}
          />

          {/* Discount Tab */}
          <FormDiscountVoucher
            errors={errors}
            register={register}
            setValue={setValue}
            watch={watch}
            discountType={discountType as "FIXED" | "PERCENTAGE"}
            handleDiscount={handleDiscountTypeChange}
          />

          {/* Validity Tab */}
          <FormValidity
            errors={errors}
            register={register}
            setValue={setValue}
            watch={watch}
          />

          {/* Categories Tab */}
          <FormCategories
            errors={errors}
            register={register}
            setValue={setValue}
            watch={watch}
            categories={categories?.data ?? []}
            isForAllCategories={isForAllCategories}
          />
        </Tabs>

        {/* Aksi Form */}
        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {initialData ? "Perbarui Voucher" : "Buat Voucher"}
          </Button>
        </div>
      </form>
    </div>
  );
}
