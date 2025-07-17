import { Router } from 'express';
import { authMiddleware, requireRole } from '../auth/auth.middleware.js';
import {
  createUserTaskStatus,
  deleteUserTaskStatus,
  getAllUserTaskStatuses,
  getUserTaskStatusById,
  updateUserTaskStatus,
} from './userTaskStatus.controller.js';

const router = Router();

// Все маршруты требуют аутентификации
router.use(authMiddleware);

// Создание статуса задачи - все авторизованные пользователи
router.post('/', createUserTaskStatus);

// Получение списка статусов - только админы и менеджеры
router.get('/list', requireRole(['ADMIN', 'MANAGER']), getAllUserTaskStatuses);

// Получение статуса по ID - с учетом ролей
router.get('/:id', getUserTaskStatusById);

// Обновление статуса - все авторизованные пользователи
router.put('/:id', updateUserTaskStatus);

// Удаление статуса - только админы
router.delete('/:id', requireRole(['ADMIN']), deleteUserTaskStatus);

export default router;
