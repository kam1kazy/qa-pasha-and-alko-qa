# Система ролей и доступа (RBAC) для обучающей платформы

## Обзор

В системе реализовано разграничение доступа на основе ролей (RBAC) с поддержкой мультикурсовости и гибкой привязкой ролей к курсам через модель `CourseRole`. Все критичные действия логируются, реализован soft-delete для важных сущностей, а загрузка файлов ограничена по размеру и типу.

---

## Роли и права

### Роли:

- **ADMIN** — администратор курса (создает курс, управляет ролями, видит всё)
- **MANAGER** — менеджер/ментор курса (проверяет задачи, видит учеников своего курса)
- **STUDENT** — ученик (выполняет задачи, видит только себя)

### Привязка ролей

- Роль хранится в таблице `CourseRole` (userId, courseId, role)
- Один пользователь может иметь разные роли в разных курсах
- Глобальное поле `User.role` используется только для базовой инициализации

---

## Структура базы данных (фрагменты)

```prisma
model User {
  id        String   @id @default(uuid())
  ...
  courseRoles CourseRole[]
}

model Course {
  id        String   @id @default(uuid())
  ...
  courseRoles CourseRole[]
}

model CourseRole {
  id        String   @id @default(uuid())
  userId    String
  courseId  String
  role      UserRole
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  course    Course   @relation(fields: [courseId], references: [id])
  createdAt DateTime @default(now())
  @@unique([userId, courseId])
}

model Task {
  ...
  deletedAt DateTime?
}
model Comment {
  ...
  deletedAt DateTime?
}
model Attachment {
  ...
  deletedAt DateTime?
}
```

---

## Основные процессы

### 1. Назначение ролей

- Только ADMIN курса может назначать роли другим пользователям в рамках своего курса
- Нельзя назначить роль самому себе
- Нельзя назначить второго ADMIN в один курс (если не предусмотрено)
- Менеджер может быть назначен только если уже состоит в курсе

### 2. Проверка доступа

- Для проверки доступа используется функция `getUserRoleInCourse(userId, courseId)`
- Все middleware используют эту функцию для проверки прав
- Для ревью задач — проверяется, что ревьюер имеет роль MANAGER или ADMIN именно в этом курсе

### 3. Soft-delete

- Для Task, Comment, Attachment используется поле `deletedAt`
- Удаление — это установка даты, а не физическое удаление
- Все выборки фильтруются по `deletedAt: null`

### 4. Загрузка файлов

- Используется multer с лимитом 5MB и фильтрацией по типу (png, jpeg, pdf)
- В контроллере дополнительно проверяется наличие файла и тип

### 5. Аудит и логирование

- Все критичные действия (назначение ролей, удаление, загрузка файлов, ревью задач) логируются
- Можно использовать отдельную таблицу AuditLog для хранения истории

---

## Примеры API и middleware

### Проверка роли в курсе

```ts
import { getUserRoleInCourse } from '@/shared/utils/roles.js';
const role = await getUserRoleInCourse(userId, courseId);
if (role === 'MANAGER') { ... }
```

### Middleware для ревью задач

```ts
router.post('/:id/review', canReviewTaskInCourse, reviewTask)
```

### Soft-delete

```ts
await prisma.task.update({ where: { id }, data: { deletedAt: new Date() } })
```

### Загрузка файла

```ts
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'application/pdf']
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(null, false)
  }
})
```

---

## Безопасность и best practices

- **Принцип наименьших привилегий** — пользователь получает только нужные права
- **Валидация данных** — все входные данные проходят валидацию (zod, joi и т.д.)
- **Проверка роли всегда через getUserRoleInCourse**
- **Soft-delete** — ничего не удаляется навсегда без возможности восстановления
- **Лимиты и фильтрация upload** — только нужные типы и размер файлов
- **Аудит** — все важные действия логируются
- **CSRF и rate limiting** — для auth и upload

---

## Возможные расширения

- Поддержка нескольких ролей у пользователя в одном курсе (например, MANAGER+STUDENT)
- Гибкая система прав (RBAC-политики)
- Восстановление soft-deleted сущностей
- Поддержка версионирования файлов/задач
- Интеграция с внешними системами логирования (Sentry, ELK)

---

## Краткие примеры запросов

### Назначение роли

```http
POST /auth/assign-role
{
  "userId": "...",
  "role": "MANAGER",
  "courseId": "..."
}
```

### Ревью задачи

```http
POST /tasks/:id/review
{
  "status": "APPROVED",
  "comment": "Отличная работа!"
}
```

### Загрузка файла

```http
POST /attachments
Content-Type: multipart/form-data
file: <binary>
```

---

## Аудит (пример)

```prisma
model AuditLog {
  id        String   @id @default(uuid())
  userId    String
  action    String
  entity    String
  entityId  String
  meta      Json?
  createdAt DateTime @default(now())
}
```

- Логируй: назначение ролей, удаление, загрузку, ревью, вход/выход
- Для логирования можно использовать middleware или сервис

---

## FAQ

**Q: Как проверить, что менеджер может ревьюить задачу?**
A: Используй `canReviewTaskInCourse` — он проверит роль в нужном курсе.

**Q: Как восстановить soft-deleted задачу?**
A: Обнови поле `deletedAt` на null.

**Q: Как добавить новый тип файла для upload?**
A: Добавь mime-type в массив allowed в multer.

---

## Дополнительные процессы

### Восстановление soft-deleted сущностей

- Для восстановления задачи, комментария или вложения достаточно обновить поле `deletedAt` на `null`:

```ts
await prisma.task.update({ where: { id }, data: { deletedAt: null } })
```

- Можно реализовать отдельный endpoint или админ-панель для восстановления
- Для аудита рекомендуется логировать факт восстановления

### Аудит (AuditLog)

- Все критичные действия (назначение ролей, удаление, восстановление, загрузка файлов, ревью задач) логируются в таблицу `AuditLog`
- Пример записи:

```ts
await prisma.auditLog.create({
  data: {
    userId,
    action: 'RESTORE_TASK',
    entity: 'Task',
    entityId: taskId,
    meta: { ... },
  },
});
```

- Можно реализовать middleware для автоматического логирования
- Для просмотра истории действий — отдельный endpoint или админ-интерфейс

### Массовое назначение ролей

- Для массового назначения ролей (например, добавить группу студентов в курс):

```ts
await prisma.courseRole.createMany({
  data: users.map(userId => ({ userId, courseId, role: 'STUDENT' })),
  skipDuplicates: true
})
```

- Можно реализовать bulk endpoint или импорт из CSV/Excel
- Все массовые операции также логируются в AuditLog

### Интеграция с внешними сервисами

- Для расширенного аудита, мониторинга и алертов можно интегрировать:
  - Sentry (ошибки и алерты)
  - ELK/Graylog (логирование)
  - Prometheus/Grafana (метрики)
  - Webhooks (реакция на события, например, отправка уведомлений)
- Для интеграции используйте сервис-слой или middleware, чтобы не дублировать код
- Пример отправки webhook:

```ts
await axios.post('https://hooks.example.com/event', { event: 'TASK_REVIEWED', ... });
```

---
