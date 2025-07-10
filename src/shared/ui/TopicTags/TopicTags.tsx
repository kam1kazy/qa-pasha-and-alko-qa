import styles from './TopicTags.module.scss';

export const TopicTags: React.FC<{ topics?: string[] }> = ({ topics }) => (
  <>
    {topics?.map((topic) => (
      <span key={topic} className={styles.topic_tags}>
        {topic}
      </span>
    ))}
  </>
);
