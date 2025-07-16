import { z } from 'zod';

export const createSprintSchema = z.object({
  title: z.string(),
});

export const updateSprintSchema = z.object({
  title: z.string().optional(),
});
