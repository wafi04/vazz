"use client";
import { trpc } from "@/utils/trpc";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { ErrorState, LoadingState } from "./state";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductData } from "@/types/product";
import { LAYANAN_PER_PAGE, STEPS } from "@/constants";
import { FormField } from "@/components/ui/formfield";
import { SearchInput } from "./form/searchInput";
import { LayananSelector } from "./form/layananSelector";
import { CategorySelector } from "./form/categorySelector";
import {
  FormData,
  useFormData,
  useProductSelection,
  useStepNavigation,
} from "./hooks";
import axios from "axios";
import { toast } from "sonner";

// Main component
export function FormPesananManual() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentStep, goToNext, goToPrevious, isFirstStep } =
    useStepNavigation();
  const {
    pickCategory,
    search,
    selectedLayanan,
    debouncedSearch,
    setSelectedLayanan,
    handleCategoryChange,
    handleSearchChange,
    clearSearch,
  } = useProductSelection();
  const { form, reset } = useFormData();

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = trpc.categories.getAll.useQuery({
    active: "active",
    isAll: true,
  });

  const {
    data: layananData,
    isLoading: layananLoading,
    error: layananError,
  } = trpc.layanans.getAll.useQuery(
    {
      status: "active",
      search: debouncedSearch || undefined,
      categoryId: pickCategory?.toString(),
      page: 1,
      perPage: LAYANAN_PER_PAGE,
    },
    { enabled: !!pickCategory }
  );

  // Effects
  useEffect(() => {
    if (search !== "" && selectedLayanan) {
      setSelectedLayanan(null);
    }
  }, [search, selectedLayanan, setSelectedLayanan]);

  useEffect(() => {
    if (selectedLayanan) {
      form.setValue("productCode", selectedLayanan.providerId);
      form.setValue("productName", selectedLayanan.layanan);
    }
  }, [selectedLayanan, form]);

  // Event handlers
  const handleLayananSelect = useCallback(
    (layanan: ProductData) => {
      setSelectedLayanan(layanan);
    },
    [setSelectedLayanan]
  );

  const handleCategorySelect = useCallback(
    (value: string) => {
      const categoryId = Number(value) || undefined;
      handleCategoryChange(categoryId);
    },
    [handleCategoryChange]
  );

  const handleNext = useCallback(() => {
    if (selectedLayanan) {
      goToNext();
    }
  }, [selectedLayanan, goToNext]);

  const handleBack = useCallback(() => {
    goToPrevious();
  }, [goToPrevious]);

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/v1/order/retransaction", data);

      if (response.status === 200 || response.status === 201) {
        toast.success("Manual order created successfully!");

        reset();
        setSelectedLayanan(null);

        return response.data;
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      let errorMessage = "Failed to create manual order";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading and error states
  if (categoriesLoading) return <LoadingState />;
  if (categoriesError) return <ErrorState error={categoriesError} />;

  const layananList = layananData?.data || [];
  const isNextDisabled = !selectedLayanan;
  const isSubmitDisabled = isSubmitting || form.formState.isSubmitting;

  return (
    <div className="w-full  p-4">
      {currentStep === STEPS.PRODUCT_SELECTION && (
        <div className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Select Product</h2>
            <p className="text-sm text-muted-foreground">
              Choose a category and product for the manual order
            </p>
          </div>

          <CategorySelector
            categories={categories?.data.data || []}
            value={pickCategory}
            onChange={handleCategorySelect}
          />

          {pickCategory && (
            <SearchInput
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onClear={clearSearch}
              debouncedValue={debouncedSearch}
            />
          )}

          {pickCategory && (
            <LayananSelector
              layananList={layananList}
              isLoading={layananLoading}
              error={layananError}
              selectedLayanan={selectedLayanan}
              onSelect={handleLayananSelect}
              search={search}
              debouncedSearch={debouncedSearch}
              onClearSearch={clearSearch}
            />
          )}

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleNext}
              disabled={isNextDisabled}
              className="flex items-center gap-2"
            >
              Next Step
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {currentStep === STEPS.ORDER_DETAILS && (
        <div className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Order Details</h2>
            <p className="text-sm text-muted-foreground">
              Fill in the required information for the manual order
            </p>
            {selectedLayanan && (
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Selected Product:</span>{" "}
                  {selectedLayanan.layanan}
                </p>
                <p className="text-sm text-muted-foreground">
                  Code: {selectedLayanan.providerId}
                </p>
              </div>
            )}
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-2xl mx-auto space-y-6"
          >
            <FormField
              id="createdBy"
              label="Created By *"
              register={form.register("createdBy")}
              error={form.formState.errors.createdBy}
              placeholder="Enter creator name"
              required
            />

            <FormField
              id="reason"
              label="Reason *"
              register={form.register("reason")}
              error={form.formState.errors.reason}
              placeholder="Enter reason for creating manual order"
              type="textarea"
              rows={3}
              required
            />

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="userId"
                label="User ID *"
                register={form.register("userId")}
                error={form.formState.errors.userId}
                placeholder="User ID"
                required
              />

              <FormField
                id="zone"
                label="Zone"
                register={form.register("zone")}
                error={form.formState.errors.zone}
                placeholder="Zone/Server"
                optional
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="nickname"
                label="Nickname"
                register={form.register("nickname")}
                error={form.formState.errors.nickname}
                placeholder="In-game name"
                optional
              />

              <FormField
                id="whatsapp"
                label="WhatsApp"
                register={form.register("whatsapp")}
                error={form.formState.errors.whatsapp}
                placeholder="WhatsApp number"
                optional
              />
            </div>

            {/* Hidden fields for product data */}
            <input type="hidden" {...form.register("productCode")} />
            <input type="hidden" {...form.register("productName")} />

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
                disabled={isSubmitDisabled}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              <Button
                type="submit"
                disabled={isSubmitDisabled}
                className="flex items-center gap-2"
              >
                {isSubmitDisabled ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  "Create Manual Order"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
