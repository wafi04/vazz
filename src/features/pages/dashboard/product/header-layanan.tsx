"use client";

import type React from "react";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Layanan } from "@/types/layanans";
import type { Category } from "@/types/category";

interface HeaderLayananProps {
  data: Layanan[];
  category: Category[];
  onSearchChange: (term: string) => void;
  onCategoryChange?: (id: string | undefined) => void;
  onSubCategoryChange?: (id: number | undefined) => void;
  onProviderChange?: (id: string | undefined) => void;
  onStatusChange?: (status: string | undefined) => void;
  onFlashSaleChange?: (isFlashSale: boolean | undefined) => void;
  onPriceRangeChange?: (
    min: number | undefined,
    max: number | undefined
  ) => void;
}

export function HeaderLayanan({
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onFlashSaleChange,
  category,
}: HeaderLayananProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchTerm);
  };

  const handleStatusChange = (value: string) => {
    if (value === "all") {
      onStatusChange?.(undefined);
    } else {
      onStatusChange?.(value);
    }
  };

  const handleFlashSaleChange = (value: string) => {
    if (value === "all") {
      onFlashSaleChange?.(undefined);
    } else {
      const isFlashSale = value === "yes";
      onFlashSaleChange?.(isFlashSale);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      onCategoryChange?.(undefined);
    } else {
      onCategoryChange?.(value);
    }
  };

  return (
    <div className="w-full mb-6">
      {/* Header Title */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Layanan</h1>
      </div>

      {/* Filters Container */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
        {/* Select Filters Group - Wrap these together */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>

          {/* Flash Sale Filter */}
          <Select onValueChange={handleFlashSaleChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Flash Sale" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="yes">Ya</SelectItem>
              <SelectItem value="no">Tidak</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {category &&
                category.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.nama}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full sm:w-auto sm:flex-grow sm:max-w-md ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari layanan..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearchSubmit(e);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
