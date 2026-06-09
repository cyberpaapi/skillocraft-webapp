'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { axiosProtected } from '@/services/axiosService';
import { CategoryForm } from '@/components/forms/category-form';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: { 
    name: string; 
    description: string; 
    image?: File | null;
    icon?: File | null;
    parentId?: string | null;
    featured: boolean;
  }) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      
      if (!values.image) {
        throw new Error('Please upload an image');
      }
      
      if (!values.icon) {
        throw new Error('Please upload an icon');
      }
      
      formData.append('image', values.image);
      formData.append('icon', values.icon);
      formData.append('featured', String(values.featured));


      await axiosProtected.post('/adminpanel/category', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Category created successfully');
      router.push('/admin/categories');
    } catch (error: unknown) {
      console.error('Error creating category:', error);
      let errorMessage = 'Failed to create category';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'response' in error) {
        const responseError = error as { response?: { data?: { message?: string } } };
        errorMessage = responseError.response?.data?.message || errorMessage;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Category</h1>
        <Link href="/admin/categories">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories
          </Button>
        </Link>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <CategoryForm 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}