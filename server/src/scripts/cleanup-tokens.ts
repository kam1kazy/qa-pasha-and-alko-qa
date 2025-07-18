import { logger } from '@/config/logger.js';
import { AuthService } from '@/modules/auth/auth.service.js';

const authService = new AuthService();

async function cleanupTokens() {
  try {
    logger.info('🛡️ 🧹 Starting token cleanup...');
    await authService.cleanupExpiredTokens();
    logger.info('🛡️ ✅ Token cleanup completed');
  } catch (error) {
    logger.error('❌ Token cleanup failed:', error);
  }
}

// Запускаем очистку
cleanupTokens();
