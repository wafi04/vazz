import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/lib/cloudinary";

export function DialogCreate() {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [open, setOpen] = useState(false);

  const utils = trpc.useUtils();
  const { mutate: createBanner, isLoading: isCreating } =
    trpc.banner.create.useMutation({
      onSuccess: () => {
        toast.success("Banner created successfully!");
        utils.banner.getAll.invalidate();
        resetForm();
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create banner");
      },
    });

  const [formData, setFormData] = useState({
    tipe: "",
    deskripsi: "",
    path: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({ tipe: "", deskripsi: "", path: "" });
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    if (!formData.tipe.trim() || !formData.deskripsi.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Upload image to Cloudinary first
      toast.loading("Uploading image...");
      const cloudinaryUrl = await uploadToCloudinary(imageFile);

      if (!cloudinaryUrl) {
        throw new Error("Failed to upload image");
      }

      toast.dismiss();

      // Create banner with Cloudinary URL
      createBanner({
        tipe: formData.tipe.trim(),
        deskripsi: formData.deskripsi.trim(),
        path: cloudinaryUrl,
      });
    } catch (error) {
      toast.error("Upload failed");
      toast.dismiss();

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to upload image. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, path: "" }));
  };

  const isSubmitDisabled =
    loading ||
    isCreating ||
    !imageFile ||
    !formData.tipe.trim() ||
    !formData.deskripsi.trim();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Banner
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Banner</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-4">
            <Label htmlFor="image">Banner Image *</Label>
            <div className="relative">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
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
                      className="absolute top-2 right-2 opacity-90 hover:opacity-100"
                      onClick={removeImage}
                      disabled={loading || isCreating}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6">
                    <Upload className="h-8 w-8 text-muted-foreground mb-4" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mb-2"
                      onClick={() => document.getElementById("image")?.click()}
                      disabled={loading || isCreating}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Image
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      PNG, JPG, GIF up to 10MB
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
                disabled={loading || isCreating}
                required
              />
            </div>
            {imageFile && (
              <p className="text-xs text-muted-foreground">
                Selected: {imageFile.name} (
                {(imageFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipe">Type *</Label>
              <Input
                id="tipe"
                value={formData.tipe}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tipe: e.target.value }))
                }
                placeholder="e.g., Hero Banner, Promotional"
                disabled={loading || isCreating}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi">Description *</Label>
            <Textarea
              id="deskripsi"
              value={formData.deskripsi}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, deskripsi: e.target.value }))
              }
              placeholder="Describe the banner content and purpose"
              rows={3}
              disabled={loading || isCreating}
              required
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              disabled={loading || isCreating}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full sm:w-auto"
            >
              {loading || isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {loading ? "Uploading..." : "Creating..."}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Banner
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
