import { z } from 'zod';

export const featuredBrandFormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  logo: z.instanceof(File, { message: 'Please upload a logo' })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB max
      'Maximum file size is 5MB.'
    )
    .refine(
      (file) => file.type.startsWith('image/'),
      'Only image files are allowed.'
    ),
});

export type FeaturedBrandFormValues = z.infer<typeof featuredBrandFormSchema>;
