'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { axiosProtected } from '@/services/axiosService';
import { FeaturedGalleryForm } from '@/components/forms/featured-gallery-form';

export default function CreateFeaturedGalleryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: { image?: File; description?: string }) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Append the image file if it exists
      if (values.image) {
        formData.append('image', values.image);
      }
      
      // Append description if it exists
      if (values.description) {
        formData.append('description', values.description);
      }

      const response = await axiosProtected.post('/adminpanel/feature-gallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 1) {
        toast.success('Gallery item created successfully');
        router.push('/admin/featured-gallery');
      } else {
        throw new Error(response.data.message || 'Failed to create gallery item');
      }
    } catch (error) {
      console.error('Error creating gallery item:', error);
      
      let errorMessage = 'Failed to create gallery item';
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
          <h1 className="text-2xl font-bold">Add New Gallery Item</h1>
          <p className="text-muted-foreground">Upload a new image to the featured gallery</p>
        </div>
        <Link href="/admin/featured-gallery">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Gallery
          </Button>
        </Link>
      </div>
      
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <FeaturedGalleryForm 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}