#!/usr/bin/env bash
# withoutwater.ru — деплой лендинга (репаковка 2026-07) + бэкенда заявок на Timeweb VDS.
# Запуск: ./deploy.sh
# Инфраструктура (systemd-юнит, nginx /api/ + /admin, .env) ставится ОДИН раз — см. README.
# Этот скрипт: заливает site-new/ и backend/ и перезапускает сервис заявок.
set -euo pipefail

SERVER="${SERVER_USER:-root}@${SERVER_HOST:-5.129.198.180}"

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
