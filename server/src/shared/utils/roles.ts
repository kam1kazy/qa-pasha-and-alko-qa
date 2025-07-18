import { prisma } from '@/infrastructure/prisma/client.js';

export async function getUserRoleInCourse(userId: string, courseId: string) {
  const courseRole = await prisma.courseRole.findFirst({
    where: { userId, courseId },
  });
  return courseRole?.role || null;
}
