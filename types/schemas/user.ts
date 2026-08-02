import { z } from 'zod';

export const GetMeSchema = z.object({});

export type GetMeRequest = z.infer<typeof GetMeSchema>;

export const UpdateMeSchema = z.object({
  // userId: z.st We are not validating it since it is attached to every request of logged in user
  username: z
    .string({ message: 'Username must be string' })
    .min(1, 'Username is required'),
});

export type UpdateMeRequest = z.infer<typeof UpdateMeSchema>;

export const GetUserByRoleSchema = z.object({
  role: z.string({ message: 'Role must be string' }).min(1, 'Role is required'),
});

export type GetUserByRoleRequest = z.infer<typeof GetUserByRoleSchema>;
