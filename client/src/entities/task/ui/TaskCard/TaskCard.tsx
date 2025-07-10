import { useSortable } from '@dnd-kit/sortable';

import { ITask } from '@/entities/task/models/task.types';
import { useTaskCard } from '@/entities/task/models/useTaskCard';

import {
  DifficultyTag,
  IconText,
  ProgressCircle,
  SubtasksInfo,
  TaskActions,
  TopicTags,
} from '.';
import styles from './TaskCard.module.scss';

interface TaskCardProps {
  task: ITask;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const {
    onClick,
    // isModalOpen,
    // closeModal
  } = useTaskCard(task);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    borderTop: isOver ? '2px solid #4f8cff' : undefined,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        className={styles.card}
        style={{ ...style }}
        onClick={onClick}
        {...listeners}
        {...attributes}
      >
        <div className={styles.card__header}>
          <ProgressCircle progress={task.progress} />
          <div style={{ flex: 1 }}>
            <div className={styles.card__title}>{task.title}</div>
            <div className={styles.card__description}>{task.description}</div>
          </div>
        </div>
        <div className={styles.card__tags}>
          <DifficultyTag difficulty={task.difficulty} />
          <TopicTags topics={task.topics} />
        </div>
        <div className={styles.card__info}>
          <IconText icon={<span>💬</span>} count={task.commentsCount} />
          <IconText icon={<span>📎</span>} count={task.filesCount} />
        </div>
        <TaskActions task={task} />
        <SubtasksInfo done={task.subtasksDone} total={task.subtasksCount} />
      </div>
      {/* Модалка с деталями задачи */}
      {/* {isModalOpen && <KanbanTaskDetailsModal task={task} onClose={closeModal} />} */}
    </>
  );
};
