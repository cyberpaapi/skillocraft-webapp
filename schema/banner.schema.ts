import * as z from 'zod';

export const bannerFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().min(5, {
    message: 'Description must be at least 5 characters.',
  }),
  bannerLocation: z.string({
    required_error: 'Please select a banner location.',
  }),
  image: z.any().refine(
    (file) => {
      if (!file) return false;
      return file instanceof File;
    },
    {
      message: 'Image is required',
    }
  ),
});

export type BannerFormValues = z.infer<typeof bannerFormSchema>;

// API request/response schemas
export const createBannerRequestSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  bannerLocation: z.string(),
  image: z.any().refine(
    (file) => file instanceof File,
    {
      message: 'Image is required',
    }
  ),
});

export const bannerResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  bannerLocation: z.string(),
  imageLink: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const bannersListResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(bannerResponseSchema),
});

export type Banner = z.infer<typeof bannerResponseSchema>;
