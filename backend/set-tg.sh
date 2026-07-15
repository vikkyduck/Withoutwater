#!/usr/bin/env bash
# Запускать НА СЕРВЕРЕ: вписывает токен бота (@BotFather) и chat_id получателя
# в /opt/withoutwater/.env и перезапускает сервис. Токен вводится вслепую (не эхоится).
set -euo pipefail
ENV=/opt/withoutwater/.env
[ -f "$ENV" ] || { echo "Нет $ENV — сначала задеплой бэкенд"; exit 1; }

read -rsp "TG_BOT_TOKEN (вставь и Enter): " TOKEN; echo
read -rp  "TG_CHAT_ID (напр. 291416924 или -100xxxxxxxxxx): " CHAT
[ -n "${TOKEN:-}" ] && [ -n "${CHAT:-}" ] || { echo "Пусто — отмена"; exit 1; }

tmp=$(mktemp)
grep -vE '^(TG_BOT_TOKEN|TG_CHAT_ID)=' "$ENV" > "$tmp" || true
printf 'TG_BOT_TOKEN=%s\nTG_CHAT_ID=%s\n' "$TOKEN" "$CHAT" >> "$tmp"
install -m 600 -o root -g root "$tmp" "$ENV"
rm -f "$tmp"

systemctl restart withoutwater-api
sleep 1
echo -n "health: "; curl -sS http://127.0.0.1:5020/api/health; echo
echo "✅ Токен записан, сервис перезапущен. tg должно быть true выше."
