import { Router } from 'express';
import {
  createSprint,
  deleteSprint,
  getAllSprints,
  getSprintById,
  updateSprint,
} from './sprint.controller.js';

const router = Router();

router.post('/', createSprint);
router.get('/', getAllSprints);
router.get('/:id', getSprintById);
router.put('/:id', updateSprint);
router.delete('/:id', deleteSprint);

export default router;
