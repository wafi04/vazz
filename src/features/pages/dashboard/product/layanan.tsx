"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/utils/trpc";
import { HeaderLayanan } from "./header-layanan";
import { LayananTable } from "./layanan-table";
import { PaginationComponent } from "@/components/ui/pagination-component";
import { Category } from "@/types/category";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { EmptyState } from "@/components/ui/not-found/NotFound";
import { NotFoundItems } from "@/components/ui/not-found-items";
import { useDebouncedValue } from "@/hooks/useDebounced";

export function LayananPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [categoryId, setCategoryId] = useState<string | undefined>("");
  const [status, setStatus] = useState<string | undefined>("all");
  const [isFlashSale, setIsFlashSale] = useState<boolean | undefined>(false);

  const debouncedSearch = useDebouncedValue(searchTerm);

  const { data, isLoading, isFetching, error } = trpc.products.getAll.useQuery(
    {
      page: currentPage,
      perPage,
      search: debouncedSearch,
      categoryId: categoryId,
      status,
      isFlashSale,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      enabled: true,
    }
  );
  const { data: category } = trpc.main.getCategories.useQuery({
    fields: ["id", "nama"],
  });

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const products = data?.data || [];
  const meta = data?.meta;
  const pagination = meta
    ? {
        totalCount: meta.total,
        totalPages: meta.totalPages,
        hasNextPage: meta.page < meta.totalPages,
        hasPreviousPage: meta.page > 1,
      }
    : undefined;

  const isLoadingData = isLoading || isFetching;
  return (
    <main className="p-8 min-h-screen ">
      <HeaderLayanan
        onSearchChange={handleSearchChange}
        data={products}
        category={category?.data as Category[]}
        onCategoryChange={setCategoryId}
        onStatusChange={setStatus}
        onFlashSaleChange={setIsFlashSale}
      />

      <section className="rounded-lg border bg-card shadow-sm">
        {error ? (
          <EmptyState />
        ) : isLoadingData ? (
          <LoadingOverlay />
        ) : products.length === 0 ? (
          <NotFoundItems
            text="Product Kosong"
            subText="Segera Tambahkan Product"
          />
        ) : (
          <LayananTable data={products} />
        )}
      </section>

      {pagination && (
        <PaginationComponent
          currentPage={currentPage}
          perPage={perPage}
          pagination={pagination}
          setCurrentPage={setCurrentPage}
        />
      )}
    </main>
  );
}
