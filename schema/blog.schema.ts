import { z } from 'zod';

export const blogFormSchema = z.object({
  title: z.string()
    .min(5, { message: 'Title must be at least 5 characters' })
    .max(200, { message: 'Title must be less than 200 characters' }),
    
  author: z.string()
    .min(2, { message: 'Author name must be at least 2 characters' })
    .max(100, { message: 'Author name must be less than 100 characters' }),
    
  categoryId: z.string().min(1, { message: 'Please select a category' }),
  subCategoryId: z.string().min(1, { message: 'Please select a subcategory' }),
  
  shortDescription: z.string()
    .min(10, { message: 'Short description must be at least 10 characters' })
    .max(500, { message: 'Short description must be less than 500 characters' }),
    
  longDescription: z.string()
    .min(50, { message: 'Long description must be at least 50 characters' })
    .max(10000, { message: 'Long description must be less than 10000 characters' }),
    
  featured: z.boolean(),
  featuredImage: z.custom<File | null>()
    .refine((file) => {
      // Skip validation if no file is provided (handled by required check if needed)
      if (!file) return true;
      
      // Check if the file is an image
      if (!(file instanceof File)) return false;
      return file.type.startsWith('image/');
    }, { message: 'Please upload a valid image file' })
    .refine((file) => {
      if (!file) return true; // Skip if no file
      // Check file size (5MB max)
      return file.size <= 5 * 1024 * 1024;
    }, { message: 'Image size must be less than 5MB' })
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;

export const updateBlogSchema = z.object({
  title: z.string()
    .min(5, { message: 'Title must be at least 5 characters' })
    .max(200, { message: 'Title must be less than 200 characters' })
    .optional(),
    
  authorId: z.string()
    .min(1, { message: 'Please select an author' })
    .optional(),
    
  categoryId: z.string().min(1, { message: 'Please select a category' }).optional(),
  
  shortDescription: z.string()
    .min(10, { message: 'Short description must be at least 10 characters' })
    .max(500, { message: 'Short description must be less than 500 characters' })
    .optional(),
    
  longDescription: z.string()
    .min(50, { message: 'Long description must be at least 50 characters' })
    .max(10000, { message: 'Long description must be less than 10000 characters' })
    .optional(),
    
  featured: z.boolean().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  
  featuredImage: z.custom<File | null>()
    .refine((file) => {
      if (!file) return true;
      if (!(file instanceof File)) return false;
      return file.type.startsWith('image/');
    }, { message: 'Please upload a valid image file' })
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024, // 5MB max
      { message: 'Maximum file size is 5MB' }
    )
    .optional(),
});

export type UpdateBlogValues = z.infer<typeof updateBlogSchema>;
