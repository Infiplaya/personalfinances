import { z } from 'zod';

export const registerFormSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const newProfileFormSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: 'Profile name must be atleast 4 char long.',
    })
    .max(60, {
      message: 'Profile name must be atmost 256 character long.',
    }),
  currencyCode: z.string().length(3),
});

export type RegisterForm = z.infer<typeof registerFormSchema>;
export type LoginForm = z.infer<typeof loginFormSchema>;
export type NewProfileForm = z.infer<typeof newProfileFormSchema>;
