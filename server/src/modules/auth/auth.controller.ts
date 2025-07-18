import { Request, Response } from 'express';

import { prisma } from '@/infrastructure/prisma/client.js';
import { RegisterSchema } from './auth.schema.js';
import { AuthService } from './auth.service.js';

const service = new AuthService();

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // true только в продакшене
  sameSite: 'strict' as const, // защита от CSRF
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 дней
  path: '/',
  domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined, // в продакшене
};

// Логирование попытки входа
const logLoginAttempt = async (
  email: string,
  ipAddress: string,
  success: boolean,
  userId?: string
) => {
  try {
    await prisma.loginAttempt.create({
      data: {
        email,
        ipAddress,
        success,
        userId,
      },
    });
  } catch (error) {
    console.error('Failed to log login attempt:', error);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = RegisterSchema.parse(req.body);

    const userAgent = req.headers['user-agent'];
    const ipAddress =
      req.ip ||
      req.connection.remoteAddress ||
      (req.headers['x-forwarded-for'] as string);

    const tokens = await service.register(
      email,
      password,
      userAgent,
      ipAddress
    );

    // Логируем успешную регистрацию
    await logLoginAttempt(email, req.ip || 'unknown', true);

    res.cookie('refreshToken', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
    res.json({ accessToken: tokens.accessToken });
  } catch (err: any) {
    // Логируем неудачную попытку регистрации
    await logLoginAttempt(
      req.body.email || 'unknown',
      req.ip || 'unknown',
      false
    );
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = RegisterSchema.parse(req.body);

    const userAgent = req.headers['user-agent'];
    const ipAddress =
      req.ip ||
      req.connection.remoteAddress ||
      (req.headers['x-forwarded-for'] as string);

    const tokens = await service.login(email, password, userAgent, ipAddress);

    // Получаем пользователя для логирования
    const user = await prisma.user.findUnique({ where: { email } });

    // Логируем успешный вход
    await logLoginAttempt(email, req.ip || 'unknown', true, user?.id);

    res.cookie('refreshToken', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
    res.json({ accessToken: tokens.accessToken });
  } catch (err: any) {
    // Логируем неудачную попытку входа
    await logLoginAttempt(
      req.body.email || 'unknown',
      req.ip || 'unknown',
      false
    );
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token' });
    }

    const userAgent = req.headers['user-agent'];
    const ipAddress =
      req.ip ||
      req.connection.remoteAddress ||
      (req.headers['x-forwarded-for'] as string);

    const tokens = await service.refresh(refreshToken, userAgent, ipAddress);
    res.cookie('refreshToken', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
    res.json({ accessToken: tokens.accessToken });
  } catch (err: any) {
    res.status(err.statusCode || 401).json({ message: err.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await service.logoutByToken(refreshToken);
    }
    res.clearCookie('refreshToken', {
      path: '/',
      domain:
        process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined,
    });
    res.json({ message: 'Logged out' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Назначение роли пользователю (только для админов)
export const assignRole = async (req: Request, res: Response) => {
  try {
    const { userId, role, courseId } = req.body;
    const adminId = (req as any).user.id;

    await service.assignRole(adminId, userId, role, courseId);

    res.status(200).json({
      message: 'Role assigned successfully',
      userId,
      role,
      courseId,
    });
  } catch (err: any) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

// Получение пользователей курса
export const getCourseUsers = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const requesterId = (req as any).user.id;

    const users = await service.getCourseUsers(courseId, requesterId);

    res.status(200).json({
      users,
      courseId,
    });
  } catch (err: any) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

// Создание курса (только для админов)
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const adminId = (req as any).user.id;

    const course = await service.createCourse(adminId, title, description);

    res.status(201).json({
      message: 'Course created successfully',
      course,
    });
  } catch (err: any) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

// Добавление пользователя в курс
export const addUserToCourse = async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.body;
    const adminId = (req as any).user.id;

    await service.addUserToCourse(adminId, userId, courseId);

    res.status(200).json({
      message: 'User added to course successfully',
      userId,
      courseId,
    });
  } catch (err: any) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

// Получение статистики курса
export const getCourseStats = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const requesterId = (req as any).user.id;

    const stats = await service.getCourseStats(courseId, requesterId);

    res.status(200).json({
      stats,
      courseId,
    });
  } catch (err: any) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};
