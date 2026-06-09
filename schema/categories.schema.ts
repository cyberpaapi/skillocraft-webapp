import * as z from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
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
    ),
  icon: z.instanceof(File, { message: 'Please upload an icon' })
    .refine(
      (file) => file.size <= 2 * 1024 * 1024, // 2MB max for icons
      'Maximum file size is 2MB.'
    )
    .refine(
      (file) => file.type.startsWith('image/'),
      'Only image files are allowed for icons.'
    ),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
