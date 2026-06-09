'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { axiosProtected } from '@/services/axiosService';
import { FeaturedBrandsForm } from '@/components/forms/featured-brands-form';

export default function CreateFeaturedBrandPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: { 
    title: string;
    description: string;
    logo: File;
  }) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('logo', values.logo);

      const response = await axiosProtected.post('/adminpanel/feature-brands', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 1) {
        toast.success('Brand created successfully');
        router.push('/admin/featured-brands');
      } else {
        throw new Error(response.data.message || 'Failed to create brand');
      }
    } catch (error) {
      console.error('Error creating brand:', error);
      
      let errorMessage = 'Failed to create brand';
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
        <div>
          <h1 className="text-2xl font-bold">Add New Brand</h1>
          <p className="text-muted-foreground">Add a new brand to the featured brands section</p>
        </div>
        <Link href="/admin/featured-brands">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Brands
          </Button>
        </Link>
      </div>
      
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <FeaturedBrandsForm 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}