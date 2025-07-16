import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';

import columnsReducer from '@/entities/column/model/column.slice';
import tasksReducer from '@/entities/task/models/task.slice';
import { userApi } from '@/entities/user/api/userApi';
import userSlice from '@/entities/user/models/user.slice';

const ListenerMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: {
    columns: columnsReducer,
    tasks: tasksReducer,
    user: userSlice,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(ListenerMiddleware.middleware)
      .concat(userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
