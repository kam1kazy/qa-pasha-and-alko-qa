import { getLoggerWithRequestId } from '@/config/logger.js';
import { Request, Response } from 'express';
import {
  createUserTaskStatusSchema,
  updateUserTaskStatusSchema,
} from './userTaskStatus.schema.js';
import { UserTaskStatusService } from './userTaskStatus.service.js';

function getService() {
  const log = getLoggerWithRequestId();
  return new UserTaskStatusService(log);
}

export const createUserTaskStatus = async (req: Request, res: Response) => {
  const service = getService();

  try {
    const data = createUserTaskStatusSchema.parse(req.body);
    const status = await service.create(data);
    res.status(201).json(status);
  } catch (err: unknown) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllUserTaskStatuses = async (_: Request, res: Response) => {
  const service = getService();

  const statuses = await service.getAll();
  res.json(statuses);
};

export const getUserTaskStatusById = async (req: Request, res: Response) => {
  const service = getService();

  const { id } = req.params;
  const status = await service.getById(id);

  if (!status)
    return res.status(404).json({ message: 'UserTaskStatus not found' });
  res.json(status);
};

export const updateUserTaskStatus = async (req: Request, res: Response) => {
  const service = getService();

  try {
    const { id } = req.params;
    const data = updateUserTaskStatusSchema.parse(req.body);
    const status = await service.update(id, data);
    res.json(status);
  } catch (err: unknown) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteUserTaskStatus = async (req: Request, res: Response) => {
  const service = getService();

  try {
    const { id } = req.params;
    await service.delete(id);
    res.status(204).send();
  } catch (err: unknown) {
    res.status(400).json({ message: err.message });
  }
};
