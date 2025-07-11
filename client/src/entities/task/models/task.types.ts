export type KanbanDifficulty = 'easy' | 'medium' | 'hard';

export type columnsTypes = 'todo' | 'inprogress' | 'completed';

export interface ITask {
  id: string;
  title: string;
  description: string;
  columnId: columnsTypes;
  progress?: number; // 0-100
  difficulty?: KanbanDifficulty;
  topics?: string[];
  commentsCount?: number;
  filesCount?: number;
  dueDate?: string; // ISO string, если нужно
  done?: boolean;
  subtasksCount?: number;
  subtasksDone?: number;
}

export interface IKanbanColumn {
  id: columnsTypes;
  title: string;
}
