import { prisma } from '@/infrastructure/prisma/client.js';
import {
  CreateUserActiveSprintDto,
  UpdateUserActiveSprintDto,
} from './userActiveSprint.interface.js';

export class UserActiveSprintService {
  async create(data: CreateUserActiveSprintDto) {
    return prisma.userActiveSprint.create({ data });
  }

  async getAll() {
    return prisma.userActiveSprint.findMany();
  }

  async getById(id: string) {
    return prisma.userActiveSprint.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateUserActiveSprintDto) {
    return prisma.userActiveSprint.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.userActiveSprint.delete({ where: { id } });
  }
}
