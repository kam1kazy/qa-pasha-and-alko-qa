'use client';

import { useState } from 'react';

import { Task } from '@/widgets/kanban/types/kanban';

export const useTaskCard = (_task: Task) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const onClick = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return { onClick, isModalOpen, closeModal };
};
