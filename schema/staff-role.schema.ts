import * as z from 'zod';

export const staffRoleFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  staffAccessIds: z.array(z.string()).min(1, 'At least one permission is required'),
});

export type StaffRoleFormValues = z.infer<typeof staffRoleFormSchema>;

// API request/response schemas
export const createStaffRoleRequestSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  staffAccessIds: z.array(z.string()).min(1),
});

export const staffRoleResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  staffAccess: z.array(z.object({
    id: z.string(),
    routeName: z.string(),
  })),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const staffRolesListResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(staffRoleResponseSchema),
});

export type StaffRole = z.infer<typeof staffRoleResponseSchema>;
