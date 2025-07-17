import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const envSchema = z.object({
  PORT: z.string().default('4000'),
  JWT_SECRET: z.string(),
  JWT_ALGORITHM: z.enum(['HS256', 'RS256']).default('HS256'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  JWT_AUDIENCE: z.string(),
  DATABASE_URL: z.string(),
  COOKIE_SECRET: z.string().default('your-cookie-secret'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'), // 15 минут
  RATE_LIMIT_MAX_ATTEMPTS: z.string().default('5'),
  RATE_LIMIT_BLOCK_DURATION_MS: z.string().default('1800000'), // 30 минут
});

export const env = envSchema.parse(process.env);
