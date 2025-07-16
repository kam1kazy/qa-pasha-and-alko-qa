import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { getLoggerWithRequestId } from './logger.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const log = getLoggerWithRequestId();
  log.error({ err }, 'Ошибка на сервере');

  if (err instanceof ZodError) {
    return res.status(400).json({ error: err.flatten() });
  }

  const status = (err as any).status || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;

  return res.status(status).json({ error: message });
}
