import * as z from 'zod';

export const subcategoryFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  categoryId: z.string().min(1, {
    message: 'Please select a category.',
  }),
  featured: z.boolean(),
  image: z.instanceof(File, { message: 'Please upload an image' })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB max
      'Maximum file size is 5MB.'
    )
    .refine(
      (file) => file.type.startsWith('image/'),
      'Only image files are allowed.'
    )
    .optional()
    .nullable(),
});

export type SubcategoryFormValues = z.infer<typeof subcategoryFormSchema>;
