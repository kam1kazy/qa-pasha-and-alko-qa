import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const envSchema = z.object({
  PORT: z.string().default('4000'),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_AUDIENCE: z.string(),
  DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
