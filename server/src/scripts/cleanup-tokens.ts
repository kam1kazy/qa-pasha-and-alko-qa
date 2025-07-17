import { AuthService } from '@/modules/auth/auth.service.js';

const authService = new AuthService();

async function cleanupTokens() {
  try {
    console.log('🧹 Starting token cleanup...');
    await authService.cleanupExpiredTokens();
    console.log('✅ Token cleanup completed');
  } catch (error) {
    console.error('❌ Token cleanup failed:', error);
  }
}

// Запускаем очистку
cleanupTokens();
