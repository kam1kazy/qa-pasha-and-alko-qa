import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { initialColumns } from '@/components/dashboard/kanban/taskList';
import { KanbanColumn } from '@/types/kanban';

interface ColumnsState {
  columns: KanbanColumn[];
}

const initialState: ColumnsState = {
  columns: initialColumns,
};

const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    setColumns: (state, action: PayloadAction<KanbanColumn[]>) => {
      state.columns = action.payload;
    },
    addColumn: (state, action: PayloadAction<KanbanColumn>) => {
      state.columns.push(action.payload);
    },
    removeColumn: (state, action: PayloadAction<string>) => {
      state.columns = state.columns.filter((column) => column.id !== action.payload);
    },
    updateColumn: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<KanbanColumn> }>
    ) => {
      const { id, updates } = action.payload;
      const column = state.columns.find((col) => col.id === id);
      if (column) {
        Object.assign(column, updates);
      }
    },
  },
});

export const { setColumns, addColumn, removeColumn, updateColumn } = columnsSlice.actions;
export default columnsSlice.reducer;
