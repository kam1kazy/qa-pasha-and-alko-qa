import { compare, hash } from 'bcrypt';
import { JWTPayload, SignJWT } from 'jose';

import { env } from '@/config/env.js';
import { BaseService } from '@/core/base.service.js';
import { prisma } from '@/infrastructure/prisma/client.js';

export class AuthService extends BaseService {
  private secret = new TextEncoder().encode(env.JWT_SECRET);

  async register(email: string, password: string) {
    const exists = await prisma.user.findUnique({ where: { email } });
    this.throwIf(!!exists, 'User already exists');

    const hashed = await hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed },
    });

    return this.generateToken({ id: user.id, email: user.email });
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    this.throwIf(!user, 'User not found', 404);

    const match = await compare(password, user.password);
    this.throwIf(!match, 'Invalid password');

    return this.generateToken({ id: user.id, email: user.email });
  }

  private async generateToken(payload: JWTPayload) {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(env.JWT_EXPIRES_IN)
      .sign(this.secret);
  }
}
