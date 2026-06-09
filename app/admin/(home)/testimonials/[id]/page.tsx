'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Star, Calendar, Clock, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import Image from 'next/image';
import { axiosProtected } from '@/services/axiosService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TestimonialEditForm } from '@/components/forms/testimonial-edit-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TestimonialDetail {
  id: string;
  name: string;
  imageLink: string;
  description: string;
  ratting: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
}

interface ApiResponse {
  status: number;
  message: string;
  data: TestimonialDetail;
}

export default function TestimonialDetailPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { 
    data: response, 
    isLoading, 
    error: queryError
  } = useQuery<ApiResponse>({
    queryKey: ['testimonial', id],
    queryFn: async () => {
      const { data } = await axiosProtected.get<ApiResponse>(
        `/testimonials/${id}`
      );
      return data;
    },
  });

  const testimonial = response?.data;
  const error = queryError ? (queryError as Error).message : null;

  const updateTestimonialMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const response = await axiosProtected.put(
          `/testimonials/${id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response.data;
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err.response?.data?.message || 'Failed to update testimonial');
      }
    },
    onSuccess: () => {
      toast.success('Testimonial updated successfully');
      queryClient.invalidateQueries({ queryKey: ['testimonial', id] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setIsEditModalOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleUpdateTestimonial = async (formData: FormData) => {
    await updateTestimonialMutation.mutateAsync(formData);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Testimonials
        </Button>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="h-48 w-48 rounded-full mx-auto md:mx-0" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !testimonial) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Testimonials
        </Button>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-red-500 mb-4">{error || 'Testimonial not found'}</div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Testimonials
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="relative h-48 w-48 rounded-full overflow-hidden border-4 border-gray-100">
                <Image
                  src={testimonial.imageUrl.startsWith('http') ? testimonial.imageUrl : `${process.env.NEXT_PUBLIC_API_URL}${testimonial.imageUrl}` || '/placeholder-avatar.png'}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{testimonial.name}</h1>
                <div className="flex items-center mt-2 md:mt-0">
                  <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">{testimonial.ratting}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Created: {formatDate(testimonial.createdAt)}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{testimonial.description}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                <Button 
                  onClick={() => setIsEditModalOpen(true)}
                  disabled={updateTestimonialMutation.isPending}
                >
                  {updateTestimonialMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Edit className="mr-2 h-4 w-4" />
                  )}
                  {updateTestimonialMutation.isPending ? 'Updating...' : 'Edit Testimonial'}
                </Button>
                <Button variant="outline" onClick={() => router.back()}>
                  Back to List
                </Button>
              </div>
              
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Edit Testimonial</DialogTitle>
                    <DialogDescription>
                      Update the testimonial details below. Click save when you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  {testimonial && (
                    <TestimonialEditForm
                      onSubmit={handleUpdateTestimonial}
                      isLoading={updateTestimonialMutation.isPending}
                      initialData={{
                        id: testimonial.id,
                        name: testimonial.name,
                        description: testimonial.description,
                        ratting: testimonial.ratting,
                        status: testimonial.status,
                        imageUrl: testimonial.imageUrl,
                      }}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Last updated: {formatDate(testimonial.updatedAt)}</span>
            </div>
            <div>
              <span>ID: {testimonial.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
