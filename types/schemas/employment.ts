import { z } from "zod";

export const CreateEmploymentTypeSchema = z.object({
  name: z.string().min(1, "Employment type name is required"),
  workingHours: z
    .number({ message: "Working hours must a nuber" })
    .min(1, "Minimalna liczba godzin etatu to 1")
    .max(24, "Maksymalna liczba godzin etatu to 24"),
  breakTimeMinutes: z
    .number({
      message: "Break time minutes must be a number",
    })
    .min(0, "Minimalna liczba minut przerwy to 0")
    .max(1440, "Maksymalna liczba minut przerwy to 1440 (24h)"),
});

export type CreateEmploymentTypeRequest = z.infer<
  typeof CreateEmploymentTypeSchema
>;

export const DeleteEmploymentTypeSchema = z.object({
  employmentId: z.string().uuid("Employment type id must be UUID"),
});

export type DeleteEmploymentTypeRequest = z.infer<
  typeof DeleteEmploymentTypeSchema
>;

export const AssignEmploymentSchema = z.object({
  employeeId: z
    .string({ message: "Employee ID is required" })
    .uuid("Employee ID must be UUID"),
  employmentTypeId: z
    .string({ message: "Employment type ID is required" })
    .uuid("Employment type ID must be UUID"),
  startDate: z
    .string({ message: "Start date is required" })
    .min(10, "Date it too short")
    .max(10, "Date is too long")
    .regex(
      new RegExp(/^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/),
      "Invalid date format, expected: YYYY-MM-DD"
    ),
  endDate: z.union([
    z
      .string()
      .regex(
        /^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/,
        "Invalid date format, expected: YYYY-MM-DD"
      ),
    z.literal(null),
  ]),
});

export type AssignEmploymentRequest = z.infer<typeof AssignEmploymentSchema>;

export const UnassignEmploymentSchema = z.object({
  employeeId: z
    .string({ message: "Employee ID is required" })
    .uuid("Employee ID must be UUID"),
  employmentTypeId: z
    .string({ message: "Employment type ID is required" })
    .uuid("Employment type ID must be UUID"),
});

export type UnassignEmploymentRequest = z.infer<
  typeof UnassignEmploymentSchema
>;

export const GetAllEmploymentTypesSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined))
    .pipe(
      z.number().min(50, "Minimal limit is 50").max(200, "Maximal limit is 200")
    )
    .optional(),

  offset: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined))
    .pipe(z.number().min(0, "Minimal offset is 0"))
    .optional(),
  orderBy: z.string().optional(),
  sort: z.string().optional(),
});

export type GetAllEmploymentTypesRequest = z.infer<
  typeof GetAllEmploymentTypesSchema
>;

export const GetEmploymentTypeByIdSchema = z.object({
  employmentTypeId: z
    .string({ message: "Employment type ID is required" })
    .uuid("Employment type ID is required"),
});

export type GetEmploymentTypeByIdRequest = z.infer<
  typeof GetEmploymentTypeByIdSchema
>;

export const GetEmployeeEmploymentSchema = z.object({
  employeeId: z.string().uuid("EmployeeId must be UUID"),
});

export type GetEmployeeEmploymentRequest = z.infer<
  typeof GetEmployeeEmploymentSchema
>;

export const SetPreferredWorkingHoursSchema = z.object({
  employeeId: z.string().uuid("EmployeeId must be UUID"),
  startTime: z
    .string()
    .min(5, "Start time is too short")
    .max(5, "Start time is too long")
    .regex(
      new RegExp(/^(?:\d{2}):(?:\d{2})/),
      "Invalid start time format, expexted: HH:mm (24hour clock)"
    ),
  startDate: z
    .string({ message: "Start date is required" })
    .min(10, "Date it too short")
    .max(10, "Date is too long")
    .regex(
      new RegExp(/^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/),
      "Invalid date format, expected: YYYY-MM-DD"
    ),
  endDate: z.union([
    z
      .string()
      .regex(
        /^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/,
        "Invalid date format, expected: YYYY-MM-DD"
      ),
    z.literal(null),
  ]),
});

export type SetPreferredWorkingHoursRequest = z.infer<
  typeof SetPreferredWorkingHoursSchema
>;

export const GetPreferredWorkingHoursSchema = z.object({
  employeeId: z.string().uuid("EmployeeId must be UUID"),
});

export type GetPreferredWorkingHoursRequest = z.infer<
  typeof GetPreferredWorkingHoursSchema
>;
