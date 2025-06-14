import { useState } from "react";
import { BannerCardProps } from "../bannerCard";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";

export function DialogDelete({ banner }: { banner: BannerCardProps }) {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();
  const { mutate, isLoading } = trpc.banner.delete.useMutation();

  const handleDelete = async () => {
    try {
      mutate(
        {
          id: banner.id,
        },
        {
          onSuccess: () => {
            toast.success("Banner deleted successfully");
            utils.banner.getAll.invalidate();
            setOpen(false);
          },
          onError: (error) => {
            toast.error("Failed to delete banner");
          },
        }
      );
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Delete Banner
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                This action cannot be undone
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Banner Preview */}
          <div className="space-y-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted/50">
              <Image
                src={banner.path}
                alt={banner.deskripsi}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>

            {/* Banner Details */}
            <div className="rounded-lg bg-muted/30 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Type:
                </span>
                <span className="text-sm font-semibold">{banner.tipe}</span>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Description:
                </span>
                <p className="text-sm leading-relaxed">{banner.deskripsi}</p>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">
                  Are you sure you want to delete this banner?
                </p>
                <p className="text-sm text-destructive/80">
                  This will permanently remove the banner from your system. This
                  action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 pt-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1 sm:flex-none"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Banner
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
