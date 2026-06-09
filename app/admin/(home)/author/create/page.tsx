'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthorForm } from '@/components/forms/author-form';
import { AuthorFormValues } from '@/schema/author.schema';
import { axiosProtected } from '@/services/axiosService';

export default function CreateAuthorPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: AuthorFormValues) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      
      if (!values.image) {
        throw new Error('Please upload an image');
      }
      
      formData.append('image', values.image);

      await axiosProtected.post('/adminpanel/author', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Author created successfully');
      router.push('/admin/author');
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        const errorMessage = axiosError.response?.data?.message || 'Failed to create author';
        toast.error(errorMessage);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
      console.error('Error creating author:', error);
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
            Back to Authors
          </Button>
          <h1 className="text-2xl font-bold">Create New Author</h1>
          <p className="text-muted-foreground">Add a new author to the platform</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        <AuthorForm 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting} 
        />
      </div>
    </div>
  );
}
