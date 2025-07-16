export type KanbanDifficultyTypes = 'easy' | 'medium' | 'hard';

export type ColumnsTypes = 'todo' | 'inprogress' | 'completed';

export interface Course {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sprint {
  id: string;
  title: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
}

export interface UserActiveSprint {
  id: string;
  userId: string;
  sprintId: string;
}

export interface UserTaskStatus {
  id: string;
  userId: string;
  taskId: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}
