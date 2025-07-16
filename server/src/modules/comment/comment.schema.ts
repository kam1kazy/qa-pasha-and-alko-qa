import { z } from 'zod';

export const createCommentSchema = z.object({
  text: z.string(),
  taskId: z.string(),
  userId: z.string(),
});

export const updateCommentSchema = z.object({
  text: z.string().optional(),
});
