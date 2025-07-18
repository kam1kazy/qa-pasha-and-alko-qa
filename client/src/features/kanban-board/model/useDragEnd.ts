import type { DragEndEvent } from '@dnd-kit/core';
import { useDispatch, useSelector } from 'react-redux';

// import { setColumns } from '@/entities/column/model/column.slice';
import { moveTask } from '@/entities/task/models/task.slice';
import type { RootState } from '@/shared/lib/redux/store';
import { IKanbanColumn } from '@/shared/types';

interface IProps {
  columns: IKanbanColumn[];
  setDragInProgress?: (v: boolean) => void;
}

export const useDragEnd = ({ columns, setDragInProgress }: IProps) => {
  const dispatch = useDispatch();
  // TODO: Селектор достаю не правильно, надо из либы
  const tasksByColumn = useSelector((state: RootState) => state.tasks.tasks);

  const findTask = (id: string) => {
    for (let colIdx = 0; colIdx < columns.length; colIdx++) {
      const columnId = columns[colIdx].id;
      const taskList = tasksByColumn[columnId] || undefined;
      const taskIdx = taskList.findIndex((t) => t.id === id);
      if (taskIdx !== -1) {
        return {
          columnIndex: colIdx,
          taskIndex: taskIdx,
          task: taskList[taskIdx],
        };
      }
    }
    return null;
  };

  const findColumnIndex = (id: string) =>
    columns.findIndex((col) => col.id === id);

  return (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }

    const from = findTask(active.id as string);
    if (!from) {
      return;
    }

    // Попали ли в задачу?
    const to = findTask(over.id as string);

    let toColumnIdx: number;
    let toTaskIdx: number;

    if (to) {
      toColumnIdx = to.columnIndex;
      toTaskIdx = to.taskIndex;

      // Двигаем вниз в ту же колонку → корректируем
      if (from.columnIndex === toColumnIdx && from.taskIndex < toTaskIdx) {
        toTaskIdx -= 1;
      }
    } else {
      // Попали в колонку — дроп в конец
      toColumnIdx = findColumnIndex(over.id as string);
      if (toColumnIdx === -1) {
        return;
      }
      const columnId = columns[toColumnIdx].id;
      toTaskIdx = (tasksByColumn[columnId] || undefined).length;
    }

    // Не переместили
    if (from.columnIndex === toColumnIdx && from.taskIndex === toTaskIdx) {
      return;
    }

    dispatch(
      moveTask({
        sourceColumnId: columns[from.columnIndex].id,
        destinationColumnId: columns[toColumnIdx].id as any,
        taskId: from.task.id,
        newIndex: toTaskIdx,
      })
    );

    if (setDragInProgress) {
      setTimeout(() => setDragInProgress(false), 100);
    }
  };
};
