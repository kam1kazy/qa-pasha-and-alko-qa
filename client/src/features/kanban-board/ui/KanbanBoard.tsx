'use client';

import { useSelector } from 'react-redux';

import { IKanbanColumn } from '@/entities/task/models/task.types';
import { KanbanColumn } from '@/features/kanban-column/ui/KanbanColumn';
import { RootState } from '@/shared/lib/redux/store';
import { KanbanDndProvider } from '@/shared/providers/KanbanDndProvider';

export const KanbanBoard: React.FC = () => {
  const columns = useSelector((state: RootState) => state.columns.columns);

  return (
    <KanbanDndProvider columns={columns}>
      <div
        style={{
          display: 'flex',
          gap: 24,
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {columns.map((column: IKanbanColumn) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>
    </KanbanDndProvider>
  );
};
