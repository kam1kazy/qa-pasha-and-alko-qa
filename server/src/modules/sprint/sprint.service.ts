import { prisma } from '@/infrastructure/prisma/client.js';
import { CreateSprintDto, UpdateSprintDto } from './sprint.interface.js';

export class SprintService {
  async create(data: CreateSprintDto) {
    return prisma.sprint.create({ data });
  }

  async getAll() {
    return prisma.sprint.findMany();
  }

  async getById(id: string) {
    return prisma.sprint.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateSprintDto) {
    return prisma.sprint.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.sprint.delete({ where: { id } });
  }
}
