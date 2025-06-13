import { Task } from '@/types/kanban';

interface KanbanTaskDetailsModalProps {
  task: Task;
  onClose: () => void;
}

const KanbanTaskDetailsModal: React.FC<KanbanTaskDetailsModalProps> = ({ task, onClose }) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#000a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}
  >
    <div style={{ background: '#232329', borderRadius: 12, padding: 32, minWidth: 400 }}>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <button onClick={onClose} style={{ marginTop: 16 }}>
        Закрыть
      </button>
    </div>
  </div>
);

export default KanbanTaskDetailsModal;
