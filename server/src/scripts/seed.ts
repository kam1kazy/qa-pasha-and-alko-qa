import { prismaService } from './db.js';

import { logger } from '@/config/logger.js';
import courses from './configs/courses.json' with { type: 'json' };
import kanbanColumns from './configs/kanbanColumns.json' with { type: 'json' };
import sprints from './configs/sprints.json' with { type: 'json' };
import tasks from './configs/tasks.json' with { type: 'json' };
import userActiveSprints from './configs/userActiveSprints.json' with { type: 'json' };
import users from './configs/users.json' with { type: 'json' };
import userTaskStatuses from './configs/userTaskStatuses.json' with { type: 'json' };

const seed = async () => {
  logger.info(`\nPRISMA: 🌾 Выполняем посев данных...`);


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

  logger.info('🛡️ PRISMA: 🎉 Посев данных успешно завершен!');
};

seed()
  .then(() => {
    logger.info('🛡️ Посев завершен успешно');
  })
  .catch((error) => {
    logger.error('Ошибка при посеве:', error);
  });

export default seed;
