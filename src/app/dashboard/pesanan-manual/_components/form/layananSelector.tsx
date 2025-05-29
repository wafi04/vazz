import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ErrorState } from "../state";

export const LayananSelector = ({
  layananList,
  isLoading,
  error,
  selectedLayanan,
  onSelect,
  search,
  debouncedSearch,
  onClearSearch,
}: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <Label htmlFor="layanan">Daftar Layanan</Label>
      {layananList.length > 0 && (
        <Badge variant="outline">{layananList.length} layanan</Badge>
      )}
    </div>

    {isLoading ? (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="animate-spin h-4 w-4" />
        <span>Loading layanan...</span>
      </div>
    ) : layananList.length > 0 ? (
      <Select
        value={selectedLayanan?.id?.toString() || ""}
        onValueChange={(value) => {
          const selected = layananList.find(
            (l: any) => l.id.toString() === value
          );
          if (selected) onSelect(selected);
        }}
      >
        <SelectTrigger id="layanan" className="w-full">
          <SelectValue placeholder="Pilih Layanan" />
        </SelectTrigger>
        <SelectContent>
          {layananList.map((layanan: any) => (
            <SelectItem key={layanan.id} value={layanan.id.toString()}>
              <div className="flex justify-between items-center w-full gap-2">
                <span className="truncate">{layanan.layanan}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <div className="text-center py-8 text-muted-foreground border rounded-md text-sm">
        {search && debouncedSearch ? (
          <div className="space-y-2">
            <p>Tidak ditemukan layanan untuk "{debouncedSearch}"</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClearSearch}
            >
              Hapus pencarian
            </Button>
          </div>
        ) : (
          "Tidak ada layanan tersedia untuk kategori ini."
        )}
      </div>
    )}

    {error && <ErrorState error={error} />}
  </div>
);
