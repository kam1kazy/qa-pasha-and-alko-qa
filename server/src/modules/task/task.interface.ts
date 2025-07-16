export interface CreateTaskDto {
  title: string;
  description: string;
  columnId: string;
  sprintId: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topics?: string[];
  dueDate?: string;
  subtasksCount?: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  columnId?: string;
  sprintId?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  topics?: string[];
  dueDate?: string;
  done?: boolean;
  subtasksCount?: number;
  subtasksDone?: number;
  progress?: number;
}
