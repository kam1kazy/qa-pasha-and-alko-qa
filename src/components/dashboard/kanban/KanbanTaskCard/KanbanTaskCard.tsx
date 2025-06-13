import { useDraggable } from '@dnd-kit/core';
import React from 'react';

import { Task } from '@/types/kanban';

import { useKanbanTaskCard } from './hooks/useKanbanTaskCard';
import KanbanTaskActions from './KanbanTaskActions';

// Компонент кружка прогресса
const ProgressCircle: React.FC<{ progress?: number }> = ({ progress = 0 }) => (
  <svg width={28} height={28}>
    <circle cx={14} cy={14} r={12} stroke="#333" strokeWidth={3} fill="none" />
    <circle
      cx={14}
      cy={14}
      r={12}
      stroke="#4f8cff"
      strokeWidth={3}
      fill="none"
      strokeDasharray={2 * Math.PI * 12}
      strokeDashoffset={2 * Math.PI * 12 * (1 - progress / 100)}
      style={{ transition: 'stroke-dashoffset 0.3s' }}
    />
  </svg>
);

// Тег сложности
const DifficultyTag: React.FC<{ difficulty?: string }> = ({ difficulty }) => {
  if (!difficulty) {
    return null;
  }
  const color = difficulty === 'easy' ? '#4ade80' : difficulty === 'medium' ? '#facc15' : '#f87171';
  return (
    <span
      style={{
        background: color,
        color: '#18181c',
        borderRadius: 6,
        fontSize: 12,
        padding: '2px 8px',
        fontWeight: 500,
      }}
    >
      {difficulty}
    </span>
  );
};

// Теги по темам
const TopicTags: React.FC<{ topics?: string[] }> = ({ topics }) => (
  <>
    {topics?.map((topic) => (
      <span
        key={topic}
        style={{
          background: '#34343c',
          color: '#fff',
          borderRadius: 6,
          fontSize: 12,
          padding: '2px 8px',
          marginRight: 4,
        }}
      >
        {topic}
      </span>
    ))}
  </>
);

// Иконка и число
const IconText: React.FC<{ icon: React.ReactNode; count?: number }> = ({ icon, count }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 13,
      color: '#aaa',
      marginRight: 12,
    }}
  >
    {icon} {count}
  </span>
);

// Добавим отображение количества подзадач
const SubtasksInfo: React.FC<{ done?: number; total?: number }> = ({ done, total }) => {
  if (typeof total !== 'number' || total === 0) {
    return null;
  }
  return (
    <span
      style={{
        fontSize: 12,
        color: '#aaa',
        position: 'absolute',
        right: 12,
        bottom: 8,
        background: '#232329cc',
        borderRadius: 6,
        padding: '2px 8px',
      }}
    >
      {done ?? 0}/{total}
    </span>
  );
};

interface KanbanTaskCardProps {
  task: Task;
}

const KanbanTaskCard: React.FC<KanbanTaskCardProps> = ({ task }) => {
  const { onClick, isModalOpen, closeModal } = useKanbanTaskCard(task);
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
        style={{
          background: '#28282f',
          borderRadius: 8,
          padding: 12,
          cursor: 'pointer',
          boxShadow: '0 2px 8px #0002',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          position: 'relative',
          ...style,
        }}
        onClick={onClick}
        {...listeners}
        {...attributes}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ProgressCircle progress={task.progress} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: 16 }}>{task.title}</div>
            <div style={{ fontSize: 13, color: '#aaa', margin: '2px 0' }}>{task.description}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <DifficultyTag difficulty={task.difficulty} />
          <TopicTags topics={task.topics} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <IconText icon={<span>💬</span>} count={task.commentsCount} />
          <IconText icon={<span>📎</span>} count={task.filesCount} />
        </div>
        <KanbanTaskActions task={task} />
        <SubtasksInfo done={task.subtasksDone} total={task.subtasksCount} />
      </div>
      {/* Модалка с деталями задачи */}
      {/* {isModalOpen && <KanbanTaskDetailsModal task={task} onClose={closeModal} />} */}
    </>
  );
};

export default KanbanTaskCard;
