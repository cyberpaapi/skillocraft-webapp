import { z } from 'zod';

// Create a base schema for file validation
const fileSchema = z.instanceof(File, { message: 'Please upload an image' })
  .refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB max
    'Maximum file size is 5MB.'
  )
  .refine(
    (file) => file.type.startsWith('image/'),
    'Only image files are allowed.'
  );

export const featuredGalleryFormSchema = z.object({
  image: z.union([
    fileSchema,
    z.any().refine(val => val === null || val === undefined, {
      message: 'Please upload an image',
    })
  ]).transform(val => val || null),
  description: z.string().optional(),
});

export type FeaturedGalleryFormValues = z.infer<typeof featuredGalleryFormSchema>;
