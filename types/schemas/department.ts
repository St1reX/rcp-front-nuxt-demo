import { z } from 'zod';

const OptionalUserIdSchema = z.preprocess(
  (value) => (value === '' || value === null ? undefined : value),
  z.string().uuid('User id must be UUID').optional()
);

export const CreateDepartmentSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  userId: OptionalUserIdSchema,
});

export type CreateDepartmentRequest = z.infer<typeof CreateDepartmentSchema>;

export const DeleteDepartmentSchema = z.object({
  departmentId: z.string().uuid('Department id must be UUID'),
});

export type DeleteDepartmentRequest = z.infer<typeof DeleteDepartmentSchema>;

export const UpdateDepartmentSchema = z.object({
  departmentId: z.string().uuid('Department id must be UUID'),
  name: z.string().min(1, 'Department name is required'),
  userId: z.string().uuid('User id must be UUID').optional(),
});

export type UpdateDepartmentRequest = z.infer<typeof UpdateDepartmentSchema>;

export const GetDepartmentDetailsSchema = z.object({
  departmentId: z.string().uuid('Department id must be UUID'),
});

export type GetDepartmentDetailsRequest = z.infer<typeof GetDepartmentDetailsSchema>;
