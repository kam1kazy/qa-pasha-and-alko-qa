'use client';

import { useSelector } from 'react-redux';

import { KanbanColumn } from '@/features/kanban-column/KanbanColumn';
import { RootState } from '@/shared/lib/redux/store';
import { KanbanDndProvider } from '@/shared/providers/KanbanDndProvider';
import { IKanbanColumn } from '@/shared/types';

import styles from './KanbanBoard.module.scss';

export const KanbanBoard: React.FC = () => {
  const columns = useSelector((state: RootState) => state.columns.columns);

  return (
    <KanbanDndProvider columns={columns}>
      <div className={styles.board}>
        {columns.map((column: IKanbanColumn) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>
    </KanbanDndProvider>
  );
};
