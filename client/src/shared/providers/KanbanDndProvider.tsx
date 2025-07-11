import { closestCenter, DndContext } from '@dnd-kit/core';
import { useEffect, useState } from 'react';

import { IKanbanColumn } from '@/entities/task/models/task.types';
import { useDragEnd } from '@/features/kanban-board/model/useDragEnd';

interface KanbanColumnsListProps {
  children: React.ReactNode;
  columns: IKanbanColumn[];
}

// TODO: блоки в провайдере быть не должны
const style = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.05)',
  zIndex: 9999,
  pointerEvents: 'all',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 32,
  color: '#4f8cff',
};

export const KanbanDndProvider: React.FC<KanbanColumnsListProps> = ({
  children,
  columns,
}) => {
  const [mounted, setMounted] = useState(false);
  const [dragInProgress, setDragInProgress] = useState(false);
  const handleDragEnd = useDragEnd({ columns, setDragInProgress });

  useEffect(() => {
    setMounted(true);
  }, []);

  // TODO: надо доделать, ща он не реагирует
  //? Оверлей, для блокировки интерфейса, пока задачка прыгает между колонками
  // Сброс dragInProgress при изменении колонок
  useEffect(() => {
    if (dragInProgress) {
      setDragInProgress(false);
    }
  }, [columns, dragInProgress]);

  useEffect(() => {
    if (dragInProgress) {
      const timeout = setTimeout(() => setDragInProgress(false), 700);
      return () => clearTimeout(timeout);
    }
  }, [dragInProgress]);

  if (!mounted) {
    return null;
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {children}
      {dragInProgress && <div {...style}>Перемещаем задачу...</div>}
    </DndContext>
  );
};
