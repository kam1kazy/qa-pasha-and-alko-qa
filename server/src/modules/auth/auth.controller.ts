import { Request, Response } from 'express';

import { RegisterSchema } from './auth.schema.js';
import { AuthService } from './auth.service.js';

const service = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = RegisterSchema.parse(req.body);
    const token = await service.register(email, password);
    res.json({ token });
    //TODO: Разрешить any
  } catch (err: any) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = RegisterSchema.parse(req.body);
    const token = await service.login(email, password);
    res.json({ token });
    //TODO: Разрешить any
  } catch (err: any) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};
