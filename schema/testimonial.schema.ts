import { z } from 'zod';

export const testimonialFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  rating: z.coerce.number().min(1).max(5, {
    message: 'Rating must be between 1 and 5.',
  }),
  image: z.union([
    z.instanceof(File, {
      message: 'Please upload an image file',
    }),
    z.string().min(1, {
      message: 'Please upload an image file',
    }),
  ]).refine(
    (file) => {
      if (file instanceof File) {
        return file.size <= 5 * 1024 * 1024 && 
               ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      }
      return true;
    },
    {
      message: 'Image must be a JPG, PNG, or WebP file and less than 5MB',
    }
  ),
});

export const updateTestimonialSchema = testimonialFormSchema.extend({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }).optional(),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }).optional(),
  rating: z.coerce.number().min(1).max(5, {
    message: 'Rating must be between 1 and 5.',
  }).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  image: z.union([
    z.instanceof(File, {
      message: 'Please upload an image file',
    }),
    z.string().min(1, {
      message: 'Please upload an image file',
    }),
  ])
  .refine(
    (file) => {
      if (file instanceof File) {
        return file.size <= 5 * 1024 * 1024 && 
               ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      }
      return true;
    },
    {
      message: 'Image must be a JPG, PNG, or WebP file and less than 5MB',
    }
  )
  .optional(),
});

export type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;
export type UpdateTestimonialValues = z.infer<typeof updateTestimonialSchema>;
