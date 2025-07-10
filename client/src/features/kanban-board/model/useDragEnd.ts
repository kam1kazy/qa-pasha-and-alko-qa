import type { DragEndEvent } from '@dnd-kit/core';
import { useDispatch } from 'react-redux';

import { setColumns } from '@/entities/column/model/column.slice';
import { moveTask } from '@/entities/task/models/task.slice';
import { IKanbanColumn, ITask } from '@/entities/task/models/task.types';

interface IProps {
  columns: IKanbanColumn[];
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
    let task: ITask | undefined;
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
        return {
          ...col,
          tasks: [...col.tasks, { ...task!, columnId: Number(col.id) }],
        };
      }
      return col;
    });

    dispatch(setColumns(newColumns));
  };
};
