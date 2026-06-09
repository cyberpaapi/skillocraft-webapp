'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { axiosProtected } from '@/services/axiosService';
import { SubcategoryForm } from '@/components/forms/subcategory-form';
import { useQuery } from '@tanstack/react-query';

type Category = {
  id: string;
  name: string;
};

export default function CreateSubcategoryPage() {
  const router = useRouter();
  const { id: categoryId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the current category details
  const { data: category } = useQuery<Category>({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const { data } = await axiosProtected.get(`/categories/${categoryId}`);
      return data.data;
    },
  });

  const handleSubmit = async (data: { 
    categoryId: string; 
    name: string; 
    description: string; 
    image?: File | null;
  }) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('categoryId', data.categoryId);
      
      if (data.image) {
        formData.append('image', data.image);
      }

      await axiosProtected.post('/adminpanel/subcategory', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Subcategory created successfully');
      router.push(`/admin/categories/${categoryId}`);
    } catch (error) {
      console.error('Error creating subcategory:', error);
      toast.error('Failed to create subcategory');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/categories/${categoryId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Category
            </Link>
          </Button>
          <h1 className="mt-2 text-2xl font-bold">
            {category ? `Create Subcategory in ${category.name}` : 'Create Subcategory'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new subcategory to this category
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <SubcategoryForm 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting}
          categories={category ? [category] : []}
          defaultCategoryId={categoryId as string}
        />
      </div>
    </div>
  );
}
