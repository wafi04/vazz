"use client";
import { useState } from "react";
import { HeaderCategory } from "./components/header-category";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";
import { TableCategory } from "./components/table-category";
import { NotFoundItems } from "@/components/ui/not-found-items";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedValue } from "@/hooks/useDebounced";

export function DashboardProductCategory() {
  const [filter, setFilter] = useState<{
    search: string;
    type: string | undefined;
    status: string | undefined;
  }>({
    search: "",
    type: undefined ?? "gamelainnya",
    status: undefined ?? "active",
  });

  const debouncedSearch = useDebouncedValue(filter.search);

  const { data, isLoading, isFetching } = trpc.categories.getAll.useQuery(
    {
      page: 1,
      perPage: 10,
      type: filter.type,
      active: filter.status,
      search: debouncedSearch,
    },
    { staleTime: 5 * 60_000 }
  );

  const categories = data?.data.data || [];

  return (
    <div className="space-y-6 p-8">
      <HeaderCategory filter={filter} setFilter={setFilter} />

      <Card>
        <CardContent className="p-0">
          {isLoading && (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          )}
          {!isLoading && categories.length > 0 && (
            <TableCategory categories={categories} />
          )}
          {!isLoading && !isFetching && categories.length === 0 && (
            <NotFoundItems />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
