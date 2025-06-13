export type KanbanDifficulty = 'easy' | 'medium' | 'hard';

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
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

export interface KanbanColumn {
  id: string;
  title: string;
  tasks: Task[];
  doneCount?: number;
}
