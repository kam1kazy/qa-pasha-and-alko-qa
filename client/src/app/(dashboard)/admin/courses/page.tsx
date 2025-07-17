'use client';

import { useState } from 'react';

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

  const tasks = mockTasks[selectedSprint] || [];
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;

  return (
    <div>
      {/* Верхний блок: Курсы */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 32,
        }}
      >
        <h1 style={{ fontSize: '2rem' }}>Курсы</h1>
        <button
          style={{
            background: '#7c3aed',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 18px',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          + Add
        </button>
      </div>
      <div style={{ display: 'flex', gap: 24, marginBottom: 40 }}>
        {mockCourses.map((course) => (
          <div
            key={course.id}
            style={{
              background: '#23232b',
              borderRadius: 16,
              padding: 24,
              minWidth: 220,
              minHeight: 100,
              color: '#fff',
              boxShadow: '0 1px 8px #0001',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
            }}
          >
            {course.name}
          </div>
        ))}
      </div>

      {/* Нижний блок: Задачи и Спринты */}
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 18 }}>Задачи</h2>
        <div style={{ display: 'flex', gap: 32 }}>
          {/* Спринты */}
          <div style={{ minWidth: 180 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <span style={{ fontWeight: 500 }}>Спринты</span>
              <button
                style={{
                  background: '#34343c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '4px 10px',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                }}
              >
                +
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mockSprints.map((sprint) => (
                <div
                  key={sprint.id}
                  onClick={() => {
                    setSelectedSprint(sprint.id);
                    setSelectedTaskId(null);
                  }}
                  style={{
                    background:
                      selectedSprint === sprint.id ? '#7c3aed' : '#23232b',
                    color: selectedSprint === sprint.id ? '#fff' : '#ccc',
                    borderRadius: 10,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontWeight: selectedSprint === sprint.id ? 600 : 400,
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  {sprint.name}
                </div>
              ))}
            </div>
          </div>

          {/* Задачи */}
          <div style={{ flex: 1, minWidth: 220, maxWidth: 340 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <span style={{ fontWeight: 500 }}>Задачи</span>
              <button
                style={{
                  background: '#7c3aed',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '4px 14px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                + Add
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  style={{
                    background:
                      selectedTaskId === task.id ? '#7c3aed' : '#23232b',
                    color: selectedTaskId === task.id ? '#fff' : '#fff',
                    borderRadius: 12,
                    padding: 18,
                    fontSize: '1rem',
                    boxShadow: '0 1px 8px #0001',
                    cursor: 'pointer',
                    fontWeight: selectedTaskId === task.id ? 600 : 400,
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  {task.title}
                </div>
              ))}
              {tasks.length === 0 && (
                <div
                  style={{ color: '#888', fontStyle: 'italic', padding: 12 }}
                >
                  Нет задач
                </div>
              )}
            </div>
          </div>

          {/* Блок с содержимым задачи */}
          <div style={{ minWidth: 320, maxWidth: 400, flex: 1 }}>
            {selectedTask ? (
              <div
                style={{
                  background: '#23232b',
                  borderRadius: 16,
                  padding: 28,
                  color: '#fff',
                  boxShadow: '0 1px 8px #0002',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                }}
              >
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                  {selectedTask.title}
                </h3>
                <div style={{ color: '#a3a3a3', fontSize: '0.98rem' }}>
                  {selectedTask.description}
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <button
                    style={{
                      background: '#34343c',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '6px 18px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                    }}
                  >
                    Редактировать
                  </button>
                  <button
                    style={{
                      background: '#7c3aed',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '6px 18px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  color: '#888',
                  fontStyle: 'italic',
                  padding: 24,
                  background: '#23232b',
                  borderRadius: 16,
                  minHeight: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Выберите задачу, чтобы посмотреть детали
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
