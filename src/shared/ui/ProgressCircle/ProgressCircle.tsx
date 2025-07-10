import styles from './ProgressCircle.module.scss';

export const ProgressCircle: React.FC<{ progress?: number }> = ({
  progress = 0,
}) => (
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
      className={styles.progress_circle}
    />
  </svg>
);
