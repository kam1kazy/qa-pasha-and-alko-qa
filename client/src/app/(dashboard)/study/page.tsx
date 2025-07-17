'use client';

import Image from 'next/image';
import { useState } from 'react';

import { KanbanBoard } from '@/features/kanban-board/KanbanBoard';

import styles from './page.module.scss';

const mockSprints = [
  { id: 1, name: 'Спринт 1', lock: false },
  { id: 2, name: 'Спринт 2', lock: true },
  { id: 3, name: 'Спринт 3', lock: true },
  { id: 4, name: 'Спринт 4', lock: true },
];

const TasksPage: React.FC = () => {
  // Активный таб — первый не заблокированный
  const firstActiveIdx = mockSprints.findIndex((s) => !s.lock);
  const [activeSprintId] = useState<number>(mockSprints[firstActiveIdx]?.id);

  return (
    <div className={styles.task_page}>
      <div className={styles.task_tabs}>
        {mockSprints.map((sprint) => (
          <button
            key={sprint.id}
            className={
              styles.task_tab +
              (activeSprintId === sprint.id ? ' ' + styles.active : '') +
              (sprint.lock ? ' ' + styles.locked : '')
            }
            disabled={sprint.lock}
          >
            {sprint.name}
            {sprint.lock && (
              <Image
                src="/images/icons/padlock.svg"
                alt="locked"
                className={styles.lock_icon}
                width={30}
                height={30}
              />
            )}
          </button>
        ))}
      </div>
      {/* KanbanBoard только для активного спринта */}
      {activeSprintId && <KanbanBoard />}
    </div>
  );
};

export default TasksPage;
