#!/usr/bin/env bash
# withoutwater.ru — деплой лендинга (репаковка 2026-07) + бэкенда заявок на Timeweb VDS.
# Запуск: ./deploy.sh
# Инфраструктура (systemd-юнит, nginx /api/ + /admin, .env) ставится ОДИН раз — см. README.
# Этот скрипт: заливает site-new/ и backend/ и перезапускает сервис заявок.
set -euo pipefail

SERVER="${SERVER_USER:-root}@${SERVER_HOST:-5.129.198.180}"

echo "==> проверка типов (ловит опечатки до выкатки, а не после)"
# Стала возможна 10.08.2026, когда снесли библиотеку shadcn из экспорта Lovable:
# её файлы никто не подключал, но зависимостей к ним нет — проверка спотыкалась
# на них полсотни раз. Ошибка здесь останавливает деплой: set -e.
( cd lovable && npx tsc --noEmit )

echo "==> сборка фронта (Vite + пререндер статического HTML для SEO)"
( cd lovable && npm run build )

echo "==> dist/ → /opt/withoutwater/site  (дизайн Expert Compass / Lovable)"
rsync -az --delete lovable/dist/ "$SERVER:/opt/withoutwater/site/"

echo "==> backend/ → /opt/withoutwater/backend (без .env, он в /opt/withoutwater/.env)"
rsync -az --delete --exclude='.env' backend/ "$SERVER:/opt/withoutwater/backend/"

echo "==> перезапуск withoutwater-api + health"
ssh "$SERVER" 'systemctl restart withoutwater-api && sleep 1 && echo -n "health: " && curl -sS http://127.0.0.1:5020/api/health && echo'

echo "==> проверка сайта"
curl -sS -o /dev/null -w "site HTTPS %{http_code}\n" "https://withoutwater.ru/" || true
echo "✅ Готово: https://withoutwater.ru/"
