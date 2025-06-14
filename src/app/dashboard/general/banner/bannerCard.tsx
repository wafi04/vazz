import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/utils/formatPrice";
import { Calendar, Eye, ImageIcon } from "lucide-react";
import Image from "next/image";
import { DialogView } from "./dialogView";
import { DialogUpdate } from "./dialog/dialogUpdate";
import { DialogDelete } from "./dialog/dialogDelete";

export interface BannerCardProps {
  path: string;
  deskripsi: string;
  id: number;
  createdAt: string | null;
  tipe: string;
}
export function BannerCard({ banner }: { banner: BannerCardProps }) {
  return (
    <Card
      key={banner.id}
      className="overflow-hidden hover:shadow-lg transition-shadow"
    >
      <CardHeader className="p-0">
        <div className="relative aspect-video">
          <Image
            src={banner.path}
            alt={banner.deskripsi}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary">
              <ImageIcon className="h-3 w-3 mr-1" />
              {banner.tipe}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground capitalize">
            {banner.deskripsi}
          </p>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            Created: {formatDate(banner.createdAt as string)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DialogView banner={banner} />
          <DialogUpdate banner={banner} />
          <DialogDelete banner={banner} />
        </div>
      </CardContent>
    </Card>
  );
}
