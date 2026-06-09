'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { categoryFormSchema, CategoryFormValues } from '@/schema/categories.schema';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '../ui/label';

interface CategoryFormProps {
  onSubmit: (data: CategoryFormValues) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function CategoryForm({ onSubmit, isLoading, onCancel }: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      description: '',
      featured: false,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'icon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'image') {
        setImagePreview(reader.result as string);
      } else {
        setIconPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Update form value - validation is handled by zod
    form.setValue(type, file, { shouldValidate: true });
  };

  const triggerFileInput = (type: 'image' | 'icon') => {
    if (type === 'image') {
      imageInputRef.current?.click();
    } else {
      iconInputRef.current?.click();
    }
  };

  const removeFile = (e: React.MouseEvent, type: 'image' | 'icon') => {
    e.stopPropagation();
    if (type === 'image') {
      setImagePreview(null);
      form.setValue('image', undefined as unknown as File, { shouldValidate: true });
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    } else {
      setIconPreview(null);
      form.setValue('icon', undefined as unknown as File, { shouldValidate: true });
      if (iconInputRef.current) {
        iconInputRef.current.value = '';
      }
    }
  };

  async function handleSubmit(data: CategoryFormValues) {
    // Ensure required files are provided before submitting
    if (!data.image) {
      form.setError('image', { message: 'Please upload an image' });
      return;
    }
    if (!data.icon) {
      form.setError('icon', { message: 'Please upload an icon' });
      return;
    }
    await onSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Image</FormLabel>
                  <FormControl>
                    <div>
                      <div 
                        className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => triggerFileInput('image')}
                      >
                        <div className="space-y-1 text-center w-full">
                          {imagePreview ? (
                            <div className="relative w-full h-48 rounded-md overflow-hidden">
                              <div className="relative w-full h-full">
                                <Image
                                  src={imagePreview}
                                  alt="Category preview"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 rounded-full w-6 h-6 p-0"
                                onClick={(e) => removeFile(e, 'image')}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="mx-auto h-12 w-12 text-gray-400">
                                <ImageIcon className="h-full w-full" />
                              </div>
                              <div className="flex text-sm text-gray-600 justify-center">
                                <span className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                                  Upload an image
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, WEBP, SVG up to 5MB
                              </p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          ref={imageInputRef}
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => {
                            handleFileChange(e, 'image');
                            field.onChange(e.target.files?.[0]);
                          }}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Icon Upload */}
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Icon</FormLabel>
                  <FormControl>
                    <div>
                      <div 
                        className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => triggerFileInput('icon')}
                      >
                        <div className="space-y-1 text-center w-full">
                          {iconPreview ? (
                            <div className="relative w-full h-48 rounded-md overflow-hidden">
                              <div className="relative w-full h-full flex items-center justify-center">
                                <div className="relative w-16 h-16">
                                  <Image
                                    src={iconPreview}
                                    alt="Icon preview"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 rounded-full w-6 h-6 p-0"
                                onClick={(e) => removeFile(e, 'icon')}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="mx-auto h-12 w-12 text-gray-400">
                                <ImageIcon className="h-full w-full" />
                              </div>
                              <div className="flex text-sm text-gray-600 justify-center">
                                <span className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                                  Upload an icon
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                SVG, PNG up to 2MB
                              </p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          ref={iconInputRef}
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => {
                            handleFileChange(e, 'icon');
                            field.onChange(e.target.files?.[0]);
                          }}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category name" {...field} disabled={isLoading} />
                </FormControl>
                <FormDescription>
                  This is your category display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter category description"
                    className="min-h-[120px]"
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
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md p-4 border">
                <FormControl>
                  <Checkbox
                    checked={field.value}  // Use checked instead of value
                    onCheckedChange={field.onChange}  // Use onCheckedChange instead of onChange
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <Label htmlFor="featured" className="flex items-center gap-2 text-sm font-medium">
                    <span className="h-4 w-4 text-yellow-500">★</span>
                    Featured
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Featured categories will be shown on the homepage
                  </p>
                </div>
              </FormItem>
            )}
          />

        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Category
          </Button>
        </div>
      </form>
    </Form>
  );
}
