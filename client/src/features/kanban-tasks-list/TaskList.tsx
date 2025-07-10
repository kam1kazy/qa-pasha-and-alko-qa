import { ITask } from '@/entities/task/models/task.types';
import { TaskCard } from '@/entities/task/ui/TaskCard/TaskCard';

interface KanbanTaskListProps {
  tasks: ITask[];
}

export const KanbanTaskList: React.FC<KanbanTaskListProps> = ({ tasks }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
    {tasks.map((task) => (
      <TaskCard key={task.id} task={task} />
    ))}
  </div>
);
