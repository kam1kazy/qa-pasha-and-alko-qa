export type KanbanDifficulty = 'easy' | 'medium' | 'hard';

export interface ITask {
  id: string;
  title: string;
  description: string;
  columnId: number;
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
  id: string;
  title: string;
  tasks: ITask[];
  doneCount?: number;
}
