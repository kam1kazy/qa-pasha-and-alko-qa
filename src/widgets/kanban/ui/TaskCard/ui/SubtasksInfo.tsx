import styles from './SubtasksInfo.module.scss';

export const SubtasksInfo: React.FC<{ done?: number; total?: number }> = ({ done, total }) => {
  if (typeof total !== 'number' || total === 0) {
    return null;
  }
  return (
    <span className={styles.subtasks_info}>
      {done ?? 0}/{total}
    </span>
  );
};
