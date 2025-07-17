'use client';

import { useDispatch, useSelector } from 'react-redux';

import { addTask } from '@/entities/task/models/task.slice';
import { ITask } from '@/entities/task/models/task.types';
import { RootState } from '@/shared/lib/redux/store';
import { IKanbanColumn } from '@/shared/types';

export const useKanbanColumn = (column: IKanbanColumn) => {
  const dispatch = useDispatch();
  const tasks = useSelector(
    (state: RootState) => state.tasks.tasks[column.id] || []
  );

  const onAddTask = () => {
    const newTask: ITask = {
      id: Date.now().toString(),
      title: 'New Task',
      description: 'Описание задачи',
      //TODO: наследовать спринт
      sprintId: 'todo',
      columnId: 'todo',
    };
    dispatch(addTask({ columnId: column.id, task: newTask }));
  };

  return { tasks, onAddTask };
};
