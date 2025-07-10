import { KanbanBoard } from '@/features/kanban-board/ui/KanbanBoard';

import styles from './page.module.scss';

const TasksPage: React.FC = () => {
  return (
    <div className={styles.task_page}>
      <KanbanBoard />
    </div>
  );
};

export default TasksPage;
