'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

type TestimonialFormValues = {
  name: string;
  description: string;
  ratting: string;
  status: string;
  image?: File | string;
};

interface TestimonialEditFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
  initialData: {
    id: string;
    name: string;
    description: string;
    ratting: string;
    status: string;
    imageUrl?: string;
  };
}

export function TestimonialEditForm({ 
  onSubmit, 
  isLoading = false, 
  initialData,
}: TestimonialEditFormProps) {
  const [existingImage, setExistingImage] = useState<string | null>(initialData.imageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const form = useForm<TestimonialFormValues>({
    defaultValues: {
      name: initialData.name,
      description: initialData.description,
      ratting: initialData.ratting,
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

  const handleSubmit = async (data: TestimonialFormValues) => {
    const formData = new FormData();
    
    // Append all form data to FormData with proper type checking
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('ratting', data.ratting);
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
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ratting"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < num ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Testimonial</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter testimonial"
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Profile Image</FormLabel>
            <div className="flex flex-col items-start gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {(existingImage || initialData.imageUrl) && (
                <div className="relative h-32 w-32 rounded-full overflow-hidden border">
                  <Image
                    src={existingImage || `${initialData.imageUrl}`}
                    alt={initialData.name}
                    fill
                    className="object-cover"
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
              'Update Testimonial'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
