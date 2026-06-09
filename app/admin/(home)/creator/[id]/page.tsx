'use client';

import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axiosProtected } from '@/services/axiosService';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Creator } from '@/types';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreatorEditForm } from '@/components/forms/creator-edit-form';

export default function CreatorDetailsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id: creatorId } = useParams<{ id: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: response, isLoading, isError } = useQuery<Creator>({
    queryKey: ['creator', creatorId],
    queryFn: async () => {
      try {
        const response = await axiosProtected.get(`/creators/${creatorId}`);
        return response.data.data;
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to fetch creator details');
        throw error;
      }
    },
  });

  const updateCreatorMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const response = await axiosProtected.put(
          `/creators/${creatorId}`,
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
        throw new Error(err.response?.data?.message || 'Failed to update creator');
      }
    },
    onSuccess: () => {
      toast.success('Creator updated successfully');
      queryClient.invalidateQueries({ queryKey: ['creator', creatorId] });
      queryClient.invalidateQueries({ queryKey: ['creators'] });
      setIsEditModalOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleUpdateCreator = async (formData: FormData) => {
    await updateCreatorMutation.mutateAsync(formData);
  };

  const creator = response;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !creator) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-muted-foreground">Failed to load creator details</h2>
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
            Back to Creators
          </Button>
          <h1 className="text-2xl font-bold">Creator Details</h1>
          <p className="text-muted-foreground">View and manage creator information</p>
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
            disabled={updateCreatorMutation.isPending}
          >
            {updateCreatorMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            {updateCreatorMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
              <div className="relative aspect-square rounded-lg overflow-hidden border">
                <Image
                  src={creator.imageLink.startsWith('http') ? creator.imageLink : `${process.env.NEXT_PUBLIC_API_URL}${creator.imageLink}`}
                  alt={creator.name}
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
                <h2 className="text-2xl font-bold">{creator.name}</h2>
                <Badge 
                  variant={creator.status === 'ACTIVE' ? 'default' : 'secondary'}
                  className={creator.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                >
                  {creator.status}
                </Badge>
              </div>
              <div className="prose max-w-none">
                <p className="text-muted-foreground">{creator.designation}</p>
              </div>
              <div className="prose max-w-none">
                <p className="text-muted-foreground">{creator.description}</p>
              </div>
              
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                    <p>{new Date(creator.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                        })}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p>{new Date(creator.updatedAt).toLocaleString('en-US', {
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
            <DialogTitle>Edit Creator</DialogTitle>
            <DialogDescription>
              Update the creator details below. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          {creator && (
            <CreatorEditForm
              onSubmit={handleUpdateCreator}
              isLoading={updateCreatorMutation.isPending}
              initialData={{
                id: creator.id,
                name: creator.name,
                designation: creator.designation,
                description: creator.description,
                status: creator.status,
                imageLink: creator.imageLink,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
