#!/usr/bin/env bash
# withoutwater.ru — мониторинг живости (cron, каждые 5 минут).
# Проверяет: сайт по HTTPS (200) + /api/health бэкенда (ok:true).
# При падении шлёт ОДИН алерт в Telegram (без спама), при восстановлении — «снова в порядке».
# Токен/чат берёт из /opt/withoutwater/.env (тот же, что у бэкенда заявок).
# Установка (разово): /etc/cron.d/withoutwater-monitor → */5 * * * * root /opt/withoutwater/backend/monitor.sh
set -u

ENV_FILE=/opt/withoutwater/.env
STATE=/opt/withoutwater/data/monitor.down   # маркер «уже алертили»
# shellcheck disable=SC1090
. "$ENV_FILE" 2>/dev/null || true

fail=""

code=$(curl -sS -o /dev/null -w '%{http_code}' -m 15 https://withoutwater.ru/ 2>/dev/null || echo 000)
[ "$code" = "200" ] || fail="сайт HTTP $code"

health=$(curl -sS -m 10 http://127.0.0.1:5020/api/health 2>/dev/null || echo '')
echo "$health" | grep -q '"ok":true' || fail="${fail:+$fail; }api/health: ${health:-нет ответа}"

send() {
  [ -n "${TG_BOT_TOKEN:-}" ] && [ -n "${TG_CHAT_ID:-}" ] || return 0
  curl -sS -m 10 -X POST \
    "${TELEGRAM_API_BASE:-https://api.telegram.org}/bot${TG_BOT_TOKEN}/sendMessage" \
    -d chat_id="${TG_CHAT_ID}" --data-urlencode text="$1" >/dev/null 2>&1
}

if [ -n "$fail" ]; then
  if [ ! -f "$STATE" ]; then
    date -u +%FT%TZ > "$STATE"
    send "🔴 withoutwater.ru: $fail — проверьте сервер (systemctl status withoutwater-api, nginx)."
  fi
else
  if [ -f "$STATE" ]; then
    rm -f "$STATE"
    send "🟢 withoutwater.ru снова в порядке."
  fi
fi
