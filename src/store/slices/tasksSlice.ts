import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { initialColumns } from '@/widgets/kanban/config/taskList.mockData';
import { Task } from '@/widgets/kanban/types/kanban';

interface TasksState {
  tasks: Record<string, Task[]>;
}

const initialState: TasksState = {
  tasks: initialColumns.reduce(
    (acc, column) => ({
      ...acc,
      [column.id]: column.tasks || [],
    }),
    {}
  ),
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<{ columnId: string; tasks: Task[] }>) => {
      const { columnId, tasks } = action.payload;
      state.tasks[columnId] = tasks;
    },
    addTask: (state, action: PayloadAction<{ columnId: string; task: Task }>) => {
      const { columnId, task } = action.payload;
      if (!state.tasks[columnId]) {
        state.tasks[columnId] = [];
      }
      state.tasks[columnId].push(task);
    },
    removeTask: (state, action: PayloadAction<{ columnId: string; taskId: string }>) => {
      const { columnId, taskId } = action.payload;
      if (state.tasks[columnId]) {
        state.tasks[columnId] = state.tasks[columnId].filter((task) => task.id !== taskId);
      }
    },
    updateTask: (
      state,
      action: PayloadAction<{ columnId: string; taskId: string; updates: Partial<Task> }>
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
        destinationColumnId: string;
        taskId: string;
        newIndex: number;
      }>
    ) => {
      const { sourceColumnId, destinationColumnId, taskId, newIndex } = action.payload;

      // Находим задачу в исходной колонке
      const sourceColumn = state.tasks[sourceColumnId];
      if (!sourceColumn) {
        return;
      }

      const taskIndex = sourceColumn.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) {
        return;
      }

      // Удаляем задачу из исходной колонки
      const [task] = sourceColumn.splice(taskIndex, 1);

      // Добавляем задачу в целевую колонку
      if (!state.tasks[destinationColumnId]) {
        state.tasks[destinationColumnId] = [];
      }
      state.tasks[destinationColumnId].splice(newIndex, 0, task);
    },
  },
});

export const { setTasks, addTask, removeTask, updateTask, moveTask } = tasksSlice.actions;
export default tasksSlice.reducer;
