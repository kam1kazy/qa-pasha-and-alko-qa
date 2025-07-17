# 🔐 Схема системы авторизации

## Архитектура системы

```mermaid
graph TB
    subgraph Frontend
        A[Пользователь] --> B[AuthModal]
        B --> C[useAuth Hook]
        C --> D[Redux Store]
        D --> E[userApi]
    end

    subgraph Backend
        F[Auth Controller] --> G[Auth Service]
        G --> H[Prisma DB]
        I[Rate Limiting] --> F
        J[Security Monitor] --> G
    end

    subgraph Database
        H --> K[Users Table]
        H --> L[RefreshTokens Table]
        H --> M[LoginAttempts Table]
    end

    E --> F
    C --> N[ProtectedRoute]
```

## Процесс регистрации

```mermaid
sequenceDiagram
    participant U as Пользователь
    participant F as Frontend
    participant B as Backend
    participant DB as Database

    U->>F: Ввод email/password
    F->>B: POST /auth/register
    B->>B: Хеширование пароля
    B->>DB: Создание пользователя
    B->>B: Генерация токенов
    B->>F: Access Token + Refresh Token (cookie)
    F->>F: Сохранение в Redux
    F->>U: Успешная регистрация
```

## Процесс входа

```mermaid
sequenceDiagram
    participant U as Пользователь
    participant F as Frontend
    participant B as Backend
    participant DB as Database

    U->>F: Ввод email/password
    F->>B: POST /auth/login
    B->>DB: Проверка пользователя
    B->>B: Сравнение паролей
    B->>DB: Запись попытки входа
    B->>B: Генерация токенов
    B->>F: Access Token + Refresh Token (cookie)
    F->>F: Сохранение в Redux
    F->>U: Успешный вход
```

## Обновление токенов

```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant DB as Database

    F->>B: POST /auth/refresh (с cookie)
    B->>DB: Поиск refresh token
    B->>B: Проверка валидности
    B->>B: Проверка User-Agent/IP
    B->>B: Генерация новых токенов
    B->>DB: Удаление старого токена
    B->>F: Новые токены
    F->>F: Обновление в Redux
```

## Структура токенов

```mermaid
graph LR
    subgraph Access Token
        A1[JWT Header] --> A2[Payload: userId, email]
        A2 --> A3[Signature]
        A4[Время жизни: 15 минут]
    end

    subgraph Refresh Token
        B1[Случайная строка] --> B2[Хеш в БД]
        B2 --> B3[User-Agent/IP привязка]
        B4[Время жизни: 30 дней]
    end
```

## Защита от атак

```mermaid
graph TB
    subgraph Rate Limiting
        R1[5 попыток за 15 минут] --> R2[Временная блокировка]
        R2 --> R3[Логирование попыток]
    end

```

```mermaid
graph TB
    subgraph CSRF Protection
        C1[SameSite: strict] --> C2[Origin проверка]
        C2 --> C3[CSRF токены]
    end
```

```mermaid
graph TB
    subgraph Monitoring
        M1[Подозрительные IP] --> M2[Honeypot endpoints]
        M2 --> M3[Security alerts]
    end
```

```mermaid
graph TB
    subgraph Token Security
        T1[Rotation при каждом refresh] --> T2[Инвалидация при reuse]
        T2 --> T3[Автоочистка истекших]
    end
```

## Хранение данных

```mermaid
erDiagram
    USERS {
        string id PK
        string email UK
        string password
        string name
        datetime createdAt
        datetime updatedAt
        datetime changePassword
    }

    REFRESH_TOKENS {
        string id PK
        string token UK
        string userId FK
        datetime expiresAt
        string userAgent
        string ipAddress
        boolean isRevoked
        datetime createdAt
    }

    LOGIN_ATTEMPTS {
        string id PK
        string email
        string ipAddress
        string userAgent
        boolean success
        datetime createdAt
    }

    USERS ||--o{ REFRESH_TOKENS : has
    USERS ||--o{ LOGIN_ATTEMPTS : attempts
```

## Жизненный цикл токенов

