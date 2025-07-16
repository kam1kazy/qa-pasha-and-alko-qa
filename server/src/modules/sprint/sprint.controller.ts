import { Request, Response } from 'express';
import { createSprintSchema, updateSprintSchema } from './sprint.schema.js';
import { SprintService } from './sprint.service.js';

const service = new SprintService();

export const createSprint = async (req: Request, res: Response) => {
  try {
    const data = createSprintSchema.parse(req.body);
    const sprint = await service.create(data);
    res.status(201).json(sprint);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllSprints = async (_: Request, res: Response) => {
  const sprints = await service.getAll();
  res.json(sprints);
};

export const getSprintById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const sprint = await service.getById(id);
  if (!sprint) return res.status(404).json({ message: 'Sprint not found' });
  res.json(sprint);
};

export const updateSprint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateSprintSchema.parse(req.body);
    const sprint = await service.update(id, data);
    res.json(sprint);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteSprint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await service.delete(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
