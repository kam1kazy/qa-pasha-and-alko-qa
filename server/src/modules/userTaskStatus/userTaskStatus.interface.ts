export interface CreateUserTaskStatusDto {
  userId: string;
  taskId: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | `APPROVED`;
}

export interface UpdateUserTaskStatusDto {
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE' | `APPROVED`;
}
