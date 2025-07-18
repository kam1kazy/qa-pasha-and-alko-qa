import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  // В продакшене заменить на реальные домены
  // 'https://yourdomain.com',
  // 'https://www.yourdomain.com',
];

export const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // В продакшене проверяем origin
    if (process.env.NODE_ENV === 'production') {
      if (!origin || !allowedOrigins.includes(origin)) {
        return callback(new Error('Not allowed by CORS'));
      }
    }
    callback(null, true);
  },
  credentials: true, // важно для cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 часа
};

export const corsMiddleware = cors(corsOptions);
