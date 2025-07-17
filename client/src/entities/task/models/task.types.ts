import { ColumnsTypes, KanbanDifficultyTypes } from '@/shared/types';

export interface ITask {
  id: string;
  title: string;
  description: string;
  columnId: ColumnsTypes;
  sprintId: string;
  progress?: number;
  difficulty?: KanbanDifficultyTypes;
  topics?: string[];
  commentsCount?: number;
  filesCount?: number;
  dueDate?: string;
  done?: boolean;
  subtasksCount?: number;
  subtasksDone?: number;
  createdAt?: string;
  updatedAt?: string;
}
