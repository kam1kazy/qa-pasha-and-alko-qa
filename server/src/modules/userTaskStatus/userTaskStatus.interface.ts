export interface CreateUserTaskStatusDto {
  userId: string;
  taskId: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export interface UpdateUserTaskStatusDto {
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
}
