import { useDroppable } from '@dnd-kit/core';

import { IKanbanColumn } from '@/entities/task/models/task.types';
import { KanbanAddTaskButton } from '@/features/add-task/ui/AddTaskButton';
import { KanbanTaskList } from '@/features/kanban-tasks-list/TaskList';
import { KanbanColumnHeader } from '@/shared/ui/ColumnHeader/ColumnHeader';

import { useKanbanColumn } from '../model/useKanbanColumn';
import styles from './KanbanColumn.module.scss';

interface KanbanColumnProps {
  column: IKanbanColumn;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column }) => {
  const { tasks, onAddTask } = useKanbanColumn(column);
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ border: isOver ? '2px dashed #4f8cff' : 'none' }}
      className={styles.columns}
    >
      <KanbanColumnHeader
        title={column.title}
        count={tasks.length}
        doneCount={column.doneCount}
      />
      <KanbanTaskList tasks={tasks} />
      <KanbanAddTaskButton onAdd={onAddTask} />
    </div>
  );
};
