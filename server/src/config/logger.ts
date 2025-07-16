import { AsyncLocalStorage } from 'node:async_hooks';
import crypto from 'node:crypto';

import fs from 'fs';
import path from 'path';
import { pino } from 'pino';
import { pinoHttp } from 'pino-http';

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
            ignore: 'pid,hostname',
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
export const requestIdMiddleware = (req: any, res: any, next: any) => {
  const id = crypto.randomUUID();
  const store = new Map<string, string>();
  store.set('request-id', id);
  asyncStorage.run(store, () => {
    req.requestId = id; // Добавляем requestId в объект
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
