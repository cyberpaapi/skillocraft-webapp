'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Loader2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  rating: z.coerce.number().min(1).max(5, {
    message: 'Rating must be between 1 and 5.',
  }),
  image: z.union([
    z.instanceof(File, {
      message: 'Please upload an image file',
    }),
    z.string().min(1, {
      message: 'Please upload an image file',
    }),
  ]).refine(
    (file) => {
      if (file instanceof File) {
        return file.size <= 5 * 1024 * 1024 && 
               ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      }
      return true;
    },
    {
      message: 'Image must be a JPG, PNG, or WebP file and less than 5MB',
    }
  ),
});

type TestimonialFormValues = z.infer<typeof formSchema>;

interface TestimonialFormProps {
  onSubmit: (values: TestimonialFormValues) => void;
  loading: boolean;
  initialData?: {
    name?: string;
    description?: string;
    rating?: number;
    imageUrl?: string;
  };
}

export function TestimonialForm({ onSubmit, loading, initialData }: TestimonialFormProps) {
  const [preview, setPreview] = useState<string | null>(
    initialData?.imageUrl ? `${initialData.imageUrl}` : null
  );

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      rating: 5,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file, { shouldValidate: true });
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="enter your name.." {...field} />
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
                  <FormLabel>Testimonial</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={cn(
                          'p-1',
                          star <= field.value ? 'text-yellow-400' : 'text-gray-300'
                        )}
                        onClick={() => field.onChange(star)}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <div className="mt-1 flex items-center">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer rounded-md border border-dashed p-4 w-full text-center"
                    >
                      {preview ? (
                        <div className="relative">
                          <div className="relative h-48 w-48 mx-auto">
                            <Image
                              src={preview}
                              alt="Preview"
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            Click to change
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg
                              className="h-12 w-12 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Click to upload an image
                          </div>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, WEBP up to 5MB
                          </p>
                        </div>
                      )}
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                        ref={field.ref}
                        name={field.name}
                        onBlur={field.onBlur}
                      />
                    </label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Update Testimonial' : 'Create Testimonial'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
