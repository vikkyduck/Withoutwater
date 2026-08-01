#!/usr/bin/env bash
# Запускать НА СЕРВЕРЕ: включает дублирование заявок на почту.
# Пароль вводится вслепую (не отображается и не попадает в историю команд).
#
# Нужен ПАРОЛЬ ПРИЛОЖЕНИЯ, а не пароль от почты:
#   Яндекс ID → Безопасность → Пароли приложений → Почта → создать.
# Обычный пароль Яндекс 360 для SMTP не подойдёт.
set -euo pipefail
ENV=/opt/withoutwater/.env
[ -f "$ENV" ] || { echo "Нет $ENV — сначала задеплой бэкенд"; exit 1; }

DEFAULT_USER="vu@withoutwater.ru"
read -rp  "SMTP_USER (ящик-отправитель) [$DEFAULT_USER]: " USER_IN
USER_IN="${USER_IN:-$DEFAULT_USER}"
read -rp  "MAIL_TO (куда слать заявки) [$USER_IN]: " TO_IN
TO_IN="${TO_IN:-$USER_IN}"
read -rsp "SMTP_PASS (пароль приложения, вставь и Enter): " PASS_IN; echo
read -rp  "SMTP_HOST [smtp.yandex.ru]: " HOST_IN
HOST_IN="${HOST_IN:-smtp.yandex.ru}"
read -rp  "SMTP_PORT [465]: " PORT_IN
PORT_IN="${PORT_IN:-465}"

[ -n "${PASS_IN:-}" ] || { echo "Пароль пустой — отмена"; exit 1; }

tmp=$(mktemp)
grep -vE '^(SMTP_HOST|SMTP_PORT|SMTP_USER|SMTP_PASS|MAIL_TO)=' "$ENV" > "$tmp" || true
printf 'SMTP_HOST=%s\nSMTP_PORT=%s\nSMTP_USER=%s\nSMTP_PASS=%s\nMAIL_TO=%s\n' \
  "$HOST_IN" "$PORT_IN" "$USER_IN" "$PASS_IN" "$TO_IN" >> "$tmp"
install -m 600 -o root -g root "$tmp" "$ENV"
rm -f "$tmp"

systemctl restart withoutwater-api
sleep 1
echo -n "health: "; curl -sS http://127.0.0.1:5020/api/health; echo
echo
echo "Проверка: отправь заявку с сайта и посмотри логи —"
echo "  journalctl -u withoutwater-api -n 20 --no-pager | grep mail"
