// server/src/scripts/test-security.ts
import { AuthService } from '@/modules/auth/auth.service.js';
import { securityMonitor } from './security-monitor.js';

const authService = new AuthService();

async function testSecurityFeatures() {
  console.log('🔒 Testing security features...\n');

  try {
    // 1. Тест регистрации с User-Agent и IP
    console.log('1. Testing registration with User-Agent and IP tracking...');
    const testUserAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
    const testIP = '192.168.1.100';
    const tokens = await authService.register(
      'test@example.com',
      'password123',
      testUserAgent,
      testIP
    );
    console.log('✅ Registration successful, tokens generated');

    // 2. Тест refresh с проверкой User-Agent и IP
    console.log('\n2. Testing refresh with User-Agent and IP validation...');
    const newTokens = await authService.refresh(
      tokens.refreshToken,
      testUserAgent,
      testIP
    );
    console.log('✅ Refresh successful with same User-Agent and IP');

    // 3. Тест logout
    console.log('\n3. Testing logout...');
    await authService.logoutByToken(newTokens.refreshToken);
    console.log('✅ Logout successful');

    // 4. Тест очистки токенов
    console.log('\n4. Testing token cleanup...');
    await authService.cleanupExpiredTokens();
    console.log('✅ Token cleanup completed');

    // 5. Тест мониторинга безопасности
    console.log('\n5. Testing security monitoring...');
    const alerts = await securityMonitor.runChecks();
    console.log(
      `✅ Security monitoring completed, found ${alerts.length} alerts`
    );

    console.log('\n�� All security tests passed!');
  } catch (error) {
    console.error('❌ Security test failed:', error);
  }
}

// Запуск тестов
testSecurityFeatures()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
