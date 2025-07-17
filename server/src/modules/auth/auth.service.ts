import { compare, hash } from 'bcrypt';
import { createHash } from 'crypto';
import { JWTPayload } from 'jose';

import { BaseService } from '@/core/base.service.js';
import { prisma } from '@/infrastructure/prisma/client.js';
import {
  generateRefreshTokenString,
  signAccessToken,
} from '@/shared/utils/jwt.js';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService extends BaseService {
  async register(
    email: string,
    password: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthTokens> {
    const exists = await prisma.user.findUnique({ where: { email } });
    this.throwIf(!!exists, 'User already exists');

    const hashed = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: email, // или другое значение по умолчанию
        updatedAt: new Date(),
        changePassword: new Date(),
      },
    });

    return this.generateTokens(
      { id: user.id, email: user.email },
      userAgent,
      ipAddress
    );
  }

  async login(
    email: string,
    password: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthTokens> {
    const user = await prisma.user.findUnique({ where: { email } });

    // Унифицированное сообщение об ошибке для предотвращения атак перечислением
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const match = await compare(password, user.password);
    if (!match) {
      throw new Error('Invalid credentials');
    }

    return this.generateTokens(
      {
        id: user.id,
        email: user.email,
      },
      userAgent,
      ipAddress
    );
  }

  async refresh(
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthTokens> {
    // Находим refresh token в БД
    const tokenHash = this.hashToken(refreshToken);
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: tokenHash },
      include: { user: true },
    });

    this.throwIf(!tokenRecord, 'Invalid refresh token', 401);
    this.throwIf(tokenRecord?.isRevoked ?? false, 'Refresh token revoked', 401);
    this.throwIf(
      (tokenRecord?.expiresAt as any) < new Date(),
      'Refresh token expired',
      401
    );

    if (
      tokenRecord?.userAgent &&
      userAgent &&
      tokenRecord.userAgent !== userAgent
    ) {
      console.warn(`User-Agent mismatch for user ${tokenRecord.user.id}`);
    }

    if (
      tokenRecord?.ipAddress &&
      ipAddress &&
      tokenRecord.ipAddress !== ipAddress
    ) {
      console.warn(`IP mismatch for user ${tokenRecord.user.id}`);
    }

    // Проверяем, не был ли токен уже использован (защита от reuse атак)
    if (tokenRecord?.isRevoked) {
      // Если токен был использован повторно, инвалидируем все токены пользователя
      await this.invalidateAllUserTokens(tokenRecord.user.id);
      throw new Error('Token reuse detected - all sessions invalidated');
    }

    // Генерируем новые токены
    const newTokens = await this.generateTokens(
      {
        id: tokenRecord?.user.id,
        email: tokenRecord?.user.email,
      },
      userAgent,
      ipAddress
    );

    // Удаляем старый refresh token (rotation)
    await prisma.refreshToken.delete({
      where: { id: tokenRecord?.id },
    });

    return newTokens;
  }

  async logout(userId: string): Promise<void> {
    // Удаляем все refresh токены пользователя
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async logoutByToken(refreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(refreshToken);

    await prisma.refreshToken.deleteMany({
      where: { token: tokenHash },
    });
  }

  // Очистка старых токенов (вызывать по расписанию)
  async cleanupExpiredTokens(): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  // Инвалидация всех токенов пользователя (при подозрении на компрометацию)
  private async invalidateAllUserTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }

  private async generateTokens(
    payload: JWTPayload,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthTokens> {
    const accessToken = await signAccessToken(payload);
    const refreshTokenString = generateRefreshTokenString();
    const refreshTokenHash = this.hashToken(refreshTokenString);

    // Сохраняем refresh token в БД с дополнительной информацией
    await prisma.refreshToken.create({
      data: {
        token: refreshTokenHash,
        userId: payload.id as string,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
        userAgent,
        ipAddress,
      },
    });

    return {
      accessToken,
      refreshToken: refreshTokenString,
    };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
