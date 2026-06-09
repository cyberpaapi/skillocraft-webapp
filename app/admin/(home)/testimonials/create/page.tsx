'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { axiosPublic } from '@/services/axiosService';
import { TestimonialForm } from '@/components/forms/testimonial-form';

export default function CreateTestimonialPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: {
    name: string;
    description: string;
    rating: number;
    image: File | string;
  }) => {
    // If image is a string (URL), don't submit the form
    if (typeof values.image === 'string') {
      toast.error('Please upload an image');
      return;
    }
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('ratting', values.rating.toString());
      formData.append('image', values.image);

      const { data } = await axiosPublic.post('/testimonials', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.status === 1) {
        toast.success('Testimonial created successfully');
        router.push('/admin/testimonials');
      } else {
        throw new Error(data.message || 'Failed to create testimonial');
      }
    } catch (error) {
      console.error('Error creating testimonial:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to create testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create New Testimonial</h1>
          <p className="text-muted-foreground">Add a new customer testimonial</p>
        </div>
        <Link href="/admin/testimonials">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Testimonials
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <TestimonialForm onSubmit={onSubmit} loading={isSubmitting} />
      </div>
    </div>
  );
}
