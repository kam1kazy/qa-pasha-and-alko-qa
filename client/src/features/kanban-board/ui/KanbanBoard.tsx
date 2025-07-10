'use client';

import { useSelector } from 'react-redux';

import { KanbanColumn as KanbanColumnType } from '@/entities/task/models/task.types';
import { KanbanDndProvider } from '@/providers/KanbanDndProvider';
import { RootState } from '@/shared/lib/redux/store';

import KanbanColumn from '../../kanban-column/ui/KanbanColumn';

const KanbanBoard: React.FC = () => {
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
        {columns.map((column: KanbanColumnType) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>
    </KanbanDndProvider>
  );
};

export default KanbanBoard;
