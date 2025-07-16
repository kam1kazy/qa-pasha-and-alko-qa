import cookieParser from 'cookie-parser';
import express from 'express';
import rateLimit from 'express-rate-limit';

import { corsMiddleware } from '@/config/cors.js';
import { errorHandler } from '@/config/error.handler.js';
import { helmetMiddleware } from '@/config/helmet.js';
import { getLoggerWithRequestId, httpLogger } from '@/config/logger.js';
import attachmentRoutes from '@/modules/attachment/attachment.route.js';
import authRoutes from '@/modules/auth/auth.route.js';
import commentRoutes from '@/modules/comment/comment.route.js';
import kanbanColumnRoutes from '@/modules/kanbanColumn/kanbanColumn.route.js';
import sprintRoutes from '@/modules/sprint/sprint.route.js';
import taskRoutes from '@/modules/task/task.route.js';
import userActiveSprintRoutes from '@/modules/userActiveSprint/userActiveSprint.route.js';
import userTaskStatusRoutes from '@/modules/userTaskStatus/userTaskStatus.route.js';

const app = express();

app.use(httpLogger);

app.use((req, res, next) => {
  const log = getLoggerWithRequestId();
  log.info({ message: 'Обрабатываем запрос' });
  next();
});

// --- Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmetMiddleware);
app.use(corsMiddleware);

// --- Rate Limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP',
  })
);

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/sprints', sprintRoutes);
app.use('/comments', commentRoutes);
app.use('/columns', kanbanColumnRoutes);
app.use('/attachments', attachmentRoutes);
app.use('/user-task-statuses', userTaskStatusRoutes);
app.use('/user-active-sprints', userActiveSprintRoutes);

app.use(errorHandler);

export default app;
