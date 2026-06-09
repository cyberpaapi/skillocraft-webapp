'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Loader2, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { featuredGalleryFormSchema, FeaturedGalleryFormValues } from '@/schema/featured-gallery.schema';

interface FeaturedGalleryFormProps {
  onSubmit: (data: FeaturedGalleryFormValues) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
  initialData?: {
    description?: string;
    imageUrl?: string;
  };
}

export function FeaturedGalleryForm({ 
  onSubmit, 
  isLoading = false, 
  onCancel,
  initialData 
}: FeaturedGalleryFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FeaturedGalleryFormValues>({
    resolver: zodResolver(featuredGalleryFormSchema),
    defaultValues: {
      description: initialData?.description || '',
      image: undefined,
    },
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(selectedFile);
    setImagePreview(previewUrl);
    form.setValue('image', selectedFile, { shouldValidate: true });
  };

  // Remove selected image
  const removeImage = () => {
    // Clean up the object URL to prevent memory leaks
    if (imagePreview && !initialData?.imageUrl) {
      URL.revokeObjectURL(imagePreview);
    }
    
    setImagePreview(null);
    form.setValue('image', undefined as unknown as File, { shouldValidate: true });
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Increment the key to force re-render of the file input
    setFileInputKey(prev => prev + 1);
  };

  // Handle form submission
  const handleFormSubmit = async (values: FeaturedGalleryFormValues) => {
    try {
      // The form values already contain the file if one was selected
      await onSubmit(values);
    } catch (error) {
      console.error('Error in form submission:', error);
      // Set a form error that can be displayed to the user
      form.setError('root', {
        type: 'manual',
        message: 'Failed to submit the form. Please try again.'
      });
      throw error; // Re-throw to let the form handle the error
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Gallery Image *</FormLabel>
                <FormControl>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="relative h-48 w-48 overflow-hidden rounded-md border">
                      {imagePreview ? (
                        <div className="relative h-full w-full">
                          <Image
                            src={imagePreview}
                            alt="Gallery preview"
                            fill
                            className="object-cover"
                            sizes="(max-width: 192px) 100vw, 192px"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
                            disabled={isLoading}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-sm">Upload an image</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="mb-2"
                      >
                        {imagePreview ? 'Change Image' : 'Upload Image'}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Recommended size: 800x800px
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Max file size: 5MB
                      </p>
                      <input
                        key={`file-input-${fileInputKey}`}
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a description for this gallery item"
                    className="min-h-[100px]"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Gallery Item
          </Button>
        </div>
      </form>
    </Form>
  );
}
