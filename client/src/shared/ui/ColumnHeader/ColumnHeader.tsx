interface KanbanColumnHeaderProps {
  title: string;
  count: number;
  doneCount?: number;
}

export const KanbanColumnHeader: React.FC<KanbanColumnHeaderProps> = ({
  title,
  count,
  doneCount,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    }}
  >
    <span style={{ fontWeight: 600, fontSize: 18 }}>{title}</span>
    <span
      style={{
        background: '#34343c',
        borderRadius: 8,
        padding: '2px 8px',
        fontSize: 14,
      }}
    >
      {doneCount !== undefined ? `${doneCount}/${count}` : count}
    </span>
  </div>
);
