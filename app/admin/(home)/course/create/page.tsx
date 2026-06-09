'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CourseForm, CourseFormValues } from '@/components/forms/course-form';
import { axiosProtected } from '@/services/axiosService';

export default function CreateCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CourseFormValues) => {
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      // Required fields
      formDataToSend.append('name', data.name);
      formDataToSend.append('shortDescription', data.shortDescription);
      formDataToSend.append('longDescription', data.longDescription);
      formDataToSend.append('price', data.price);
      formDataToSend.append('categoryId', data.categoryId);
      formDataToSend.append('creatorId', data.creatorId);
      formDataToSend.append('language', data.language);
      formDataToSend.append('featured', String(data.featured));
      formDataToSend.append('whatsAppLink', data.whatsAppLink || '');

      if (data.image) {
        formDataToSend.append('image', data.image);
      }
      
      if (data.teaserVideo) {
        if (typeof data.teaserVideo === 'string') {
          // If it's a string (URL), append it as is
          formDataToSend.append('teaserVideo', data.teaserVideo);
        } else {
          // If it's a File object, append the file
          formDataToSend.append('teaserVideo', data.teaserVideo);
        }
      }
      
      if (data.pdfFile) {
        formDataToSend.append('pdfFile', data.pdfFile);
      }

      await axiosProtected.post('/adminpanel/course', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Course created successfully');
      router.push('/admin/course');
    } catch (error: unknown) {
      console.error('Error creating course:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || 'Failed to create course';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Course</h1>
          <p className="text-muted-foreground">Add a new course to your platform</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>Fill in the details for your new course</CardDescription>
        </CardHeader>
        <CardContent>
          <CourseForm 
            onSubmit={handleSubmit} 
            isLoading={isSubmitting} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
