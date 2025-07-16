import { corsMiddleware } from '@/config/cors.js';
import { errorHandler } from '@/config/error.handler.js';
import { helmetMiddleware } from '@/config/helmet.js';
import { httpLogger, requestIdMiddleware } from '@/config/logger.js';
import attachmentRoutes from '@/modules/attachment/attachment.route.js';
import authRoutes from '@/modules/auth/auth.route.js';
import commentRoutes from '@/modules/comment/comment.route.js';
import kanbanColumnRoutes from '@/modules/kanbanColumn/kanbanColumn.route.js';
import sprintRoutes from '@/modules/sprint/sprint.route.js';
import taskRoutes from '@/modules/task/task.route.js';
import userActiveSprintRoutes from '@/modules/userActiveSprint/userActiveSprint.route.js';
import userTaskStatusRoutes from '@/modules/userTaskStatus/userTaskStatus.route.js';
import cookieParser from 'cookie-parser';
import express from 'express';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';

const swaggerSpec = yaml.load(
  fs.readFileSync(new URL('../../swagger.yaml', import.meta.url), 'utf8')
) as object;

const app = express();

app.use(requestIdMiddleware);
app.use(httpLogger);

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;
