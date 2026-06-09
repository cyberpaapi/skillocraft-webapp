'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Loader2, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { axiosProtected } from '@/services/axiosService';
import { Category, Author } from '@/types';

export interface CourseFormValues {
  name: string;
  shortDescription: string;
  longDescription: string;
  price: string;
  categoryId: string;
  creatorId: string;
  image: File | null;
  teaserVideo: File | string;
  pdfFile?: File | null;
  whatsAppLink?: string;
  featured: boolean;
  language: string;
}

interface CourseFormProps {
  onSubmit: (data: CourseFormValues) => Promise<void>;
  isLoading: boolean;
  initialData?: Partial<CourseFormValues>;
}

export function CourseForm({ onSubmit, isLoading, initialData = {} }: CourseFormProps) {
  const [formData, setFormData] = useState<CourseFormValues>({
    name: '',
    shortDescription: '',
    longDescription: '',
    price: '',
    categoryId: '',
    creatorId: '',
    image: null,
    teaserVideo: '',
    featured: false,
    language: '',
    ...initialData
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosProtected.get<{ 
        status: number;
        message: string;
        data: Category[] 
      }>('/categories');
      return response.data.data || [];
    },
  });

  const { data: creators = [] } = useQuery<Author[]>({
    queryKey: ['creators'],
    queryFn: async () => {
      const response = await axiosProtected.get<{ 
        status: number;
        message: string;
        data: Author[] 
      }>('/creators');
      return response.data.data || [];
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value,type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if(type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, teaserVideo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
    ...formData,
    language: formData.language.toLowerCase().trim()
  };
    await onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Course Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter course name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Brief description of the course"
              rows={3}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longDescription">Detailed Description</Label>
            <Textarea
              id="longDescription"
              name="longDescription"
              value={formData.longDescription}
              onChange={handleChange}
              placeholder="Detailed description of the course"
              rows={6}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creatorId">Creator</Label>
            <Select
              value={formData.creatorId}
              onValueChange={(value) => handleSelectChange('creatorId', value)}
              disabled={isLoading || creators.length === 0}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a creator" />
              </SelectTrigger>
              <SelectContent>
                {creators.map((creator) => (
                  <SelectItem key={creator.id} value={creator.id}>
                    {creator.name}
                  </SelectItem>
                ))}
                {creators.length === 0 && (
                  <div className="px-3 py-1.5 text-sm text-muted-foreground">
                    No creators found
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => handleSelectChange('categoryId', value)}
              disabled={isLoading || categories.length === 0}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category: Category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
                {categories.length === 0 && (
                  <div className="px-3 py-1.5 text-sm text-muted-foreground">
                    No categories found
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsAppLink">WhatsApp Group Link</Label>
            <Input
              id="whatsAppLink"
              name="whatsAppLink"
              type="url"
              placeholder="https://wa.me/1234567890"
              value={formData.whatsAppLink || ''}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Course Image</Label>
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Course preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <span className="text-muted-foreground">Preview</span>
                  </div>
                )}
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e: Event) => {
                      const target = e.target as HTMLInputElement;
                      if (target.files?.[0]) {
                        const event = {
                          target: {
                            files: target.files
                          }
                        } as React.ChangeEvent<HTMLInputElement>;
                        handleImageChange(event);
                      }
                    };
                    input.click();
                  }}
                >
                  {imagePreview ? 'Change' : 'Upload'} Image
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Recommended size: 800x450px. Max file size: 2MB
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Course PDF (Optional)</Label>
            <div className="flex items-center gap-4">
              {pdfFile ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{pdfFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPdfFile(null);
                      setFormData(prev => ({ ...prev, pdfFile: null }));
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'application/pdf';
                    input.onchange = (e: Event) => {
                      const target = e.target as HTMLInputElement;
                      if (target.files?.[0]) {
                        const file = target.files[0];
                        setPdfFile(file);
                        setFormData(prev => ({ ...prev, pdfFile: file }));
                      }
                    };
                    input.click();
                  }}
                  disabled={isLoading}
                >
                  Upload PDF
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Teaser Video</Label>
            <div className="space-y-4">
              {videoPreview ? (
                <div className="relative w-full max-w-md overflow-hidden rounded-md border">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full max-h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setVideoPreview(null);
                      setFormData(prev => ({ ...prev, teaserVideo: '' }));
                    }}
                    className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-md border border-dashed p-8 bg-muted">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">No video selected</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isLoading}
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'video/*';
                        input.onchange = (e: Event) => {
                          const target = e.target as HTMLInputElement;
                          if (target.files?.[0]) {
                            const event = {
                              target: {
                                files: target.files
                              }
                            } as React.ChangeEvent<HTMLInputElement>;
                            handleVideoChange(event);
                          }
                        };
                        input.click();
                      }}
                    >
                      Upload Video
                    </Button>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoChange}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: MP4, WebM, MOV. Max file size: 50MB
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              placeholder="Enter language"
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <Label htmlFor="featured" className="text-sm font-medium text-gray-700">
              Mark as featured
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Course
        </Button>
      </div>
    </form>
  );
}
