'use client';

import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/store';
import { addTask } from '@/store/slices/tasksSlice';
import { KanbanColumn, Task } from '@/widgets/kanban/types/kanban';

export const useKanbanColumn = (column: KanbanColumn) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks[column.id] || []);

  const onAddTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: 'New Task',
      description: 'Описание задачи',
      columnId: Number(column.id),
    };
    dispatch(addTask({ columnId: column.id, task: newTask }));
  };

  return { tasks, onAddTask };
};
