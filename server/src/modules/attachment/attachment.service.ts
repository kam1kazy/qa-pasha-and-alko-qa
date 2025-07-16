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
    return prisma.attachment.findMany();
  }

  async getById(id: string) {
    return prisma.attachment.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateAttachmentDto) {
    return prisma.attachment.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.attachment.delete({ where: { id } });
  }
}
