import { z } from "zod";
import { LeaveTypes } from "../../constants/leaveTypes";
import { LeaveStatuses } from "../../constants/leaveStatus";

export const RequestForLeaveSchema = z
  .object({
    employeeId: z
      .string({ message: "Employee id must be string" })
      .uuid("Employee id must be uuid"),
    startDate: z
      .string({ message: "Date must be string" })
      .min(10, "Start date it too short")
      .max(10, "Start Date is too long")
      .regex(
        new RegExp(/^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/),
        "Invalid start date format, expected: YYYY-MM-DD"
      ),
    endDate: z
      .string({ message: "Date must be string" })
      .min(10, "End date it too short")
      .max(10, "End date is too long")
      .regex(
        new RegExp(/^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/),
        "Invalid end date format, expected: YYYY-MM-DD"
      ),
    type: z.nativeEnum(LeaveTypes),
    reason: z.string({ message: "Reason must be string" }).optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    },
    {
      message: "Start date must be before end date",
      path: ["startDate"],
    }
  )
  .superRefine((data, ctx) => {
    if (data.type === LeaveTypes.BEREAVEMENT && !data.reason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Musisz podać powód jeśli wybranem typem urlopu jest okolicznościowy.",
        path: ["reason"],
      });
    }
  });

export type RequestForLeaveRequest = z.infer<typeof RequestForLeaveSchema>;

export const AddLeaveSchema = z
  .object({
    employeeId: z
      .string({ message: "Employee id must be string" })
      .uuid("Employee id must be uuid"),
    startDate: z
      .string({ message: "Date must be string" })
      .min(10, "Start date it too short")
      .max(10, "Start Date is too long")
      .regex(
        new RegExp(/^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/),
        "Invalid start date format, expected: YYYY-MM-DD"
      ),
    endDate: z
      .string({ message: "Date must be string" })
      .min(10, "End date it too short")
      .max(10, "End date is too long")
      .regex(
        new RegExp(/^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/),
        "Invalid end date format, expected: YYYY-MM-DD"
      ),
    type: z.nativeEnum(LeaveTypes),
    reason: z.string({ message: "Reason must be string" }).optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    },
    {
      message: "Start date must be before end date",
      path: ["startDate"],
    }
  )
  .superRefine((data, ctx) => {
    if (data.type === LeaveTypes.BEREAVEMENT && !data.reason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Reason is required when type is Urlop okolicznościowy",
        path: ["reason"],
      });
    }
  });

export type AddLeaveRequest = z.infer<typeof AddLeaveSchema>;

export const GetLeaveByIdSchema = z.object({
  leaveId: z
    .string({ message: "Leave ID is required" })
    .uuid("Leave ID must be UUID"),
});

export type GetLeaveByIdRequest = z.infer<typeof GetLeaveByIdSchema>;

export const DisapproveLeaveSchema = z.object({
  leaveId: z
    .string({ message: "Leave id must be string" })
    .uuid("Leave id must be UUID"),
});

export type DisapproveLeaveRequest = z.infer<typeof DisapproveLeaveSchema>;

export const ApproveLeaveSchema = z.object({
  leaveId: z
    .string({ message: "Leave id must be string" })
    .uuid("Leave id must be UUID"),
});

export type ApproveLeaveRequest = z.infer<typeof ApproveLeaveSchema>;

export const UpdateLeaveAdminSchema = z
  .object({
    leaveId: z
      .string({ message: "Leave id must be string" })
      .uuid("Leave id must be UUID"),
    startDate: z
      .string({ message: "Date must be string" })
      .min(10, "Start date it too short")
      .max(10, "Start Date is too long")
      .regex(
        new RegExp(/^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/),
        "Invalid start date format, expected: YYYY-MM-DD"
      ),
    endDate: z
      .string({ message: "Date must be string" })
      .min(10, "End date it too short")
      .max(10, "End date is too long")
      .regex(
        new RegExp(/^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/),
        "Invalid end date format, expected: YYYY-MM-DD"
      ),
    newType: z.nativeEnum(LeaveTypes),
    newReason: z.string({ message: "Reason must be string" }).optional(),
    newStatus: z.nativeEnum(LeaveStatuses),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    },
    {
      message: "Start date must be before end date",
      path: ["startDate"],
    }
  )
  .superRefine((data, ctx) => {
    if (data.newType === LeaveTypes.BEREAVEMENT && !data.newReason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "New reason is required when type is Urlop okolicznościowy",
        path: ["newReason"],
      });
    }
  });

export type UpdateLeaveAdminRequest = z.infer<typeof UpdateLeaveAdminSchema>;

export const GenerateLeaveRequestSchema = z.object({
  leaveId: z
    .string({ message: "Leave id must be string" })
    .uuid("Leave id must be UUID"),
});

export type GenerateLeaveRequestRequest = z.infer<
  typeof GenerateLeaveRequestSchema
>;

export const GenerateMonthlyReportOptimaSchema = z.object({
  year: z
    .string()
    .regex(
      new RegExp(/^(?:\d{4})/),
      "Invalid year format, must have four digits"
    ),
  month: z
    .string()
    .regex(
      new RegExp(/^(?:0[1-9]|1[0-2])/),
      "Invalid month format, must have two digits"
    ),
});

export type GenerateMonthlyReportOptimaRequest = z.infer<
  typeof GenerateMonthlyReportOptimaSchema
>;

export const GetAllLeavesSchema = z.object({
  limit: z
    .number()
    .min(50, "Minimal limit is 50")
    .max(200, "Maximal limit is 200")
    .optional(),
  offset: z.number().min(0, "Minimal offest is 0").optional(),
});

export type GetAllLeavesRequest = z.infer<typeof GetAllLeavesSchema>;

export const GetAllLeavesForMonth = z.object({
  month: z
    .string()
    .transform(Number)
    .pipe(
      z
        .number()
        .int("Month must be an integer")
        .min(1, "Month must be between 1 and 12")
        .max(12, "Month must be between 1 and 12")
    ),

  year: z
    .string()
    .transform(Number)
    .pipe(
      z
        .number()
        .int("Year must be an integer")
        .min(2000, "Year must be >= 2025")
        .max(2100, "Year must be <= 2100")
    ),
});

export type GetAllLeavesForMonthRequest = z.infer<typeof GetAllLeavesForMonth>;
