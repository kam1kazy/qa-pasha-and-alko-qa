import { prisma } from '@/infrastructure/prisma/client.js';
import { CreateCommentDto, UpdateCommentDto } from './comment.interface.js';

export class CommentService {
  async create(data: CreateCommentDto) {
    return prisma.comment.create({ data });
  }

  async getAll() {
    return prisma.comment.findMany();
  }

  async getById(id: string) {
    return prisma.comment.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateCommentDto) {
    return prisma.comment.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.comment.delete({ where: { id } });
  }
}
