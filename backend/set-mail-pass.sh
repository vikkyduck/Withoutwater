#!/usr/bin/env bash
# Запускать НА СЕРВЕРЕ через TTY:
#   ssh -t root@5.129.198.180 /opt/withoutwater/backend/set-mail-pass.sh
#
# Спрашивает ТОЛЬКО пароль приложения. Остальное (хост, порт, ящик, получатель)
# уже прописано в /opt/withoutwater/.env.
# Нужен ПАРОЛЬ ПРИЛОЖЕНИЯ: Яндекс ID → Безопасность → Пароли приложений → Почта.
# Обычный пароль от почты Яндекс для SMTP не принимает.
set -euo pipefail
ENV=/opt/withoutwater/.env
[ -f "$ENV" ] || { echo "Нет $ENV"; exit 1; }

USER_NOW=$(grep -E '^SMTP_USER=' "$ENV" | cut -d= -f2- || echo '(не задан)')
TO_NOW=$(grep -E '^MAIL_TO=' "$ENV" | cut -d= -f2- || echo '(не задан)')
echo "Ящик-отправитель : $USER_NOW"
echo "Заявки приходят  : $TO_NOW"
echo

read -rsp "Пароль приложения (ввод не отображается), затем Enter: " PASS; echo
[ -n "${PASS:-}" ] || { echo "Пусто — отмена, ничего не изменено"; exit 1; }

tmp=$(mktemp)
grep -vE '^SMTP_PASS=' "$ENV" > "$tmp" || true
printf 'SMTP_PASS=%s\n' "$PASS" >> "$tmp"
install -m 600 -o root -g root "$tmp" "$ENV"
rm -f "$tmp"
unset PASS

systemctl restart withoutwater-api
sleep 1
echo -n "health: "; curl -sS http://127.0.0.1:5020/api/health; echo

echo
echo "Отправляю проверочное письмо…"
if node /opt/withoutwater/backend/mail-test.mjs; then
  echo "Готово: проверь почту $TO_NOW (загляни и в «Спам»)."
else
  echo
  echo "Письмо не ушло. Частые причины:"
  echo "  • использован обычный пароль вместо пароля приложения;"
  echo "  • в Яндекс 360 для ящика выключен доступ по SMTP;"
  echo "  • пароль скопирован с пробелом на конце."
  echo "Полный текст ошибки: journalctl -u withoutwater-api -n 20 --no-pager"
fi
