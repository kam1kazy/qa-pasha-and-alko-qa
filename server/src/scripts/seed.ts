import { prismaService } from './db.js';
import * as fs from 'fs';
import * as path from 'path';

const usersPath = path.resolve(__dirname, '../../bot-data/data/users.json');
const coursesPath = path.resolve(__dirname, '../../bot-data/data/courses.json');
const sprintsPath = path.resolve(__dirname, '../../bot-data/data/sprints.json');
const kanbanColumnsPath = path.resolve(
  __dirname,
  '../../bot-data/data/kanbanColumns.json'
);
const tasksPath = path.resolve(__dirname, '../../bot-data/data/tasks.json');
const userActiveSprintsPath = path.resolve(
  __dirname,
  '../../bot-data/data/userActiveSprints.json'
);
const userTaskStatusesPath = path.resolve(
  __dirname,
  '../../bot-data/data/userTaskStatuses.json'
);

const users = require(usersPath);
const courses = require(coursesPath);
const sprints = require(sprintsPath);
const kanbanColumns = require(kanbanColumnsPath);
const tasks = require(tasksPath);
const userActiveSprints = require(userActiveSprintsPath);
const userTaskStatuses = require(userTaskStatusesPath);

const seed = async () => {
  console.log(`\nPRISMA: 🌾 Выполняем посев данных...`);

  // Проверяем существование файлов
  const files = [
    { path: usersPath, name: 'users' },
    { path: coursesPath, name: 'courses' },
    { path: sprintsPath, name: 'sprints' },
    { path: kanbanColumnsPath, name: 'kanbanColumns' },
    { path: tasksPath, name: 'tasks' },
    { path: userActiveSprintsPath, name: 'userActiveSprints' },
    { path: userTaskStatusesPath, name: 'userTaskStatuses' },
  ];

  for (const file of files) {
    if (!fs.existsSync(file.path)) {
      console.log(`PRISMA: ⚠️ Файл с данными ${file.name} не найден`);
      return;
    }
  }

  // Очистка базы данных
  await prismaService.clearDatabase();

  // Добавляем пользователей
  await prismaService.loadUsers(users);

  // Добавляем курсы
  await prismaService.loadCourses(courses);

  // Добавляем спринты
  await prismaService.loadSprints(sprints);

  // Добавляем колонки Канбан
  await prismaService.loadKanbanColumns(kanbanColumns);

  // Добавляем задачи
  await prismaService.loadTasks(tasks);

  // Добавляем активные спринты
  await prismaService.loadUserActiveSprints(userActiveSprints);

  // Добавляем статусы задач
  await prismaService.loadUserTaskStatuses(userTaskStatuses);

  // Выводим статистику
  await prismaService.getStats();

  console.log('PRISMA: 🎉 Посев данных успешно завершен!');
};

export default seed;
