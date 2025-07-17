import { KanbanBoard } from '@/features/kanban-board/KanbanBoard';
import { ProtectedRoute } from '@/shared/providers/ProtectedRoute';

import styles from './page.module.scss';

const TasksPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <div className={styles.task_page}>
        <KanbanBoard />
      </div>
    </ProtectedRoute>
  );
};

export default TasksPage;
