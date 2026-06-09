'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Loader2, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { updateAuthorSchema, UpdateAuthorValues } from '@/schema/author.schema';

interface AuthorEditFormProps {
  onSubmit: (data: UpdateAuthorValues) => Promise<void>;
  isLoading?: boolean;
  initialData: {
    name: string;
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
    imageUrl?: string;
  };
}

export function AuthorEditForm({ 
  onSubmit, 
  isLoading = false, 
  initialData 
}: AuthorEditFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  const form = useForm<UpdateAuthorValues>({
    resolver: zodResolver(updateAuthorSchema),
    defaultValues: {
      name: initialData.name,
      description: initialData.description,
      status: initialData.status,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      form.setError('image', { type: 'manual', message: 'Only image files are allowed.' });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      form.setError('image', { type: 'manual', message: 'Maximum file size is 5MB.' });
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Set form value
    form.setValue('image', file, { shouldValidate: true });
    setHasImageChanged(true);
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue('image', undefined, { shouldValidate: true });
    setHasImageChanged(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter author name" 
                      {...field} 
                      disabled={isLoading} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter author description"
                    className="min-h-[100px]"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Author Image {!hasImageChanged && initialData.imageUrl ? '(Optional)' : '*'}</FormLabel>
                <FormControl>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                      {imagePreview ? (
                        <div className="relative h-full w-full">
                          <Image
                            src={imagePreview}
                            alt="Author preview"
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
                            disabled={isLoading}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : initialData.imageUrl ? (
                        <div className="relative h-full w-full">
                          <Image
                            src={initialData.imageUrl}
                            alt="Author preview"
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                      >
                        {imagePreview || initialData.imageUrl ? 'Change' : 'Upload'} Image
                      </Button>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Recommended size: 400x400px. Max file size: 5MB
                  {!hasImageChanged && initialData.imageUrl && (
                    <span className="block text-muted-foreground text-xs mt-1">
                      Leave empty to keep current image
                    </span>
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
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
            Update Author
          </Button>
        </div>
      </form>
    </Form>
  );
}
