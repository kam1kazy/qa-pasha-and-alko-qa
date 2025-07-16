import { z } from 'zod';

export const createKanbanColumnSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export const updateKanbanColumnSchema = z.object({
  title: z.string().optional(),
});
