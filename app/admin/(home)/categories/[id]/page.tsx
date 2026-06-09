'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Plus, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { axiosProtected } from '@/services/axiosService';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';
import DataTable from '@/components/tables/subcategories/DataTable';
import { columns } from '@/components/tables/subcategories/columns';
import { Category, SubCategory } from '@/types';
import { useState } from 'react';
import { AlertModal } from '@/components/ui/alert-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CategoryEditForm } from '@/components/forms/category-edit-form';

export default function CategoryDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch category details with subcategories
  const { data: categoryResponse, isLoading: isLoadingCategory } = useQuery<{
    status: number;
    message: string;
    data: Category & { subCategory: SubCategory[] };
  }>({
    queryKey: ['category', id],
    queryFn: async () => {
      const { data } = await axiosProtected.get(`/categories/${id}`);
      return data;
    },
  });

  const category = categoryResponse?.data;
  const subcategories = category?.subCategory || [];

  // Define interface for category update data
  interface CategoryUpdateData {
    name?: string;
    description?: string;
    status?: string;
    image?: File;
    icon?: File;
  }

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryUpdateData }) => {
      const formData = new FormData();
      
      // Append only the fields that have values
      if (data.name) formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.status) formData.append('status', data.status);
      if (data.image) formData.append('image', data.image);
      if (data.icon) formData.append('icon', data.icon);

      const response = await axiosProtected.put(
        `/categories/${id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Category updated successfully');
      queryClient.invalidateQueries({ queryKey: ['category', id] });
      setIsEditModalOpen(false);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      console.error('Error updating category:', error);
      toast.error(error.response?.data?.message || 'Failed to update category');
    }
  });

  const onDelete = async () => {
    try {
      setLoading(true);
      await axiosProtected.delete(`/categories/${id}`);
      toast.success('Category deleted successfully');
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  interface CategoryFormData {
    name: string;
    description?: string;
    status: 'ACTIVE' | 'INACTIVE';
    image?: File | string;
  }

  const handleEditSubmit = async (formData: CategoryFormData) => {
    // Create a new object with the form data
    const updateData = { ...formData };
    
    // If image is a string (URL), remove it from the update data
    if (typeof updateData.image === 'string') {
      delete updateData.image;
    }
    
    await updateCategoryMutation.mutateAsync({
      id: id as string,
      data: updateData as Omit<CategoryFormData, 'image'> & { image?: File }
    });
  };

  const isLoadingSubcategories = isLoadingCategory;

  if (isLoadingCategory) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 h-[60vh]">
        <h2 className="text-2xl font-bold">Category not found</h2>
        <p className="text-muted-foreground">The category you are looking for does not exist.</p>
        <Button onClick={() => router.push('/admin/categories')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/admin/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{category.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Updated on {new Date(category.updatedAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditModalOpen(true)}
            disabled={loading}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium">Category Details</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {category.description}
              </p>
              <div className="mt-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-medium text-muted-foreground">Status</span>
                      <Badge variant={category.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {category.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-medium text-muted-foreground">Created By</span>
                      <span className="text-sm">{category.createdBy}</span>
                    </div>
                    {category.icon && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Category Icon</h4>
                        <div className="relative h-20 w-20 overflow-hidden rounded-md border flex items-center justify-center bg-white p-2">
                          <Image
                            src={category.icon.startsWith('http') ? category.icon : `${process.env.NEXT_PUBLIC_API_URL}${category.icon}`}
                            alt={`${category.name} icon`}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 w-full">
              {category.imageUrl && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Category Image</h4>
                  <div className="relative h-48 w-full max-w-xs overflow-hidden rounded-md border">
                    <Image
                      src={category.imageUrl.startsWith('http') ? category.imageUrl : `${process.env.NEXT_PUBLIC_API_URL}${category.imageUrl}`}
                      alt={`${category.name} image`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Subcategories</h3>
            <Button size="sm" asChild>
              <Link href={`/admin/categories/${id}/create`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Subcategory
              </Link>
            </Button>
          </div>
          <div className="mt-4">
            {isLoadingSubcategories ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={subcategories || []}
                meta={{ categoryId: id }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
    
    {/* Delete Confirmation Modal */}
    <AlertModal
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
      title="Are you sure you want to delete this category?"
      description="This will permanently delete this category and all its subcategories. This action cannot be undone."
    />

    {/* Edit Category Modal */}
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Edit Category</DialogTitle>
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
          {category ? (
            <CategoryEditForm 
              onSubmit={handleEditSubmit}
              isLoading={updateCategoryMutation.isPending}
              initialData={{
                id: category.id,
                name: category.name,
                description: category.description || '',
                status: category.status as 'ACTIVE' | 'INACTIVE',
                imageUrl: category.imageUrl,
                icon: category.icon
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}