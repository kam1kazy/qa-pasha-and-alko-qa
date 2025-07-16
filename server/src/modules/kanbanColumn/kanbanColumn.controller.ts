import { Request, Response } from 'express';
import {
  createKanbanColumnSchema,
  updateKanbanColumnSchema,
} from './kanbanColumn.schema.js';
import { KanbanColumnService } from './kanbanColumn.service.js';

const service = new KanbanColumnService();

export const createKanbanColumn = async (req: Request, res: Response) => {
  try {
    const data = createKanbanColumnSchema.parse(req.body);
    const column = await service.create(data);
    res.status(201).json(column);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllKanbanColumns = async (_: Request, res: Response) => {
  const columns = await service.getAll();
  res.json(columns);
};

export const getKanbanColumnById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const column = await service.getById(id);
  if (!column) return res.status(404).json({ message: 'Column not found' });
  res.json(column);
};

export const updateKanbanColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateKanbanColumnSchema.parse(req.body);
    const column = await service.update(id, data);
    res.json(column);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteKanbanColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await service.delete(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
