import { z } from 'zod';

export const creatorFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  designation: z.string().min(10, {
    message: 'Designation must be at least 10 characters.',
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

export type CreatorFormValues = z.infer<typeof creatorFormSchema>;

export const updateCreatorSchema = creatorFormSchema.extend({
  status: z.enum(['ACTIVE', 'INACTIVE']),
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
}).refine(data => data.status === 'ACTIVE' || data.status === 'INACTIVE', {
  message: 'Status must be either ACTIVE or INACTIVE',
  path: ['status']
});

export type UpdateCreatorValues = z.infer<typeof updateCreatorSchema>;