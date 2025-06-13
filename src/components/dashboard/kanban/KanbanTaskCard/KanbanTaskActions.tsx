import { Task } from '@/types/kanban';

interface KanbanTaskActionsProps {
  task: Task;
}

const KanbanTaskActions: React.FC<KanbanTaskActionsProps> = () => {
  // Здесь будут кнопки для действий (переместить, удалить и т.д.)
  return <div style={{ marginTop: 8, display: 'flex', gap: 8 }}></div>;
};

export default KanbanTaskActions;
