import { Request, Response } from 'express';
import {
  createAttachmentSchema,
  updateAttachmentSchema,
} from './attachment.schema.js';
import { AttachmentService } from './attachment.service.js';

const service = new AttachmentService();

export const createAttachment = async (req: Request, res: Response) => {
  try {
    const data = createAttachmentSchema.parse(req.body);
    const attachment = await service.create(data);
    res.status(201).json(attachment);
  } catch (err: unknown) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getAllAttachments = async (_: Request, res: Response) => {
  const attachments = await service.getAll();
  res.json(attachments);
};

export const getAttachmentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const attachment = await service.getById(id);
  if (!attachment)
    return res.status(404).json({ message: 'Attachment not found' });
  res.json(attachment);
};

export const updateAttachment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateAttachmentSchema.parse(req.body);
    const attachment = await service.update(id, data);
    res.json(attachment);
  } catch (err: unknown) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const deleteAttachment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await service.delete(id);
    res.status(204).send();
  } catch (err: unknown) {
    res.status(400).json({ message: (err as Error).message });
  }
};
