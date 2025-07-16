import cors from 'cors';

export const corsOptions = {
  origin: true, // или указать список доменов
  credentials: true,
};

export const corsMiddleware = cors(corsOptions);
