import { z } from 'zod';

export const createUserActiveSprintSchema = z.object({
  userId: z.string(),
  sprintId: z.string(),
});

export const updateUserActiveSprintSchema = z.object({
  userId: z.string().optional(),
  sprintId: z.string().optional(),
});
