import { z } from "zod";

export const registerFormSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});


export type RegisterForm = z.infer<typeof registerFormSchema>;
export type LoginForm = z.infer<typeof loginFormSchema>;
