import * as z from 'zod';

export const successFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  brand: z.string().min(2, {
    message: 'Brand must be at least 2 characters.',
  }),
  earning: z.string().min(2, {
    message: 'Earning must be at least 2 characters.',
  }),
  categoryId: z.string().min(1, {
    message: 'Please select a category.',
  }),
  image: z.instanceof(File, { message: 'Please upload an image' })
    .refine(
      (file) => file.size <= 2 * 1024 * 1024, // 2MB max
      'Maximum file size is 2MB.'
    )
    .refine(
      (file) => file.type.startsWith('image/'),
      'Only image files are allowed for Image.'
    ),
  coverPhoto: z.instanceof(File, { message: 'Please upload an cover photo' })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB max for icons
      'Maximum file size is 5MB.'
    )
    .refine(
      (file) => file.type.startsWith('image/'),
      'Only image files are allowed for Cover Photo.'
    ),
});

export type SuccessFormValues = z.infer<typeof successFormSchema>;
