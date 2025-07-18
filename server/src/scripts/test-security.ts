// server/src/scripts/test-security.ts
import { logger } from '@/config/logger.js';
import { AuthService } from '@/modules/auth/auth.service.js';
import { securityMonitor } from './security-monitor.js';

const authService = new AuthService();

async function testSecurityFeatures() {
  logger.info('🛡️ 🔒 Testing security features...\n');

  try {
    // 1. Тест регистрации с User-Agent и IP
    logger.info(
      '🛡️ 1. Testing registration with User-Agent and IP tracking...'
    );
    const testUserAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
    const testIP = '192.168.1.100';
    const tokens = await authService.register(
      'test@example.com',
      'password123',
      testUserAgent,
      testIP
    );
    logger.info('🛡️ ✅ Registration successful, tokens generated');

    // 2. Тест refresh с проверкой User-Agent и IP
    logger.info('🛡️ \n2. Testing refresh with User-Agent and IP validation...');
    const newTokens = await authService.refresh(
      tokens.refreshToken,
      testUserAgent,
      testIP
    );
    logger.info('🛡️ ✅ Refresh successful with same User-Agent and IP');

    // 3. Тест logout
    logger.info('🛡️ \n3. Testing logout...');
    await authService.logoutByToken(newTokens.refreshToken);
    logger.info('🛡️ ✅ Logout successful');

    // 4. Тест очистки токенов
    logger.info('🛡️ \n4. Testing token cleanup...');
    await authService.cleanupExpiredTokens();
    logger.info('🛡️ ✅ Token cleanup completed');

    // 5. Тест мониторинга безопасности
    logger.info('🛡️ \n5. Testing security monitoring...');
    const alerts = await securityMonitor.runChecks();
    logger.info(
      `✅ Security monitoring completed, found ${alerts.length} alerts`
    );

    logger.info('🛡️ \n�� All security tests passed!');
  } catch (error) {
    logger.error('❌ Security test failed:', error);
  }
}

// Запуск тестов
testSecurityFeatures()
  .then(() => process.exit(0))
  .catch((error) => {
    logger.error('Test execution failed:', error);
    process.exit(1);
  });
