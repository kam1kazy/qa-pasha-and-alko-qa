import { useDroppable } from '@dnd-kit/core';
import React from 'react';

import { KanbanColumn as KanbanColumnType } from '@/entities/task/models/task.types';
import KanbanAddTaskButton from '@/features/add-task/ui/AddTaskButton';
import KanbanTaskList from '@/features/kanban-tasks-list/TaskList';
import KanbanColumnHeader from '@/shared/ui/ColumnHeader/ColumnHeader';

import { useKanbanColumn } from '../model/useKanbanColumn';

interface KanbanColumnProps {
  column: KanbanColumnType;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column }) => {
  const { tasks, onAddTask } = useKanbanColumn(column);
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        background: '#232329',
        borderRadius: 12,
        padding: 16,
        minWidth: 320,
        minHeight: 400,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        border: isOver ? '2px dashed #4f8cff' : 'none',
        transition: 'border 0.2s ease',
      }}
    >
      <KanbanColumnHeader
        title={column.title}
        count={tasks.length}
        doneCount={column.doneCount}
      />
      <KanbanTaskList tasks={tasks} />
      <KanbanAddTaskButton onAdd={onAddTask} />
    </div>
  );
};

export default KanbanColumn;
