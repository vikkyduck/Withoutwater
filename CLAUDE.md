# CLAUDE.md — withoutwater.ru

Памятка для сессий Claude по этому проекту. Полная архитектура — в `ARCHITECTURE.md`,
бизнес-контекст — в `brief.md`, юр. слой — в `legal-map.md`.

## Что это

Боевой лендинг агентства «Без Воды» + бэкенд заявок. Посетитель оставляет заявку →
SQLite в РФ → Telegram-уведомление → владелец обрабатывает в `/admin`.
Живой сайт: **https://withoutwater.ru**

## Стек (коротко)

- **Фронт:** Vite 6 + React 19 + Tailwind v4 + `motion` + `lucide-react`. Вся страница —
  один файл `lovable/src/landing.tsx`; токены темы — `lovable/src/styles.css`.
- **Бэк:** zero-dep Node ≥ 22.5 (`node:sqlite`), `backend/server.mjs`, systemd
  `withoutwater-api` на `127.0.0.1:5020`.
- **Прод:** Timeweb VDS `5.129.198.180`, nginx (статика + прокси `/api/` и `/admin`),
  HTTPS Let's Encrypt.

## Как собрать / запустить / выкатить

```bash
cd lovable && npm install && npm run dev     # локальный dev-сервер
cd lovable && npm run build                  # прод-сборка → lovable/dist
./deploy.sh                                   # build + rsync на VDS + рестарт + health-check
```

Проверка бэкенда: `curl https://withoutwater.ru/api/health` → `{ok:true,...}`.

## Инварианты — НЕ нарушать

- **152-ФЗ:** данные заявок хранятся только в РФ (VDS). В Telegram уходит **только номер
  заявки**, без персональных данных.
- **Согласия:** обязательный чекбокс на обработку ПД (иначе `/api/lead` → 400) + отдельный
  необязательный на рекламу. Версия текста согласия и метки времени пишутся в базу — не
  ломать эти поля.
- **Секреты** (`TG_BOT_TOKEN`, `TG_CHAT_ID`, `ADMIN_USER/PASS`) живут только в
  `/opt/withoutwater/.env` на сервере (`chmod 600`). В код и в git — никогда. В репо только
  `backend/.env.example` с пустыми значениями.
- **Шрифты — локальные** woff2, не Google CDN (иначе утечка IP за рубеж).
- **Юр. ссылки в футере:** оферта→`/pub_oferta`, согласие→`/consent_pd`, политика→
  `/politics_pd` (на старом сайте были перепутаны — не вернуть).

## Репозиторий

- GitHub: `git@github.com:vikkyduck/withoutwater.git` (**приватный**), ветка `main`, push по SSH.
- В репо кладём **живой сайт + проектные документы**. НЕ коммитим: резюме экспертов, сырьё
  клиентских кейсов, персональные данные, реальный `.env`. Старые Tilda-зеркала (`site/`,
  `site-new/`) — мусор, в репо не тащим.

## Частые задачи

- Правка текста/вёрстки → `lovable/src/landing.tsx`, затем `npm run build` + `./deploy.sh`.
- Проверка мобильной версии обязательна (аудитория с телефона; mobile-first).
- Новое поле в заявке → добавить в схему `leads` (`server.mjs`), в форму, в CSV-экспорт.
- Тексты выверены владельцем «слово в слово» — не переписывать формулировки без запроса.
