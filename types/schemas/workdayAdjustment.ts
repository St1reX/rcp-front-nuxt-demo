import { z } from 'zod';

export const GetAllAdjustmentsSchema = z.object({
  limit: z
    .number()
    .min(50, 'Minimal limit is 50')
    .max(200, 'Maximal limit is 200')
    .optional(),
  offset: z.number().min(0, 'Minimal offest is 0').optional(),
  orderBy: z.string().optional(),
  sort: z.string().optional(),
});

export type GetAllAdjusmentsRequest = z.infer<typeof GetAllAdjustmentsSchema>;

export const GetAdjustmentsByMonthSchema = z.object({
  year: z.number({ message: 'Year must be number' }),
  month: z
    .number({ message: 'Month must be number' })
    .min(1, 'Month must be greater or equal 1')
    .max(12, 'Month must be less or equal 12'),
});

export type GetAdjustmentsByMonthRequest = z.infer<
  typeof GetAdjustmentsByMonthSchema
>;

export const GetAdjustmentByIdSchema = z.object({
  adjustmentId: z
    .string({ message: 'Adjustment ID is required' })
    .uuid('Adjustment ID must be UUID'),
});

export type GetAdjustmentByIdRequest = z.infer<typeof GetAdjustmentByIdSchema>;

export const CreateAdjustmentSchema = z.object({
  date: z
    .string({ message: 'Data jest wymagana' })
    .min(10, 'Data jest za krótka')
    .max(10, 'Data jest za długa')
    .regex(
      new RegExp(/^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/),
      'Nieprawidłowy format daty, format: YYYY-MM-DD'
    ),
  type: z
    .string({ message: 'Typ jest wymagany' })
    .refine((type) => type === 'EARLY_END' || 'LATE_START', {
      message: "Nieprawidłowy typ, możliwe: 'EARLY_END' lub 'LATE_START'",
    }),
  time: z
    .string({ message: 'Czas jest wymagany' })
    .min(5, 'Czas musi zawierać 5 znaków')
    .max(5, 'Czas musi zawierać 5 znaków')
    .regex(
      new RegExp(/^(?:\d{2}):(?:\d{2})/),
      'Nieprawidłowy format czasu, format: HH:mm (zegar 24 godziny)'
    ),
  reason: z.string().optional(),
});

export type CreateAdjustmentRequest = z.infer<typeof CreateAdjustmentSchema>;

export const DeleteAdjustmentSchema = z.object({
  id: z.string({ message: 'Id must be string' }).uuid('Id must be uuid'),
});

export type DeleteAdjustmentRequest = z.infer<typeof DeleteAdjustmentSchema>;
