import { Request, Response } from 'express';
import { createCommentSchema, updateCommentSchema } from './comment.schema.js';
import { CommentService } from './comment.service.js';

const service = new CommentService();

export const createComment = async (req: Request, res: Response) => {
  try {
    const data = createCommentSchema.parse(req.body);
    const comment = await service.create(data);
    res.status(201).json(comment);
  } catch (err: unknown) {
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
    const data = updateCommentSchema.parse(req.body);
    const comment = await service.update(id, data);
    res.json(comment);
  } catch (err: unknown) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await service.delete(id);
    res.status(204).send();
  } catch (err: unknown) {
    res.status(400).json({ message: err.message });
  }
};
