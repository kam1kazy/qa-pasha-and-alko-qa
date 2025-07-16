import { env } from '@/config/env.js';
import { logger } from '@/config/logger.js';

import app from './server.js';

app.listen(env.PORT, () => {
  logger.info({
    msg: `🚀 Server is running`,
    port: env.PORT,
    url: `http://localhost:${env.PORT}`,
  });
});
