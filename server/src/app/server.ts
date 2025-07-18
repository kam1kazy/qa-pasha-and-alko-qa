import { corsMiddleware } from '@/config/cors.js';
import { errorHandler } from '@/config/error.handler.js';
import { helmetMiddleware } from '@/config/helmet.js';
import { httpLogger, logger, requestIdMiddleware } from '@/config/logger.js';
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

// Безопасность
app.use(helmetMiddleware);
app.use(corsMiddleware);

// Ограничение размера запроса (1MB)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate limiting для всех запросов
const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов с одного IP
  message: {
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalRateLimit);

app.use(cookieParser());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/auth', authRoutes);
app.use('/api/attachments', attachmentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/kanban-columns', kanbanColumnRoutes);
app.use('/api/sprints', sprintRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/user-active-sprints', userActiveSprintRoutes);
app.use('/api/user-task-statuses', userTaskStatusRoutes);

// Honeypot endpoint для обнаружения атак
app.post('/admin-login', (req, res) => {
  logger.warn(
    { ip: req.ip, userAgent: req.headers['user-agent'] },
    '🚨 Honeypot triggered!'
  );
  // Можно добавить блокировку IP или другие меры
  res.status(404).json({ message: 'Not found' });
});

app.use(errorHandler);

export default app;
