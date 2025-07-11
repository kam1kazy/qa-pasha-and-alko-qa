import type { IKanbanColumn } from '@/entities/task/models/task.types';

export const initialColumns: IKanbanColumn[] = [
  {
    id: 'todo',
    title: 'To do',
  },
  {
    id: 'inprogress',
    title: 'In progress',
  },
  {
    id: 'completed',
    title: 'Completed',
  },
];
