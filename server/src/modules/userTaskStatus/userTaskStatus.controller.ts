import { getLoggerWithRequestId } from '@/config/logger.js';
import { prisma } from '@/infrastructure/prisma/client.js';
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
    // Добавляем ID пользователя из токена
    const userId = (req as any).user.id;
    const status = await service.create({ ...data, userId });
    res.status(201).json(status);
  } catch (err: any) {
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
  const requesterId = (req as any).user.id;
  const requesterRole = (req as any).user.role;

  const status = await service.getById(id);

  if (!status)
    return res.status(404).json({ message: 'UserTaskStatus not found' });

  // Проверяем права доступа
  if (requesterRole === 'STUDENT') {
    if (status.userId !== requesterId)
      return res
        .status(403)
        .json({ message: 'You can only view your own task statuses' });
  } else if (requesterRole === 'MANAGER') {
    // Менеджеры могут видеть статусы учеников своего курса
    const requester = await prisma.user.findUnique({
      where: { id: requesterId },
    });
    const statusUser = await prisma.user.findUnique({
      where: { id: status.userId },
    });

    if (requester?.courseId !== statusUser?.courseId)
      return res.status(403).json({ message: 'Access denied' });
  }

  res.json(status);
};

export const updateUserTaskStatus = async (req: Request, res: Response) => {
  const service = getService();

  try {
    const { id } = req.params;
    const requesterId = (req as any).user.id;
    const requesterRole = (req as any).user.role;

    const status = await service.getById(id);

    if (!status)
      return res.status(404).json({ message: 'UserTaskStatus not found' });

    // Проверяем права на обновление
    if (requesterRole === 'STUDENT') {
      if (status.userId !== requesterId) {
        return res
          .status(403)
          .json({ message: 'You can only update your own task statuses' });
      }
    } else if (requesterRole === 'MANAGER') {
      // Менеджеры могут обновлять статусы учеников своего курса
      const requester = await prisma.user.findUnique({
        where: { id: requesterId },
      });
      const statusUser = await prisma.user.findUnique({
        where: { id: status.userId },
      });

      if (requester?.courseId !== statusUser?.courseId) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const data = updateUserTaskStatusSchema.parse(req.body);
    const updatedStatus = await service.update(id, data);
    res.json(updatedStatus);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteUserTaskStatus = async (req: Request, res: Response) => {
  const service = getService();

  try {
    const { id } = req.params;
    await service.delete(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
