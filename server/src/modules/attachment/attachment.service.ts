import { prisma } from '@/infrastructure/prisma/client.js';
import {
  CreateAttachmentDto,
  UpdateAttachmentDto,
} from './attachment.interface.js';

export class AttachmentService {
  async create(data: CreateAttachmentDto) {
    return prisma.attachment.create({ data });
  }

  async getAll() {
    return prisma.attachment.findMany({ where: { deletedAt: null } });
  }

  async getById(id: string) {
    return prisma.attachment.findFirst({ where: { id, deletedAt: null } });
  }

  async update(id: string, data: UpdateAttachmentDto) {
    return prisma.attachment.update({ where: { id }, data });
  }

  async delete(id: string) {
    // Soft-delete
    return prisma.attachment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
