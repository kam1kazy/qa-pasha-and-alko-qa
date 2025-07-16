import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ITask } from '../models/task.types';

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    credentials: 'include', // Для отправки cookies
  }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query<ITask[], { sprintId?: string }>({
      query: ({ sprintId }) => ({
        url: '/tasks',
        params: sprintId ? { sprintId } : undefined,
      }),
      providesTags: ['Task'],
    }),
    getTaskById: builder.query<ITask, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: ['Task'],
    }),
    createTask: builder.mutation<ITask, Partial<ITask>>({
      query: (task) => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<ITask, Partial<ITask> & { id: string }>({
      query: ({ id, ...task }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
