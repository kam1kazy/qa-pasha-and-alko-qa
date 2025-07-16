import { Request, Response } from 'express';
import {
  createUserActiveSprintSchema,
  updateUserActiveSprintSchema,
} from './userActiveSprint.schema.js';
import { UserActiveSprintService } from './userActiveSprint.service.js';

const service = new UserActiveSprintService();

export const createUserActiveSprint = async (req: Request, res: Response) => {
  try {
    const data = createUserActiveSprintSchema.parse(req.body);
    const activeSprint = await service.create(data);
    res.status(201).json(activeSprint);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllUserActiveSprints = async (_: Request, res: Response) => {
  const activeSprints = await service.getAll();
  res.json(activeSprints);
};

export const getUserActiveSprintById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const activeSprint = await service.getById(id);
  if (!activeSprint)
    return res.status(404).json({ message: 'UserActiveSprint not found' });
  res.json(activeSprint);
};

export const updateUserActiveSprint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateUserActiveSprintSchema.parse(req.body);
    const activeSprint = await service.update(id, data);
    res.json(activeSprint);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteUserActiveSprint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await service.delete(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
