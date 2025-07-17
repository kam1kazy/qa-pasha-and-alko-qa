import { IKanbanColumn } from '@/shared/types';

export const initialColumns: IKanbanColumn[] = [
  {
    id: 'todo',
    title: 'To do',
    columnId: 'todo',
  },
  {
    id: 'inprogress',
    title: 'In progress',
    columnId: 'inprogress',
  },
  {
    id: 'completed',
    title: 'Completed',
    columnId: 'completed',
  },
  {
    id: 'approved',
    title: 'Approved',
    columnId: 'approved',
  },
];
