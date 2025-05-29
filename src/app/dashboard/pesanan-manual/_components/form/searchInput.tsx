import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

export const SearchInput = ({
  value,
  onChange,
  onClear,
  debouncedValue,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  debouncedValue: string;
}) => (
  <div className="space-y-2">
    <Label htmlFor="search">Cari Layanan</Label>
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        id="search"
        value={value}
        onChange={onChange}
        placeholder="Cari nama layanan atau produk..."
        className="pl-10 pr-10"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
        >
          ×
        </Button>
      )}
    </div>
    {debouncedValue && (
      <p className="text-xs text-muted-foreground">
        Mencari: "{debouncedValue}"
      </p>
    )}
  </div>
);
