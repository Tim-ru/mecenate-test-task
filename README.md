# Mecenate Test Task

Экран ленты публикаций на `React Native + Expo` с `TypeScript`, `MobX` и `React Query`.

## Требования

- Node.js 18+
- npm 9+
- Expo Go на телефоне (iOS/Android)

## Установка и запуск

1. Установить зависимости:

```bash
npm install
```

2. Создать файл `.env` в корне проекта.

3. Заполнить переменные окружения (пример ниже).

4. Запустить проект:

```bash
npm run start
```

## Переменные окружения

Пример `.env`:

```env
EXPO_PUBLIC_API_BASE_URL=https://k8s.mectest.ru/test-app
EXPO_PUBLIC_AUTH_TOKEN=550e8400-e29b-41d4-a716-446655440000
```

Обязательные переменные:

- `EXPO_PUBLIC_API_BASE_URL` — базовый URL API.
- `EXPO_PUBLIC_AUTH_TOKEN` — bearer UUID для авторизации.

## Запуск через Expo Go

1. Установить приложение `Expo Go` на телефон.
2. Запустить проект командой `npm run start`.
3. В терминале откроется QR-код.
4. Отсканировать QR-код:
   - iOS: через камеру или Expo Go
   - Android: через Expo Go

После сканирования приложение откроется на устройстве.

## Полезные команды

- `npm run start` — запуск Metro/Expo.
- `npm run ios` — запуск в iOS-симуляторе.
- `npm run android` — запуск в Android-эмуляторе.
- `npm run web` — запуск web-версии.
- `npm run typecheck` — проверка TypeScript.
- `npm run lint` — проверка ESLint.
