import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { ITask } from '@/entities/task/models/task.types';
import { initialTasks } from '@/features/kanban-tasks-list/config/taskList.mockData';
import type { ColumnsTypes } from '@/shared/types';

interface TasksState {
  tasks: Record<string, ITask[]>;
}

const initialState: TasksState = {
  tasks: initialTasks.reduce(
    (acc, task) => {
      if (!acc[task.columnId]) {
        acc[task.columnId] = [];
      }
      acc[task.columnId].push(task);
      return acc;
    },
    {} as Record<string, ITask[]>
  ),
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (
      state,
      action: PayloadAction<{ columnId: string; tasks: ITask[] }>
    ) => {
      const { columnId, tasks } = action.payload;
      state.tasks[columnId] = tasks;
    },
    addTask: (
      state,
      action: PayloadAction<{ columnId: string; task: ITask }>
    ) => {
      const { columnId, task } = action.payload;
      if (!state.tasks[columnId]) {
        state.tasks[columnId] = [];
      }
      state.tasks[columnId].push(task);
    },
    removeTask: (
      state,
      action: PayloadAction<{ columnId: string; taskId: string }>
    ) => {
      const { columnId, taskId } = action.payload;
      if (state.tasks[columnId]) {
        state.tasks[columnId] = state.tasks[columnId].filter(
          (task) => task.id !== taskId
        );
      }
    },
    updateTask: (
      state,
      action: PayloadAction<{
        columnId: string;
        taskId: string;
        updates: Partial<ITask>;
      }>
    ) => {
      const { columnId, taskId, updates } = action.payload;
      if (state.tasks[columnId]) {
        const task = state.tasks[columnId].find((t) => t.id === taskId);
        if (task) {
          Object.assign(task, updates);
        }
      }
    },
    moveTask: (
      state,
      action: PayloadAction<{
        sourceColumnId: string;
        destinationColumnId: ColumnsTypes;
        taskId: string;
        newIndex: number;
      }>
    ) => {
      const { sourceColumnId, destinationColumnId, taskId, newIndex } =
        action.payload;

      // Находим задачу в исходной колонке
      const sourceColumn = state.tasks[sourceColumnId];
      if (!sourceColumn) {
        console.error('sourceColumn not found');
        return;
      }

      const taskIndex = sourceColumn.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) {
        console.error('task not found in sourceColumn');
        return;
      }

      // Удаляем задачу из исходной колонки
      const [task] = sourceColumn.splice(taskIndex, 1);

      // Обновляем columnId
      task.columnId = destinationColumnId;

      // Добавляем задачу в целевую колонку
      if (!state.tasks[destinationColumnId]) {
        console.error(`сolumn ${destinationColumnId} not found`);
        state.tasks[destinationColumnId] = [];
      }
      state.tasks[destinationColumnId].splice(newIndex, 0, task);
    },
  },
});

export const { setTasks, addTask, removeTask, updateTask, moveTask } =
  tasksSlice.actions;
export default tasksSlice.reducer;
