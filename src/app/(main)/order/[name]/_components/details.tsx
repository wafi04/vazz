'use client';
import { trpc } from '@/utils/trpc';
import { HelpCircle } from 'lucide-react';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import Image from 'next/image';
import Link from 'next/link';
import { SidebarOrder } from '@/app/(main)/order/[name]/_components/sidebar';
import { ProductPage } from './products';

export default function DetailsCategories({ name }: { name: string }) {
    const {data,isLoading } = trpc.categories.getByCode.useQuery({
     code : name
 })

  const category = data?.data
  
  if (isLoading) {
    return <LoadingOverlay />;
  }
  if (category === undefined || category === null) {
    return (
      <div className="min-h-screen w-full justify-center items-center text-white">
        <p>category belum tersedia</p>
      </div>
    );
  }

  
  return (
    <>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Hero Section */}
        <section className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden mb-6">
          <Image
            src={category.bannerLayanan}
            alt={category.nama}
            fill
            className="object-cover"
          />
        </section>

        {/* Main Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3  gap-6">
          <SidebarOrder category={category} />
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Input */}
            <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-800/50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Detail Akun
                </h2>
                <Link 
                  href="/cara-top-up" 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-500/30 transition-all duration-300 text-blue-300 hover:text-blue-200 border border-blue-500/30"
                >
                  <span className="text-sm font-medium">Cara Top-up</span>
                  <HelpCircle size={16} className="text-blue-400" />
                </Link>
              </div>
            </div>
            <ProductPage products={category.layanan} />
          </div>
        </section>
      </main>
    </>
  );
}
