"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HeaderSubCategory } from "./components/header-sub-category";
import { trpc } from "@/utils/trpc";
import SubContent from "./components/sub-content";
import { SkeletonSubCategories } from "./components/skeleton-sub";
import { NotFoundItems } from "@/components/ui/not-found-items";
import { PaginationComponent } from "@/components/ui/pagination-component";
import { useDebouncedValue } from "@/hooks/useDebounced";

export default function SubCategory() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial values from URL parameters
  const initialSearch = searchParams.get("search") || "";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialStatus = searchParams.get("active") ?? "all";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [status, setStatus] = useState<string | undefined>(initialStatus);
  const [perPage] = useState(10);

  // Use the debounced hook for search
  const debouncedSearch = useDebouncedValue(searchTerm);

  // Update URL when search, page, or status changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }

    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    } else {
      params.delete("page");
    }

    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, currentPage, status, router, searchParams]);

  // Reset page when search or status changes
  useEffect(() => {
    if (
      (searchTerm !== searchParams.get("search") ||
        status !== searchParams.get("status")) &&
      currentPage !== 1
    ) {
      setCurrentPage(1);
    }
  }, [searchTerm, status, searchParams, currentPage]);

  const { data, isLoading, isFetching } = trpc.subCategory.getAll.useQuery(
    {
      page: currentPage,
      perPage,
      search: debouncedSearch,
      active: status || undefined, // Send as undefined if empty string
    },
    {
      retry: 1,
      staleTime: 10 * 60 * 60,
      refetchOnWindowFocus: false,
    }
  );

  const subCategories = data?.data?.data || [];
  const meta = data?.data?.meta;

  // Transform pagination data
  const pagination = meta
    ? {
        totalCount: meta.totalItems,
        totalPages: meta.totalPages,
        hasNextPage: meta.currentPage < meta.totalPages,
        hasPreviousPage: meta.currentPage > 1,
      }
    : undefined;

  // Handle status change
  const handleStatusChange = (value: string | undefined) => {
    setStatus(value);
  };

  return (
    <main className="space-y-6 p-8">
      <HeaderSubCategory
        onSearchChange={setSearchTerm}
        searchValue={searchTerm}
        onStatusChange={handleStatusChange}
        statusValue={status}
      />

      {isLoading || isFetching ? (
        <SkeletonSubCategories />
      ) : subCategories.length > 0 ? (
        <>
          <SubContent data={subCategories} />

          {pagination && (
            <PaginationComponent
              currentPage={currentPage}
              perPage={perPage}
              pagination={pagination}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      ) : (
        <NotFoundItems />
      )}
    </main>
  );
}
