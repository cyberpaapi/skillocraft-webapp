import { z } from 'zod';

export const updateCategorySchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  image: z.any().optional(),
  icon: z.any().optional(),
});

export type UpdateCategoryValues = z.infer<typeof updateCategorySchema>;
