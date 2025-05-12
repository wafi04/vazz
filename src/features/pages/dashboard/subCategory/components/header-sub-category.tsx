"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, X, ChevronDown } from "lucide-react";
import type { JSX } from "react";
import DialogSubCategory from "./dialog-sub-category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Simplified HeaderSubCategory with added status filter
export function HeaderSubCategory({
  onSearchChange,
  searchValue = "",
  onStatusChange,
  statusValue = "",
}: {
  onSearchChange: (term: string) => void;
  searchValue?: string;
  onStatusChange: (status: string) => void;
  statusValue?: string;
}): JSX.Element {
  // Handle search input change directly
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    onSearchChange("");
  };

  return (
    <section className="space-y-4 w-full">
      {/* Single row layout for all elements on md screens and up */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4">
        {/* Kiri: Title */}
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">Kategori</h1>
        </div>

        {/* Kanan: Semua input dan tombol */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-40 flex items-center">
            <Input
              placeholder="Cari kategori..."
              value={searchValue}
              onChange={handleSearchChange}
              className="pr-8 w-full"
            />
            {searchValue && (
              <button
                onClick={handleClearSearch}
                className="absolute right-10 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1"
              type="button"
              tabIndex={-1}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-auto sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center"
                >
                  {statusValue === "active"
                    ? "Aktif"
                    : statusValue === "inactive"
                    ? "Tidak Aktif"
                    : statusValue === "all"
                    ? "Semua Status"
                    : "Status"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onStatusChange("all")}>
                  Semua Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange("active")}>
                  Aktif
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange("inactive")}>
                  Tidak Aktif
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Select for larger screen */}
          <div className="hidden sm:block w-full sm:w-48">
            <Select value={statusValue} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"all"}>Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filter button */}
          {statusValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStatusChange("")}
              className="h-8 px-2 text-xs"
            >
              Reset Filter <X className="ml-1 h-3 w-3" />
            </Button>
          )}

          {/* Tambah Button */}
          <DialogSubCategory>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">Tambah</span>
            </Button>
          </DialogSubCategory>
        </div>
      </div>
    </section>
  );
}
