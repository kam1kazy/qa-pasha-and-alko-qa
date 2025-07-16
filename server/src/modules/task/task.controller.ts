import { Request, Response } from 'express';
import { createTaskSchema, updateTaskSchema } from './task.schema.js';
import { TaskService } from './task.service.js';

const service = new TaskService();

export const createTask = async (req: Request, res: Response) => {
  try {
    const data = createTaskSchema.parse(req.body);
    const task = await service.create(data);
    res.status(201).json(task);
  } catch (err: unknown) {
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
  } catch (err: unknown) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await service.delete(id);
    res.status(204).send();
  } catch (err: unknown) {
    res.status(400).json({ message: err.message });
  }
};
