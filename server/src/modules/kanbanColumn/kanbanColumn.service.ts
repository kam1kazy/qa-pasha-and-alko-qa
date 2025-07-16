import { prisma } from '@/infrastructure/prisma/client.js';
import {
  CreateKanbanColumnDto,
  UpdateKanbanColumnDto,
} from './kanbanColumn.interface.js';

export class KanbanColumnService {
  async create(data: CreateKanbanColumnDto) {
    return prisma.kanbanColumn.create({ data });
  }

  async getAll() {
    return prisma.kanbanColumn.findMany();
  }

  async getById(id: string) {
    return prisma.kanbanColumn.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateKanbanColumnDto) {
    return prisma.kanbanColumn.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.kanbanColumn.delete({ where: { id } });
  }
}
