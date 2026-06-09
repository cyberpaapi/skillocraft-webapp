'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { featuredBrandFormSchema, FeaturedBrandFormValues } from '@/schema/featured-brands.schema';

interface FeaturedBrandsFormProps {
  onSubmit: (data: FeaturedBrandFormValues) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
  initialData?: {
    title?: string;
    description?: string;
    logoUrl?: string;
  };
}

export function FeaturedBrandsForm({ 
  onSubmit, 
  isLoading = false, 
  onCancel,
  initialData 
}: FeaturedBrandsFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logoUrl || null);
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FeaturedBrandFormValues>({
    resolver: zodResolver(featuredBrandFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      form.setError('logo', { type: 'manual', message: 'Only image files are allowed.' });
      return;
    }

    // Validate file size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      form.setError('logo', { type: 'manual', message: 'Maximum file size is 5MB.' });
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(selectedFile);
    setLogoPreview(previewUrl);
    setFile(selectedFile);
    form.setValue('logo', selectedFile, { shouldValidate: true });
  };

  const removeLogo = () => {
    // Clean up the object URL to prevent memory leaks
    if (logoPreview && !initialData?.logoUrl) {
      URL.revokeObjectURL(logoPreview);
    }
    
    setLogoPreview(null);
    setFile(null);
    form.setValue('logo', undefined as unknown as File, { shouldValidate: true });
    
    // Increment the key to force re-render of the file input
    setFileInputKey(prev => prev + 1);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Title *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter brand title" 
                    {...field} 
                    disabled={isLoading} 
                  />
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
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter brand description"
                    className="min-h-[100px]"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="logo"
            render={() => (
              <FormItem>
                <FormLabel>Brand Logo *</FormLabel>
                <FormControl>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="relative h-32 w-32 overflow-hidden rounded-md border">
                      {logoPreview ? (
                        <div className="relative h-full w-full">
                          <Image
                            src={logoPreview}
                            alt="Brand logo preview"
                            fill
                            className="object-contain p-2"
                            sizes="(max-width: 128px) 100vw, 128px"
                          />
                          <button
                            type="button"
                            onClick={removeLogo}
                            className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
                            disabled={isLoading}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-sm">Upload logo</span>
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
                        {logoPreview ? 'Change Logo' : 'Upload Logo'}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Recommended size: 300x150px
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Max file size: 5MB
                      </p>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="relative w-full">
                          <Input
                            key={`file-input-${fileInputKey}`}
                            id="logo"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                          />
                          {file && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              Selected: {file.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
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
            Create Brand
          </Button>
        </div>
      </form>
    </Form>
  );
}
