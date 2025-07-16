import { Router } from 'express';
import {
  createKanbanColumn,
  deleteKanbanColumn,
  getAllKanbanColumns,
  getKanbanColumnById,
  updateKanbanColumn,
} from './kanbanColumn.controller.js';

const router = Router();

router.post('/', createKanbanColumn);
router.get('/', getAllKanbanColumns);
router.get('/:id', getKanbanColumnById);
router.put('/:id', updateKanbanColumn);
router.delete('/:id', deleteKanbanColumn);

export default router;
