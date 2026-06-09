'use client';

import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { AuthorEditForm } from '@/components/forms/author-edit-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axiosPublic } from '@/services/axiosService';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface AuthorDetailsResponse {
  status: number;
  message: string;
  data: {
    id: string;
    name: string;
    imageLink: string;
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt: string;
  };
}

export default function AuthorDetailsPage() {
  const router = useRouter();
  const { id: authorId } = useParams<{ id: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: response, isLoading, isError } = useQuery<AuthorDetailsResponse>({
    queryKey: ['author', authorId],
    queryFn: async () => {
      try {
        const response = await axiosPublic.get(`/author/${authorId}`);
        return response.data;
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to fetch author details');
        throw error;
      }
    },
  });

  const author = response?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !author) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-muted-foreground">Failed to load author details</h2>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold">Author Details</h1>
          <p className="text-muted-foreground">View and manage author information</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => {}}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
              <div className="relative aspect-square rounded-lg overflow-hidden border">
                <Image
                  src={author.imageLink.startsWith('http') ? author.imageLink : `${process.env.NEXT_PUBLIC_API_URL}${author.imageLink}`}
                  alt={author.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/placeholder-user.jpg';
                  }}
                />
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{author.name}</h2>
                <Badge 
                  variant={author.status === 'ACTIVE' ? 'default' : 'secondary'}
                  className={author.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                >
                  {author.status}
                </Badge>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-muted-foreground">{author.description}</p>
              </div>
              
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                    <p>{new Date(author.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                        })}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p>{new Date(author.updatedAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                        })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Edit Author</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="py-4">
            <AuthorEditForm 
              onSubmit={async (values) => {
                try {
                  const formData = new FormData();
                  if (values.name) formData.append('name', values.name);
                  if (values.description) formData.append('description', values.description);
                  if (values.status) formData.append('status', values.status);
                  if (values.image && values.image instanceof File) {
                    formData.append('image', values.image);
                  }

                  const response = await axiosPublic.put(
                    `/adminpanel/authors/${authorId}`, 
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                  );

                  if (response.data.status === 1) {
                    toast.success('Author updated successfully');
                    setIsEditModalOpen(false);
                    // Refresh the data
                    router.refresh();
                  } else {
                    throw new Error(response.data.message || 'Failed to update author');
                  }
                } catch (error) {
                  console.error('Error updating author:', error);
                  throw error;
                }
              }}
              initialData={{
                name: author.name,
                description: author.description,
                status: author.status,
                imageUrl: author.imageLink || ''
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
