import { Router } from 'express';
import { authMiddleware, requireRole } from '../auth/auth.middleware.js';
import {
  createSprint,
  deleteSprint,
  getAllSprints,
  getSprintById,
  updateSprint,
} from './sprint.controller.js';

const router = Router();

// Все маршруты требуют аутентификации
router.use(authMiddleware);

// Создание спринтов - только админы
router.post('/', requireRole(['ADMIN']), createSprint);

// Получение списка спринтов - все авторизованные пользователи
router.get('/list', getAllSprints);

// Получение спринта по ID - все авторизованные пользователи
router.get('/:id', getSprintById);

// Обновление спринтов - только админы
router.put('/:id', requireRole(['ADMIN']), updateSprint);

// Удаление спринтов - только админы
router.delete('/:id', requireRole(['ADMIN']), deleteSprint);

export default router;
