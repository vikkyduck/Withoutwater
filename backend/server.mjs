// withoutwater.ru — приём заявок + админка. v2 (репаковка 2026-07).
// Zero-dependency Node >=22.5 (node:sqlite). Слушает localhost, за nginx: /api/ и /admin.
//
// Хранилище: SQLite /opt/withoutwater/data/leads.db (152-ФЗ: данные в РФ).
// JSONL-журнал сохраняется как резервный (append-only).
// Telegram-уведомление БЕЗ персональных данных: только номер заявки.
//
// ENV (см. .env.example):
//   PORT               — порт (по умолч. 5020), слушаем только 127.0.0.1
//   TG_BOT_TOKEN       — токен бота (пусто → Telegram пропускается)
//   TG_CHAT_ID         — чат для уведомлений
//   TELEGRAM_API_BASE  — базовый URL Telegram API (прямой или CF-прокси)
//   DB_FILE            — путь к SQLite-базе заявок
//   LEADS_FILE         — путь к JSONL-журналу (резерв)
//   ALLOWED_ORIGIN     — CORS-origin сайта
//   ADMIN_USER / ADMIN_PASS — доступ к /admin (basic auth)
//   PUBLIC_BASE        — публичный URL сайта (для ссылки в уведомлении)

import http from 'node:http';
import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

import { sendMail } from './mailer.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT || 5020);
const HOST = '127.0.0.1';
const TG_BOT_TOKEN = (process.env.TG_BOT_TOKEN || '').trim();
const TG_CHAT_ID = (process.env.TG_CHAT_ID || '').trim();
const TELEGRAM_API_BASE = (process.env.TELEGRAM_API_BASE || 'https://api.telegram.org').replace(/\/+$/, '');
const DB_FILE = process.env.DB_FILE || '/opt/withoutwater/data/leads.db';
const LEADS_FILE = process.env.LEADS_FILE || '/opt/withoutwater/data/leads.jsonl';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://withoutwater.ru';
const ADMIN_USER = (process.env.ADMIN_USER || '').trim();
const ADMIN_PASS = (process.env.ADMIN_PASS || '').trim();
const PUBLIC_BASE = (process.env.PUBLIC_BASE || 'https://withoutwater.ru').replace(/\/+$/, '');
/* Дублирование заявки на почту владельца. Без SMTP_* блок просто выключен. */
const SMTP_HOST = (process.env.SMTP_HOST || 'smtp.yandex.ru').trim();
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = (process.env.SMTP_USER || '').trim();
const SMTP_PASS = (process.env.SMTP_PASS || '').trim();
const MAIL_TO   = (process.env.MAIL_TO || '').trim();
const MAIL_ENABLED = Boolean(SMTP_USER && SMTP_PASS && MAIL_TO);

const MAX_BODY = 16 * 1024;
const MAX_FIELD_LEN = 2000;
const RATE_MAX = 20;               // заявок в час с одного IP
const RATE_WINDOW_MS = 60 * 60e3;

const STATUSES = ['new', 'work', 'done'];

/* ── база ── */
await mkdir(dirname(DB_FILE), { recursive: true }).catch(() => {});
const db = new DatabaseSync(DB_FILE);
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts TEXT NOT NULL,
    name TEXT DEFAULT '',
    contact TEXT DEFAULT '',
    company TEXT DEFAULT '',
    comment TEXT DEFAULT '',
    page TEXT DEFAULT '',
    ip TEXT DEFAULT '',
    ua TEXT DEFAULT '',
    consent_pd_version TEXT DEFAULT '',
    consent_pd_ts TEXT DEFAULT '',
    consent_ads INTEGER DEFAULT 0,
    consent_ads_ts TEXT DEFAULT '',
    status TEXT DEFAULT 'new',
    legacy_fields TEXT DEFAULT ''
  );
  -- прохождения визарда «Черновик модели решения»: только выборы, БЕЗ персональных данных
  CREATE TABLE IF NOT EXISTS wizard_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts TEXT NOT NULL,
    scenario TEXT DEFAULT '',
    have TEXT DEFAULT '',
    goal TEXT DEFAULT '',
    timing TEXT DEFAULT ''
  );
