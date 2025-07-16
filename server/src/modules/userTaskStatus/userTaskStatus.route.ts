import { Router } from 'express';
import {
  createUserTaskStatus,
  deleteUserTaskStatus,
  getAllUserTaskStatuses,
  getUserTaskStatusById,
  updateUserTaskStatus,
} from './userTaskStatus.controller.js';

const router = Router();

router.post('/', createUserTaskStatus);
router.get('/', getAllUserTaskStatuses);
router.get('/:id', getUserTaskStatusById);
router.put('/:id', updateUserTaskStatus);
router.delete('/:id', deleteUserTaskStatus);

export default router;
