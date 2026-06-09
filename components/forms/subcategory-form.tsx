'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { subcategoryFormSchema, SubcategoryFormValues } from '@/schema/subcategories.schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SubcategoryFormProps {
  onSubmit: (data: SubcategoryFormValues) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
  categories: Array<{ id: string; name: string }>;
  defaultCategoryId?: string;
}

export function SubcategoryForm({ 
  onSubmit, 
  isLoading = false, 
  onCancel, 
  categories, 
  defaultCategoryId = '' 
}: SubcategoryFormProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<SubcategoryFormValues>({
    resolver: zodResolver(subcategoryFormSchema),
    defaultValues: {
      name: '',
      description: '',
      categoryId: defaultCategoryId || '',
      featured: false,
      image: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Update form value - validation is handled by zod
    form.setValue('image', file, { shouldValidate: true });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    form.setValue('image', undefined, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Subcategory Image</FormLabel>
                <FormControl>
                  <div>
                    <div 
                      className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={triggerFileInput}
                    >
                      <div className="space-y-1 text-center">
                        {preview ? (
                          <div className="relative w-full h-48 rounded-md overflow-hidden">
                            <div className="relative w-full h-full">
                              <Image
                                src={preview}
                                alt="Subcategory preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 rounded-full w-6 h-6 p-0"
                              onClick={removeImage}
                            >
                              ×
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="mx-auto h-12 w-12 text-gray-400">
                              <ImageIcon className="h-full w-full" />
                            </div>
                            <div className="flex text-sm text-gray-600">
                              <span className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                                Upload a file
                              </span>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, WEBP, SVG up to 5MB
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="sr-only"
                        accept="image/*"
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter subcategory name" {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter subcategory description"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <Label htmlFor="featured" className="flex items-center gap-2 text-sm font-medium">
                    <span className="h-4 w-4 text-yellow-500">★</span>
                    Featured
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Featured subcategories will be shown on the homepage
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
            Create Subcategory
          </Button>
        </div>
      </form>
    </Form>
  );
}
