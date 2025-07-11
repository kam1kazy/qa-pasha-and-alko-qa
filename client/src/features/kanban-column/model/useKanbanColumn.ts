'use client';

import { useDispatch, useSelector } from 'react-redux';

import { addTask } from '@/entities/task/models/task.slice';
import { IKanbanColumn, ITask } from '@/entities/task/models/task.types';
import { RootState } from '@/shared/lib/redux/store';

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

      //TODO: Это тупая фигня, зесь должна 100 проц ставится колонка todo (первая)
      //TODO: По сути, кнопка добавить задачу должна быть вне колонок
      columnId: column.id,
    };
    dispatch(addTask({ columnId: column.id, task: newTask }));
  };

  return { tasks, onAddTask };
};
