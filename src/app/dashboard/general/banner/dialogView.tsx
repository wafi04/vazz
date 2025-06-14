"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import type { BannerCardProps } from "./bannerCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Eye,
  Calendar,
  FileImage,
  ExternalLink,
  Edit,
  Trash2,
  Plus,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { formatDate } from "@/utils/formatPrice";
import { toast } from "sonner";

export function DialogView({ banner }: { banner: BannerCardProps }) {
  const [imageLoading, setImageLoading] = useState(true);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="">
            <Badge variant="secondary" className="ml-auto">
              {banner.tipe}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Preview */}
          <div className="relative">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg ">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
              <Image
                src={banner.path}
                alt={banner.deskripsi}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            </div>
          </div>

          <Separator />

          {/* Banner Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Type
                  </span>
                  <Badge variant="outline">{banner.tipe}</Badge>
                </div>

                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Description
                  </span>
                  <span className="text-sm text-right capitalize max-w-[200px]">
                    {banner.deskripsi}
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Timeline</h3>
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created
                </span>
                <span className="text-sm text-right">
                  {formatDate(banner.createdAt as string)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
