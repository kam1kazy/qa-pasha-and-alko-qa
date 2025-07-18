import { randomBytes } from 'crypto';
import { readFileSync } from 'fs';
import { importPKCS8, importSPKI, jwtVerify, SignJWT } from 'jose';
import { join } from 'path';

import { env } from '@/config/env.js';

// Поддержка как HMAC, так и RSA
let secret: Uint8Array;
let privateKey: any;
let publicKey: any;

// Инициализация ключей
const initializeKeys = async () => {
  if (env.JWT_ALGORITHM === 'RS256') {
    try {
      const privateKeyPem = readFileSync(
        join(process.cwd(), 'keys', 'private.pem'),
        'utf8'
      );
      const publicKeyPem = readFileSync(
        join(process.cwd(), 'keys', 'public.pem'),
        'utf8'
      );

      privateKey = await importPKCS8(privateKeyPem, 'RS256');
      publicKey = await importSPKI(publicKeyPem, 'RS256');
    } catch (error) {
      console.warn('RSA keys not found, falling back to HMAC');
      secret = new TextEncoder().encode(env.JWT_SECRET);
    }
  } else {
    secret = new TextEncoder().encode(env.JWT_SECRET);
  }
};

// Инициализируем ключи при загрузке модуля
initializeKeys();

export async function signAccessToken(payload: Record<string, unknown>) {
  const alg = env.JWT_ALGORITHM === 'RS256' ? 'RS256' : 'HS256';
  const key = env.JWT_ALGORITHM === 'RS256' ? privateKey : secret;

  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .sign(key);
}

export async function signRefreshToken(payload: Record<string, unknown>) {
  const alg = env.JWT_ALGORITHM === 'RS256' ? 'RS256' : 'HS256';
  const key = env.JWT_ALGORITHM === 'RS256' ? privateKey : secret;

  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(env.JWT_REFRESH_EXPIRES_IN)
    .sign(key);
}

export async function verifyJWT(token: string) {
  try {
    const key = env.JWT_ALGORITHM === 'RS256' ? publicKey : secret;
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch {
    return null;
  }
}

export function generateRefreshTokenString(): string {
  return randomBytes(32).toString('hex');
}
