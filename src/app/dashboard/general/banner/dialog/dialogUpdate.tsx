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
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Edit, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/utils/trpc";
import { uploadToCloudinary } from "@/lib/cloudinary";

export function DialogUpdate({ banner }: { banner: BannerCardProps }) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const utils = trpc.useUtils();
  const {
    mutate: updateBanner,
    isLoading,
    error,
  } = trpc.banner.update.useMutation({
    onSuccess: () => {
      toast.success("Banner updated successfully!");
      utils.banner.getAll.invalidate();
    },
  });
  const [imagePreview, setImagePreview] = useState<string>(banner.path);
  const [formData, setFormData] = useState({
    tipe: banner.tipe,
    deskripsi: banner.deskripsi,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalPath = banner.path;

      if (imageFile) {
        toast.loading("Uploading image...");
        const cloudinaryUrl = await uploadToCloudinary(imageFile);

        if (!cloudinaryUrl) {
          throw new Error("Failed to upload image");
        }

        toast.dismiss();
        finalPath = cloudinaryUrl;
      }

      // Update banner dengan data baru
      updateBanner(
        {
          id: banner.id, // Pastikan banner memiliki property id
          tipe: formData.tipe.trim(),
          deskripsi: formData.deskripsi.trim(),
          path: finalPath, // Gunakan path baru jika ada upload, atau path lama jika tidak ada
        },
        {
          onSuccess: () => {
            toast.success("Banner updated successfully!");
            setImageFile(null);
          },
          onError: (error) => {
            toast.error("Failed to update banner");
            console.error("Update error:", error);
          },
        }
      );
    } catch (error) {
      toast.error("Update failed");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Banner</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-4">
            <Label htmlFor="image">Banner Image</Label>
            <div className="relative">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25">
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(banner.path); // Reset ke gambar asli
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Click to upload image
                    </p>
                  </div>
                )}
              </div>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipe">Type</Label>
              <Input
                id="tipe"
                value={formData.tipe}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tipe: e.target.value }))
                }
                placeholder="Banner type"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi">Description</Label>
            <Textarea
              id="deskripsi"
              value={formData.deskripsi}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, deskripsi: e.target.value }))
              }
              placeholder="Banner description"
              rows={3}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={loading || isLoading}
              className="w-full md:w-auto"
            >
              {loading || isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                "Update Banner"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
