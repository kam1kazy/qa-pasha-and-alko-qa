import { Router } from 'express';
import { authMiddleware, requireRole } from '../auth/auth.middleware.js';
import {
  createComment,
  deleteComment,
  getAllComments,
  getCommentById,
  updateComment,
} from './comment.controller.js';

const router = Router();

// Все маршруты требуют аутентификации
router.use(authMiddleware);

// Создание комментариев - все авторизованные пользователи
router.post('/', createComment);

// Получение списка комментариев - все авторизованные пользователи
router.get('/list', getAllComments);

// Получение комментария по ID - все авторизованные пользователи
router.get('/:id', getCommentById);

// Обновление комментариев - только автор или админы/менеджеры
router.put('/:id', updateComment);

// Удаление комментариев - только автор или админы
router.delete('/:id', requireRole(['ADMIN', 'MANAGER']), deleteComment);

export default router;
