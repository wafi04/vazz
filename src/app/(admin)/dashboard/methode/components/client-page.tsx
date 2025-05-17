"use client";
import { trpc } from "@/utils/trpc";
import { HeaderMethode } from "./header-methode";
import TableMethode from "./table-methode";
import { PaymentMethod } from "@/types/payment";
import { useFilterMethods } from "@/hooks/useFilterMethods";
import { useDebouncedValue } from "@/hooks/useDebounced";

export default function ClientPage() {
  const { isAll, isActive, search, type, perPage, page } = useFilterMethods();

  const debounced = useDebouncedValue(search);
  const { data: methodData } = trpc.method.getAll.useQuery({
    isActive,
    isAll,
    limit: perPage,
    page,
    search: debounced,
    type,
  });

  return (
    <main className="min-h-screen p-8  w-full">
      <HeaderMethode />
      <TableMethode data={methodData?.data as PaymentMethod[]} />
    </main>
  );
}
