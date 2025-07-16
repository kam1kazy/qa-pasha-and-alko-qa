import { prisma } from '@/lib/prisma.js';
import { signJWT } from '@/utils/jwt.js';
import { Router } from 'express';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = await signJWT({ id: user.id, email: user.email });

  res.json({ token });
});

export default router;
