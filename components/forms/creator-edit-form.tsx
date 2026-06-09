'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

// Form validation is handled by zod schema

type CreatorFormValues = {
  name: string;
  designation: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  image?: File | string;
};

interface CreatorEditFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
  initialData: {
    id: string;
    name: string;
    designation: string;
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
    imageLink?: string;
  };
}

export function CreatorEditForm({ 
  onSubmit, 
  isLoading = false, 
  initialData,
}: CreatorEditFormProps) {
  const [existingImage, setExistingImage] = useState<string | null>(initialData.imageLink || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const form = useForm<CreatorFormValues>({
    defaultValues: {
      name: initialData.name,
      designation: initialData.designation,
      description: initialData.description,
      status: initialData.status,
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

  const handleSubmit = async (data: CreatorFormValues) => {
    const formData = new FormData();
    
    // Append all form data to FormData with proper type checking
    formData.append('name', data.name);
    formData.append('designation', data.designation);
    formData.append('description', data.description);
    formData.append('status', data.status);

    // Append the image file if it exists
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
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
                  <Input placeholder="Enter creator name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input placeholder="Enter designation" {...field} />
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
                      placeholder="Enter description"
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
            <FormLabel>Profile Image</FormLabel>
            <div className="mt-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {(existingImage || initialData.imageLink) && (
                <div className="relative mt-4 w-32 h-32">
                  <Image
                    src={existingImage || `${initialData.imageLink}`}
                    alt="Creator"
                    fill
                    className="object-cover rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/placeholder-user.jpg';
                    }}
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
              'Update Creator'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
