'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreatorFormValues } from '@/schema/creator.schema';
import { axiosProtected } from '@/services/axiosService';
import { CreatorForm } from '@/components/forms/creator-form';

export default function CreateCreatorPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: CreatorFormValues) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('designation', values.designation);
      formData.append('description', values.description);
      
      if (!values.image) {
        throw new Error('Please upload an image');
      }
      
      formData.append('image', values.image);

      await axiosProtected.post('/adminpanel/creator', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Creator created successfully');
      router.push('/admin/creator');
    } catch (error: unknown) {
      console.error('Error creating creator:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || 'Failed to create creator';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Creators
          </Button>
          <h1 className="text-2xl font-bold">Create New Creator</h1>
          <p className="text-muted-foreground">Add a new creator to the platform</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        <CreatorForm 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting} 
        />
      </div>
    </div>
  );
}
