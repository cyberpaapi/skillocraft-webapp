import { z } from 'zod';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ACCEPTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
];

export const productFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  videoFile: z
    .any() // Use any() instead of instanceof FileList for server-side compatibility
    .refine(
      (files) => !isBrowser || files instanceof FileList,
      'File is required.'
    )
    .refine(
      (files) => !isBrowser || files.length > 0,
      'Video file is required.'
    )
    .refine(
      (files) => !isBrowser || files[0]?.size <= MAX_FILE_SIZE,
      'Max file size is 500MB.'
    )
    .refine(
      (files) => !isBrowser || ACCEPTED_VIDEO_TYPES.includes(files[0]?.type),
      'Only .mp4, .webm, .ogg, and .mov formats are supported.'
    ),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