`);

// одноразовая миграция: если таблица пуста, а jsonl есть — импортируем историю.
// Маркер-файл гарантирует, что миграция не повторится после ручного удаления заявок.
const MIGRATED_MARK = DB_FILE + '.jsonl-imported';
try {
  const cnt = db.prepare('SELECT COUNT(*) AS c FROM leads').get().c;
  if (cnt === 0 && !existsSync(MIGRATED_MARK) && existsSync(LEADS_FILE)) {
    const ins = db.prepare(`INSERT INTO leads (ts,name,contact,company,comment,page,ip,ua,legacy_fields,status)
      VALUES (?,?,?,?,?,?,?,?,?,'new')`);
    let imported = 0;
    for (const line of readFileSync(LEADS_FILE, 'utf8').split('\n')) {
      if (!line.trim()) continue;
      try {
        const r = JSON.parse(line);
        const f = r.fields || {};
        ins.run(r.ts || r.receivedAt || new Date().toISOString(),
          r.name || f.Name || f.name || '',
          r.contact || f.Textarea_4 || f.Phone || f.Email || f.contact || '',
          r.company || '', r.comment || '', r.page || '', r.ip || '', r.ua || '',
          r.fields ? JSON.stringify(f) : '');
        imported++;
      } catch {}
    }
    if (imported) console.log(`[db] импортировано из JSONL: ${imported} заявок`);
  }
  const { writeFileSync } = await import('node:fs');
  if (!existsSync(MIGRATED_MARK)) writeFileSync(MIGRATED_MARK, new Date().toISOString());
} catch (e) { console.error('[db] миграция jsonl пропущена:', e.message); }

/* ── утилиты ── */
const rate = new Map();
function clientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (xff) return String(xff).split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}
function rateOk(ip) {
  const now = Date.now();
  const arr = (rate.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX) { rate.set(ip, arr); return false; }
  arr.push(now); rate.set(ip, arr); return true;
}
function clean(v) {
  return String(v == null ? '' : v)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim().slice(0, MAX_FIELD_LEN);
}
function json(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}
function cors(res, origin) {
  const ok = origin === ALLOWED_ORIGIN || origin === ALLOWED_ORIGIN.replace('://', '://www.');
  res.setHeader('Access-Control-Allow-Origin', ok ? origin : ALLOWED_ORIGIN);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(new Error('too_large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

/* ── telegram: уведомление БЕЗ персональных данных (152-ФЗ, трансграничка) ──
   С 05.08.2026 идёт на КАЖДУЮ заявку параллельно письму (раньше был только
   аварийным и при живой почте молчал). В сообщении — один номер заявки:
   Telegram зарубежный, персональные данные туда не уходят, состав заявки
   смотрят в письме или в админке. */
async function notifyTelegram(id, text) {
  if (!TG_BOT_TOKEN || !TG_CHAT_ID) {
    console.warn('[tg] пропуск: токен/чат не заданы'); return;
  }
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(`${TELEGRAM_API_BASE}/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text, disable_web_page_preview: true }),
      signal: ctrl.signal,
    });
    if (!r.ok) console.error(`[tg] HTTP ${r.status}: ${(await r.text().catch(() => '')).slice(0, 200)}`);
    /* Логируем и успех: иначе по журналу не отличить «ушло» от «молча не сработало» */
    else console.log(`[tg] уведомление о заявке #${id} отправлено`);
  } catch (e) {
    console.error('[tg] сбой:', e.message || e);
  } finally { clearTimeout(t); }
}

/* ── почта: письмо владельцу с содержимым заявки ──────────────────────────
   В Telegram уходит только номер (внешний сервис — без ПД). Письмо идёт на
   собственный ящик оператора на своём домене (mx.yandex.net, РФ), поэтому в
   нём можно везти содержимое: это обработка оператором своих же данных, а не
   передача третьему лицу. */
