import { Router } from 'express';
import {
  createUserActiveSprint,
  deleteUserActiveSprint,
  getAllUserActiveSprints,
  getUserActiveSprintById,
  updateUserActiveSprint,
} from './userActiveSprint.controller.js';

const router = Router();

router.post('/', createUserActiveSprint);
router.get('/list', getAllUserActiveSprints);
router.get('/:id', getUserActiveSprintById);
router.put('/:id', updateUserActiveSprint);
router.delete('/:id', deleteUserActiveSprint);

export default router;
