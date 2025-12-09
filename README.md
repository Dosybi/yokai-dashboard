# Yokai Dashboard

Мониторинг и отлов японских духов йокаев в режиме реального времени.

## Технологии

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **TanStack Query**
- **Zod**
- **SCSS Modules**
- **Server-Sent Events (SSE)**

## Архитектура

Проект следует строгому **Feature Sliced Design (FSD)**:

```
src/
├── app/ # Next.js App Router
│ ├── api/spirits/ # API Routes (GET, POST, SSE)
│ ├── monitoring/ # Monitoring page
│ └── layout.tsx # Root layout
├── entities/ # Бизнес-сущности (данные)
│ └── spirit/
│ ├── api/ # useSpiritsQuery, useSpiritsSSE
│ ├── model/ # Types, Zod schemas
│ └── ui/ # SpiritCard, ThreatBadge, StatusBadge
├── features/ # Пользовательские сценарии (действия)
│ └── spirit-capture/
│ ├── model/ # useCaptureSpirit (mutation + optimistic updates)
│ └── ui/ # CaptureButton
├── widgets/ # Композиция entities + features
│ └── spirit-monitoring/
│ └── ui/ # SpiritList, SpiritGrid, SpiritStats
└── shared/ # Переиспользуемые модули
├── lib/ # ThemeProvider, QueryClientProvider
└── ui/ # Button, Notification, ThemeToggle
```

### Разделение ответственности

- **entities** — чистые данные и UI без бизнес-логики
- **features** — изолированные пользовательские сценарии (capture, mutations)
- **widgets** — композиция entities + features для экранов
- **shared** — переиспользуемые компоненты и утилиты

## Ключевые функции

### ✅ Optimistic Updates

- Мгновенное обновление UI при поимке духа (`features/spirit-capture`)
- Автоматический откат при ошибке с уведомлением
- TanStack Query: `onMutate` → optimistic update, `onError` → rollback

### ✅ Server-Sent Events (SSE)

- Real-time обновления уровня угрозы активных духов
- Каждые 5 секунд случайный Active дух меняет `threatLevel`
- EventSource API (`entities/spirit/api/useSpiritsSSE`)
- Captured духи не получают обновления (фильтр на сервере)

### ✅ Zod валидация

- Все API responses валидируются через схемы
- Request body validation на сервере
- Type-safe данные из схем (`spiritSchema`)

### ✅ Темная и светлая темы

- Переключение через `ThemeToggle`
- CSS-переменные + localStorage
- Поддержка системных предпочтений

### ✅ SCSS Modules

- Модульные стили с градиентами для уровней угрозы
- Адаптивный дизайн

## Установка и запуск

### Локально

```bash
// Установка зависимостей
npm install

// Запуск dev сервера
npm run dev

// Открыть браузер
http://localhost:3000
```

### Docker

```bash
// Запуск (первый раз или после изменений)
docker-compose up --build

// Запуск (если образ уже собран)
docker-compose up

// Остановка
docker-compose down
```

## Маршруты

- \`/\` - Главная страница (приветствие)
- \`/monitoring\` - Мониторинг духов с real-time обновлениями

## API Endpoints

### GET /api/spirits

Получение списка всех духов (18 духов в mock data).

**Response:**

```json
{
"success": true,
"data": [/_ Spirit[] _/],
"total": 18
}
```

### POST /api/spirits/capture

Поимка духа по ID. **30% вероятность ошибки** для демонстрации error handling.

**Request:**

```json
{ "id": "spirit-001" }
```

**Response (success):**

```json
{
"success": true,
"message": "Spirit captured successfully",
"data": {/_ Spirit _/}
}
```

### GET /api/spirits/stream

Server-Sent Events stream для real-time обновлений уровня угрозы.

- Обновления каждые 5 секунд
- Только для Active духов (Captured исключены)
- Формат: `data: {"id": "...", "threatLevel": "High"}`

## Разработка

```bash
// Форматирование кода
npm run format

// Проверка форматирования
npm run format:check

// Линтинг
npm run lint

// Production build
npm run build
npm start
```

## Структура данных

```typescript
interface Spirit {
  id: string;
  name: string;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  location: string;
  status: 'Active' | 'Captured';
}
```