async function notifyMail(id, rec) {
  if (!SMTP_USER || !SMTP_PASS || !MAIL_TO) {
    console.warn('[mail] пропуск: SMTP_USER/SMTP_PASS/MAIL_TO не заданы');
    return;
  }
  const when = new Date(rec.ts).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
  const lines = [
    `Заявка №${id} с сайта withoutwater.ru`,
    `Время: ${when} (МСК)`,
    '',
    `Имя: ${rec.name || '—'}`,
    `Контакт: ${rec.contact || '—'}`,
    `Компания и роль: ${rec.company || '—'}`,
    `Запрос: ${rec.comment || '—'}`,
    '',
    `Страница: ${rec.page || '/'}`,
    `Согласие на обработку ПД: да (версия ${rec.consent_pd_version || '—'})`,
    `Согласие на рассылку: ${rec.consent_ads ? 'да' : 'нет'}`,
    '',
    `Открыть в админке: ${PUBLIC_BASE}/admin`,
  ];
  try {
    await sendMail({
      host: SMTP_HOST, port: SMTP_PORT, user: SMTP_USER, pass: SMTP_PASS,
      from: SMTP_USER, to: MAIL_TO,
      subject: `Заявка №${id} — ${rec.name || 'без имени'}`,
      text: lines.join('\n'),
    });
    console.log(`[mail] заявка #${id} отправлена на ${MAIL_TO}`);
  } catch (e) {
    const why = String(e.message || e).slice(0, 300);
    console.error(`[mail] заявка #${id} НЕ отправлена:`, why);
    /* Письмо не дошло — поднимаем тревогу в Telegram, иначе заявку заметят
       только при следующем заходе в админку. Без ПД: только номер и причина. */
    notifyTelegram(id,
      `⚠️ Заявка №${id} — письмо НЕ доставлено\nПричина: ${why}\nЗаявка сохранена: ${PUBLIC_BASE}/admin`);
  }
}

/* ── basic auth для /admin ── */
function adminAuthed(req) {
  if (!ADMIN_USER || !ADMIN_PASS) return false; // без настроенного пароля админка закрыта
  const h = req.headers.authorization || '';
  if (!h.startsWith('Basic ')) return false;
  try {
    const [u, ...p] = Buffer.from(h.slice(6), 'base64').toString('utf8').split(':');
    // сравнение фиксированной длительности не критично за rate-limit'ом, но не светим тайминги
    return u === ADMIN_USER && p.join(':') === ADMIN_PASS;
  } catch { return false; }
}
function require401(res) {
  res.writeHead(401, {
    'WWW-Authenticate': 'Basic realm="withoutwater admin", charset="UTF-8"',
    'Content-Type': 'text/plain; charset=utf-8',
  });
  res.end('Требуется вход');
}

