import { STEPS, DEBOUNCE_DELAY, DEFAULT_CATEGORY } from "@/constants";
import { useDebouncedValue } from "@/hooks/useDebounced";
import { ProductData } from "@/types/product";
import { PembelianManualData } from "@/types/transaction";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const useOrderData = () => {
  const { data, isLoading, error } = trpc.manualOrder.getManualOrder.useQuery(
    {}
  );
  return {
    orders: data?.data || [],
    isLoading,
    error,
  };
};

export const useOrderFilters = (orders: PembelianManualData[]) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("total");

  const filteredOrders =
    selectedFilter === "total"
      ? orders
      : orders.filter((order) => order.status === selectedFilter);

  return {
    selectedFilter,
    setSelectedFilter,
    filteredOrders,
  };
};

export const useExpandedRows = () => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (orderId: string) => {
    setExpandedRows((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  return { expandedRows, toggleRow };
};

// Schema validation
export const CreateManualOrderSchema = z.object({
  createdBy: z.string().min(1, "Created By is required"),
  reason: z.string().min(1, "Reason is required"),
  productCode: z.string().min(1, "Product Code is required"),
  userId: z.string().min(1, "User ID is required"),
  zone: z.string().optional(),
  nickname: z.string().optional(),
  whatsapp: z.string().optional(),
  productName: z.string().min(1, "Product Name is required"),
});

export type FormData = z.infer<typeof CreateManualOrderSchema>;

// Custom hooks
export const useStepNavigation = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.PRODUCT_SELECTION);

  const goToNext = () => setCurrentStep(STEPS.ORDER_DETAILS);
  const goToPrevious = () => setCurrentStep(STEPS.PRODUCT_SELECTION);
  const isFirstStep = currentStep === STEPS.PRODUCT_SELECTION;
  const isLastStep = currentStep === STEPS.ORDER_DETAILS;

  return { currentStep, goToNext, goToPrevious, isFirstStep, isLastStep };
};

export const useProductSelection = () => {
  const [pickCategory, setPickCategory] = useState<number | undefined>(
    DEFAULT_CATEGORY
  );
  const [search, setSearch] = useState<string>("");
  const [selectedLayanan, setSelectedLayanan] = useState<ProductData | null>(
    null
  );

  const debouncedSearch = useDebouncedValue(search, DEBOUNCE_DELAY);

  const resetSelection = () => {
    setSelectedLayanan(null);
    setSearch("");
  };

  const handleCategoryChange = (categoryId: number | undefined) => {
    setPickCategory(categoryId);
    resetSelection();
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (value !== "") {
      setSelectedLayanan(null);
    }
  };

  const clearSearch = () => setSearch("");

  return {
    pickCategory,
    search,
    selectedLayanan,
    debouncedSearch,
    setSelectedLayanan,
    handleCategoryChange,
    handleSearchChange,
    clearSearch,
    resetSelection,
  };
};

export const useFormData = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(CreateManualOrderSchema),
    defaultValues: {
      createdBy: "",
      reason: "",
      productCode: "",
      userId: "",
      zone: "",
      nickname: "",
      whatsapp: "",
      productName: "",
    },
  });

  return { form, reset: form.reset };
};
