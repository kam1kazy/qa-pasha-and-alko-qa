import { prisma } from '@/infrastructure/prisma/client.js';

export class PrismaService {
  private prisma: typeof prisma;

  constructor() {
    this.prisma = prisma;
  }

  // Очистка всей базы
  async clearDatabase() {
    try {
      // Удаляем данные в правильном порядке (из-за зависимостей)
      await this.prisma.$transaction([
        this.prisma.userTaskStatus.deleteMany(),
        this.prisma.userActiveSprint.deleteMany(),
        this.prisma.comment.deleteMany(),
        this.prisma.attachment.deleteMany(),
        this.prisma.task.deleteMany(),
        this.prisma.kanbanColumn.deleteMany(),
        this.prisma.sprint.deleteMany(),
        this.prisma.course.deleteMany(),
        this.prisma.user.deleteMany(),
      ]);

      console.log('PRISMA: 🗑 База данных очищена');
    } catch (error) {
      console.error('PRISMA: ❌ Ошибка при очистке базы:', error);
    }
  }

  // Загрузка пользователей
  async loadUsers(users: any[]) {
    try {
      console.log(`PRISMA: 📝 Начало загрузки ${users.length} пользователей`);
      await this.prisma.user.createMany({
        data: users,
        skipDuplicates: true,
      });
      console.log(`PRISMA: 📊 Итого загружено пользователей: ${users.length}`);
    } catch (error) {
      console.error('PRISMA: ❌ Ошибка при загрузке пользователей:', error);
    }
  }

  // Загрузка курсов
  async loadCourses(courses: any[]) {
    try {
      console.log(`PRISMA: 📝 Начало загрузки ${courses.length} курсов`);
      await this.prisma.course.createMany({
        data: courses,
        skipDuplicates: true,
      });
      console.log(`PRISMA: 📊 Итого загружено курсов: ${courses.length}`);
    } catch (error) {
      console.error('PRISMA: ❌ Ошибка при загрузке курсов:', error);
    }
  }

  // Загрузка спринтов
  async loadSprints(sprints: any[]) {
    try {
      console.log(`PRISMA: 📝 Начало загрузки ${sprints.length} спринтов`);
      await this.prisma.sprint.createMany({
        data: sprints,
        skipDuplicates: true,
      });
      console.log(`PRISMA: 📊 Итого загружено спринтов: ${sprints.length}`);
    } catch (error) {
      console.error('PRISMA: ❌ Ошибка при загрузке спринтов:', error);
    }
  }

  // Загрузка колонок Канбан
  async loadKanbanColumns(columns: any[]) {
    try {
      console.log(
        `PRISMA: 📝 Начало загрузки ${columns.length} колонок Канбан`
      );
      await this.prisma.kanbanColumn.createMany({
        data: columns,
        skipDuplicates: true,
      });
      console.log(
        `PRISMA: 📊 Итого загружено колонок Канбан: ${columns.length}`
      );
    } catch (error) {
      console.error('PRISMA: ❌ Ошибка при загрузке колонок Канбан:', error);
    }
  }

  // Загрузка задач
  async loadTasks(tasks: any[]) {
    try {
      console.log(`PRISMA: 📝 Начало загрузки ${tasks.length} задач`);
      await this.prisma.task.createMany({
        data: tasks,
        skipDuplicates: true,
      });
      console.log(`PRISMA: 📊 Итого загружено задач: ${tasks.length}`);
    } catch (error) {
      console.error('PRISMA: ❌ Ошибка при загрузке задач:', error);
    }
  }

  // Загрузка активных спринтов
  async loadUserActiveSprints(userActiveSprints: any[]) {
    try {
      console.log(
        `PRISMA: 📝 Начало загрузки ${userActiveSprints.length} активных спринтов`
      );
      await this.prisma.userActiveSprint.createMany({
        data: userActiveSprints,
        skipDuplicates: true,
      });
      console.log(
        `PRISMA: 📊 Итого загружено активных спринтов: ${userActiveSprints.length}`
      );
    } catch (error) {
      console.error('PRISMA: ❌ Ошибка при загрузке активных спринтов:', error);
    }
  }

  // Загрузка статусов задач
  async loadUserTaskStatuses(userTaskStatuses: any[]) {
    try {
      console.log(
        `PRISMA: 📝 Начало загрузки ${userTaskStatuses.length} статусов задач`
      );
      await this.prisma.userTaskStatus.createMany({
        data: userTaskStatuses,
        skipDuplicates: true,
      });
      console.log(
        `PRISMA: 📊 Итого загружено статусов задач: ${userTaskStatuses.length}`
      );
    } catch (error) {
      console.error('PRISMA: ❌ Ошибка при загрузке статусов задач:', error);
    }
  }

  // Получение статистики
  async getStats() {
    try {
      const [
        users,
        courses,
        sprints,
        kanbanColumns,
        tasks,
        userActiveSprints,
        userTaskStatuses,
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.course.count(),
        this.prisma.sprint.count(),
        this.prisma.kanbanColumn.count(),
        this.prisma.task.count(),
        this.prisma.userActiveSprint.count(),
        this.prisma.userTaskStatus.count(),
      ]);

      const stats = {
        users,
        courses,
        sprints,
        kanbanColumns,
        tasks,
        userActiveSprints,
        userTaskStatuses,
        lastUpdate: new Date().toISOString(),
      };

      console.log('PRISMA: 📊 Статистика базы данных:', stats);
      return stats;
    } catch (error) {
      console.error('PRISMA: ❌ Ошибка при получении статистики:', error);
      return null;
    }
  }
}

export const prismaService = new PrismaService();
