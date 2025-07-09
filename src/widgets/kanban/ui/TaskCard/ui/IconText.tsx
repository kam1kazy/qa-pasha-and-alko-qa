import styles from './IconText.module.scss';

export const IconText: React.FC<{ icon: React.ReactNode; count?: number }> = ({ icon, count }) => (
  <span className={styles.icon_text}>
    {icon} {count}
  </span>
);
