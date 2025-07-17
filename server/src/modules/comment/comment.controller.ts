import { prisma } from '@/infrastructure/prisma/client.js';
import { Request, Response } from 'express';
import { createCommentSchema, updateCommentSchema } from './comment.schema.js';
import { CommentService } from './comment.service.js';

const service = new CommentService();

export const createComment = async (req: Request, res: Response) => {
  try {
    const data = createCommentSchema.parse(req.body);
    // Добавляем ID пользователя из токена
    const userId = (req as any).user.id;
    const comment = await service.create({ ...data, userId });
    res.status(201).json(comment);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllComments = async (_: Request, res: Response) => {
  const comments = await service.getAll();
  res.json(comments);
};

export const getCommentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const comment = await service.getById(id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  res.json(comment);
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    // Проверяем, что комментарий существует
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Проверяем права на редактирование
    if (comment.userId !== userId && !['ADMIN', 'MANAGER'].includes(userRole))
      return res
        .status(403)
        .json({ message: 'You can only edit your own comments' });

    const data = updateCommentSchema.parse(req.body);
    const updatedComment = await service.update(id, data);
    res.json(updatedComment);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    // Проверяем, что комментарий существует
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Проверяем права на удаление
    if (comment.userId !== userId && !['ADMIN'].includes(userRole))
      return res
        .status(403)
        .json({ message: 'You can only delete your own comments' });

    await service.delete(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