```mermaid
stateDiagram-v2
    [*] --> Login
    Login --> AccessToken: Успешный вход
    AccessToken --> RefreshToken: Истечение access
    RefreshToken --> AccessToken: Успешный refresh
    RefreshToken --> Logout: Истечение refresh
    AccessToken --> Logout: Пользователь выходит
    Logout --> [*]

    note right of AccessToken
        Время жизни: 15 минут
        Хранится в Redux
    end note

    note right of RefreshToken
        Время жизни: 30 дней
        httpOnly cookie
        Привязка к User-Agent/IP
    end note
```

## Компоненты безопасности

```mermaid
graph TB
    subgraph Backend Security
        BS1[Rate Limiting Middleware]
        BS2[CSRF Protection]
        BS3[Input Validation]
        BS4[Security Headers]
    end

    subgraph Token Management
        TM1[JWT Utils]
        TM2[Rotation]
        TM3[Token Cleanup]
        TM4[Token Validation]
    end

    subgraph Monitoring
        M1[Security Monitor]
        M2[Attempts]
        M3[Honeypot Endpoints]
        M4[Alert System]
    end

    subgraph Frontend Security
        FS1[Protected Routes]
        FS2[Token Interceptor]
        FS3[Auto Refresh]
        FS4[Secure Storage]
    end
```

## API Endpoints

```mermaid
graph LR
    subgraph Auth Endpoints
        AE1[POST /auth/register]
        AE2[POST /auth/login]
        AE3[POST /auth/refresh]
        AE4[POST /auth/logout]
    end

    subgraph Security Endpoints
        SE1[GET /auth/me]
        SE2[POST /admin-login]
        SE3[GET /security/alerts]
    end

    subgraph Rate Limiting
        RL1[5/min для login]
        RL2[10/15min глобально]
        RL3[Блокировка при превышении]
    end
```

## Поток данных

```mermaid
flowchart TD
    A[Пользователь] --> B{Действие}
    B -->|Регистрация| C[POST /auth/register]
    B -->|Вход| D[POST /auth/login]
    B -->|Обновление| E[POST /auth/refresh]
    B -->|Выход| F[POST /auth/logout]

    C --> G[Создание пользователя]
    D --> H[Проверка учетных данных]
    E --> I[Валидация refresh token]
    F --> J[Удаление токенов]

    G --> K[Генерация токенов]
    H --> K
    I --> K
    J --> L[Очистка сессии]

    K --> M[Access Token в ответе]
    K --> N[Refresh Token в cookie]
    M --> O[Redux Store]
    N --> P[HttpOnly Cookie]

    O --> Q[Защищенные маршруты]
    P --> R[Автоматическое обновление]
```

## Мониторинг безопасности

````mermaid
graph TB
    subgraph Security Checks
        SC1[Подозрительные IP]
        SC2[Token Reuse Detection]
        SC3[Rate Limit Exceeded]
        SC4[Honeypot Access]
    end

    subgraph Alerts
        A1[Email Notifications]
        A2[Log Entries]
        A3[Dashboard Alerts]
        A4[Admin Notifications]
    end

    subgraph Automation
        AM1[Token Cleanup]
        AM2[Security Monitoring]
        AM3[Alert Processing]
        AM4[Report Generation]
    end

    SC1 --> A1
    SC2 --> A2
    SC3 --> A3
    SC4 --> A4
    A1 --> AM1
    A2 --> AM2
    A3 --> AM3
    A4 --> AM4
```
````

---

## Ключевые особенности системы:

### 🔐 Безопасность

- **Refresh токены** в httpOnly cookies
- **Rate limiting** для защиты от брутфорса
- **CSRF защита** для всех auth endpoints
- **Token rotation** при каждом обновлении
- **User-Agent/IP привязка** для refresh токенов

### 📊 Мониторинг

- **Логирование** всех попыток входа
- **Honeypot endpoints** для обнаружения атак
- **Security alerts** при подозрительной активности
- **Автоматическая очистка** истекших токенов

### 🔄 UX

- **Автоматическое обновление** токенов
- **Прозрачная работа** для пользователя
- **Защищенные маршруты** с автоматической проверкой
- **Единообразные ошибки** для предотвращения атак перечислением

### 🛡️ Enterprise-уровень

- **RSA поддержка** для внешних клиентов
- **Расширенное логирование** безопасности
- **Готовность к продакшену** с cron jobs
- **Документация** по безопасности

```

```
