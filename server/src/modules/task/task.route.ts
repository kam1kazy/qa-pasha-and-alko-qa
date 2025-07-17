import { Router } from 'express';
import {
  authMiddleware,
  canReviewTaskInCourse,
  requireRole,
} from '../auth/auth.middleware.js';
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  getTasksForReview,
  getUserTasks,
  reviewTask,
  updateTask,
} from './task.controller.js';

const router = Router();

// Все маршруты требуют аутентификации
router.use(authMiddleware);

// Создание задач - только админы и менеджеры
router.post('/', requireRole(['ADMIN', 'MANAGER']), createTask);

// Получение списка задач - все авторизованные пользователи
router.get('/list', getAllTasks);

// Получение задачи по ID - все авторизованные пользователи
router.get('/:id', getTaskById);

// Обновление задач - только админы и менеджеры
router.put('/:id', requireRole(['ADMIN', 'MANAGER']), updateTask);

// Удаление задач - только админы
router.delete('/:id', requireRole(['ADMIN']), deleteTask);

// Ревью задач - только админы и менеджеры
router.post('/:id/review', canReviewTaskInCourse, reviewTask);

// Получение задач для ревью - только админы и менеджеры
router.get(
  '/review/list',
  requireRole(['ADMIN', 'MANAGER']),
  getTasksForReview
);

// Получение задач пользователя - с учетом ролей
router.get('/user/:userId', getUserTasks);

export default router;
