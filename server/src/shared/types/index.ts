// User
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  comments: Comment[];
  taskStatuses: UserTaskStatus[];
  activeSprints: UserActiveSprint[];
  createdAt: string; // Date в ISO-строке
  updatedAt: string;
  changePassword: string;
}

// Sprint
export interface Sprint {
  id: string;
  title: string;
  tasks: Task[];
  activeUsers: UserActiveSprint[];
  createdAt: string;
  updatedAt: string;
}

// UserActiveSprint
export interface UserActiveSprint {
  id: string;
  user: User;
  sprint: Sprint;
  userId: string;
  sprintId: string;
}

// Task
export interface Task {
  id: string;
  title: string;
  description: string;
  column: KanbanColumn;
  columnId: string;
  sprint: Sprint;
  sprintId: string;
  progress: number;
  difficulty: KanbanDifficulty;
  topics: string[];
  dueDate?: string;
  done: boolean;
  subtasksCount?: number;
  subtasksDone?: number;
  attachments: Attachment[];
  comments: Comment[];
  taskStatuses: UserTaskStatus[];
  createdAt: string;
  updatedAt: string;
}

// KanbanColumn
export interface KanbanColumn {
  id: string;
  title: string;
  tasks: Task[];
}

// Attachment
export interface Attachment {
  id: string;
  fileUrl: string;
  task: Task;
  taskId: string;
}

// Comment
export interface Comment {
  id: string;
  text: string;
  task: Task;
  taskId: string;
  user: User;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// UserTaskStatus
export interface UserTaskStatus {
  id: string;
  user: User;
  task: Task;
  userId: string;
  taskId: string;
  status: TaskStatus;
}

// Перечисления
export type KanbanDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | `APPROVED`;
