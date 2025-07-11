import { SortableContext } from '@dnd-kit/sortable';

interface SortableProviderProps {
  children: React.ReactNode;
  items: string[];
}

export const SortableProvider: React.FC<SortableProviderProps> = ({
  children,
  items,
}) => {
  return <SortableContext items={items}>{children}</SortableContext>;
};
