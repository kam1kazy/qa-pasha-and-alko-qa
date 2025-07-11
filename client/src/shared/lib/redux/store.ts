import { configureStore } from '@reduxjs/toolkit';

import columnsReducer from '@/entities/column/model/column.slice';
import tasksReducer from '@/entities/task/models/task.slice';

export const store = configureStore({
  reducer: {
    columns: columnsReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
