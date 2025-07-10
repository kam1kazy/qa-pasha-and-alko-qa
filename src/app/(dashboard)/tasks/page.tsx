import React from 'react';

import KanbanBoard from '@/features/kanban-board/ui/KanbanBoard';

const TasksPage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#18181c',
        padding: '40px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <KanbanBoard />
    </div>
  );
};

export default TasksPage;
