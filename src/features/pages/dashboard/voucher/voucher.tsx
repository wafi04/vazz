"use client";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { HeaderVoucher } from "./header-voucher";
import { VoucherTableSkeleton } from "@/components/ui/skeleton/voucher_skeleton";
import { VoucherTable } from "./voucher-table";
import { Tag } from "lucide-react";
import { useDebouncedValue } from "@/hooks/useDebounced";

export function VoucherPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleStatusChange = (statuses: string[]) => {
    setSelectedStatuses(statuses);
  };

  const determineCategory = () => {
    if (selectedStatuses.length === 0) return activeTab;
    return selectedStatuses[0];
  };

  const { data, isLoading } = trpc.voucher.getAll.useQuery({
    code: debouncedSearch,
    category: determineCategory(),
  });
  return (
    <main className="p-8">
      <HeaderVoucher
        onChange={handleSearchChange}
        setActiveTab={setActiveTab}
        onStatusChange={handleStatusChange}
        selectedStatuses={selectedStatuses}
      />

      <section className="py-3">
        {isLoading ? (
          <VoucherTableSkeleton />
        ) : data && data.length > 0 ? (
          <VoucherTable vouchers={data} />
        ) : (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No vouchers found</h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? `No results for "${searchTerm}"`
                : "There are no available vouchers at the moment"}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