/* ── CSV ── */
function csvEscape(v) {
  const s = String(v == null ? '' : v);
  return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

/* ── сервер ── */
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const origin = req.headers.origin || '';
  const path = url.pathname;

  if (req.method === 'OPTIONS') { cors(res, origin); res.writeHead(204); res.end(); return; }

  if (req.method === 'GET' && path === '/api/health') {
    const c = db.prepare("SELECT COUNT(*) AS c FROM leads").get().c;
    return json(res, 200, { ok: true, tg: Boolean(TG_BOT_TOKEN && TG_CHAT_ID), leads: c, admin: Boolean(ADMIN_USER && ADMIN_PASS), mail: MAIL_ENABLED });
  }

  /* ── приём заявки ── */
  if (req.method === 'POST' && path === '/api/lead') {
    cors(res, origin);
    const ip = clientIp(req);
    if (!rateOk(ip)) return json(res, 429, { ok: false, error: 'rate_limited' });

    let p;
    try { p = JSON.parse(await readBody(req) || '{}'); }
    catch (e) { return json(res, e.message === 'too_large' ? 413 : 400, { ok: false, error: 'bad_body' }); }

    // два формата: новый (name/contact/…) и старый tilda ({fields:{…}}) на переходный период
    let name, contact, company = '', comment = '', legacy = '';
    let consentPd = false, consentPdVersion = '', consentAds = false;
    if (p && p.fields && typeof p.fields === 'object') {
      const f = p.fields;
      if (clean(f._hp)) return json(res, 200, { ok: true }); // honeypot
      name = clean(f.Name || f.name);
      contact = clean(f.Textarea_4 || f.Phone || f.Email || f.contact);
      legacy = JSON.stringify(f).slice(0, 4000);
      consentPd = true; consentPdVersion = 'tilda-checkbox';
    } else {
      if (clean(p.website)) return json(res, 200, { ok: true }); // honeypot
      name = clean(p.name);
      contact = clean(p.contact);
      company = clean(p.company);
      comment = clean(p.comment);
      consentPd = p.consent_pd === true;
      consentPdVersion = clean(p.consent_pd_version).slice(0, 40);
      consentAds = p.consent_ads === true;
    }

    if (!contact && !name) return json(res, 400, { ok: false, error: 'no_contact' });
    if (!consentPd) return json(res, 400, { ok: false, error: 'no_consent' });

    const nowIso = new Date().toISOString();
    const rec = {
      ts: nowIso, name, contact, company, comment,
      page: clean(p.page).slice(0, 300), ip,
      ua: clean(req.headers['user-agent']).slice(0, 300),
      consent_pd_version: consentPdVersion || '1.0-2026-07-14',
      consent_pd_ts: nowIso,
      consent_ads: consentAds ? 1 : 0,
      consent_ads_ts: consentAds ? nowIso : '',
      legacy_fields: legacy,
    };

    let id;
    try {
      const r = db.prepare(`INSERT INTO leads
        (ts,name,contact,company,comment,page,ip,ua,consent_pd_version,consent_pd_ts,consent_ads,consent_ads_ts,legacy_fields)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`)
        .run(rec.ts, rec.name, rec.contact, rec.company, rec.comment, rec.page, rec.ip, rec.ua,
          rec.consent_pd_version, rec.consent_pd_ts, rec.consent_ads, rec.consent_ads_ts, rec.legacy_fields);
      id = Number(r.lastInsertRowid);
    } catch (e) {
      console.error('[db] insert не прошёл:', e.message);
      return json(res, 500, { ok: false, error: 'store_failed' });
    }

    // резервный журнал (append-only), не блокируем ответ при сбое
    appendFile(LEADS_FILE, JSON.stringify({ id, ...rec }) + '\n', 'utf8').catch((e) =>
      console.error('[jsonl] журнал не записан:', e.message));

    console.log(`[lead] #${id} ip=${ip} ads=${rec.consent_ads}`);
    /* Два канала сразу (решение Виктории 05.08.2026): письмо с полным составом
       заявки на почту владельца и короткое уведомление в Telegram. Раньше
       Telegram был только аварийным — при работающей почте не срабатывал
       вовсе, и заявки замечались с задержкой.
       В Telegram по-прежнему уходит ТОЛЬКО номер заявки: это зарубежный
       сервис, персональные данные туда не передаются (152-ФЗ). */
    if (MAIL_ENABLED) notifyMail(id, rec);
    notifyTelegram(id, `🖋 Новая заявка №${id} — withoutwater.ru\nОткрыть админку: ${PUBLIC_BASE}/admin`);
    return json(res, 200, { ok: true, id });
  }

  /* ── визард «Черновик модели решения»: фиксация выборов (без ПД) ── */
  if (req.method === 'POST' && path === '/api/wizard') {
    cors(res, origin);
    const ip = clientIp(req);
    if (!rateOk(ip)) return json(res, 429, { ok: false, error: 'rate_limited' });
    let p;
    try { p = JSON.parse(await readBody(req) || '{}'); }
    catch (e) { return json(res, e.message === 'too_large' ? 413 : 400, { ok: false, error: 'bad_body' }); }
    const scenario = clean(p.scenario).slice(0, 80);
    const have = (Array.isArray(p.have) ? p.have : []).map((h) => clean(h).slice(0, 80)).filter(Boolean).slice(0, 8).join(', ');
    const goal = clean(p.goal).slice(0, 80);
    const timing = clean(p.timing).slice(0, 80);
    if (!scenario) return json(res, 400, { ok: false, error: 'no_scenario' });
    try {
      db.prepare('INSERT INTO wizard_runs (ts,scenario,have,goal,timing) VALUES (?,?,?,?,?)')
        .run(new Date().toISOString(), scenario, have, goal, timing);
    } catch (e) {
      console.error('[wizard] insert не прошёл:', e.message);
      return json(res, 500, { ok: false, error: 'store_failed' });
    }
    return json(res, 200, { ok: true });
  }

  /* ── админка ── */
  if (path === '/admin' || path.startsWith('/admin/')) {
    if (!adminAuthed(req)) return require401(res);

    if (req.method === 'GET' && (path === '/admin' || path === '/admin/')) {
      try {
        const html = await readFile(join(__dirname, 'admin.html'), 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' });
        return res.end(html);
      } catch { return json(res, 500, { ok: false, error: 'admin_html_missing' }); }
    }

    if (req.method === 'GET' && path === '/admin/api/leads') {
      const status = url.searchParams.get('status') || '';
      const q = (url.searchParams.get('q') || '').trim();
      let sql = 'SELECT * FROM leads';
      const cond = [], args = [];
      if (STATUSES.includes(status)) { cond.push('status = ?'); args.push(status); }
      if (q) { cond.push('(name LIKE ? OR contact LIKE ? OR company LIKE ? OR comment LIKE ?)');
        args.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`); }
      if (cond.length) sql += ' WHERE ' + cond.join(' AND ');
      sql += ' ORDER BY id DESC LIMIT 500';
      const rows = db.prepare(sql).all(...args);
      const counts = {};
      for (const s of STATUSES) counts[s] = db.prepare('SELECT COUNT(*) AS c FROM leads WHERE status = ?').get(s).c;
      return json(res, 200, { ok: true, leads: rows, counts });
    }

    const mStatus = path.match(/^\/admin\/api\/leads\/(\d+)\/status$/);
    if (req.method === 'POST' && mStatus) {
      let body;
      try { body = JSON.parse(await readBody(req) || '{}'); } catch { return json(res, 400, { ok: false }); }
      if (!STATUSES.includes(body.status)) return json(res, 400, { ok: false, error: 'bad_status' });
      db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(body.status, Number(mStatus[1]));
      return json(res, 200, { ok: true });
    }

    const mDel = path.match(/^\/admin\/api\/leads\/(\d+)$/);
    if (req.method === 'DELETE' && mDel) {
      db.prepare('DELETE FROM leads WHERE id = ?').run(Number(mDel[1]));
      console.log(`[admin] заявка #${mDel[1]} удалена (запрос на удаление ПД или ручная очистка)`);
      return json(res, 200, { ok: true });
    }

    // дайджест визарда: что выбирают чаще всего + последние прохождения
    if (req.method === 'GET' && path === '/admin/api/wizard/summary') {
      const total = db.prepare('SELECT COUNT(*) AS c FROM wizard_runs').get().c;
      const by = (col) => db.prepare(
        `SELECT ${col} AS k, COUNT(*) AS c FROM wizard_runs WHERE ${col} != '' GROUP BY ${col} ORDER BY c DESC`
      ).all();
      // «что есть» — мультивыбор через запятую, раскладываем по значениям
      const haveCounts = {};
      for (const r of db.prepare("SELECT have FROM wizard_runs WHERE have != ''").all()) {
        for (const h of r.have.split(', ')) haveCounts[h] = (haveCounts[h] || 0) + 1;
      }
      const recent = db.prepare('SELECT ts,scenario,have,goal,timing FROM wizard_runs ORDER BY id DESC LIMIT 20').all();
      return json(res, 200, {
        ok: true, total,
        scenario: by('scenario'), goal: by('goal'), timing: by('timing'),
        have: Object.entries(haveCounts).map(([k, c]) => ({ k, c })).sort((a, b) => b.c - a.c),
        recent,
      });
    }

    if (req.method === 'GET' && path === '/admin/api/export.csv') {
      const rows = db.prepare('SELECT id,ts,name,contact,company,comment,page,status,consent_pd_version,consent_pd_ts,consent_ads FROM leads ORDER BY id DESC').all();
      const head = 'id;время;имя;контакт;компания;комментарий;страница;статус;версия_согласия;время_согласия;согласие_рассылка';
      const lines = rows.map((r) => [r.id, r.ts, r.name, r.contact, r.company, r.comment, r.page, r.status,
        r.consent_pd_version, r.consent_pd_ts, r.consent_ads ? 'да' : 'нет'].map(csvEscape).join(';'));
      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      });
      return res.end('﻿' + [head, ...lines].join('\n')); // BOM для Excel
    }

    return json(res, 404, { ok: false, error: 'not_found' });
  }

  json(res, 404, { ok: false, error: 'not_found' });
});

server.listen(PORT, HOST, () => {
  console.log(`withoutwater API v2 на http://${HOST}:${PORT}  (tg=${Boolean(TG_BOT_TOKEN && TG_CHAT_ID)}, db=${DB_FILE}, admin=${Boolean(ADMIN_USER && ADMIN_PASS)})`);
});
