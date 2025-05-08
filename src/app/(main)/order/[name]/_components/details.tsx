'use client';

import { trpc } from '@/utils/trpc';
import Image from 'next/image';
import { SidebarOrder } from '@/app/(main)/order/[name]/_components/sidebar';
import { ProductPage } from './products';
import { HeaderFilterProduct } from './header';
import { useFilterProduct } from '@/hooks/use-filterProduct';
import { useEffect, useState } from 'react';
import { HeroSection } from './herosection';
import { PlaceholderContent } from '@/app/(main)/order/[name]/_components/placeholder';
import { useOrderStore } from '@/hooks/user-order';
import WhatsAppInput from './whatsappInput';
import { MethodSection } from './methodSection';
import { HeaderNumber } from '@/components/ui/headernumber';
import { KodeVoucherInput } from './voucher';

export default function DetailsCategories({ name }: { name: string }) {
  const { filter } = useFilterProduct();
  const { data, isLoading } = trpc.categories.getByCode.useQuery({ code: name });
  const {setUserId,setZone,userId,zone}  = useOrderStore()
  const category = data?.data;

  const [filteredProducts, setFilteredProducts] = useState(category?.layanan ?? []);

  useEffect(() => {
    if (category?.layanan) {
      let updatedLayanan = [...category.layanan];

      if (filter) {
        const formattedProviderId = formatProviderId(filter);

        updatedLayanan = updatedLayanan.filter((layanan) => {
          const layananProviderId = layanan.providerId.toUpperCase();
          const match = layananProviderId.match(/^([A-Z]+)/);
          const matchedProvider = match ? match[1] : layananProviderId;
          return matchedProvider === formattedProviderId;
        });
      }

      setFilteredProducts(updatedLayanan);
    }
  }, [filter, category?.layanan]); 

  if (isLoading) {
    return null;
  }

  if (!category) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center text-white">
        <p>Category belum tersedia</p>
      </div>
    );
  }

  return (
    <main className="">
      {/* Hero Section */}
      <HeroSection category={category} />
      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 container mx-auto max-w-7xl">
        <div className="hidden lg:block lg:sticky lg:top-6 lg:self-start">
          <SidebarOrder category={category} />
        </div>
        
        {/* Input Section */}
        <div className="lg:col-span-2 px-2 space-y-6">
          <div className="flex flex-col w-full rounded-lg overflow-hidden border-2">
              <HeaderNumber number={"1"} title={"Masukkan Detail Akun"} />
              <PlaceholderContent category={category} onChangeServerId={setZone} serverId={zone} userId={userId} onChangeUserId={setUserId} />
          </div>
          <div className="flex flex-col w-full rounded-lg overflow-hidden border-2">
              <HeaderNumber number={"2"} title={"Pilih Product"} />
              <HeaderFilterProduct subCategories={category.subCategories} /> 
              <ProductPage products={filteredProducts} />
          </div>
          <MethodSection />
          <WhatsAppInput />
          <KodeVoucherInput />
        </div>
      </section>
    </main>
  );
}

// Helper buat format ProviderID
function formatProviderId(providerId: string) {
  return providerId.toUpperCase().replace(/\s+/g, ''); // contoh sederhana
}
