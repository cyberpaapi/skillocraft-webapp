"use client";

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bannerFormSchema, type BannerFormValues } from '@/schema/banner.schema';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image as ImageIcon, Loader2, X } from 'lucide-react';
import Image from 'next/image';

interface BannerFormValuesWithOptionalImage extends Omit<BannerFormValues, 'image'> {
  image?: File;
}

interface BannerFormProps {
  onSubmit: (values: BannerFormValuesWithOptionalImage) => Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: Partial<BannerFormValues> & { imageUrl?: string };
}

export function BannerForm({ onSubmit, isSubmitting = false, defaultValues }: BannerFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BannerFormValuesWithOptionalImage>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      name: '',
      description: '',
      bannerLocation: 'HOME',
      ...defaultValues,
    },
  });

  const bannerLocations = [
    'HOME',
    'COURSE',
    'SUCCESS_STORY',
    'REFER',
    'LIVE',
    'MARKET',
    'BLOG',
    'BLOG_DETAILS',
  ] as const;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear any previous errors
    form.clearErrors('image');

    // Validate file type
    if (!file.type.startsWith('image/')) {
      form.setError('image', { type: 'manual', message: 'Only image files are allowed.' });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      form.setError('image', { type: 'manual', message: 'Maximum file size is 5MB.' });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      // Set form value after the preview is set
      form.setValue('image', file, { shouldValidate: true });
    };
    reader.onerror = () => {
      form.setError('image', { type: 'manual', message: 'Error reading file.' });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue('image', {} as File, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Image upload */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Banner Image</FormLabel>
                  <FormControl>
                    <div>
                      <div 
                        className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={triggerFileInput}
                      >
                        <div className="flex items-center gap-4 w-full">
                          <div className="relative w-full h-48 overflow-hidden rounded-md border">
                            {imagePreview ? (
                              <>
                                <Image
                                  src={imagePreview}
                                  alt="Banner preview"
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = '/placeholder.svg';
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage();
                                  }}
                                  className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-white"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center bg-muted">
                                <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  PNG, JPG, GIF up to 5MB
                                </p>
                              </div>
                            )}
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                            value={undefined}
                          />
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right column - Form fields */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter banner name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={() => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter banner description"
                      className="min-h-[100px]"
                      {...form.register('description')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bannerLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bannerLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location.split('_').map(word => 
                            word.charAt(0) + word.slice(1).toLowerCase()
                          ).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
