import { z } from "zod";

export const AddHolidaySchema = z.object({
  name: z.string({ message: "Holiday name is required" }),
  date: z
    .string({ message: "Date is required" })
    .min(10, "Date it too short")
    .max(10, "Date is too long")
    .regex(
      new RegExp(/^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/),
      "Invalid date format, expected: YYYY-MM-DD"
    ),
  isFixed: z.boolean(),
});

export type AddHolidayRequest = z.infer<typeof AddHolidaySchema>;

export const GetHolidaysSchema = z.object({
  year: z
    .number({ message: "Year must be a number" })
    .int("Year must be integer"),
});

export type GetHolidaysRequest = z.infer<typeof GetHolidaysSchema>;

export const DeleteHolidaySchema = z.object({
  id: z
    .string({ message: "Holiday id must be string" })
    .uuid("Holiday id must be UUID"),
});

export type DeleteHolidayRequest = z.infer<typeof DeleteHolidaySchema>;
