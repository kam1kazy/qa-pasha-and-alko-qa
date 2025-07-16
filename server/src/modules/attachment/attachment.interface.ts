export interface CreateAttachmentDto {
  fileUrl: string;
  taskId: string;
}

export interface UpdateAttachmentDto {
  fileUrl?: string;
}
