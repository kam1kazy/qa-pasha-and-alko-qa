import { Request, Response } from 'express';
import { createTaskSchema, updateTaskSchema } from './task.schema.js';
import { TaskService } from './task.service.js';

const service = new TaskService();

export const createTask = async (req: Request, res: Response) => {
  try {
    const data = createTaskSchema.parse(req.body);
    const task = await service.create(data);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllTasks = async (_: Request, res: Response) => {
  const tasks = await service.getAll();
  res.json(tasks);
};

export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await service.getById(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateTaskSchema.parse(req.body);
    const task = await service.update(id, data);
    res.json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await service.delete(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Ревью задачи (только для админов и менеджеров)
export const reviewTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;
    const reviewerId = (req as any).user.id;

    await service.reviewTask(id, reviewerId, status, comment);

    res.status(200).json({
      message: 'Task reviewed successfully',
      taskId: id,
      status,
      comment,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Получение задач для ревью (только для админов и менеджеров)
export const getTasksForReview = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.query;
    const reviewerId = (req as any).user.id;

    const tasks = await service.getTasksForReview(
      reviewerId,
      courseId as string
    );

    res.status(200).json({
      tasks,
      total: tasks.length,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Получение задач пользователя (с учетом ролей)
export const getUserTasks = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const requesterId = (req as any).user.id;

    const tasks = await service.getUserTasks(userId, requesterId);

    res.status(200).json({
      tasks,
      total: tasks.length,
      userId,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
