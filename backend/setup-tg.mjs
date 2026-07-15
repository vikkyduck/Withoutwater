/* Одноразовый мастер подключения Telegram-бота для заявок withoutwater.ru.
 * Открывается по секретной ссылке, принимает токен бота, сам находит chat_id,
 * пишет TG_BOT_TOKEN/TG_CHAT_ID в /opt/withoutwater/.env и перезапускает сервис.
 * После настройки — остановить и снять nginx-локацию (одноразовая штука).
 * Слушает только localhost; наружу по секретному пути проксирует nginx. */
import http from 'node:http';
import fs from 'node:fs';
import { execFile } from 'node:child_process';

const PORT = 5099;
const HOST = '127.0.0.1';
const ENV_FILE = '/opt/withoutwater/.env';
const SECRET = process.env.SETUP_SECRET || '';
if (!SECRET) { console.error('SETUP_SECRET не задан'); process.exit(1); }
const BASE = '/wf-setup-' + SECRET;

function readEnv() {
  const env = {};
  try {
    for (const line of fs.readFileSync(ENV_FILE, 'utf8').split('\n')) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m) env[m[1]] = m[2];
    }
  } catch (_) {}
  return env;
}
function writeEnvKeys(updates) {
  let lines = [];
  try { lines = fs.readFileSync(ENV_FILE, 'utf8').split('\n'); } catch (_) {}
  const keys = Object.keys(updates);
  const seen = {};
  lines = lines.map((l) => {
    const m = l.match(/^([A-Z_]+)=/);
    if (m && keys.includes(m[1])) { seen[m[1]] = 1; return `${m[1]}=${updates[m[1]]}`; }
    return l;
  });
  for (const k of keys) if (!seen[k]) lines.push(`${k}=${updates[k]}`);
  fs.writeFileSync(ENV_FILE, lines.join('\n'), { mode: 0o600 });
}

// Вызов Telegram Bot API через тот же прокси, что и основной сервис
function tgBase() {
  const b = (readEnv().TELEGRAM_API_BASE || 'https://api.telegram.org').replace(/\/$/, '');
  return b;
}
// Вызов Telegram Bot API через fetch (Node 18+)
async function tg(token, method, params) {
  try {
    const res = await fetch(`${tgBase()}/bot${token}/${method}`, {
      method: params ? 'POST' : 'GET',
      headers: params ? { 'Content-Type': 'application/json' } : undefined,
      body: params ? JSON.stringify(params) : undefined,
    });
    return await res.json();
  } catch (e) {
    return { ok: false, description: String(e.message || e) };
  }
}

function restartApi() {
  return new Promise((resolve) => {
    execFile('systemctl', ['restart', 'withoutwater-api'], (err) => resolve(!err));
  });
}

const PAGE = `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Подключение Telegram — withoutwater.ru</title>
<style>
 body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a2e;background:#f7f8fb}
 h1{font-size:20px} .card{background:#fff;border-radius:14px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,.06);margin-bottom:16px}
 ol{padding-left:20px;line-height:1.6} input{width:100%;box-sizing:border-box;padding:12px;font-size:15px;border:1px solid #ccd;border-radius:10px;margin:8px 0}
 button{background:#5b6ef5;color:#fff;border:0;border-radius:10px;padding:13px 18px;font-size:15px;font-weight:600;cursor:pointer;width:100%}
 button:disabled{opacity:.6} .msg{margin-top:14px;padding:12px;border-radius:10px;font-size:14px;line-height:1.5;display:none}
 .ok{background:#e6f8ec;color:#0a7a33} .err{background:#fdecec;color:#c02626} code{background:#eef;padding:2px 6px;border-radius:6px}
</style></head><body>
<h1>🌊 Подключение Telegram для заявок</h1>
<div class="card">
 <b>Шаг 1.</b> В Telegram откройте <code>@BotFather</code> → команда <code>/newbot</code> → придумайте имя и @username бота. BotFather пришлёт <b>токен</b> вида <code>1234:AA...</code>.<br><br>
 <b>Шаг 2.</b> Напишите вашему новому боту любое сообщение (например «привет») — чтобы он узнал ваш чат.<br><br>
 <b>Шаг 3.</b> Вставьте токен сюда и нажмите кнопку.
</div>
<div class="card">
 <input id="tok" placeholder="Токен бота от @BotFather" autocomplete="off">
 <button id="go">Проверить и подключить</button>
 <div id="m" class="msg"></div>
</div>
<script>
 var go=document.getElementById('go'),m=document.getElementById('m'),tok=document.getElementById('tok');
 function show(t,ok){m.style.display='block';m.className='msg '+(ok?'ok':'err');m.innerHTML=t;}
 go.onclick=function(){
   var t=(tok.value||'').trim(); if(!t){show('Вставьте токен.',false);return;}
   go.disabled=true; show('Проверяю…',true);
   fetch('${BASE}/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:t})})
    .then(function(r){return r.json()}).then(function(res){
      go.disabled=false;
      if(res.ok){show('✅ Готово! Бот <b>@'+res.bot+'</b> подключён. Я отправил тестовое сообщение вам в Telegram — проверьте. Заявки с сайта теперь будут приходить туда.',true);}
      else if(res.error==='no_chat'){show('Токен верный (бот <b>@'+res.bot+'</b>), но я не вижу вашего сообщения боту. Напишите боту любое сообщение в Telegram и нажмите кнопку ещё раз.',false);}
      else if(res.error==='bad_token'){show('Токен не подошёл. Проверьте, что скопировали его целиком от @BotFather.',false);}
      else{show('Ошибка: '+(res.error||'неизвестно')+'. Попробуйте ещё раз.',false);}
    }).catch(function(){go.disabled=false;show('Сеть недоступна, попробуйте ещё раз.',false);});
 };
</script></body></html>`;

const server = http.createServer(async (req, res) => {
  const url = (req.url || '').split('?')[0];
  const json = (c, o) => { res.writeHead(c, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(o)); };

  if (req.method === 'GET' && url === BASE) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    return res.end(PAGE);
  }
  if (req.method === 'POST' && url === BASE + '/save') {
    let raw = '';
    req.on('data', (d) => { raw += d; if (raw.length > 4096) req.destroy(); });
    req.on('end', async () => {
      let token = '';
      try { token = String(JSON.parse(raw).token || '').trim(); } catch (_) {}
      if (!token) return json(400, { ok: false, error: 'empty' });
      const me = await tg(token, 'getMe');
      if (!me || !me.ok) return json(200, { ok: false, error: 'bad_token' });
      const botName = me.result.username;
      const upd = await tg(token, 'getUpdates', null);
      let chatId = null;
      if (upd && upd.ok && Array.isArray(upd.result)) {
        for (let i = upd.result.length - 1; i >= 0; i--) {
          const msg = upd.result[i].message || upd.result[i].edited_message;
          if (msg && msg.chat && msg.chat.id) { chatId = msg.chat.id; break; }
        }
      }
      if (!chatId) return json(200, { ok: false, error: 'no_chat', bot: botName });
      writeEnvKeys({ TG_BOT_TOKEN: token, TG_CHAT_ID: String(chatId) });
      await restartApi();
      await tg(token, 'sendMessage', {
        chat_id: chatId,
        text: '✅ Бот подключён к сайту withoutwater.ru. Сюда будут приходить заявки с формы «Оставить заявку».',
      });
      return json(200, { ok: true, bot: botName });
    });
    return;
  }
  json(404, { ok: false });
});
server.listen(PORT, HOST, () => console.log(`setup-tg слушает http://${HOST}:${PORT}${BASE}`));
