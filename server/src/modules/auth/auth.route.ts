import { Router } from 'express';

import { login, logout, refresh, register } from './auth.controller.js';
import {
  checkUserBlocked,
  csrfProtection,
  loginRateLimit,
  refreshRateLimit,
} from './auth.middleware.js';

const router = Router();

// Rate limiting для login
router.post('/login', checkUserBlocked, loginRateLimit, login);
router.post('/register', register);

// CSRF защита и rate limiting для refresh
router.post('/refresh', csrfProtection, refreshRateLimit, refresh);
router.post('/logout', logout);

export default router;
