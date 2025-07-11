'use client';

import { useState } from 'react';

import { ITask } from '@/entities/task/models/task.types';

export const useTaskCard = (_task: ITask) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const onClick = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return { onClick, isModalOpen, closeModal };
};
