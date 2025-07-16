import { NextFunction, Request, Response } from 'express';

import { verifyJWT } from '@/shared/utils/jwt.js';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const token = auth.split(' ')[1];
    const payload = await verifyJWT(token);

    if (!payload) {
      throw new Error('Unauthorized. payload is null');
    }

    //TODO: Разрешить any
    (req as any).user = payload;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Unauthorized' + e });
  }
}
