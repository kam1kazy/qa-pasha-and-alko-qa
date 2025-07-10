interface KanbanAddTaskButtonProps {
  onAdd: () => void;
}

export const KanbanAddTaskButton: React.FC<KanbanAddTaskButtonProps> = ({
  onAdd,
}) => (
  <button
    style={{
      marginTop: 8,
      background: '#34343c',
      color: '#fff',
      border: 'none',
      borderRadius: 8,
      padding: '8px 0',
      width: '100%',
      cursor: 'pointer',
    }}
    onClick={onAdd}
  >
    + Add task
  </button>
);
