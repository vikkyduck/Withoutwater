// Проверка почты: отправляет одно письмо и печатает понятную ошибку, если не вышло.
// Запуск на сервере: node /opt/withoutwater/backend/mail-test.mjs
import { readFileSync } from 'node:fs';
import { sendMail } from './mailer.mjs';

/* .env читаем сами: сервис запускается через systemd EnvironmentFile,
   а скрипт — руками, поэтому переменных в окружении нет. */
const ENV_FILE = process.env.ENV_FILE || '/opt/withoutwater/.env';
const env = {};
try {
  for (const line of readFileSync(ENV_FILE, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
} catch (e) {
  console.error(`Не прочитать ${ENV_FILE}: ${e.message}`);
  process.exit(1);
}

const need = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_TO'];
const missing = need.filter((k) => !env[k]);
if (missing.length) {
  console.error('Не заданы: ' + missing.join(', '));
  process.exit(1);
}

const when = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
try {
  await sendMail({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.SMTP_USER,
    to: env.MAIL_TO,
    subject: 'Проверка: заявки с сайта будут приходить сюда',
    text: [
      'Это проверочное письмо с сервера withoutwater.ru.',
      `Отправлено: ${when} (МСК)`,
      '',
      'Если письмо дошло — дублирование заявок на почту работает.',
      'Дальше сюда будут приходить заявки с формы: имя, контакт,',
      'компания, запрос и ссылка на админку.',
    ].join('\n'),
  });
  console.log(`OK: письмо отправлено на ${env.MAIL_TO}`);
} catch (e) {
  console.error('ОШИБКА: ' + (e.message || e));
  process.exit(1);
}
