import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterIcon, PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { DialogCreateCategory } from "./dialog-category";
import {
  DataTypeCategory,
  DataActiveCategory,
} from "@/data/data-category-form";

interface HeaderCategoryProps {
  filter: {
    search: string;
    type: string | undefined;
    status: string | undefined;
  };
  setFilter: (filter: HeaderCategoryProps["filter"]) => void;
}

export function HeaderCategory({ filter, setFilter }: HeaderCategoryProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, search: e.target.value });
  };

  const handleClear = () => {
    setFilter({ ...filter, search: "" });
  };

  const handleTypeSelect = (type: string | undefined) => {
    setFilter({ ...filter, type });
  };

  const handleStatusSelect = (status: string | undefined) => {
    setFilter({ ...filter, status });
  };

  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 mb-6">
      <h1 className="text-2xl font-bold text-card-foreground">Kategori</h1>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
        {/* Search input */}
        <div className="relative w-full md:w-auto flex items-center">
          <Input
            placeholder="Cari kategori..."
            value={filter.search}
            onChange={handleInputChange}
            className="pr-8 w-full"
          />
          {filter.search && (
            <button
              onClick={handleClear}
              className="absolute right-10 text-gray-500 hover:text-gray-700"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
          <Button variant="ghost" size="icon" className="absolute right-1">
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Type filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={filter.type ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
            >
              <FilterIcon className="h-4 w-4" />
              <span>{filter.type || "Tipe"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleTypeSelect(undefined)}>
              Semua Tipe
            </DropdownMenuItem>
            {DataTypeCategory.map((item) => (
              <DropdownMenuItem
                key={item.value}
                onClick={() => handleTypeSelect(item.value)}
              >
                {item.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={filter.status ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
            >
              <FilterIcon className="h-4 w-4" />
              <span>{filter.status || "Status"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleStatusSelect(undefined)}>
              Semua Status
            </DropdownMenuItem>
            {DataActiveCategory.map((item) => (
              <DropdownMenuItem
                key={item.value}
                onClick={() => handleStatusSelect(item.value)}
              >
                {item.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogCreateCategory>
          <Button className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            <span className="hidden md:inline">Tambah Kategori</span>
          </Button>
        </DialogCreateCategory>
      </div>
    </section>
  );
}
