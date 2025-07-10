import { closestCenter, DndContext } from '@dnd-kit/core';
import { useEffect, useState } from 'react';

import { IKanbanColumn } from '@/entities/task/models/task.types';
import { useDragEnd } from '@/features/kanban-board/model/useDragEnd';

interface KanbanColumnsListProps {
  children: React.ReactNode;
  columns: IKanbanColumn[];
}

export const KanbanDndProvider: React.FC<KanbanColumnsListProps> = ({
  children,
  columns,
}) => {
  const [mounted, setMounted] = useState(false);
  const handleDragEnd = useDragEnd({ columns });

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
