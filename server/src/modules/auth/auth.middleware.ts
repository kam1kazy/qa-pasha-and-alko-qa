import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

import { env } from '@/config/env.js';
import { prisma } from '@/infrastructure/prisma/client.js';
import { verifyJWT } from '@/shared/utils/jwt.js';
import { getUserRoleInCourse } from '@/shared/utils/roles.js';

// CSRF защита для refresh endpoint
export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Проверяем, что запрос пришел с нашего домена
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // Разрешенные домены (в продакшене заменить на реальные)
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://yourdomain.com', // заменить на реальный домен
  ];

  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ message: 'CSRF protection: Invalid origin' });
  }

  if (referer && !allowedOrigins.some((domain) => referer.startsWith(domain))) {
    return res
      .status(403)
      .json({ message: 'CSRF protection: Invalid referer' });
  }

  next();
};

// Rate limiting для логина
export const loginRateLimit = rateLimit({
  windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS),
  max: parseInt(env.RATE_LIMIT_MAX_ATTEMPTS),
  message: {
    message: 'Слишком много попыток входа. Попробуйте позже.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req: Request, res: Response) => {
    // Логируем неудачную попытку
    await prisma.loginAttempt.create({
      data: {
        email: req.body.email || 'unknown',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        success: false,
      },
    });

    res.status(429).json({
      message: 'Слишком много попыток входа. Попробуйте позже.',
    });
  },
});

// Rate limiting для refresh endpoint
export const refreshRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 10, // максимум 10 refresh попыток
  message: {
    message: 'Слишком много попыток обновления токена.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Проверка блокировки пользователя
export const checkUserBlocked = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next();
    }

    // Проверяем последние неудачные попытки
    const recentFailures = await prisma.loginAttempt.count({
      where: {
        email,
        success: false,
        createdAt: {
          gte: new Date(
            Date.now() - parseInt(env.RATE_LIMIT_BLOCK_DURATION_MS)
          ),
        },
      },
    });

    if (recentFailures >= parseInt(env.RATE_LIMIT_MAX_ATTEMPTS)) {
      return res.status(429).json({
        message:
          'Аккаунт временно заблокирован из-за множественных неудачных попыток входа.',
      });
    }

    next();
  } catch (error) {
    next();
  }
};

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const token = auth.split(' ')[1];
    const payload = await verifyJWT(token);

    if (!payload) {
      throw new Error('Unauthorized. payload is null');
    }

    // Получаем полную информацию о пользователе из БД
    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      include: { course: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    (req as any).user = user;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Unauthorized' + e });
  }
}

// Middleware для проверки ролей
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        message: 'Forbidden: Insufficient permissions',
        requiredRoles: roles,
        userRole: user.role,
      });
    }

    next();
  };
};

// Middleware для проверки доступа к курсу
export const requireCourseAccess = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  const courseId = req.params.courseId || req.body.courseId;

  if (!courseId) {
    return res.status(400).json({ message: 'Course ID is required' });
  }

  // Админы имеют доступ ко всем курсам
  if (user.role === 'ADMIN') {
    return next();
  }

  // Проверяем, что пользователь принадлежит к курсу
  if (user.courseId !== courseId) {
    return res.status(403).json({
      message: 'Forbidden: No access to this course',
      userCourseId: user.courseId,
      requestedCourseId: courseId,
    });
  }

  next();
};

// Middleware для проверки роли пользователя в конкретном курсе
export const requireCourseRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const courseId = req.params.courseId || req.body.courseId;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Админы имеют доступ ко всем курсам
    if (user.role === 'ADMIN') {
      return next();
    }

    const userRole = await getUserRoleInCourse(user.id, courseId);
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({
        message: 'Forbidden: Insufficient permissions for this course',
      });
    }
    next();
  };
};

// Middleware для проверки владельца курса
export const requireCourseOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  const courseId = req.params.courseId || req.body.courseId;

  if (!courseId) {
    return res.status(400).json({ message: 'Course ID is required' });
  }

  // Проверяем, что пользователь является владельцем курса
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  if (course.ownerId !== user.id) {
    return res.status(403).json({
      message: 'Forbidden: Only course owner can perform this action',
    });
  }

  next();
};

// Middleware для проверки возможности ревью задач с учетом курса
export const canReviewTaskInCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  const taskId = req.params.taskId || req.params.id || req.body.taskId;

  if (!taskId) {
    return res.status(400).json({ message: 'Task ID is required' });
  }

  // Получаем задачу с информацией о курсе
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      sprint: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const courseId = task.sprint.course.id;

  // Админы могут ревьюить любые задачи
  if (user.role === 'ADMIN') {
    return next();
  }

  const userRole = await getUserRoleInCourse(user.id, courseId);
  if (!userRole || !['ADMIN', 'MANAGER'].includes(userRole)) {
    return res.status(403).json({
      message:
        'Forbidden: Only admins and managers can review tasks in this course',
    });
  }

  next();
};

// Функция для проверки роли пользователя в курсе
export const userHasRoleInCourse = async (
  userId: string,
  courseId: string,
  role: string
): Promise<boolean> => {
  const courseRole = await prisma.courseRole.findFirst({
    where: {
      userId,
      courseId,
      role: role as any,
    },
  });

  return !!courseRole;
};
