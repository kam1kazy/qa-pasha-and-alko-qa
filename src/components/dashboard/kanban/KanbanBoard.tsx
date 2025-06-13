'use client';

import { closestCenter, DndContext } from '@dnd-kit/core';
// import { useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@/store';
import { KanbanColumn as KanbanColumnType } from '@/types/kanban';

// import { addTask, moveTask } from '@/store/slices/tasksSlice';
import { useDragEnd } from './hooks/useDragEnd';
import KanbanColumn from './KanbanColumn/KanbanColumn';
// Пример начальных данных

const KanbanBoard: React.FC = () => {
  const columns = useSelector((state: RootState) => state.columns.columns);

  const handleDragEnd = useDragEnd({ columns });

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', width: '100%' }}>
        {columns.map((column: KanbanColumnType) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
