import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CategorySelector = ({
  categories,
  value,
  onChange,
}: {
  categories: any[];
  value: number | undefined;
  onChange: (value: string) => void;
}) => (
  <div className="space-y-2">
    <Label htmlFor="category">Kategori</Label>
    <Select value={value?.toString() || ""} onValueChange={onChange}>
      <SelectTrigger id="category" className="w-full">
        <SelectValue placeholder="Pilih Kategori" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id.toString()}>
            {category.nama}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
