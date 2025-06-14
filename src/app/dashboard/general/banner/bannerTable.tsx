import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BannerCardProps } from "./bannerCard";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatPrice";
import { DialogView } from "./dialogView";
import { DialogUpdate } from "./dialog/dialogUpdate";
import { DialogDelete } from "./dialog/dialogDelete";

export function BannerTable({ banners }: { banners: BannerCardProps[] }) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Preview</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>
                <div className="relative w-16 h-10 rounded overflow-hidden">
                  <Image
                    src={banner.path || "/placeholder.svg"}
                    alt={banner.deskripsi}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">#{banner.id}</TableCell>
              <TableCell>
                <Badge variant="outline">{banner.tipe}</Badge>
              </TableCell>
              <TableCell className="capitalize">{banner.deskripsi}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(banner.createdAt as string)}
              </TableCell>

              <TableCell className="flex items-center gap-2">
                <DialogUpdate banner={banner} />
                <DialogView banner={banner} />
                <DialogDelete banner={banner} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
