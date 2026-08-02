import { z } from 'zod';

export const RegisterAttendanceSchema = z.object({
  cardKey: z.string().min(1, 'Card key is required'),
  readerId: z.string().uuid('Reader ID must be UUID format'),
  dateTimeRead: z.number(),
});

export type RegisterAttendanceRequest = z.infer<typeof RegisterAttendanceSchema>;

export const DeleteAttendanceSchema = z.object({
  attendanceId: z.string().uuid('Attendance ID must be UUID format'),
});

export type DeleteAttendanceRequest = z.infer<typeof DeleteAttendanceSchema>;

export const GetAttendanceSchema = z.object({
  employeeId: z.string().uuid('Employee ID must be UUID format'),
  limit: z.number().min(50, 'Minimal limit is 50').max(200, 'Maximal limit is 200').optional(),
  offset: z.number().min(0, 'Minimal offest is 0').optional(),
  orderBy: z.string().optional(),
  sort: z.string().optional(),
});

export type GetAttendanceRequest = z.infer<typeof GetAttendanceSchema>;

export const GetMonthlyAttendanceForEmployeeSchema = z.object({
  employeeId: z.string().uuid('Employee ID must be UUID format'),
  year: z.string().regex(new RegExp(/^(?:\d{4})/), 'Invalid year format, must have four digits'),
  month: z
    .string()
    .regex(new RegExp(/^(?:0[1-9]|1[0-2])/), 'Invalid month format, must have two digits'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined))
    .pipe(z.number().min(50, 'Minimal limit is 50').max(200, 'Maximal limit is 200'))
    .optional(),

  offset: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined))
    .pipe(z.number().min(0, 'Minimal offset is 0'))
    .optional(),
  orderBy: z.string().optional(),
  sort: z.string().optional(),
});

export type GetMonthlyAttendanceForEmployeeRequest = z.infer<
  typeof GetMonthlyAttendanceForEmployeeSchema
>;

export const CalculateWorkHoursSchema = z.object({
  employeeId: z.string().uuid('Employee ID must be UUID format'),
  date: z
    .string()
    .min(10, 'Date it too short')
    .max(10, 'Date is too long')
    .regex(
      new RegExp(/^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/),
      'Invalid date format, expected: YYYY-MM-DD'
    ),
});

export type CalculateWorkHoursRequest = z.infer<typeof CalculateWorkHoursSchema>;

export const CalculateDaliyNormSchema = z.object({
  employeeId: z.string().uuid('Employee ID must be UUID format'),
  date: z
    .string()
    .min(10, 'Date it too short')
    .max(10, 'Date is too long')
    .regex(
      new RegExp(/^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/),
      'Invalid date format, expected: YYYY-MM-DD'
    ),
});

export type CalculateDailyNormRequest = z.infer<typeof CalculateDaliyNormSchema>;

export const GetMonthlyNormSchema = z.object({
  employeeId: z.string().uuid('Employee ID must be a string'),
  year: z.string().regex(new RegExp(/^(?:\d{4})/), 'Invalid year format, must have four digits'),
  month: z
    .string()
    .regex(new RegExp(/^(?:0[1-9]|1[0-2])/), 'Invalid month format, must have two digits'),
});

export type GetMonthlyNormRequest = z.infer<typeof GetMonthlyNormSchema>;

export const GetMonthlySummarySchema = z.object({
  employeeId: z.string().uuid('Employee ID must be string'),
  startDate: z
    .string()
    .min(10, 'Start date it too short')
    .max(10, 'Start Date is too long')
    .regex(
      new RegExp(/^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/),
      'Invalid start date format, expected: YYYY-MM-DD'
    ),
  endDate: z
    .string()
    .min(10, 'End date it too short')
    .max(10, 'End Date is too long')
    .regex(
      new RegExp(/^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/),
      'Invalid end date format, expected: YYYY-MM-DD'
    ),
});

export type GetMonthlySummaryRequest = z.infer<typeof GetMonthlySummarySchema>;

export const GenerateMonthlyReportSchema = z.object({
  employeeId: z.string().uuid('Employee ID must be a string'),
  year: z.string().regex(new RegExp(/^(?:\d{4})/), 'Invalid year format, must have four digits'),
  month: z
    .string()
    .regex(new RegExp(/^(?:0[1-9]|1[0-2])/), 'Invalid month format, must have two digits'),
});

export type GenerateMonthlyReportRequest = z.infer<typeof GenerateMonthlyReportSchema>;

export const GetAttendanceForDateSchema = z.object({
  date: z
    .string({ message: 'Date is required' })
    .min(10, 'Date it too short')
    .max(10, 'Date is too long')
    .regex(
      new RegExp(/^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/),
      'Invalid date format, expected: YYYY-MM-DD'
    ),
});

export type GetAttendanceForDateRequest = z.infer<typeof GetAttendanceForDateSchema>;
