import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Email not valid'),
  password: z
    .string()
    .min(8, 'Password is too short')
    .max(40, 'Password is too long'),
}); // Login shouldn't be validated to not give a potential hacker a clue which way to go

export type LoginRequest = z.infer<typeof LoginSchema>;

export const ChangePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password is too short')
    .max(40, 'Password is too long')
    .refine((password) => /[A-Z]/.test(password), {
      message: 'Password must contain at least one uppercase letter',
    })
    .refine((password) => /[a-z]/.test(password), {
      message: 'Password must contain at least one lowercase letter',
    })
    .refine((password) => /[0-9]/.test(password), {
      message: 'Password must contain at least one digit',
    })
    .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
      message: 'Password must contain at least one special character (!@#$%^&*())',
    }),
  oldPassword: z
    .string()
    .min(8, 'Old password is too short')
    .max(40, 'Old password is too long'),
  reOldPassword: z
    .string()
    .min(8, 'Repeated old password is too short')
    .max(40, 'Repeated old password is too long'),
});

export type ChangePasswordRequest = z.infer<typeof ChangePasswordSchema>;

export const RequestPasswordResetSchema = z.object({
  email: z.string({ message: 'Email must be string' }).email('Invalid email format'),
});

export type RequestPasswordResetRequest = z.infer<typeof RequestPasswordResetSchema>;

export const ResetPasswordSchema = z
  .object({
    token: z.string({ message: 'Brak tokenu' }),
    newPassword: z
      .string()
      .min(8, 'Hasło jest za krótkie')
      .max(40, 'Hasło jest za długie')
      .refine((password) => /[A-Z]/.test(password), {
        message: 'Hasło musi zawierać conajmniej jedną dużą literę',
      })
      .refine((password) => /[a-z]/.test(password), {
        message: 'Hasło musi zawierać conajmniej jedną małą literę',
      })
      .refine((password) => /[0-9]/.test(password), {
        message: 'Hasło musi zawierać conajmniej jedną cyfrę',
      })
      .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
        message: 'Hasło musi zawierać conajmniej jeden znak specjalny (!@#$%^&*())',
      }),
    reNewPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.reNewPassword) {
      ctx.addIssue({
        path: ['reNewPassword'],
        code: 'custom',
        message: 'Podane hasła nie są takie same',
      });
    }
  });

export type ResetPasswordRequest = z.infer<typeof ResetPasswordSchema>;

export const CreateInviteSchema = z.object({
  email: z.string().email('Invalid email'),
  roleId: z.string().uuid('Role ID must be UUID'),
});

export type CreateInviteRequest = z.infer<typeof CreateInviteSchema>;

export const ResendInviteSchema = z.object({
  id: z.string().uuid('ID musi być typu UUID'),
});

export type ResendInviteRequest = z.infer<typeof ResendInviteSchema>;

export const AcceptInviteSchema = z
  .object({
    token: z.string({ message: 'Token jest wymagany' }),
    username: z.string({ message: 'Nazwa użytkownika jest wymagana' }),
    password: z
      .string()
      .min(8, 'Hasło jest za krótkie')
      .max(40, 'Hasło jest za długie')
      .refine((password) => /[A-Z]/.test(password), {
        message: 'Hasło musi zawierać dużą literę',
      })
      .refine((password) => /[a-z]/.test(password), {
        message: 'Hasło musi zawierać małą literę',
      })
      .refine((password) => /[0-9]/.test(password), {
        message: 'Hasło musi zawierać cyfrę',
      })
      .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
        message: 'Hasło musi zawierać znak specjalny (!@#$%^&*())',
      }),
    rePassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.rePassword) {
      ctx.addIssue({
        path: ['reNewPassword'],
        code: 'custom',
        message: 'Hasła się nie zgadzają',
      });
    }
  });

export type AcceptInviteRequest = z.infer<typeof AcceptInviteSchema>;

export const GetInviteByIdSchema = z.object({
  id: z.string().uuid('ID must be UUID'),
});

export type GetInviteByIdRequest = z.infer<typeof GetInviteByIdSchema>;

export const RemoveInviteSchema = z.object({
  id: z.string().uuid('ID must be UUID'),
});

export type RemoveIntiveRequest = z.infer<typeof RemoveInviteSchema>;
