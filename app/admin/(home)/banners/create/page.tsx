"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { axiosProtected } from '@/services/axiosService';
import { BannerForm } from '@/components/forms/banner-form';

export default function CreateBannerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: { name: string; description: string; bannerLocation: string; image?: File }) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('bannerLocation', values.bannerLocation);
      
      // Only append image if it exists
      if (values.image) {
        formData.append('image', values.image);
      } else {
        toast.error('Please select an image');
        setIsSubmitting(false);
        return;
      }

      await axiosProtected.post('/adminpanel/banners', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Banner created successfully');
      router.push('/admin/banners');
    } catch (error) {
      console.error('Error creating banner:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to create banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Banner</h1>
        <Link href="/admin/banners">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Banners
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <BannerForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
          />
        </div>
      </div>
    </div>
  );
}
