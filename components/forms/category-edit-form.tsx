'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { updateCategorySchema, UpdateCategoryValues } from '@/schema/category.schema';

interface CategoryEditFormProps {
  onSubmit: (data: UpdateCategoryValues) => Promise<void>;
  isLoading?: boolean;
  initialData: {
    id: string;
    name: string;
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
    imageUrl?: string;
    icon?: string;
  };
}

export function CategoryEditForm({ 
  onSubmit, 
  isLoading = false, 
  initialData 
}: CategoryEditFormProps) {
  const [existingImage, setExistingImage] = useState<string | null>(initialData.imageUrl || null);
  const [existingIcon, setExistingIcon] = useState<string | null>(initialData.icon || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);

  const form = useForm<UpdateCategoryValues>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: initialData.name,
      description: initialData.description,
      status: initialData.status,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setExistingImage(URL.createObjectURL(file));
    }
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      setExistingIcon(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (data: UpdateCategoryValues) => {
    const formData = {
      ...data,
      image: imageFile,
      icon: iconFile,
    };
    await onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter category description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormLabel>Category Image</FormLabel>
            <div className="flex flex-col gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {(existingImage || initialData.imageUrl) && (
                <div className="relative w-full max-w-xs h-48">
                  <Image
                    src={existingImage || `${initialData.imageUrl}`}
                    alt="Category"
                    fill
                    className="object-contain border rounded-md p-2"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <FormLabel>Category Icon</FormLabel>
            <div className="flex flex-col gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleIconChange}
                className="cursor-pointer"
              />
              {(existingIcon || initialData.icon) && (
                <div className="relative w-20 h-20">
                  <Image
                    src={existingIcon || `${initialData.icon}`}
                    alt="Category Icon"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Category'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
