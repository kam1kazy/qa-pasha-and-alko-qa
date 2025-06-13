'use client';

import { useState } from 'react';

import { Task } from '@/types/kanban';

export const useKanbanTaskCard = (_task: KanbanTask) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const onClick = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return { onClick, isModalOpen, closeModal };
};
