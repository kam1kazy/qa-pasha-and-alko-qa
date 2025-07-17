import { compare, hash } from 'bcrypt';
import { createHash } from 'crypto';
import { JWTPayload } from 'jose';

import { BaseService } from '@/core/base.service.js';
import { prisma } from '@/infrastructure/prisma/client.js';
import {
  generateRefreshTokenString,
  signAccessToken,
} from '@/shared/utils/jwt.js';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService extends BaseService {
  async register(
    email: string,
    password: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthTokens> {
    const exists = await prisma.user.findUnique({ where: { email } });
    this.throwIf(!!exists, 'User already exists');

    const hashed = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: email, // или другое значение по умолчанию
        updatedAt: new Date(),
        changePassword: new Date(),
      },
    });

    return this.generateTokens(
      { id: user.id, email: user.email },
      userAgent,
      ipAddress
    );
  }

  async login(
    email: string,
    password: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthTokens> {
    const user = await prisma.user.findUnique({ where: { email } });

    // Унифицированное сообщение об ошибке для предотвращения атак перечислением
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const match = await compare(password, user.password);
    if (!match) {
      throw new Error('Invalid credentials');
    }

    return this.generateTokens(
      {
        id: user.id,
        email: user.email,
      },
      userAgent,
      ipAddress
    );
  }

  async refresh(
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthTokens> {
    // Находим refresh token в БД
    const tokenHash = this.hashToken(refreshToken);
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: tokenHash },
      include: { user: true },
    });

    this.throwIf(!tokenRecord, 'Invalid refresh token', 401);
    this.throwIf(tokenRecord?.isRevoked ?? false, 'Refresh token revoked', 401);
    this.throwIf(
      (tokenRecord?.expiresAt as any) < new Date(),
      'Refresh token expired',
      401
    );

    if (
      tokenRecord?.userAgent &&
      userAgent &&
      tokenRecord.userAgent !== userAgent
    ) {
      console.warn(`User-Agent mismatch for user ${tokenRecord.user.id}`);
    }

    if (
      tokenRecord?.ipAddress &&
      ipAddress &&
      tokenRecord.ipAddress !== ipAddress
    ) {
      console.warn(`IP mismatch for user ${tokenRecord.user.id}`);
    }

    // Проверяем, не был ли токен уже использован (защита от reuse атак)
    if (tokenRecord?.isRevoked) {
      // Если токен был использован повторно, инвалидируем все токены пользователя
      await this.invalidateAllUserTokens(tokenRecord.user.id);
      throw new Error('Token reuse detected - all sessions invalidated');
    }

    // Генерируем новые токены
    const newTokens = await this.generateTokens(
      {
        id: tokenRecord?.user.id,
        email: tokenRecord?.user.email,
      },
      userAgent,
      ipAddress
    );

    // Удаляем старый refresh token (rotation)
    await prisma.refreshToken.delete({
      where: { id: tokenRecord?.id },
    });

    return newTokens;
  }

  async logout(userId: string): Promise<void> {
    // Удаляем все refresh токены пользователя
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async logoutByToken(refreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(refreshToken);

    await prisma.refreshToken.deleteMany({
      where: { token: tokenHash },
    });
  }

  // Очистка старых токенов (вызывать по расписанию)
  async cleanupExpiredTokens(): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  // Инвалидация всех токенов пользователя (при подозрении на компрометацию)
  private async invalidateAllUserTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }

  private async generateTokens(
    payload: JWTPayload,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthTokens> {
    const accessToken = await signAccessToken(payload);
    const refreshTokenString = generateRefreshTokenString();
    const refreshTokenHash = this.hashToken(refreshTokenString);

    // Сохраняем refresh token в БД с дополнительной информацией
    await prisma.refreshToken.create({
      data: {
        token: refreshTokenHash,
        userId: payload.id as string,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
        userAgent,
        ipAddress,
      },
    });

    return {
      accessToken,
      refreshToken: refreshTokenString,
    };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  // Метод для назначения роли пользователю (только для админов)
  async assignRole(
    adminId: string,
    userId: string,
    role: string,
    courseId?: string
  ): Promise<void> {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    this.throwIf(!admin, 'Admin not found');
    this.throwIf(admin?.role !== 'ADMIN', 'Only admins can assign roles');

    // Проверяем, что админ не назначает роль самому себе
    this.throwIf(adminId === userId, 'Cannot assign role to yourself');

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    this.throwIf(!user, 'User not found');

    // Проверяем, что не назначается второй админ (если не предусмотрено)
    if (role === 'ADMIN') {
      const existingAdmin = await prisma.courseRole.findFirst({
        where: {
          courseId: courseId!,
          role: 'ADMIN',
        },
      });
      this.throwIf(!!existingAdmin, 'Course already has an admin');
    }

    // Если назначается менеджер, проверяем что он состоит в курсе
    if (role === 'MANAGER' && courseId) {
      const userInCourse = await prisma.user.findFirst({
        where: {
          id: userId,
          courseId: courseId,
        },
      });
      this.throwIf(
        !userInCourse,
        'User must be enrolled in the course to be assigned as manager'
      );
    }

    // Создаем или обновляем роль в курсе
    if (courseId) {
      await prisma.courseRole.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        update: {
          role: role as any,
        },
        create: {
          userId,
          courseId,
          role: role as any,
        },
      });
    } else {
      // Обновляем глобальную роль пользователя
      await prisma.user.update({
        where: { id: userId },
        data: {
          role: role as any,
        },
      });
    }
  }

  // Метод для получения всех пользователей курса (для админов и менеджеров)
  async getCourseUsers(courseId: string, requesterId: string): Promise<any[]> {
    const requester = await prisma.user.findUnique({
      where: { id: requesterId },
    });

    this.throwIf(!requester, 'Requester not found');

    // Проверяем права доступа
    if (requester?.role === 'STUDENT') {
      this.throwIf(requester?.courseId !== courseId, 'Access denied');
      // Студенты видят только себя
      return [requester];
    }

    // Проверяем роль в курсе для админов и менеджеров
    if (requester?.role !== 'ADMIN') {
      const courseRole = await prisma.courseRole.findFirst({
        where: {
          userId: requesterId,
          courseId,
          role: ['ADMIN', 'MANAGER'] as any,
        },
      });
      this.throwIf(!courseRole, 'Access denied to this course');
    }

    // Получаем пользователей курса с их ролями
    const courseRoles = await prisma.courseRole.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    return courseRoles.map((cr) => ({
      ...cr.user,
      courseRole: cr.role,
    }));
  }

  // Метод для создания курса (только для админов)
  async createCourse(
    adminId: string,
    title: string,
    description?: string
  ): Promise<any> {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    this.throwIf(!admin, 'Admin not found');
    this.throwIf(admin?.role !== 'ADMIN', 'Only admins can create courses');

    const course = await prisma.course.create({
      data: {
        title,
        description,
        ownerId: adminId,
      },
    });

    // Автоматически назначаем создателя курса как админа курса
    await prisma.courseRole.create({
      data: {
        userId: adminId,
        courseId: course.id,
        role: 'ADMIN',
      },
    });

    return course;
  }

  // Метод для добавления пользователя в курс
  async addUserToCourse(
    adminId: string,
    userId: string,
    courseId: string
  ): Promise<void> {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    this.throwIf(!admin, 'Admin not found');
    this.throwIf(
      admin?.role !== 'ADMIN',
      'Only admins can add users to courses'
    );

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    this.throwIf(!course, 'Course not found');
    this.throwIf(
      course?.ownerId !== adminId,
      'Only course owner can add users'
    );

    // Добавляем пользователя в курс
    await prisma.user.update({
      where: { id: userId },
      data: { courseId },
    });

    // Создаем роль студента в курсе
    await prisma.courseRole.create({
      data: {
        userId,
        courseId,
        role: 'STUDENT',
      },
    });
  }

  // Метод для получения статистики курса
  async getCourseStats(courseId: string, requesterId: string): Promise<any> {
    const requester = await prisma.user.findUnique({
      where: { id: requesterId },
    });

    this.throwIf(!requester, 'Requester not found');

    // Проверяем права доступа
    if (requester?.role === 'STUDENT') {
      this.throwIf(requester?.courseId !== courseId, 'Access denied');
      // Студенты видят только свою статистику
      return await this.getUserStats(requesterId);
    }

    // Админы и менеджеры видят статистику всего курса
    const users = await prisma.user.findMany({
      where: { courseId },
      include: {
        taskStatuses: {
          include: { task: true },
        },
      },
    });

    const stats = {
      totalUsers: users.length,
      students: users.filter((u) => u.role === 'STUDENT').length,
      managers: users.filter((u) => u.role === 'MANAGER').length,
      completedTasks: 0,
      inProgressTasks: 0,
      pendingTasks: 0,
    };

    users.forEach((user) => {
      user.taskStatuses.forEach((status) => {
        switch (status.status) {
          case 'DONE':
            stats.completedTasks++;
            break;
          case 'IN_PROGRESS':
            stats.inProgressTasks++;
            break;
          case 'TODO':
            stats.pendingTasks++;
            break;
        }
      });
    });

    return stats;
  }

  // Метод для получения статистики пользователя
  private async getUserStats(userId: string): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        taskStatuses: {
          include: { task: true },
        },
      },
    });

    if (!user) return null;

    const stats = {
      completedTasks: 0,
      inProgressTasks: 0,
      pendingTasks: 0,
      totalTasks: user.taskStatuses.length,
    };

    user.taskStatuses.forEach((status) => {
      switch (status.status) {
        case 'DONE':
          stats.completedTasks++;
          break;
        case 'IN_PROGRESS':
          stats.inProgressTasks++;
          break;
        case 'TODO':
          stats.pendingTasks++;
          break;
      }
    });

    return stats;
  }
}
