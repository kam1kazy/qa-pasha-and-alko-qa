import type { DragEndEvent } from '@dnd-kit/core';
import { useDispatch } from 'react-redux';

import { setColumns } from '@/store/slices/columnsSlice';
import { moveTask } from '@/store/slices/tasksSlice';
import { KanbanColumn as KanbanColumnType, Task } from '@/widgets/kanban/types/kanban';

interface IProps {
  columns: KanbanColumnType[];
}

export const useDragEnd = ({ columns }: IProps) => {
  const dispatch = useDispatch();

  return (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }

    // Найти колонку и задачу, которую двигаем
    let fromColumnIdx = -1;
    let task: Task | undefined;
    columns.forEach((col, idx) => {
      const found = col.tasks.find((t) => t.id === active.id);
      if (found) {
        fromColumnIdx = idx;
        task = found;
      }
    });
    if (!task) {
      return;
    }

    // Найти колонку, куда бросили
    const toColumnIdx = columns.findIndex((col) => col.id === over.id);
    if (toColumnIdx === -1) {
      return;
    }

    // Обновляем состояние в Redux
    dispatch(
      moveTask({
        sourceColumnId: columns[fromColumnIdx].id,
        destinationColumnId: columns[toColumnIdx].id,
        taskId: task.id,
        newIndex: columns[toColumnIdx].tasks.length,
      })
    );

    // Обновляем колонки
    const newColumns = columns.map((col, idx) => {
      if (idx === fromColumnIdx) {
        return { ...col, tasks: col.tasks.filter((t) => t.id !== active.id) };
      }
      if (idx === toColumnIdx) {
        return { ...col, tasks: [...col.tasks, { ...task!, columnId: col.id }] };
      }
      return col;
    });

    dispatch(setColumns(newColumns));
  };
};
