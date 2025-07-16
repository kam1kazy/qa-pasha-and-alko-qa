import { authRoutes } from '@/routes/index.js';
import { json } from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

const app = express();
dotenv.config();

app.use(cors());
app.use(json());

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});
app.use('/api/auth', authRoutes);

export default app;
