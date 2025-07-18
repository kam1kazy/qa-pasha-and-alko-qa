'use client';

import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import { addTask } from '@/entities/task/models/task.slice';
import { ITask } from '@/entities/task/models/task.types';
import { RootState } from '@/shared/lib/redux/store';
import { IKanbanColumn } from '@/shared/types';

export const useKanbanColumn = (column: IKanbanColumn) => {
  const dispatch = useDispatch();
  const selectTasksByColumn = (columnId: string) =>
    createSelector(
      (state: RootState) => state.tasks.tasks,
      (tasks) => tasks[columnId] || undefined
    );

  const tasks = useSelector(selectTasksByColumn(column.id));

  const onAddTask = () => {
    const newTask: ITask = {
      id: Date.now().toString(),
      title: 'New Task',
      description: 'Описание задачи',

      //TODO: Это тупая фигня, зесь должна 100 проц ставится колонка todo (первая)
      //TODO: По сути, кнопка добавить задачу должна быть вне колонок
      columnId: column.id,
    };
    dispatch(addTask({ columnId: column.id, task: newTask }));
  };

  return { tasks, onAddTask };
};
