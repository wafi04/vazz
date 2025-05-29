"use client";
import React from "react";
import { HeaderOrderManual } from "./header-order-manual";
import { StatsCards } from "./statsCard";
import { useExpandedRows, useOrderData, useOrderFilters } from "./hooks";
import { ErrorState, LoadingState } from "./state";
import { OrdersTable } from "./table";
import { PembelianManualData } from "@/types/transaction";

export function PesananManual() {
  const { orders, isLoading, error } = useOrderData();
  const { selectedFilter, setSelectedFilter, filteredOrders } = useOrderFilters(
    orders as PembelianManualData[]
  );
  const { expandedRows, toggleRow } = useExpandedRows();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <main className="min-h-screen p-8 space-y-6 bg-background">
      <StatsCards
        categoryData={orders}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />
      <HeaderOrderManual />
      <OrdersTable
        orders={filteredOrders}
        expandedRows={expandedRows}
        onToggleRow={toggleRow}
      />
    </main>
  );
}
