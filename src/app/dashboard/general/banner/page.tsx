"use client";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid, List } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BannerLoading } from "./isLoading";
import { BannerCard } from "./bannerCard";
import { PaginationComponent } from "@/components/ui/pagination-component";
import { BannerTable } from "./bannerTable";
import { DialogCreate } from "./dialog/dialogCreate";

export default function Page() {
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<"table" | "card">("card");

  const { data, isLoading, error } = trpc.banner.getAll.useQuery({
    tipe: "banner",
    limit: perPage,
    page,
  });

  const handlePerPageChange = (value: string) => {
    setPerPage(Number.parseInt(value));
    setPage(1);
  };

  if (error) {
    return (
      <main className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading banners: {error.message}
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Banner Management</h1>
          <p className="text-muted-foreground">
            {data?.pagination.total || 0} banners total
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={perPage.toString()}
            onValueChange={handlePerPageChange}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2 rounded-md">
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("card")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <DialogCreate />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <BannerLoading viewMode={viewMode} />}

      {/* Content */}
      {data && !isLoading && (
        <>
          {viewMode === "card" ? (
            /* Card View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.data.map((banner) => (
                <BannerCard banner={banner} />
              ))}
            </div>
          ) : (
            /* Table View */
            <BannerTable banners={data.data} />
          )}

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <PaginationComponent
              currentPage={data.pagination.page}
              pagination={{
                hasNextPage: data.pagination.hasNext,
                hasPreviousPage: data.pagination.hasPrev,
                totalCount: data.pagination.total,
                totalPages: data.pagination.totalPages,
              }}
              perPage={perPage}
              setCurrentPage={setPage}
            />
          )}
        </>
      )}
    </main>
  );
}
