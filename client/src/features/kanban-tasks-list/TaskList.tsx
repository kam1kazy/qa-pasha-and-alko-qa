import { ITask } from '@/entities/task/models/task.types';
import { TaskCard } from '@/entities/task/ui/TaskCard/TaskCard';
import { SortableProvider } from '@/shared/providers/KanbanDndSortable';

import styles from './TaskList.module.scss';

interface KanbanTaskListProps {
  tasks: ITask[];
}

export const KanbanTaskList: React.FC<KanbanTaskListProps> = ({ tasks }) => (
  <div className={styles.task_list}>
    <SortableProvider items={tasks.map((t) => t.id)}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </SortableProvider>
  </div>
);
