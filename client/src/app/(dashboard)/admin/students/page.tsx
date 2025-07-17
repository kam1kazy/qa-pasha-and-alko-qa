'use client';
import { useState } from 'react';

import styles from './page.module.scss';

const mockStudents = [
  {
    id: 1,
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    avatar: null,
    isManager: false,
    isFavorite: true,
    courses: ['Frontend', 'Backend'],
    completedSprints: 2,
    completedTasks: 12,
  },
  {
    id: 2,
    name: 'Мария Петрова',
    email: 'maria@example.com',
    avatar: null,
    isManager: true,
    isFavorite: false,
    courses: ['Frontend'],
    completedSprints: 1,
    completedTasks: 7,
  },
  {
    id: 3,
    name: 'Алексей Смирнов',
    email: 'alexey@example.com',
    avatar: null,
    isManager: false,
    isFavorite: false,
    courses: ['Backend'],
    completedSprints: 0,
    completedTasks: 0,
  },
];

const coursesList = ['Frontend', 'Backend', 'Design'];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function AdminStudentsPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    mockStudents[0]?.id ?? null
  );
  const [search, setSearch] = useState('');

  const filtered = mockStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );
  const selectedStudent =
    mockStudents.find((s) => s.id === selectedStudentId) || null;

  return (
    <div className={styles.students_container}>
      {/* Профиль выбранного студента или skeleton */}
      {mockStudents.length === 0 ? (
        <div className={styles.skeleton_profile}>
          <div className={styles.skeleton_avatar}></div>
          <div style={{ flex: 1 }}>
            <div className={styles.skeleton_block} style={{ width: 180 }}></div>
            <div className={styles.skeleton_block} style={{ width: 120 }}></div>
            <div className={styles.skeleton_block} style={{ width: 220 }}></div>
          </div>
        </div>
      ) : selectedStudent ? (
        <div className={styles.profile_card}>
          <div className={styles.avatar}>
            {selectedStudent.avatar ? (
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
              />
            ) : (
              getInitials(selectedStudent.name)
            )}
          </div>
          <div className={styles.profile_info}>
            <div className={styles.profile_name}>{selectedStudent.name}</div>
            <div className={styles.profile_email}>{selectedStudent.email}</div>
            <div className={styles.profile_courses}>
              <span style={{ fontSize: 15 }}>Курсы:</span>
              {coursesList.map((c) => (
                <span
                  key={c}
                  className={
                    styles.course_tag +
                    (selectedStudent.courses.includes(c)
                      ? ' ' + styles.active
                      : '')
                  }
                >
                  {c}
                </span>
              ))}
            </div>
            <div className={styles.profile_stats}>
              <span>
                Спринтов: <b>{selectedStudent.completedSprints}</b>
              </span>
              <span>
                Задач: <b>{selectedStudent.completedTasks}</b>
              </span>
              <button
                className={
                  styles.manager_btn +
                  (selectedStudent.isManager ? ' ' + styles.active : '')
                }
              >
                Менеджер
              </button>
              <button
                className={
                  styles.favorite_btn +
                  (selectedStudent.isFavorite ? ' ' + styles.active : '')
                }
                title="Избранное"
              >
                ★
              </button>
            </div>
          </div>
          <button
            onClick={() => setSelectedStudentId(null)}
            className={styles.close_btn}
            title="Закрыть"
          >
            ×
          </button>
        </div>
      ) : null}

      {/* Поиск и фильтры */}
      <div className={styles.search_filters}>
        <input
          type="text"
          placeholder="Поиск по имени или email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search_input}
        />
        <select className={styles.select}>
          <option>Все курсы</option>
          {coursesList.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className={styles.select}>
          <option>Все роли</option>
          <option>Менеджеры</option>
          <option>Студенты</option>
        </select>
      </div>

      {/* Таблица студентов */}
      <div className={styles.students_table}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.table_head}>
              <th className={styles.table_cell}>Фото</th>
              <th className={styles.table_cell}>Имя</th>
              <th className={styles.table_cell}>Email</th>
              <th className={styles.table_cell}>Курсы</th>
              <th className={styles.table_cell}>Роль</th>
              <th className={styles.table_cell}>Избранное</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <tr
                key={student.id}
                className={
                  styles.table_row +
                  (selectedStudentId === student.id ? ' ' + styles.active : '')
                }
                onClick={() => setSelectedStudentId(student.id)}
              >
                <td className={styles.table_cell}>
                  <div className={styles.avatar_small}>
                    {student.avatar ? (
                      <img
                        src={student.avatar}
                        alt={student.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                        }}
                      />
                    ) : (
                      getInitials(student.name)
                    )}
                  </div>
                </td>
                <td className={styles.table_cell} style={{ fontWeight: 500 }}>
                  {student.name}
                </td>
                <td className={styles.table_cell} style={{ color: '#888' }}>
                  {student.email}
                </td>
                <td className={styles.table_cell}>
                  {student.courses.map((c) => (
                    <span key={c} className={styles.course_tag}>
                      {c}
                    </span>
                  ))}
                </td>
                <td className={styles.table_cell}>
                  <span
                    className={
                      styles.role_tag +
                      (student.isManager ? ' ' + styles.manager : '')
                    }
                  >
                    {student.isManager ? 'Менеджер' : 'Студент'}
                  </span>
                </td>
                <td className={styles.table_cell}>
                  <span
                    className={
                      styles.star +
                      (student.isFavorite ? ' ' + styles.active : '')
                    }
                  >
                    ★
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{ textAlign: 'center', color: '#aaa', padding: 24 }}
                >
                  Нет студентов
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      <div className={styles.pagination}>
        <button className={styles.page_btn}>{'<'}</button>
        <button className={styles.page_btn + ' ' + styles.active}>1</button>
        <button className={styles.page_btn}>2</button>
        <button className={styles.page_btn}>{'>'}</button>
      </div>
    </div>
  );
}
