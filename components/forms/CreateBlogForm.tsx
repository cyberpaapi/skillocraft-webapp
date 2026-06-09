'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { axiosProtected } from '@/services/axiosService';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  subCategory: Array<{ id: string; name: string }>;
}

interface Author {
  id: string;
  name: string;
  imageLink: string;
  status: string;
}

interface AuthorResponse {
  status: number;
  message: string;
  data: Author[];
}

export default function CreateBlogForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    authorId: '',
    shortDescription: '',
    longDescription: '',
    categoryId: '',
    status: 'ACTIVE',
    featured: false,
    image: null as File | null,
  });

  // Fetch categories
  const { data: categoriesResponse } = useQuery<{
    status: number;
    message: string;
    data: Category[];
  }>({
    queryKey: ['categories'],
    queryFn: () => axiosProtected.get('/categories').then(res => res.data),
  });

  // Get categories from the nested data structure
  const categories = categoriesResponse?.data || [];

  // Fetch authors
  const { data: authorsResponse } = useQuery<AuthorResponse>({
    queryKey: ['authors'],
    queryFn: () => axiosProtected.get('/author').then(res => res.data),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFormData(prev => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('authorId', formData.authorId);
    formDataToSend.append('shortDescription', formData.shortDescription);
    formDataToSend.append('longDescription', formData.longDescription);
    formDataToSend.append('categoryId', formData.categoryId);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('featured', String(formData.featured));

    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      await axiosProtected.post('/adminpanel/blogs', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Blog post created successfully');
      router.push('/admin/blogs');
    } catch (error: unknown) {
      console.error('Error creating blog post:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter blog title"
            required
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              name="status"
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="authorId">Author</Label>
            <Select
              name="authorId"
              value={formData.authorId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, authorId: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select author" />
              </SelectTrigger>
              <SelectContent>
                {authorsResponse?.data?.map((author) => (
                  <SelectItem key={author.id} value={author.id}>
                    {author.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Select
            name="categoryId"
            value={formData.categoryId}
            onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category: Category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            placeholder="A brief description of the blog post"
            className="min-h-[100px]"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longDescription">Content</Label>
          <Textarea
            id="longDescription"
            name="longDescription"
            value={formData.longDescription}
            onChange={handleChange}
            placeholder="Write the full blog post content here..."
            className="min-h-[300px]"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Featured Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              disabled={loading}
              required
            />
            {imagePreview && (
              <div className="mt-2">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={320}
                  height={160}
                  className="h-40 w-auto object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              disabled={loading}
            />
            <Label htmlFor="featured" className="text-sm font-medium text-gray-700">
              Mark as featured
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Blog Post'
          )}
        </Button>
      </div>
    </form>
  );
}
