import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const LoginSchema = RegisterSchema;
