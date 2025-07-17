import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { initialColumns } from '@/features/kanban-column/config/columnsList.mockData';
import { IKanbanColumn } from '@/shared/types';

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
  },
});

export const { setColumns, addColumn, removeColumn } = columnsSlice.actions;
export default columnsSlice.reducer;
