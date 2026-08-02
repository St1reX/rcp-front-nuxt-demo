import { z } from "zod";

export const GetAllReadersSchema = z.object({
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

export type GetAllReadersRequest = z.infer<typeof GetAllReadersSchema>;

export const CreateCardReaderSchema = z.object({
  name: z.string().min(1, "Nazwa czytnika jest wymagana"),
  type: z.string().refine((type) => ["ENTRY", "EXIT", "BOTH"].includes(type), {
    message:
      "Typ czytnika musi być jedną z opcji: Wejściowy, Wyjściowy lub Obustronny",
  }),
  readerIp: z.string().ip("Adres IP czytnika musi być poprawny"),
});

export type CreateCardReaderRequest = z.infer<typeof CreateCardReaderSchema>;

export const GetCardReaderByIdSchema = z.object({
  readerId: z.string().uuid("Reader id must be UUID"),
});

export type GetCardReaderByIdRequest = z.infer<typeof GetCardReaderByIdSchema>;

export const UpdateCardReaderSchema = z.object({
  readerId: z
    .string({ message: "Reader ID is required" })
    .uuid("Reader ID must be UUID"),
  name: z.string().min(1, "Nazwa czytnika jest wymagana"),
  type: z.string().refine((type) => ["ENTRY", "EXIT", "BOTH"].includes(type), {
    message:
      "Typ czytnika musi być jedną z opcji: Wejściowy, Wyjściowy lub Obustronny",
  }),
  readerIp: z.string().ip("Adres IP czytnika musi być poprawny"),
});

export type UpdateCardReaderRequest = z.infer<typeof UpdateCardReaderSchema>;

export const DeleteCardReaderSchema = z.object({
  readerId: z.string().uuid("Card reader id must be UUID"),
});

export type DeleteCardReaderRequest = z.infer<typeof DeleteCardReaderSchema>;

export const RestartCardReaderSchema = z.object({
  readerIp: z.string().ip("Adres IP czytnika musi być poprawny"),
});

export type RestartCardReaderRequest = z.infer<typeof RestartCardReaderSchema>;
