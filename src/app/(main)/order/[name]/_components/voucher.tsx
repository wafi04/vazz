'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeaderNumber } from "@/components/ui/headernumber";
import { Input } from "@/components/ui/input";
import { useOrderStore } from "@/hooks/user-order";

export function KodeVoucherInput() {
  const { setVoucherCode } = useOrderStore();
  const [localVoucherCode, setLocalVoucherCode] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalVoucherCode(e.target.value);
  };

  const handleSubmit = () => {
    setVoucherCode(localVoucherCode); 
  };

  return (
    <div className="flex flex-col w-full rounded-lg overflow-hidden border-2 border-blue-800/50 bg-blue-900/20 space-y-4">
      <HeaderNumber number="5" title="Kode Voucher" />
      <div className="flex flex-row gap-3 px-6 pb-4">
        <Input
          type="text"
          value={localVoucherCode}
          onChange={handleChange}
          placeholder="Contoh: PROMO123"
          className="w-full rounded-md border border-blue-800/50 bg-transparent text-white placeholder-gray-400"
        />
        <Button
          onClick={handleSubmit}
          className="rounded-md text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4"
        >
          Gunakan
        </Button>
      </div>
    </div>
  );
}
