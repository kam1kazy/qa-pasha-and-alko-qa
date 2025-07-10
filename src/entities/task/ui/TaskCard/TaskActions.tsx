import { Task } from '@/entities/task/models/task.types';

import styles from './TaskActions.module.scss';

interface TaskActionsProps {
  task: Task;
}

export const TaskActions: React.FC<TaskActionsProps> = () => {
  // Здесь будут кнопки для действий (переместить, удалить и т.д.)
  return <div className={styles.task_actions}>actions</div>;
};
