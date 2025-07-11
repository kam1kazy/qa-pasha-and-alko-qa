import { useDndContext } from '@dnd-kit/core';

import { ITask } from '@/entities/task/models/task.types';
import { TaskCard } from '@/entities/task/ui/TaskCard/TaskCard';
import { SortableProvider } from '@/shared/providers/KanbanDndSortable';

import styles from './TaskList.module.scss';

interface KanbanTaskListProps {
  tasks: ITask[];
}

export const KanbanTaskList: React.FC<KanbanTaskListProps> = ({ tasks }) => {
  const { over } = useDndContext();

  return (
    <div className={styles.task_list}>
      <SortableProvider items={tasks.map((t) => t.id)}>
        {tasks.map((task) => {
          const isOver = over?.id === task.id;
          return (
            <div key={task.id} style={{ position: 'relative' }}>
              {isOver && <div className={styles.line} />}
              <TaskCard task={task} />
            </div>
          );
        })}
      </SortableProvider>
    </div>
  );
};
