"use client";

import React, { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Wallet, ListChecks, Search } from "lucide-react";
import { useCheckSaldoDIgiflazz } from "./useHooks";
import { AnimatePresence } from "framer-motion";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { SaldoContent } from "./saldoContent";
import { ContentDisplay } from "./contentDisaplay";
import { OptionCard } from "./optionCard";

// Type definitions
export interface ContentData {
  message: string;
  data: number | null;
  code: number;
}

export interface DigiflazzOption {
  name: string;
  icon: React.ElementType;
  description: string;
  action: () => Promise<void>;
  color: string;
}

export const DefaultContent: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center py-8">
    <p className="text-lg">{message}</p>
  </div>
);

// Main component
export function DigiflazzPage(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [contentData, setContentData] = useState<ContentData | null>(null);

  const options: DigiflazzOption[] = [
    {
      name: "Cek Saldo",
      icon: Wallet,
      description: "Periksa saldo akun Digiflazz Anda",
      color: "bg-blue-500",
      action: async () => {
        try {
          const data = await useCheckSaldoDIgiflazz();
          setContentData({
            message: data.message,
            code: data.code,
            data: data.data.deposit,
          });
        } catch (error) {
          toast.error("Gagal mengambil saldo");
        }
      },
    },
    {
      name: "Cek Transaksi",
      icon: ListChecks,
      description: "Lihat riwayat transaksi terakhir",
      color: "bg-green-500",
      action: async () => {
        try {
          setContentData({
            message: "Fitur dalam pengembangan",
            code: 200,
            data: null,
          });
        } catch (error) {
          toast.error("Gagal mengambil riwayat transaksi");
        }
      },
    },
    {
      name: "Cek Status",
      icon: Search,
      description: "Periksa status transaksi spesifik",
      color: "bg-purple-500",
      action: async () => {
        try {
          setContentData({
            message: "Fitur dalam pengembangan",
            code: 200,
            data: null,
          });
        } catch (error) {
          toast.error("Gagal memeriksa status");
        }
      },
    },
  ];

  const handleOptionClick = async (
    option: DigiflazzOption,
    index: number
  ): Promise<void> => {
    setIsLoading(true);
    setSelectedOption(index);
    try {
      await option.action();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeContent = (): void => {
    setSelectedOption(null);
    setContentData(null);
  };

  const renderContent = (): ReactNode => {
    if (selectedOption === null) return null;

    const option = options[selectedOption];

    switch (option.name) {
      case "Cek Saldo":
        return <SaldoContent contentData={contentData} />;
      case "Cek Transaksi":
      case "Cek Status":
      default:
        return (
          <DefaultContent
            message={contentData?.message || "Fitur dalam pengembangan"}
          />
        );
    }
  };

  return (
    <section className="w-full mt-4 p-6 rounded-xl">
      <h1 className="text-3xl font-bold mb-8">Menu Digiflazz</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((item, index) => (
          <OptionCard
            key={index}
            option={item}
            index={index}
            isSelected={selectedOption === index}
            onClick={() => handleOptionClick(item, index)}
          />
        ))}
      </div>

      {/* Content display area with animation */}
      <AnimatePresence>
        {selectedOption !== null && (
          <ContentDisplay
            selectedOption={options[selectedOption]}
            contentData={contentData}
            onClose={closeContent}
            renderContent={renderContent}
          />
        )}
      </AnimatePresence>

      {/* Loading overlay */}
      <AnimatePresence>{isLoading && <LoadingOverlay />}</AnimatePresence>
    </section>
  );
}
