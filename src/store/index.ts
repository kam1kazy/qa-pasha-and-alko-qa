import { configureStore } from '@reduxjs/toolkit';

import columnsReducer from './slices/columnsSlice';
import tasksReducer from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    columns: columnsReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
