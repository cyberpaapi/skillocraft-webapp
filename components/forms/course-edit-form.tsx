'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { courseFormSchema, CourseFormValues } from '@/schema/course.schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Category, SubCategory } from '@/types';

interface CourseEditFormProps {
  onSubmit: (data: CourseFormValues) => Promise<void>;
  isLoading?: boolean;
  initialData: {
    id: string;
    name: string;
    shortDescription: string;
    longDescription: string;
    price: number;
    language: string;
    status: 'ACTIVE' | 'INACTIVE';
    featured: boolean;
    categoryId: string;
    subCategoryId?: string;
    imageUrl?: string;
  };
  categories: Category[];
  subcategories: SubCategory[];
}

export function CourseEditForm({ 
  onSubmit, 
  isLoading = false, 
  initialData,
  categories = []
}: Omit<CourseEditFormProps, 'subcategories'>) {
  const [existingImage, setExistingImage] = useState<string | null>(initialData.imageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: initialData.name,
      shortDescription: initialData.shortDescription,
      longDescription: initialData.longDescription,
      price: initialData.price,
      language: initialData.language,
      status: initialData.status,
      featured: initialData.featured,
      categoryId: initialData.categoryId,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setExistingImage(imageUrl);
      // Clean up the object URL when component unmounts
      return () => URL.revokeObjectURL(imageUrl);
    }
  };

  const handleSubmit = async (data: CourseFormValues) => {
    const formData = new FormData();
    
    // Append all form data to FormData with proper type checking
    if (data.name) formData.append('name', data.name);
    if (data.shortDescription) formData.append('shortDescription', data.shortDescription);
    if (data.longDescription) formData.append('longDescription', data.longDescription);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.language) formData.append('language', data.language);
    if (data.status) formData.append('status', data.status);
    if (data.featured !== undefined) formData.append('featured', data.featured.toString());
    if (data.categoryId) formData.append('categoryId', data.categoryId);
    if (data.subCategoryId) formData.append('subCategoryId', data.subCategoryId);

    // Append the image file if it exists
    if (imageFile) {
      formData.append('image', imageFile);
    }

    await onSubmit(formData as unknown as CourseFormValues);
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
                <FormLabel>Course Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter course name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (INR)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter price" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    min={0}
                    step="0.01"
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
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
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

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-base">Featured Course</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    This course will appear on the featured section
                  </p>
                </div>
              </FormItem>
            )}
          />

          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a short description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="longDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the full course description"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <FormLabel>Course Image</FormLabel>
            <div className="mt-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {(existingImage || initialData.imageUrl) && (
                <div className="relative mt-4 w-full max-w-xs h-48">
                  <Image
                    src={existingImage || `${initialData.imageUrl}`}
                    alt="Course"
                    fill
                    className="object-cover rounded-md"
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
              'Update Course'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
