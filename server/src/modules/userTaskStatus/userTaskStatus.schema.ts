import { z } from 'zod';

export const createUserTaskStatusSchema = z.object({
  userId: z.string(),
  taskId: z.string(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', `APPROVED`]),
});

export const updateUserTaskStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', `APPROVED`]).optional(),
});
