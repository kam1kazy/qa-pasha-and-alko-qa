import { prisma } from '@/infrastructure/prisma/client.js';
import { Logger } from 'pino';
import {
  CreateUserTaskStatusDto,
  UpdateUserTaskStatusDto,
} from './userTaskStatus.interface.js';

export class UserTaskStatusService {
  constructor(private log: Logger) {}

  async create(data: CreateUserTaskStatusDto) {
    this.log.info({ action: 'createUserTaskStatus', data });
    return prisma.userTaskStatus.create({ data });
  }

  async getAll() {
    this.log.info({ action: 'getAllUserTaskStatuses' });
    return prisma.userTaskStatus.findMany();
  }

  async getById(id: string) {
    this.log.info({ action: 'getUserTaskStatusById', id });
    return prisma.userTaskStatus.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateUserTaskStatusDto) {
    this.log.info({ action: 'updateUserTaskStatus', id, data });
    return prisma.userTaskStatus.update({ where: { id }, data });
  }

  async delete(id: string) {
    this.log.info({ action: 'deleteUserTaskStatus', id });
    return prisma.userTaskStatus.delete({ where: { id } });
  }
}
