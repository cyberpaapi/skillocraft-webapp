'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { axiosProtected } from '@/services/axiosService';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { BlogDetailsResponseData } from '@/types';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BlogEditForm } from '@/components/forms/blog-edit-form';


export default function BlogDetailsPage() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [authors, setAuthors] = useState<Array<{ id: string; name: string }>>([]);

  // Fetch blog details
  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const response = await axiosProtected.get(`/blogs/${id}`);
      console.log('API Response:', response.data);
      return response.data.data as BlogDetailsResponseData;
    },
  });

  console.log('Blog Data:', data);

  // Fetch categories and authors when component mounts
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [categoriesResponse, authorsResponse] = await Promise.all([
          axiosProtected.get('/categories'),
          axiosProtected.get('/author')
        ]);

        if (categoriesResponse.data.status === 1) {
          setCategories(categoriesResponse.data.data);
        }

        if (authorsResponse.data.status === 1) {
          setAuthors(authorsResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    if (id && !isError) {
      fetchFormData();
    }
  }, [id, isError]);

  // Define mutation at the top level
  const updateBlogMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BlogUpdateData }) => {
      const formData = new FormData();
      
      // Append only the fields that have values
      if (data.title) formData.append('title', data.title);
      if (data.authorId) formData.append('authorId', data.authorId);
      if (data.categoryId) formData.append('categoryId', data.categoryId);
      if (data.shortDescription) formData.append('shortDescription', data.shortDescription);
      if (data.longDesription) formData.append('longDescription', data.longDesription);
      if (data.featured !== undefined) formData.append('featured', data.featured.toString());
      if (data.status) formData.append('status', data.status);
      if (data.featuredImage) formData.append('featuredImage', data.featuredImage);

      const response = await axiosProtected.put(
        `/adminpanel/blogs/${id}`, 
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
      toast.success('Blog updated successfully');
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
      setIsEditModalOpen(false);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      console.error('Error updating blog:', error);
      toast.error(error.response?.data?.message || 'Failed to update blog');
    }
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Define interfaces at the top level of the component
  interface BlogUpdateData {
    title?: string;
    authorId?: string;
    categoryId?: string;
    shortDescription?: string;
    longDesription?: string; // Note: This matches the API response
    featured?: boolean;
    status?: 'ACTIVE' | 'INACTIVE';
    featuredImage?: File | null;
  }
  
  interface BlogFormData extends Omit<BlogUpdateData, 'longDesription'> {
    longDescription?: string; // For the form, we'll use the correct spelling
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };


  const handleEditSubmit = async (formData: BlogFormData) => {
    if (!id) {
      toast.error('Blog ID is missing');
      return;
    }
    
    try {
      // Convert longDescription to longDesription for the API
      const { longDescription, ...rest } = formData;
      const apiData: BlogUpdateData = {
        ...rest,
        longDesription: longDescription
      };
      
      await updateBlogMutation.mutateAsync({
        id: id.toString(),
        data: apiData as BlogUpdateData
      });
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Failed to update blog');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Details</h1>
          <p className="text-muted-foreground">View and manage blog post</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/blogs" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-8">
          {/* Header with Title and Status */}
          <div className="border-b pb-4">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold tracking-tight">{data.title}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                data.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {data.status}
              </span>
            </div>
            <p className="text-muted-foreground mt-2">
              By {data.author.name} • {formatDate(data.createdAt)}
              {data.updatedAt !== data.createdAt && ` • Updated ${formatDate(data.updatedAt)}`}
            </p>
            {data.featured && (
              <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                Featured
              </span>
            )}
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
              <p className="mt-1">{data.category.name}</p>
            </div>
            {/* <div>
              <h3 className="text-sm font-medium text-muted-foreground">Subcategory</h3>
              <p className="mt-1">{data.category.name}</p>
            </div> */}
          </div>

          {/* Featured Image */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Featured Image</h3>
            <div className="relative aspect-video w-full max-w-2xl rounded-lg overflow-hidden border bg-gray-100">
              {data.image ? (
                <Image
                  src={data.image.startsWith('http') ? data.image : `${process.env.NEXT_PUBLIC_API_URL}${data.image}`}
                  alt={data.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized={process.env.NODE_ENV !== 'production'}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                  No image available
                </div>
              )}
            </div>
          </div>

          {/* Short Description */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Short Description</h3>
            <p className="mt-1 text-foreground">{data.shortDescription}</p>
          </div>

          {/* Content Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Content</h2>
            <article 
              className="prose max-w-none prose-headings:mt-6 prose-headings:mb-4 prose-p:leading-relaxed prose-p:my-3"
              dangerouslySetInnerHTML={{ __html: data.longDesription || '<p class="text-muted-foreground">No content available</p>' }}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Blog
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/blogs" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to List
              </Link>
            </Button>
          </div>

          {/* Edit Blog Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>Edit Blog</DialogTitle>
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
                {data && categories.length > 0 && authors.length > 0 ? (
                  <BlogEditForm 
                    onSubmit={handleEditSubmit}
                    isLoading={updateBlogMutation.isPending}
                    initialData={{
                      id: data.id,
                      title: data.title,
                      authorId: data.author?.id || '',
                      categoryId: data.category?.id || '',
                      shortDescription: data.shortDescription,
                      longDescription: data.longDesription || '',
                      featured: data.featured,
                      status: (data.status === "ACTIVE" || data.status === "INACTIVE" ? data.status : "INACTIVE"),
                      featuredImage: data.image || undefined
                    }}
                    categories={categories}
                    authors={authors}
                  />
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
