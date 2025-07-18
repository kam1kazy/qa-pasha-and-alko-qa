'use client';

import { useState } from 'react';

import styles from './page.module.scss';

const mockCourses = [
  { id: 1, name: 'Frontend' },
  { id: 2, name: 'Backend' },
];
const mockSprints = [
  { id: 1, name: 'Спринт 1' },
  { id: 2, name: 'Спринт 2' },
];

type Task = { id: number; title: string; description: string };
const mockTasks: Record<number, Task[]> = {
  1: [
    {
      id: 1,
      title: 'Задача 1',
      description:
        'Описание задачи 1. Здесь может быть подробный текст задачи, условия, критерии приёма и т.д.',
    },
    {
      id: 2,
      title: 'Задача 2',
      description:
        'Описание задачи 2. Здесь может быть подробный текст задачи, условия, критерии приёма и т.д.',
    },
  ],
  2: [
    {
      id: 3,
      title: 'Задача 3',
      description:
        'Описание задачи 3. Здесь может быть подробный текст задачи, условия, критерии приёма и т.д.',
    },
  ],
};

export default function AdminCoursesPage() {
  const [selectedSprint, setSelectedSprint] = useState<number>(1);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const tasks = mockTasks[selectedSprint] || undefined;
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;

  return (
    <div className={styles.container}>
      {/* Верхний блок: Курсы */}
      <div className={styles.topBar}>
        <h1 className={styles.title}>Курсы</h1>
        <button className={styles.addCourseBtn}>+ Add</button>
      </div>
      <div className={styles.courses}>
        {mockCourses.map((course) => (
          <div key={course.id} className={styles.courseCard}>
            {course.name}
          </div>
        ))}
      </div>

      {/* Нижний блок: Задачи и Спринты */}
      <div className={styles.tasksBlock}>
        <h2 className={styles.tasksTitle}>Задачи</h2>
        <div className={styles.sprintsTasksRow}>
          {/* Спринты */}
          <div className={styles.sprintsCol}>
            <div className={styles.sprintsHeader}>
              <span style={{ fontWeight: 500 }}>Спринты</span>
              <button className={styles.sprintsAddBtn}>+</button>
            </div>
            <div className={styles.sprintsList}>
              {mockSprints.map((sprint) => (
                <div
                  key={sprint.id}
                  onClick={() => {
                    setSelectedSprint(sprint.id);
                    setSelectedTaskId(null);
                  }}
                  className={
                    selectedSprint === sprint.id
                      ? `${styles.sprint} ${styles.sprintActive}`
                      : styles.sprint
                  }
                >
                  {sprint.name}
                </div>
              ))}
            </div>
          </div>

          {/* Задачи */}
          <div className={styles.tasksCol}>
            <div className={styles.tasksHeader}>
              <span style={{ fontWeight: 500 }}>Задачи</span>
              <button className={styles.tasksAddBtn}>+ Add</button>
            </div>
            <div className={styles.tasksList}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={
                    selectedTaskId === task.id
                      ? `${styles.task} ${styles.taskActive}`
                      : styles.task
                  }
                >
                  {task.title}
                </div>
              ))}
              {tasks.length === 0 && (
                <div className={styles.noTasks}>Нет задач</div>
              )}
            </div>
          </div>

          {/* Блок с содержимым задачи */}
          <div className={styles.taskDetailsCol}>
            {selectedTask ? (
              <div className={styles.taskDetails}>
                <h3 className={styles.taskDetailsTitle}>
                  {selectedTask.title}
                </h3>
                <div className={styles.taskDetailsDesc}>
                  {selectedTask.description}
                </div>
                <div className={styles.taskDetailsActions}>
                  <button className={styles.taskEditBtn}>Редактировать</button>
                  <button className={styles.taskDeleteBtn}>Удалить</button>
                </div>
              </div>
            ) : (
              <div className={styles.taskDetailsEmpty}>
                Выберите задачу, чтобы посмотреть детали
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
