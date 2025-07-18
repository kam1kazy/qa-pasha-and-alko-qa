import { AsyncLocalStorage } from 'node:async_hooks';
import crypto from 'node:crypto';

import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { pino } from 'pino';
import { pinoHttp } from 'pino-http';

// Расширяем типы Express
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

export const asyncStorage = new AsyncLocalStorage<Map<string, string>>();

const logDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const isProd = process.env.NODE_ENV === 'production';

const destination = isProd
  ? pino.destination(path.join(logDir, 'app.log'))
  : undefined;

const baseLogger = pino(
  {
    level: isProd ? 'info' : 'debug',
    transport: isProd
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname,req,res',
            minimumLevel: 'error', // только ошибки
          },
        },
  },
  destination
);

// Для использования в сервисах
export const logger = baseLogger;

export function getRequestId(): string {
  const store = asyncStorage.getStore();
  return store?.get('request-id') || 'unknown';
}

// Middleware для установки requestId
export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = crypto.randomUUID();
  const store = new Map<string, string>();
  store.set('request-id', id);
  asyncStorage.run(store, () => {
    req.requestId = id; // Теперь TypeScript знает об этом свойстве
    next();
  });
};

// Middleware для pino-http
export const httpLogger = pinoHttp({
  logger: baseLogger,
  customProps: (req) => ({
    'request-id': (req as any).requestId || 'unknown',
    route: req.url,
  }),
});

// обёртка над логгером
export function getLoggerWithRequestId() {
  const requestId = getRequestId();
  return logger.child({ requestId });
}
