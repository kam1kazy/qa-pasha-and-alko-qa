import { Task } from '@/entities/task/models/task.types';
import KanbanTaskCard from '@/entities/task/ui/TaskCard/KanbanTaskCard';

interface KanbanTaskListProps {
  tasks: Task[];
}

const KanbanTaskList: React.FC<KanbanTaskListProps> = ({ tasks }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
    {tasks.map((task) => (
      <KanbanTaskCard key={task.id} task={task} />
    ))}
  </div>
);

export default KanbanTaskList;
