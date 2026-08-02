import { z } from "zod";

export const GetAllCardsSchema = z.object({
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

export type GetAllCardsRequest = z.infer<typeof GetAllCardsSchema>;

export const GetCardByIdSchema = z.object({
  cardId: z.string().uuid("Card id must be UUID"),
});

export type GetCardByIdRequest = z.infer<typeof GetCardByIdSchema>;

export const AssignCardSchema = z.object({
  employeeId: z.string().uuid("Employee ID must be UUID"),
  cardKey: z.string(),
});

export type AssignCardRequest = z.infer<typeof AssignCardSchema>;

export const GetEmployeeCardsSchema = z.object({
  employeeId: z.string().uuid("Employee ID must be UUID"),
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

export type GetEmployeeCardsRequest = z.infer<typeof GetEmployeeCardsSchema>;

export const DeleteCardSchema = z.object({
  cardId: z.string().uuid("Card ID must be UUID"),
});

export type DeleteCardRequest = z.infer<typeof DeleteCardSchema>;
