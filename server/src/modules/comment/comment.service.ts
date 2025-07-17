import { prisma } from '@/infrastructure/prisma/client.js';
import { CreateCommentDto, UpdateCommentDto } from './comment.interface.js';

export class CommentService {
  async create(data: CreateCommentDto) {
    return prisma.comment.create({ data });
  }

  async getAll() {
    return prisma.comment.findMany({ where: { deletedAt: null } });
  }

  async getById(id: string) {
    return prisma.comment.findFirst({ where: { id, deletedAt: null } });
  }

  async update(id: string, data: UpdateCommentDto) {
    return prisma.comment.update({ where: { id }, data });
  }

  async delete(id: string) {
    // Soft-delete
    return prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
