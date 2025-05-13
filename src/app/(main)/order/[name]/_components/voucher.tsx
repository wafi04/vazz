"use client";
import { useState } from "react";
import { HeaderNumber } from "@/components/ui/headernumber";
import { Input } from "@/components/ui/input";
import { useOrderStore } from "@/hooks/use-order";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Instagram } from "lucide-react";

export function KodeVoucherInput() {
  const { voucherCode, setVoucherCode } = useOrderStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(e.target.value);
  };

  return (
    <div className="flex flex-col w-full rounded-lg overflow-hidden border-2 gap-3 pb-4 border-blue-800/50 bg-blue-900/20">
      <HeaderNumber number="5" title="Kode Voucher" />

      <div className="px-6 space-y-2">
        <Input
          type="text"
          value={voucherCode}
          onChange={handleChange}
          placeholder="Contoh: PROMO123"
          className="w-full rounded-md border border-blue-800/50 bg-transparent text-white placeholder-gray-400"
        />
      </div>

      <div className="px-6 text-xs text-gray-300 flex items-center flex-wrap">
        Promo spesial dari
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="https://www.instagram.com/vazzuniverse.id"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 text-white font-medium hover:text-blue-400 transition-colors duration-200 flex items-center"
              >
                <Instagram className="h-4 w-4 mr-1" />
                @vazzuniverse.id
              </Link>
            </TooltipTrigger>
            <TooltipContent className="bg-blue-950 border border-blue-800 text-white p-3 w-full">
              <div className="flex flex-col items-center space-y-2">
                <Instagram className="h-6 w-6 text-pink-500" />
                <p className="font-bold">@vazzuniverse.id</p>
                <p className="text-xs text-center">
                  Kunjungi profil untuk melihat promo spesial dan dapatkan kode
                  voucher eksklusif
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        - Dapatkan diskon eksklusif sekarang!
      </div>
    </div>
  );
}
