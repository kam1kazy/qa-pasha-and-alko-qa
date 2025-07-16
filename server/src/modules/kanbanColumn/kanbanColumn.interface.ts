export interface CreateKanbanColumnDto {
  id: string; // В schema.prisma id задаётся явно
  title: string;
}

export interface UpdateKanbanColumnDto {
  title?: string;
}
