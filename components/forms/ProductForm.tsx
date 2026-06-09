'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ArrowLeft, Upload } from 'lucide-react';
import { axiosProtected } from '@/services/axiosService';
import { productFormSchema, ProductFormValues } from '@/schema/product.schema';

interface ProductFormProps {
  courseId: string;
  onCancel?: () => void;
}

export function ProductForm({ courseId, onCancel }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      videoFile: undefined,
    },
  });

  async function onSubmit(values: ProductFormValues) {
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('courseId', courseId);
      // Get the first (and only) file from the FileList
      const videoFile = values.videoFile[0];
      formData.append('video', videoFile);
      
      await axiosProtected.post(
        `/adminpanel/products`,
        //`/adminpanel/course/${courseId}/product`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      toast.success('Product created successfully');
      router.push(`/admin/course/${courseId}`);
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={onCancel || (() => router.back())}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Add New Product</h1>
            <p className="text-sm text-muted-foreground">
              Add a new product to this course
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoFile"
                render={({ field: { onChange, value } }) => {
                  const file = value?.[0];
                  
                  return (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Video File</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                MP4, WebM, or MOV (MAX. 500MB)
                              </p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="video/mp4,video/webm,video/ogg,video/quicktime"
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  // Create a new FileList with only the first file
                                  const dataTransfer = new DataTransfer();
                                  dataTransfer.items.add(e.target.files[0]);
                                  onChange(dataTransfer.files);
                                }
                              }}
                              onClick={(e) => {
                                // Clear the previous file selection to allow reselecting the same file
                                const target = e.target as HTMLInputElement;
                                target.value = '';
                              }}
                            />
                          </label>
                          {file && (
                            <div className="text-sm text-muted-foreground">
                              <p className="font-medium">{file.name}</p>
                              <p className="text-xs">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel || (() => router.back())}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
