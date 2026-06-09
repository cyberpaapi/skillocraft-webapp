'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { successFormSchema, SuccessFormValues } from '@/schema/success.schema';
import { axiosProtected } from '@/services/axiosService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@/types';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function SuccessStoryForm() {

      const router = useRouter();
      const [loading, setLoading] = useState(false);
  const form = useForm<SuccessFormValues>({
    resolver: zodResolver(successFormSchema),
    defaultValues: {
      name: '',
      description: '',
      brand: '',
      earning: '',
      categoryId: '',
      image: undefined as File | undefined,
      coverPhoto: undefined as File | undefined,
    },
  });

   // Fetch categories
   const { data: categoriesResponse } = useQuery<{
    status: number;
    message: string;
    data: Category[];
  }>({
    queryKey: ['categories'],
    queryFn: () => axiosProtected.get('/categories').then(res => res.data),
  });

  // Get categories from the nested data structure
  const categories = categoriesResponse?.data || [];

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'coverPhoto') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'image') {
        setImagePreview(reader.result as string);
      } else {
        setCoverPhotoPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Update form value - validation is handled by zod
    form.setValue(type, file, { shouldValidate: true });
  };

  const triggerFileInput = (type: 'image' | 'coverPhoto') => {
    if (type === 'image') {
      imageInputRef.current?.click();
    } else {
      coverPhotoInputRef.current?.click();
    }
  };

  const removeFile = (e: React.MouseEvent, type: 'image' | 'coverPhoto') => {
    e.stopPropagation();
    if (type === 'image') {
      setImagePreview(null);
      form.setValue('image', undefined as unknown as File, { shouldValidate: true });
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    } else {
      setCoverPhotoPreview(null);
      form.setValue('coverPhoto', undefined as unknown as File, { shouldValidate: true });
      if (coverPhotoInputRef.current) {
        coverPhotoInputRef.current.value = '';
      }
    }
  };

  async function handleSubmit(data: SuccessFormValues) {
    setLoading(true);
    // Ensure required files are provided before submitting
    if (!data.image) {
      form.setError('image', { message: 'Please upload an image' });
      return;
    }
    if (!data.coverPhoto) {
      form.setError('coverPhoto', { message: 'Please upload an cover photo' });
      return;
    }
    try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('brand', data.brand);
        formData.append('earning', data.earning);
        formData.append('categoryId', data.categoryId);
        
        if (!data.image) {
          throw new Error('Please upload an image');
        }
        
        if (!data.coverPhoto) {
          throw new Error('Please upload an icon');
        }
        
        formData.append('image', data.image);
        formData.append('coverPhoto', data.coverPhoto);
  
        await axiosProtected.post('/adminpanel/success', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        toast.success('Success story created successfully');
        router.push('/admin/success');
      } catch (error: unknown) {
        console.error('Error creating success story:', error);
        let errorMessage = 'Failed to create success story';
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (error && typeof error === 'object' && 'response' in error) {
          const responseError = error as { response?: { data?: { message?: string } } };
          errorMessage = responseError.response?.data?.message || errorMessage;
        }
        
        toast.error(errorMessage);
      } finally{
        setLoading(false);
      }
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
                  <FormLabel>User Image</FormLabel>
                  <FormControl>
                    <div>
                      <div 
                        className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => triggerFileInput('image')}
                      >
                        <div className="space-y-1 text-center w-full">
                          {imagePreview ? (
                            <div className="relative w-28 h-28 rounded-full overflow-hidden">
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
            <FormField
              control={form.control}
              name="coverPhoto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Photo</FormLabel>
                  <FormControl>
                    <div>
                      <div 
                        className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => triggerFileInput('coverPhoto')}
                      >
                        <div className="space-y-1 text-center w-full">
                          {coverPhotoPreview ? (
                            <div className="relative w-full h-48 rounded-md overflow-hidden">
                              <div className="relative w-full h-full">
                                <Image
                                  src={coverPhotoPreview}
                                  alt="Cover photo preview"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 rounded-full w-6 h-6 p-0"
                                onClick={(e) => removeFile(e, 'coverPhoto')}
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
                          ref={coverPhotoInputRef}
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => {
                            handleFileChange(e, 'coverPhoto');
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
                  <Input placeholder="Enter category name" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter brand name" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="earning"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Earning</FormLabel>
                <FormControl>
                  <Input placeholder="Enter earning" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select
                name="categoryId"
                value={form.watch('categoryId')}
                onValueChange={(value) => form.setValue('categoryId', value)}
                required
                >
                <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((category: Category) => (
                    <SelectItem key={category.id} value={category.id}>
                        {category.name}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>

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
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end space-x-4 pt-6">
            <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
            >
            Cancel
            </Button>
            <Button type="submit" disabled={loading}>
            {loading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
                </>
            ) : (
                'Create Success Story'
            )}
            </Button>
        </div>
      </form>
    </Form>
  );
}
