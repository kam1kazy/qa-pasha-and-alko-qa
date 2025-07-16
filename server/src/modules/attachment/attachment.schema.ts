import { z } from 'zod';

export const createAttachmentSchema = z.object({
  fileUrl: z.string(),
  taskId: z.string(),
});

export const updateAttachmentSchema = z.object({
  fileUrl: z.string().optional(),
});
