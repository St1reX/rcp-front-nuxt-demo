import { z } from 'zod';

export const GetAllEmployeesSchema = z.object({
  limit: z
    .number()
    .min(50, 'Minimal limit is 50')
    .max(200, 'Maximal limit is 200')
    .optional(),
  offset: z.number().min(0, 'Minimal offest is 0').optional(),
  orderBy: z.string().optional(),
  sort: z.string().optional(),
});

export type GetAllEmployeesRequest = z.infer<typeof GetAllEmployeesSchema>;

export const GetEmployeesByDepartmentSchema = z.object({
  departmentId: z.string().uuid('Department ID must be UUID'),
});

export type GetEmployeesByDepartmentRequest = z.infer<
  typeof GetEmployeesByDepartmentSchema
>;

export const GetOneEmployeeSchema = z.object({
  id: z.string().uuid('Employee ID must be UUID'),
});

export type GetOneEmployeeRequest = z.infer<typeof GetOneEmployeeSchema>;

export const CreateEmployeeSchema = z.object({
  firstName: z
    .string({ message: 'Imię jest wymagane' })
    .min(2, 'Imię musi zawierać conajmniej dwa znaki'),
  middleName: z.string().nullable(),
  lastName: z
    .string({ message: 'Nazwisko jest wymagane' })
    .min(2, 'Nazwisko musi zawierać conajmniej dwa znaki'),
  departmentId: z
    .string({ message: 'Departament jest wymagany' })
    .uuid('Department musi posiadać poprawne ID i być wybrany z dostępnej puli'),
});

export type CreateEmployeeRequest = z.infer<typeof CreateEmployeeSchema>;

export const UpdateEmployeeSchema = z.object({
  employeeId: z
    .string({ message: 'Employee ID is required' })
    .uuid('Employee ID must be UUID'),
  firstName: z.string().min(2, 'Firts name is required'),
  middleName: z.string().nullable(),
  lastName: z.string().min(2, 'Last name is required'),
  departmentId: z
    .string({ message: 'Departament jest wymagany' })
    .uuid('Department musi posiadać poprawne ID i być wybrany z dostępnej puli'),
});

export type UpdateEmployeeRequest = z.infer<typeof UpdateEmployeeSchema>;

export const DeleteEmployeeSchema = z.object({
  id: z.string().uuid('Employee ID must be UUID'),
});

export type DeleteEmployeeRequest = z.infer<typeof DeleteEmployeeSchema>;
