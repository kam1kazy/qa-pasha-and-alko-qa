import { useDraggable } from '@dnd-kit/core';

import { ITask } from '@/entities/task/models/task.types';

import { useTaskCard } from '../../models/useTaskCard';
import {
  DifficultyTag,
  IconText,
  ProgressCircle,
  SubtasksInfo,
  TaskActions,
  TopicTags,
} from '.';
import styles from './KanbanTaskCard.module.scss';

interface KanbanTaskCardProps {
  task: ITask;
}

const KanbanTaskCard: React.FC<KanbanTaskCardProps> = ({ task }) => {
  const {
    onClick,
    // isModalOpen,
    // closeModal
  } = useTaskCard(task);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: task,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

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

export default KanbanTaskCard;
