'use client';

import { closestCenter, DndContext } from '@dnd-kit/core';
// import { useState } from 'react';
import { useSelector } from 'react-redux';

import { KanbanColumn as KanbanColumnType } from '@/entities/task/models/task.types';
import { RootState } from '@/shared/lib/redux/store';

import KanbanColumn from '../../kanban-column/ui/KanbanColumn';
// import { addTask, moveTask } from '@/store/slices/tasksSlice';
import { useDragEnd } from '../model/useDragEnd';

const KanbanBoard: React.FC = () => {
  const columns = useSelector((state: RootState) => state.columns.columns);

  const handleDragEnd = useDragEnd({ columns });

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div
        style={{
          display: 'flex',
          gap: 24,
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {columns.map((column: KanbanColumnType) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
