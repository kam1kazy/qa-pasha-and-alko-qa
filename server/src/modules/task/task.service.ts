import { prisma } from '@/infrastructure/prisma/client.js';
import { getUserRoleInCourse } from '@/shared/utils/roles.js';
import { CreateTaskDto, UpdateTaskDto } from './task.interface.js';

export class TaskService {
  async create(data: CreateTaskDto) {
    return prisma.task.create({ data });
  }

  async getAll() {
    return prisma.task.findMany({ where: { deletedAt: null } });
  }

  async getById(id: string) {
    return prisma.task.findFirst({ where: { id, deletedAt: null } });
  }

  async update(id: string, data: UpdateTaskDto) {
    return prisma.task.update({ where: { id }, data });
  }

  async delete(id: string) {
    // Soft-delete
    return prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Ревью задачи (только для админов и менеджеров)
  async reviewTask(
    taskId: string,
    reviewerId: string,
    status: 'APPROVED' | 'REJECTED',
    comment?: string
  ): Promise<void> {
    const reviewer = await prisma.user.findUnique({
      where: { id: reviewerId },
    });

    if (!reviewer) throw new Error('Reviewer not found');

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { sprint: { include: { course: true } } },
    });
    if (!task) throw new Error('Task not found');
    const courseId = task.sprint.course.id;

    // Проверяем роль ревьюера в курсе задачи
    const userRole = await getUserRoleInCourse(reviewerId, courseId);
    if (!userRole || !['ADMIN', 'MANAGER'].includes(userRole)) {
      throw new Error('Access denied to this course');
    }

    await prisma.task.update({
      where: { id: taskId },
      data: {
        done: status === 'APPROVED',
        updatedAt: new Date(),
      },
    });
    if (comment) {
      await prisma.comment.create({
        data: { text: comment, taskId, userId: reviewerId },
      });
    }
  }

  // Получение задач для ревью (только для админов и менеджеров)
  async getTasksForReview(
    reviewerId: string,
    courseId?: string
  ): Promise<any[]> {
    const reviewer = await prisma.user.findUnique({
      where: { id: reviewerId },
    });
    if (!reviewer) throw new Error('Reviewer not found');

    let allowedCourseId = courseId;
    if (!allowedCourseId) {
      // Если не указан курс, ищем все курсы, где ревьюер менеджер или админ
      const roles = await prisma.courseRole.findMany({
        where: {
          userId: reviewerId,
          role: { in: ['ADMIN', 'MANAGER'] as any },
        },
        select: { courseId: true },
      });
      if (!roles.length) throw new Error('Нет доступа ни к одному курсу');
      allowedCourseId = roles[0].courseId;
    }
    const userRole = await getUserRoleInCourse(reviewerId, allowedCourseId);
    if (!userRole || !['ADMIN', 'MANAGER'].includes(userRole)) {
      throw new Error('Access denied to this course');
    }
    return prisma.task.findMany({
      where: {
        done: false,
        sprint: { courseId: allowedCourseId },
        deletedAt: null,
      },
      include: {
        sprint: { include: { course: true } },
        taskStatuses: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        comments: {
          include: { user: { select: { id: true, name: true, role: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Получение задач пользователя (с учетом ролей)
  async getUserTasks(userId: string, requesterId: string): Promise<any[]> {
    const requester = await prisma.user.findUnique({
      where: { id: requesterId },
    });
    if (!requester) throw new Error('Requester not found');
    if (requester.id === userId) {
      // Студент или любой пользователь может видеть свои задачи
      return prisma.task.findMany({
        where: { taskStatuses: { some: { userId } }, deletedAt: null },
        include: {
          sprint: { include: { course: true } },
          taskStatuses: { where: { userId } },
          comments: {
            include: { user: { select: { id: true, name: true, role: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }
    // Если менеджер или админ — проверяем роль в курсе пользователя
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) throw new Error('Target user not found');
    const courseId = targetUser.courseId;
    if (!courseId) throw new Error('Course ID is required');
    const userRole = await getUserRoleInCourse(requesterId, courseId!);
    if (!userRole || (userRole !== 'ADMIN' && userRole !== 'MANAGER')) {
      throw new Error('Access denied to this course');
    }
    return prisma.task.findMany({
      where: {
        taskStatuses: { some: { userId } },
        sprint: { courseId },
        deletedAt: null,
      },
      include: {
        sprint: { include: { course: true } },
        taskStatuses: { where: { userId } },
        comments: {
          include: { user: { select: { id: true, name: true, role: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
