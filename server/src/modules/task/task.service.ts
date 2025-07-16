import { prisma } from '@/infrastructure/prisma/client.js';
import { CreateTaskDto, UpdateTaskDto } from './task.interface.js';

export class TaskService {
  async create(data: CreateTaskDto) {
    return prisma.task.create({ data });
  }

  async getAll() {
    return prisma.task.findMany();
  }

  async getById(id: string) {
    return prisma.task.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateTaskDto) {
    return prisma.task.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.task.delete({ where: { id } });
  }
}
