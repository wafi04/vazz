import { ButtonUploadImage } from "@/components/ui/button-upload-image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { FormValuesCategory } from "@/types/schema/categories";
import { useState } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface ImageFormCategoryProps {
    register: UseFormRegister<FormValuesCategory>
    errors: FieldErrors<FormValuesCategory>
    watch: UseFormWatch<FormValuesCategory>
    setValue: UseFormSetValue<FormValuesCategory>
}

export function ImageFormCategory({errors, register, setValue, watch}: ImageFormCategoryProps): JSX.Element {
    const [loadingState, setLoadingState] = useState({
        thumbnailLoading: false,
        bannerLoading: false,
    });
    
    const thumbnailUrl = watch('thumbnail');
    const bannerLayananUrl = watch('bannerLayanan');
  
    // Improved upload handler with proper loading states
    const handleImageUpload = async (file: File, type: 'thumbnail' | 'banner') => {
        if (!file) return;

        // Set appropriate loading state
        setLoadingState(prev => ({
            ...prev,
            thumbnailLoading: type === 'thumbnail',
            bannerLoading: type === 'banner'
        }));
  
        try {
            const imageUrl = await uploadToCloudinary(file);
            
            // Update form value based on type
            if (type === 'thumbnail') {
                setValue('thumbnail', imageUrl);
                toast.success("Thumbnail berhasil diunggah");
            } else {
                setValue('bannerLayanan', imageUrl);
                toast.success("Banner berhasil diunggah");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Gagal mengunggah ${type === 'thumbnail' ? 'thumbnail' : 'banner'}: ${errorMessage}`);
        } finally {
            // Reset loading state
            setLoadingState(prev => ({
                ...prev,
                thumbnailLoading: type === 'thumbnail' ? false : prev.thumbnailLoading,
                bannerLoading: type === 'banner' ? false : prev.bannerLoading
            }));
        }
    };

    return (
        <TabsContent value="display" className="space-y-6 mt-4">
            {/* Thumbnail Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label htmlFor="thumbnail" className="text-base font-medium">Thumbnail</Label>
                    {loadingState.thumbnailLoading && (
                        <div className="flex items-center text-primary text-sm">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Mengunggah...
                        </div>
                    )}
                </div>
                
                <div className="mt-2">
                    <ButtonUploadImage
                        type="thumbnail"
                        imageUrl={thumbnailUrl}
                        className="w-64 h-64"
                        onUpload={(file) => handleImageUpload(file, 'thumbnail')}
                        disabled={loadingState.thumbnailLoading}
                    />
                </div>
                {errors.thumbnail && (
                    <p className="text-sm font-medium text-destructive">
                        {errors.thumbnail.message}
                    </p>
                )}
            </div>

            {/* Banner Section */}
            <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center justify-between">
                    <Label htmlFor="bannerLayanan" className="text-base font-medium">Banner Layanan</Label>
                    {loadingState.bannerLoading && (
                        <div className="flex items-center text-primary text-sm">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Mengunggah...
                        </div>
                    )}
                </div>
                
                <div className="mt-2">
                    <ButtonUploadImage
                        type="banner"
                        imageUrl={bannerLayananUrl}
                        className="w-full h-40"
                        onUpload={(file) => handleImageUpload(file, 'banner')}
                        disabled={loadingState.bannerLoading}
                    />
                </div>
                
                {errors.bannerLayanan && (
                    <p className="text-sm font-medium text-destructive">
                        {errors.bannerLayanan.message}
                    </p>
                )}
            </div>

            {/* Placeholders Section */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-2">
                    <Label htmlFor="placeholder1">Placeholder 1</Label>
                    <Input
                        id="placeholder1"
                        placeholder="Masukkan placeholder 1"
                        {...register('placeholder1')}
                    />
                    {errors.placeholder1 && (
                        <p className="text-sm font-medium text-destructive">
                            {errors.placeholder1.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="placeholder2">Placeholder 2</Label>
                    <Input
                        id="placeholder2"
                        placeholder="Masukkan placeholder 2"
                        {...register('placeholder2')}
                    />
                    {errors.placeholder2 && (
                        <p className="text-sm font-medium text-destructive">
                            {errors.placeholder2.message}
                        </p>
                    )}
                </div>
            </div>
        </TabsContent>
    );
}