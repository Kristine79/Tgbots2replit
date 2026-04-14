# Tgbots2replit - Каталог лучших Telegram ботов

[![Next.js](https://img.shields.io/badge/Next.js-15.5.14-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-blue)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)](https://vercel.com/)

Каталог лучших Telegram ботов с современным glassmorphism дизайном в стиле Telegram 2026. Полнофункциональная платформа для поиска, фильтрации и управления ботами с админ-панелью.

## ✨ Возможности

### 🏠 Главная страница
- **Каталог ботов** с красивым glassmorphism дизайном
- **Поиск и фильтрация** по категориям, рейтингу, популярности
- **Карточки ботов** с рейтингом, количеством пользователей, тегами
- **Адаптивный дизайн** для всех устройств

### 👨‍💼 Админ-панель
- **Аутентификация** с защищенным паролем
- **CRUD операции** для управления ботами
- **Статистика и аналитика** в реальном времени
- **Rate limiting** для защиты от брутфорса
- **Оптимизированные запросы** к базе данных

### 🔧 Технические возможности
- **Монопепозиторий** с pnpm workspaces
- **TypeScript** для типобезопасности
- **API-first архитектура** с OpenAPI спецификацией
- **Генерация кода** с Orval (React Query + Zod)
- **База данных** PostgreSQL + Drizzle ORM
- **SSR/SSG** с Next.js App Router

## 🏗️ Архитектура

```
tgbots2replit/
├── artifacts/              # Развертываемые приложения
│   ├── tg-bots/           # Next.js фронтенд
│   ├── api-server/        # Express API сервер
│   └── mockup-sandbox/    # Песочница для макетов
├── lib/                   # Общие библиотеки
│   ├── api-spec/          # OpenAPI спецификация
│   ├── api-client-react/  # Сгенерированные React Query хуки
│   ├── api-zod/           # Сгенерированные Zod схемы
│   └── db/                # Drizzle ORM схема и подключение
├── scripts/               # Утилиты
└── pnpm-workspace.yaml    # Конфигурация workspaces
```

## 🚀 Быстрый старт

### Предварительные требования

- **Node.js** 24+
- **pnpm** 10+
- **PostgreSQL** (для продакшена)

### Установка

1. **Клонируйте репозиторий**
   ```bash
   git clone https://github.com/Kristine79/Tgbots2replit.git
   cd Tgbots2replit
   ```

2. **Установите зависимости**
   ```bash
   pnpm install
   ```

3. **Настройте переменные окружения**
   ```bash
   # Для админ-панели (обязательно!)
   export ADMIN_PASSWORD="your-secure-password-here"

   # Для базы данных (опционально, для продакшена)
   export DATABASE_URL="postgresql://user:pass@localhost:5432/tgbots"
   ```

### Запуск в режиме разработки

#### Вариант 1: Mock API (рекомендуется для разработки)
```bash
# Терминал 1: Mock API сервер
node mock-api-simple.js

# Терминал 2: Next.js фронтенд
cd artifacts/tg-bots
pnpm dev
```

#### Вариант 2: Полный стек с базой данных
```bash
# Терминал 1: API сервер
cd artifacts/api-server
ADMIN_PASSWORD="your-password" pnpm dev

# Терминал 2: Next.js фронтенд
cd artifacts/tg-bots
pnpm dev
```

### Доступ к приложению

- **Главная страница**: http://localhost:3000
- **Админ-панель**: http://localhost:3000/admin/login
- **API сервер**: http://localhost:3001/api (mock) или http://localhost:3000/api (full)

## 📚 API Документация

### Аутентификация

Админ-панель защищена паролем. Установите `ADMIN_PASSWORD` в переменных окружения.

```bash
# Логин
curl -X POST http://localhost:3001/api/admin/login \
  -H 'Content-Type: application/json' \
  -d '{"password": "your-admin-password"}'
```

### Основные эндпоинты

#### Боты
- `GET /api/bots` - Получить все боты
- `GET /api/bots/:id` - Получить бота по ID
- `POST /api/admin/bots` - Создать бота (требует токен)
- `PUT /api/admin/bots/:id` - Обновить бота (требует токен)
- `DELETE /api/admin/bots/:id` - Удалить бота (требует токен)

#### Категории
- `GET /api/categories` - Получить все категории

#### Статистика (админ)
- `GET /api/admin/stats` - Статистика по ботам (требует токен)

### Пример создания бота

```bash
curl -X POST http://localhost:3001/api/admin/bots \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "username": "@examplebot",
    "name": "Example Bot",
    "description": "A helpful Telegram bot",
    "categoryId": 1,
    "rating": 4.5,
    "reviewCount": 100,
    "isVerified": true,
    "isPremium": false,
    "tags": ["utility", "helpful"],
    "monthlyUsers": 5000,
    "iconEmoji": "🤖",
    "telegramUrl": "https://t.me/examplebot"
  }'
```

## 🚀 Развертывание на Vercel

### Подготовка

1. **Создайте аккаунт Vercel** и подключите GitHub
2. **Форкните репозиторий** или загрузите код

### Настройка переменных окружения

В Vercel Dashboard настройте Environment Variables:

```bash
# Обязательные
ADMIN_PASSWORD=your-secure-admin-password

# Для продакшена с базой данных
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

### Развертывание

#### Вариант 1: Автоматическое (рекомендуется)

1. Импортируйте проект в Vercel из GitHub
2. Vercel автоматически обнаружит конфигурацию из `vercel.json`
3. Проект развернется с двумя сервисами:
   - **Frontend**: `https://your-project.vercel.app`
   - **API**: `https://your-project.vercel.app/api`

#### Вариант 2: Ручное развертывание

```bash
# Установите Vercel CLI
npm i -g vercel

# Разверните проект
vercel

# Следуйте инструкциям CLI
```

### Структура развертывания

Vercel автоматически настроит:

- **tg-bots** → Главный домен (SSR)
- **api-server** → API роуты под `/api`
- **База данных** → Подключится через `DATABASE_URL`

### Проверка развертывания

После развертывания проверьте:

```bash
# Главная страница
curl https://your-project.vercel.app

# API здоровье
curl https://your-project.vercel.app/api/health

# Админ логин
curl -X POST https://your-project.vercel.app/api/admin/login \
  -H 'Content-Type: application/json' \
  -d '{"password": "your-password"}'
```

## 🛠️ Разработка

### Скрипты

```bash
# Корневые скрипты
pnpm build          # Собрать все пакеты
pnpm typecheck      # Проверить типы TypeScript
pnpm typecheck:libs # Проверить только библиотеки

# Фронтенд
cd artifacts/tg-bots
pnpm dev      # Режим разработки
pnpm build    # Продакшн сборка
pnpm start    # Запуск продакшн версии
pnpm typecheck # Проверка типов

# API сервер
cd artifacts/api-server
pnpm dev      # Режим разработки
pnpm build    # Сборка с esbuild
pnpm start    # Запуск собранной версии
pnpm typecheck # Проверка типов

# База данных
cd lib/db
pnpm push      # Применить схему (dev)
pnpm push-force # Пересоздать схему (dev)
```

### Генерация API кода

```bash
# Сгенерировать React Query хуки и Zod схемы из OpenAPI
cd lib/api-spec
pnpm codegen
```

### Тестирование

```bash
# Запустить демо улучшений
./demo-improvements.sh

# Тестировать админ-панель
node test-admin-panel.js

# Примеры curl запросов
./ADMIN_PANEL_CURL_EXAMPLES.sh
```

## 📁 Структура проекта

```
.
├── ADMIN_PANEL_*.md          # Документация админ-панели
├── API_INTEGRATION_*.md      # Документация API
├── IMPROVEMENTS_*.md         # Документация улучшений
├── mock-api-simple.js        # Mock API для разработки
├── package.json              # Корневой package.json
├── pnpm-lock.yaml           # Lock-файл pnpm
├── pnpm-workspace.yaml      # Конфигурация workspaces
├── tsconfig.base.json       # Базовая конфигурация TypeScript
├── tsconfig.json            # Корневая конфигурация TypeScript
├── vercel.json              # Конфигурация Vercel
├── .npmrc                   # Конфигурация npm/pnpm
├── .gitignore               # Git ignore правила
├── artifacts/
│   ├── tg-bots/            # Next.js приложение
│   │   ├── app/            # App Router страницы
│   │   ├── src/
│   │   │   ├── components/ # React компоненты
│   │   │   ├── hooks/      # React хуки
│   │   │   └── lib/        # Утилиты
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   └── vercel.json
│   ├── api-server/         # Express API сервер
│   │   ├── src/
│   │   │   ├── app.ts      # Express приложение
│   │   │   ├── index.ts    # Точка входа
│   │   │   ├── routes/     # API роуты
│   │   │   └── middlewares/# Middleware
│   │   ├── build.mjs       # Скрипт сборки
│   │   ├── package.json
│   │   └── vercel.json
│   └── mockup-sandbox/     # Песочница для макетов
├── lib/
│   ├── api-spec/           # OpenAPI спецификация
│   │   ├── openapi.yaml    # OpenAPI 3.1 спецификация
│   │   └── orval.config.ts # Конфигурация Orval
│   ├── api-client-react/   # Сгенерированные React Query хуки
│   ├── api-zod/            # Сгенерированные Zod схемы
│   └── db/                 # База данных
│       ├── src/
│       │   ├── index.ts    # Drizzle клиент
│       │   └── schema/     # Схемы таблиц
│       └── drizzle.config.ts
├── scripts/                # Утилиты
│   ├── package.json
│   └── src/                # Скрипты
└── attached_assets/        # Прикрепленные файлы
```

## 🔒 Безопасность

- **Rate limiting** на логин (5 попыток за 15 минут)
- **Защищенные пароли** (нет дефолтных значений)
- **JWT токены** для аутентификации
- **CORS** настроен для фронтенда
- **Валидация** всех входных данных с Zod

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для вашей фичи: `git checkout -b feature/amazing-feature`
3. Зафиксируйте изменения: `git commit -m 'Add amazing feature'`
4. Отправьте в ветку: `git push origin feature/amazing-feature`
5. Создайте Pull Request

### Стандарты кода

- **TypeScript** для всего кода
- **ESLint** и **Prettier** для форматирования
- **Conventional commits** для сообщений коммитов
- **Тесты** для новых функций

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 🙏 Благодарности

- [Next.js](https://nextjs.org/) - React фреймворк
- [Tailwind CSS](https://tailwindcss.com/) - CSS фреймворк
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [React Query](https://tanstack.com/query/) - Data fetching
- [Zod](https://zod.dev/) - Schema validation
- [Vercel](https://vercel.com/) - Платформа развертывания

---

**Создано с ❤️ для Telegram сообщества**