import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

import { env } from '@/config/env.js';
import { prisma } from '@/infrastructure/prisma/client.js';
import { verifyJWT } from '@/shared/utils/jwt.js';

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

    (req as any).user = payload;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Unauthorized' + e });
  }
}
