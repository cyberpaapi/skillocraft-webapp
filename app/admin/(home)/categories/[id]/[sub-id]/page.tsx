'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { axiosProtected } from '@/services/axiosService';
import { Category, SubCategory } from '@/types';
import { AlertModal } from '@/components/ui/alert-modal';


export default function SubCategoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryId = params.id as string;
  const subCategoryId = params['sub-id'] as string;

  useEffect(() => {
    const fetchCategoryWithSubcategories = async () => {
      try {
        const response = await axiosProtected.get<{
          status: number;
          message: string;
          data: Category & { subCategory: SubCategory[] };
        }>(`/categories/${categoryId}`);
        
        setCategory(response.data.data);
        
        // Find the specific subcategory from the category's subcategories
        const foundSubCategory = response.data.data.subCategory.find(
          (sub: SubCategory) => sub.id === subCategoryId
        );
        
        if (foundSubCategory) {
          setSubCategory(foundSubCategory);
        } else {
          toast.error('Subcategory not found');
        }
      } catch (error) {
        console.error('Error fetching category with subcategories:', error);
        toast.error('Failed to load subcategory details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryWithSubcategories();
  }, [categoryId, subCategoryId]);

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      await axiosProtected.delete(`/categories/${categoryId}/subcategories/${subCategoryId}`);
      toast.success('Subcategory deleted successfully');
      router.push(`/admin/categories/${categoryId}`);
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast.error('Failed to delete subcategory');
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!category || !subCategory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">
          {isLoading ? 'Loading...' : 'Subcategory not found'}
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/categories/${categoryId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Category
            </Link>
          </Button>
          <h1 className="mt-2 text-2xl font-bold">{subCategory.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Subcategory details and information
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/categories/${categoryId}/${subCategoryId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => setOpen(true)}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subcategory Information</CardTitle>
              <CardDescription>
                Details about the subcategory
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p>{subCategory.name}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={subCategory.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {subCategory.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p>{subCategory.category?.name || 'N/A'}</p>
              </div>
              <div className="pt-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">Icon</p>
                <div className="relative h-16 w-16 overflow-hidden rounded-md border flex items-center justify-center bg-white p-2">
                  <Image
                    src={subCategory.icon.startsWith('http') ? subCategory.icon : `${process.env.NEXT_PUBLIC_API_URL}${subCategory.icon}`}
                    alt={`${subCategory.name} icon`}
                    width={48}
                    height={48}
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="whitespace-pre-line">{subCategory.description || 'No description provided'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Image</CardTitle>
            </CardHeader>
            <CardContent>
              {subCategory.imageUrl ? (
                <div className="relative aspect-square rounded-md overflow-hidden border">
                  <Image
                    src={subCategory.imageUrl.startsWith('http') ? subCategory.imageUrl : `${process.env.NEXT_PUBLIC_API_URL}${subCategory.imageUrl}`}
                    alt={subCategory.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">No image</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                <p>{new Date(subCategory.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p>{new Date(subCategory.updatedAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <AlertModal
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={isDeleting}
      title="Are you sure you want to delete this subcategory?"
      description="This action cannot be undone. This will permanently delete the subcategory."
    />
    </>
  );
}
