import { z } from 'zod';

export const courseFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Course name must be at least 2 characters.',
  }),
  shortDescription: z.string().min(10, {
    message: 'Short description must be at least 10 characters.',
  }),
  longDescription: z.string().min(20, {
    message: 'Long description must be at least 20 characters.',
  }),
  price: z.coerce.number().min(0, {
    message: 'Price must be a positive number.',
  }),
  language: z.string().min(2, {
    message: 'Please select a language.',
  }),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  featured: z.boolean(),
  categoryId: z.string().min(1, {
    message: 'Please select a category.',
  }),
  subCategoryId: z.string().optional(),
  image: z.any().optional(),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;
