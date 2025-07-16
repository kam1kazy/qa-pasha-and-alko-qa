export interface CreateCommentDto {
  text: string;
  taskId: string;
  userId: string;
}

export interface UpdateCommentDto {
  text?: string;
}
