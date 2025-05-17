import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DialogMethod } from "./dialog-methode";
import { useFilterMethods } from "@/hooks/useFilterMethods";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function HeaderMethode() {
  const { setPage, setPerPage, setIsActive, setIsAll, setSearch, setType } =
    useFilterMethods();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (value: string) => {
    if (value === "all") {
      setIsAll(true);
      setIsActive("active");
    } else if (value === "active") {
      setIsAll(false);
      setIsActive("active");
    } else {
      setIsAll(false);
      setIsActive("inactive");
    }
    setPage(1);
  };

  return (
    <header className="w-full space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Payment Methods</h1>
        <DialogMethod>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Method</span>
          </Button>
        </DialogMethod>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search payment methods..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-3 pr-10"
          />
        </div>

        <div className="flex gap-4">
          <Select onValueChange={handleFilterChange} defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setType(value)} defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="virtual-account">Virtual Account</SelectItem>
              <SelectItem value="e-walet">E-Wallet</SelectItem>
              <SelectItem value="convenience-store">CS Store</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => setPerPage(parseInt(value))}
            defaultValue="10"
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
