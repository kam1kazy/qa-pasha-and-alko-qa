import { closestCenter, DndContext } from '@dnd-kit/core';
import { useEffect, useState } from 'react';

import { IKanbanColumn } from '@/entities/task/models/task.types';
import { useDragEnd } from '@/features/kanban-board/model/useDragEnd';

export const KanbanDndProvider = ({
  children,
  columns,
}: {
  children: React.ReactNode;
  columns: IKanbanColumn[];
}) => {
  const [mounted, setMounted] = useState(false);
  const handleDragEnd = useDragEnd({ columns }); // Перенесите сюда

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {children}
    </DndContext>
  );
};
