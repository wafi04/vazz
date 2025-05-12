import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/types/category";
import { getStatusBadge } from "@/utils/getStatusActive";
import { DialogCreateCategory } from "./dialog-category";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { DialogDeleteCategory } from "./dialog-delete";

interface TableCategoryProps {
  categories : Category[]
}

export function TableCategory({categories} : TableCategoryProps){
    return (
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Nama</TableHead>
            <TableHead className="w-[180px]">Sub Nama</TableHead>
            <TableHead className="w-[150px]">Brand</TableHead>
            <TableHead className="w-[100px]">Tipe</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[120px] text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">
                {category.nama}
              </TableCell>
              <TableCell>{category.subNama}</TableCell>
              <TableCell>{category.brand}</TableCell>
              <TableCell>
                <Badge variant="outline">{category.tipe}</Badge>
              </TableCell>
              <TableCell>{getStatusBadge(category.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <DialogCreateCategory req={category}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </DialogCreateCategory>
                  <DialogDeleteCategory id={category.id}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </DialogDeleteCategory>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
}