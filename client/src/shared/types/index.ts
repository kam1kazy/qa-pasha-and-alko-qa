export type KanbanDifficultyTypes = 'easy' | 'medium' | 'hard';

export type ColumnsTypes = 'todo' | 'inprogress' | 'completed' | `approved`;

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

export interface IKanbanColumn {
  id: string;
  title: string;
  columnId: ColumnsTypes;
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
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | `APPROVED`;
}
