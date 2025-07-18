import { logger } from '@/config/logger.js';
import { prisma } from '@/infrastructure/prisma/client.js';

interface SecurityAlert {
  type:
    | 'failed_login'
    | 'suspicious_ip'
    | 'token_reuse'
    | 'rate_limit_exceeded';
  message: string;
  data: any;
  timestamp: Date;
}

class SecurityMonitor {
  private alerts: SecurityAlert[] = [];

  // Проверка подозрительных IP адресов
  async checkSuspiciousIPs() {
    const recentAttempts = await prisma.loginAttempt.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Последние 24 часа
        },
        success: false,
      },
      select: {
        ipAddress: true,
        email: true,
        createdAt: true,
      },
    });

    // Группируем по IP
    const ipStats = new Map<string, { count: number; emails: Set<string> }>();

    recentAttempts.forEach((attempt) => {
      const existing = ipStats.get(attempt.ipAddress) || {
        count: 0,
        emails: new Set(),
      };
      existing.count++;
      existing.emails.add(attempt.email);
      ipStats.set(attempt.ipAddress, existing);
    });

    // Проверяем подозрительную активность
    for (const [ip, stats] of ipStats) {
      if (stats.count > 10 || stats.emails.size > 5) {
        this.addAlert('suspicious_ip', `Suspicious activity from IP ${ip}`, {
          ip,
          failedAttempts: stats.count,
          uniqueEmails: stats.emails.size,
        });
      }
    }
  }

  // Проверка повторного использования токенов
  async checkTokenReuse() {
    const revokedTokens = await prisma.refreshToken.findMany({
      where: {
        isRevoked: true,
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Последний час
        },
      },
      include: {
        user: true,
      },
    });

    if (revokedTokens.length > 0) {
      this.addAlert('token_reuse', 'Potential token reuse detected', {
        count: revokedTokens.length,
        users: revokedTokens.map((t) => t.user.email),
      });
    }
  }

  // Проверка превышения rate limit
  async checkRateLimitExceeded() {
    const recentFailures = await prisma.loginAttempt.count({
      where: {
        success: false,
        createdAt: {
          gte: new Date(Date.now() - 15 * 60 * 1000), // Последние 15 минут
        },
      },
    });

    if (recentFailures > 50) {
      this.addAlert(
        'rate_limit_exceeded',
        'High rate of failed login attempts',
        {
          failedAttempts: recentFailures,
          timeWindow: '15 minutes',
        }
      );
    }
  }

  private addAlert(type: SecurityAlert['type'], message: string, data: any) {
    const alert: SecurityAlert = {
      type,
      message,
      data,
      timestamp: new Date(),
    };

    this.alerts.push(alert);
    logger.warn(`🚨 SECURITY ALERT: ${message}`, data);

    // В продакшене здесь можно отправить уведомление в Slack/Email
    // await this.sendNotification(alert);
  }

  // Запуск всех проверок
  async runChecks() {
    logger.info('🛡️ 🔍 Running security checks...');

    await this.checkSuspiciousIPs();
    await this.checkTokenReuse();
    await this.checkRateLimitExceeded();

    logger.info(
      `✅ Security checks completed. Found ${this.alerts.length} alerts.`
    );

    return this.alerts;
  }

  // Получение всех алертов
  getAlerts(): SecurityAlert[] {
    return this.alerts;
  }

  // Очистка старых алертов
  clearAlerts() {
    this.alerts = [];
  }
}

// Экспорт для использования в других модулях
export const securityMonitor = new SecurityMonitor();

// Запуск мониторинга если скрипт запущен напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  securityMonitor
    .runChecks()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Security monitoring failed:', error);
      process.exit(1);
    });
}
