// SMTP-клиент без зависимостей: письмо с заявкой на почту владельца.
// Node >= 22, только node:tls + node:crypto. Работает по implicit TLS (порт 465,
// как у Яндекс 360) и по STARTTLS (порт 587) — режим выбирается по порту.
//
// Почему письмо, а не только Telegram: в мессенджер намеренно уходит лишь номер
// заявки (152-ФЗ — не отдаём персональные данные во внешний сервис), поэтому
// содержимое заявки надо доставлять туда, где владелец его действительно читает.
// Ящик на своём домене (mx.yandex.net, инфраструктура в РФ) для этого подходит:
// оператор пересылает данные сам себе, трансграничной передачи нет.
import tls from 'node:tls';
import net from 'node:net';

const CRLF = '\r\n';

function readReply(socket) {
  return new Promise((resolve, reject) => {
    let buf = '';
    const onData = (chunk) => {
      buf += chunk.toString('utf8');
      // Ответ закончен, когда последняя строка вида "250 текст" (пробел, не дефис)
      const lines = buf.split(CRLF).filter(Boolean);
      const last = lines[lines.length - 1];
      if (last && /^\d{3} /.test(last)) {
        cleanup();
        const code = parseInt(last.slice(0, 3), 10);
        resolve({ code, text: buf.trim() });
      }
    };
    const onErr = (e) => { cleanup(); reject(e); };
    const cleanup = () => {
      socket.removeListener('data', onData);
      socket.removeListener('error', onErr);
    };
    socket.on('data', onData);
    socket.on('error', onErr);
  });
}

async function cmd(socket, line, expect) {
  if (line !== null) socket.write(line + CRLF);
  const rep = await readReply(socket);
  if (expect && !expect.includes(rep.code)) {
    throw new Error(`SMTP ${rep.code}: ${rep.text.slice(0, 200)} (на «${String(line).split(' ')[0]}»)`);
  }
  return rep;
}

/* Кодируем заголовок и тело в base64 — кириллица в письмах иначе ломается */
const b64 = (s) => Buffer.from(s, 'utf8').toString('base64');
const encHeader = (s) => (/[^\x20-\x7E]/.test(s) ? `=?UTF-8?B?${b64(s)}?=` : s);

/* Тело в base64 режем по 76 символов — требование RFC 2045 */
function b64Body(s) {
  return (Buffer.from(s, 'utf8').toString('base64').match(/.{1,76}/g) || []).join(CRLF);
}

export async function sendMail({
  host, port, user, pass, from, to, subject, text, timeout = 15000,
}) {
  if (!host || !user || !pass || !to) throw new Error('mailer: не заданы host/user/pass/to');
  const implicitTLS = Number(port) === 465;

  const socket = await new Promise((resolve, reject) => {
    const opts = { host, port: Number(port), servername: host };
    const s = implicitTLS ? tls.connect(opts, () => resolve(s)) : net.connect(opts, () => resolve(s));
    s.setTimeout(timeout, () => { s.destroy(new Error('SMTP: таймаут соединения')); });
    s.once('error', reject);
  });

  let sock = socket;
  try {
    await cmd(sock, null, [220]);                       // приветствие сервера
    await cmd(sock, `EHLO ${from.split('@')[1] || 'localhost'}`, [250]);

    if (!implicitTLS) {                                  // STARTTLS для 587
      await cmd(sock, 'STARTTLS', [220]);
      sock = await new Promise((resolve, reject) => {
        const t = tls.connect({ socket, servername: host }, () => resolve(t));
        t.once('error', reject);
      });
      await cmd(sock, `EHLO ${from.split('@')[1] || 'localhost'}`, [250]);
    }

    await cmd(sock, 'AUTH LOGIN', [334]);
    await cmd(sock, b64(user), [334]);
    await cmd(sock, b64(pass), [235]);

    await cmd(sock, `MAIL FROM:<${from}>`, [250]);
    for (const rcpt of String(to).split(',').map((x) => x.trim()).filter(Boolean)) {
      await cmd(sock, `RCPT TO:<${rcpt}>`, [250, 251]);
    }
    await cmd(sock, 'DATA', [354]);

    const headers = [
      `From: ${encHeader('Заявки с сайта')} <${from}>`,
      `To: ${to}`,
      `Subject: ${encHeader(subject)}`,
      `Date: ${new Date().toUTCString()}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
    ].join(CRLF);

    // Точка в начале строки экранируется, иначе обрывает передачу тела
    sock.write(headers + CRLF + CRLF + b64Body(text) + CRLF + '.' + CRLF);
    await cmd(sock, null, [250]);
    await cmd(sock, 'QUIT', [221]).catch(() => {});
  } finally {
    try { sock.end(); } catch {}
    try { socket.destroy(); } catch {}
  }
}
