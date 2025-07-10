import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IKanbanColumn } from '@/entities/task/models/task.types';
import { initialColumns } from '@/features/kanban-tasks-list/config/taskList.mockData';

interface ColumnsState {
  columns: IKanbanColumn[];
}

const initialState: ColumnsState = {
  columns: initialColumns,
};

const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    setColumns: (state, action: PayloadAction<IKanbanColumn[]>) => {
      state.columns = action.payload;
    },
    addColumn: (state, action: PayloadAction<IKanbanColumn>) => {
      state.columns.push(action.payload);
    },
    removeColumn: (state, action: PayloadAction<string>) => {
      state.columns = state.columns.filter(
        (column) => column.id !== action.payload
      );
    },
    updateColumn: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<IKanbanColumn> }>
    ) => {
      const { id, updates } = action.payload;
      const column = state.columns.find((col) => col.id === id);
      if (column) {
        Object.assign(column, updates);
      }
    },
  },
});

export const { setColumns, addColumn, removeColumn, updateColumn } =
  columnsSlice.actions;
export default columnsSlice.reducer;
