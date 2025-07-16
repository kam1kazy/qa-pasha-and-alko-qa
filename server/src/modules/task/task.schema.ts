import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  columnId: z.string(),
  sprintId: z.string(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  topics: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
  subtasksCount: z.number().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  columnId: z.string().optional(),
  sprintId: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  topics: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
  done: z.boolean().optional(),
  subtasksCount: z.number().optional(),
  subtasksDone: z.number().optional(),
  progress: z.number().optional(),
});
