"use client";
import { trpc } from "@/utils/trpc";
import { SidebarOrder } from "@/app/(main)/order/[name]/_components/sidebar";
import { ProductPage } from "./products";
import { HeaderFilterProduct } from "./header";
import { useFilterProduct } from "@/hooks/use-filterProduct";
import { HeroSection } from "./herosection";
import { PlaceholderContent } from "@/app/(main)/order/[name]/_components/placeholder";
import { useOrderStore } from "@/hooks/use-order";
import WhatsAppInput from "./whatsappInput";
import { MethodSection } from "./methodSection";
import { HeaderNumber } from "@/components/ui/headernumber";
import { KodeVoucherInput } from "./voucher";
import { CartDetails } from "./cartDetails";
import { CardHistory } from "@/app/(main)/_components/history";
import { EmptyState } from "@/app/dashboard/pesanan-manual/_components/state";
import { useMemo, useRef, createContext, useContext } from "react";
import { Category } from "@/types/category";

// Create context for scroll function
const ScrollContext = createContext<{
  scrollToMethod: () => void;
} | null>(null);

export const useScrollToMethod = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollToMethod must be used within ScrollContext");
  }
  return context;
};

export default function DetailsCategories({ name }: { name: string }) {
  const { filter } = useFilterProduct();
  const methodSectionRef = useRef<HTMLDivElement>(null);

  // Scroll function
  const scrollToMethod = () => {
    if (methodSectionRef.current) {
      methodSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Fetch semua data tanpa filter subCategory di server
  const { data, isLoading } = trpc.categories.getByCode.useQuery(
    {
      code: name,
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const { setUserId, setZone, userId, zone } = useOrderStore();
  const category = data?.data;

  // Client-side filtering untuk products
  const filteredProducts = useMemo(() => {
    if (!category?.layanan) return [];

    if (!filter) return category.layanan;

    return category.layanan.filter(
      (product) => product.subCategoryId === filter
    );
  }, [category?.layanan, filter]);

  if (isLoading) {
    return null;
  }

  if (!category) {
    return <EmptyState />;
  }

  return (
    <ScrollContext.Provider value={{ scrollToMethod }}>
      <main className="">
        {/* Hero Section */}
        <HeroSection category={category as Category} />

        {/* Main Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 container mx-auto max-w-7xl">
          <div className="hidden lg:block lg:sticky lg:top-6 lg:self-start">
            <SidebarOrder category={category as Category} />
            <CardHistory />
          </div>

          {/* Input Section */}
          <div className="lg:col-span-2 px-2 space-y-6">
            <div className="flex flex-col w-full rounded-lg overflow-hidden border-2">
              <HeaderNumber number={"1"} title={"Masukkan Detail Akun"} />
              <PlaceholderContent
                category={category as Category}
                onChangeServerId={setZone}
                serverId={zone}
                userId={userId}
                onChangeUserId={setUserId}
              />
            </div>

            <div className="flex flex-col w-full rounded-lg overflow-hidden border-2">
              <HeaderNumber number={"2"} title={"Pilih Product"} />
              <HeaderFilterProduct subCategories={category.subCategories} />
              {/* Pass filtered products instead of all products */}
              <ProductPage products={filteredProducts} />
            </div>

            {/* Add ref to MethodSection */}
            <div ref={methodSectionRef}>
              <MethodSection />
            </div>
            <WhatsAppInput />
            <KodeVoucherInput />
            <CartDetails />
          </div>
        </section>
      </main>
    </ScrollContext.Provider>
  );
}
