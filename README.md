# withoutwater.ru — лендинг «Без Воды»

Боевой сайт проектной команды методологов и продактов «Без Воды»: посетитель
оставляет заявку на диагностику → бэкенд записывает её в базу → шлёт уведомление
в Telegram → владелец видит заявку в админке.

Живой сайт: **https://withoutwater.ru**

## Стек

| Слой | Технология |
|---|---|
| Фронтенд | Vite + React 19 + Tailwind v4 + `motion` (framer). Дизайн «Expert Compass». |
| Бэкенд | Zero-dependency Node (≥ 22, `node:sqlite`), systemd. |
| База | SQLite (данные заявок хранятся в РФ — 152-ФЗ). |
| Веб-сервер | nginx: статика + `/api/` и `/admin` прокси на бэкенд. |
| HTTPS | Let's Encrypt (certbot, автопродление). |
| Аналитика | Яндекс Метрика, цель `lead_sent` на успешную отправку формы. |
| Уведомления | Telegram-бот, сообщение «Новая заявка №N» — без персональных данных. |

## Структура

```
lovable/            фронтенд (Vite SPA)
  src/landing.tsx   вся страница одним компонентом
  src/styles.css    Tailwind v4 + токены темы (красный акцент, oklch)
  public/           шрифты (Unbounded/Manrope), фото команды, юр. страницы, robots, sitemap, 404
backend/            приём заявок
  server.mjs        zero-dep Node: /api/lead, /api/health, /admin
  admin.html        админка заявок (статусы, CSV, удаление)
  .env.example      образец конфига (реальный .env — только на сервере)
deploy.sh           сборка фронта + rsync на VDS + рестарт сервиса
```

## Запуск локально

Фронтенд:
```bash
cd lovable
npm install
npm run dev        # dev-сервер
npm run build      # прод-сборка в lovable/dist
```

Бэкенд:
```bash
cd backend
cp .env.example .env   # заполнить TG_BOT_TOKEN, TG_CHAT_ID, ADMIN_USER/ADMIN_PASS
node server.mjs        # слушает 127.0.0.1:5020
```

## Деплой

```bash
./deploy.sh            # собирает lovable/dist, льёт его и backend/ на VDS, рестартит сервис
```
Инфраструктура (systemd-юнит, nginx `/api/` + `/admin`, `.env`, каталог данных)
разворачивается на сервере один раз.

## Юридический слой (152-ФЗ)

- Согласие на обработку персональных данных — обязательный чекбокс в форме (не проставлен заранее).
- Отдельное согласие на рекламную рассылку — необязательный чекбокс.
- Публичные документы: `/politics_pd`, `/consent_pd`, `/pub_oferta`.
- Данные заявок хранятся на сервере в РФ; в Telegram уходит только номер заявки.

## Секреты

Токен бота, chat_id и пароль админки живут **только** в `/opt/withoutwater/.env` на
сервере (`chmod 600`) и в репозиторий не попадают. В коде — только `.env.example` с
пустыми значениями.
