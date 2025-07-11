import styles from './AddTaskButton.module.scss';

interface KanbanAddTaskButtonProps {
  onAdd: () => void;
}

export const KanbanAddTaskButton: React.FC<KanbanAddTaskButtonProps> = ({
  onAdd,
}) => (
  <button className={styles.addTaskButto} onClick={onAdd}>
    + Add task
  </button>
);
