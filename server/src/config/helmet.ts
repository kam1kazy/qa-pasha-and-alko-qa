import helmet from 'helmet';

export const helmetMiddleware = helmet({
  contentSecurityPolicy: true,
});
