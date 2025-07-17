import { Router } from 'express';
import multer from 'multer';
import { authMiddleware, requireRole } from '../auth/auth.middleware.js';
import {
  createAttachment,
  deleteAttachment,
  getAllAttachments,
  getAttachmentById,
  updateAttachment,
} from './attachment.controller.js';

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'application/pdf'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(null, false);
  },
});

const router = Router();

// Все маршруты требуют аутентификации
router.use(authMiddleware);

// Создание вложений - все авторизованные пользователи
router.post('/', upload.single('file'), createAttachment);

// Получение списка вложений - все авторизованные пользователи
router.get('/', getAllAttachments);

// Получение вложения по ID - все авторизованные пользователи
router.get('/:id', getAttachmentById);

// Обновление вложений - только админы и менеджеры
router.put('/:id', requireRole(['ADMIN', 'MANAGER']), updateAttachment);

// Удаление вложений - только админы и менеджеры
router.delete('/:id', requireRole(['ADMIN', 'MANAGER']), deleteAttachment);

export default router;
