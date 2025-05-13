import { useMemo } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVoucherSchema } from "@/types/schema/voucher";
import { Voucher } from "@/types/voucher";

export function useVoucherForm(initialData?: Voucher) {
  const defaultExpiryDate = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof createVoucherSchema>>({
    resolver: zodResolver(createVoucherSchema),
    defaultValues: {
      code: initialData?.code ?? "",
      discountType: initialData?.discountType ?? "PERCENTAGE",
      discountValue: initialData?.discountValue ?? 0,
      maxDiscount: initialData?.maxDiscount ?? null,
      minPurchase: initialData?.minPurchase ?? null,
      usageLimit: initialData?.usageLimit ?? null,
      isForAllCategories: initialData?.isForAllCategories ?? false,
      isActive: initialData?.isActive ?? true,
      startDate: initialData?.startDate
        ? new Date(initialData.startDate)
        : new Date(),
      expiryDate: initialData?.expiryDate
        ? new Date(initialData.expiryDate)
        : defaultExpiryDate,
      description: initialData?.description ?? "",
      categoryIds: [],
    },
  });

  const discountType = watch("discountType");
  const isForAllCategories = watch("isForAllCategories");

  const handleDiscountTypeChange = (checked: boolean) => {
    setValue("discountType", checked ? "PERCENTAGE" : "FIXED");
  };

  const validateAndPrepareSubmission = (
    values: z.infer<typeof createVoucherSchema>
  ) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate =
      values.startDate instanceof Date
        ? values.startDate
        : new Date(values.startDate);

    const expiryDate =
      values.expiryDate instanceof Date
        ? values.expiryDate
        : new Date(values.expiryDate);

    if (startDate < today) {
      throw new Error("Start date tidak boleh hari kemarin");
    }

    if (expiryDate < startDate) {
      throw new Error("Hari berakhir harus lebih cepat dari hari mulai");
    }

    return {
      ...values,
      startDate: startDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
    };
  };

  return {
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    discountType,
    isForAllCategories,
    handleDiscountTypeChange,
    validateAndPrepareSubmission,
  };
}
