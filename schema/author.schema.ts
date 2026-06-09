import { z } from 'zod';

export const authorFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  image: z.instanceof(File, { message: 'Please upload an image' })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB max
      'Maximum file size is 5MB.'
    )
    .refine(
      (file) => file.type.startsWith('image/'),
      'Only image files are allowed.'
    ),
});

export const updateAuthorSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }).optional(),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  image: z.instanceof(File, { message: 'Please upload an image' })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB max
      'Maximum file size is 5MB.'
    )
    .refine(
      (file) => file.type.startsWith('image/'),
      'Only image files are allowed.'
    )
    .optional(),
});

export type AuthorFormValues = z.infer<typeof authorFormSchema>;
export type UpdateAuthorValues = z.infer<typeof updateAuthorSchema>;