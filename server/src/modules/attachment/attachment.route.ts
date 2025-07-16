import { Router } from 'express';
import {
  createAttachment,
  deleteAttachment,
  getAllAttachments,
  getAttachmentById,
  updateAttachment,
} from './attachment.controller.js';

const router = Router();

router.post('/', createAttachment);
router.get('/', getAllAttachments);
router.get('/:id', getAttachmentById);
router.put('/:id', updateAttachment);
router.delete('/:id', deleteAttachment);

export default router;
