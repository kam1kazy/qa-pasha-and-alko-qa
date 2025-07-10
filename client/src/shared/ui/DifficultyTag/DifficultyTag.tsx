import styles from './DifficultyTag.module.scss';

export const DifficultyTag: React.FC<{ difficulty?: string }> = ({
  difficulty,
}) => {
  if (!difficulty) {
    return null;
  }

  const color =
    difficulty === 'easy'
      ? '#4ade80'
      : difficulty === 'medium'
        ? '#facc15'
        : '#f87171';

  return (
    <span className={styles.difficulty_tag} style={{ background: color }}>
      {difficulty}
    </span>
  );
};
