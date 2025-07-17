import { Router } from 'express';

import {
  addUserToCourse,
  assignRole,
  createCourse,
  getCourseStats,
  getCourseUsers,
  login,
  logout,
  refresh,
  register,
} from './auth.controller.js';
import {
  authMiddleware,
  checkUserBlocked,
  loginRateLimit,
  requireCourseAccess,
  requireRole,
} from './auth.middleware.js';

const router = Router();

// Публичные маршруты
router.post('/register', register);
router.post('/login', loginRateLimit, checkUserBlocked, login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Защищенные маршруты (требуют аутентификации)
router.use(authMiddleware);

// Маршруты для админов
router.post('/assign-role', requireRole(['ADMIN']), assignRole);
router.post('/create-course', requireRole(['ADMIN']), createCourse);
router.post('/add-user-to-course', requireRole(['ADMIN']), addUserToCourse);

// Маршруты для всех авторизованных пользователей
router.get('/course/:courseId/users', requireCourseAccess, getCourseUsers);
router.get('/course/:courseId/stats', requireCourseAccess, getCourseStats);

export default router;
