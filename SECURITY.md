# 🔒 Security Documentation

## Обзор системы безопасности

Наша система авторизации реализует enterprise-уровень безопасности с использованием современных практик защиты.

## 🛡️ Реализованные меры безопасности

### 1 Токены

- **Access Token**: 15минут жизни, хранится в памяти
- **Refresh Token**: 30ей жизни, httpOnly cookie
- **Алгоритм**: HS256(по умолчанию) или RS256я внешних клиентов
- **Rotation**: Refresh токен обновляется при каждом использовании

###2. Защита от атак

#### CSRF (Cross-Site Request Forgery)

- CSRF защита для `/auth/refresh` endpoint
- Проверка Origin/Referer заголовков
- SameSite: strict для cookies

#### XSS (Cross-Site Scripting)

- httpOnly cookies для refresh токенов
- CSP заголовки (настроить на фронтенде)
- Экранирование пользовательского контента

#### Brute Force

- Rate limiting: 5 попыток за 15 минут для login
- Временная блокировка при превышении лимита
- Логирование всех попыток входа

#### Token Reuse

- Инвалидация всех токенов при повторном использовании
- Автоматическая очистка истекших токенов
- Проверка User-Agent и IP адреса

### 3 Мониторинг и алерты

#### Система мониторинга

- Отслеживание подозрительных IP адресов
- Обнаружение повторного использования токенов
- Мониторинг превышения rate limit

#### Honeypot

- Endpoint `/admin-login` для обнаружения атак
- Логирование попыток доступа

### 4. Операционная безопасность

#### Ограничения запросов

- Лимит размера body: 1MB
- Глобальный rate limiting:100 запросов с IP за15 минут
- Валидация всех входных данных

#### Логирование

- Все попытки входа (успешные и неудачные)
- Подозрительная активность
- Ошибки безопасности

## 🚀 Использование

### Авторизация

```bash
# Логин
POST /auth/login
[object Object]email":user@example.com,
  ssword": password123
# Получаем access token в ответе
# Refresh token автоматически сохраняется в httpOnly cookie
```

### Обновление токенов

```bash
# Автоматическое обновление через refresh
POST /auth/refresh
# Требует refresh token в cookie
```

### Выход

```bash
# Logout
POST /auth/logout
# Удаляет refresh token из БД и cookie
```

## 🔧 Настройка для продакшена

### 1ременные окружения

```env
# JWT
JWT_SECRET=your-super-secret-key
JWT_ALGORITHM=HS256или RS256я внешних клиентов
JWT_EXPIRES_IN=15
JWT_REFRESH_EXPIRES_IN=30d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=90000RATE_LIMIT_MAX_ATTEMPTS=5RATE_LIMIT_BLOCK_DURATION_MS=18000

# Cookies
COOKIE_SECRET=your-cookie-secret
```

### 2CORS настройки

```typescript
const allowedOrigins = [
  'https://yourdomain.com',
 https://www.yourdomain.com'
];
```

### 3. Cron jobs для автоматизации

```bash
# Очистка токенов (каждый день в 200 * * * cd /path/to/app && npm run cleanup-tokens

# Мониторинг безопасности (каждый час)
0 * * * cd /path/to/app && npm run security-monitor
```

## 📊 Мониторинг

### Скрипты безопасности

```bash
# Очистка истекших токенов
npm run cleanup-tokens

# Мониторинг безопасности
npm run security-monitor

# Тестирование безопасности
npm run test-security
```

### Логи для отслеживания

- `logs/auth.log` - попытки входа
- `logs/security.log` - подозрительная активность
- `logs/errors.log` - ошибки безопасности

## 🚨 Алерты

Система генерирует алерты при:

- Подозрительной активности с IP
- Повторном использовании токенов
- Превышении rate limit
- Попытках доступа к honeypot

## 🔄 Обновления безопасности

### Регулярные проверки

1. Обновление зависимостей2логов безопасности3лиз подозрительной активности
   4ение rate limiting настроек

### Планы на будущее

- Интеграция с SIEM системами
- Двухфакторная аутентификация
- Капча для защиты от ботов
- Геолокационные ограничения

## 📞 Контакты

При обнаружении уязвимостей:

- Создайте issue в репозитории
- Опишите проблему детально
- Укажите шаги для воспроизведения

---

**Последнее обновление**: $(date)
**Версия**: 1.0.0
