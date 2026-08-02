// PDF раздела «Бизнес-эффект» — из той же вёрстки, что и страницы (ТЗ 02.08).
// Запускается после prerender.mjs (package.json → "build"). Схема: поднимаем
// локальный статический сервер над dist/, печатаем четыре страницы системным
// Chrome (headless, A4, без колонтитулов) в dist/pdf/*.pdf.
//
// Печатаем с включённым JS: сценарии появления в печати гасятся правилом
// в styles.css (@media print → opacity:1). Флаги --virtual-time-budget и
// --blink-settings=scriptEnabled=false НЕ добавлять: с ними Chrome 151 молча
// выходит, не записав файл (проверено 03.08).
//
// Chrome может зависнуть уже ПОСЛЕ записи файла (фоновые сервисы) — поэтому
// ждём появления файла и стабильного размера, затем убиваем процесс сами.
//
// Ссылки в HTML переписываются на https://withoutwater.ru — иначе в PDF они
// вели бы на локальный порт печати. Метрика на время печати заглушена
// host-resolver-rules, чтобы сборка не создавала визитов.
//
// Пропуск (машина без Chrome): SKIP_PDF=1 npm run build
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, statSync, rmSync } from "node:fs";
import { resolve, extname, dirname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";

const root = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(root, "dist");
const ORIGIN = "https://withoutwater.ru";

const TARGETS = [
  ["/business-effect/", "bez-vody-business-effect.pdf"],
  ["/tasks/internal-experts/business-effect/", "bez-vody-internal-experts.pdf"],
  ["/tasks/team-subscription/business-effect/", "bez-vody-team-subscription.pdf"],
  ["/tasks/external-experts/business-effect/", "bez-vody-external-experts.pdf"],
];

if (process.env.SKIP_PDF === "1") {
  console.log("[pdf] SKIP_PDF=1 — пропускаю сборку PDF");
  process.exit(0);
}

const CHROME =
  process.env.CHROME ||
  ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome", "/usr/bin/chromium-browser", "/usr/bin/chromium",
  ].find(existsSync);
if (!CHROME) {
  console.error("[pdf] Chrome не найден. Укажи путь: CHROME=/путь/к/chrome npm run build, либо SKIP_PDF=1");
  process.exit(1);
}

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".png": "image/png", ".woff2": "font/woff2",
  ".xml": "application/xml", ".txt": "text/plain", ".ico": "image/x-icon",
};

const server = createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = normalize(resolve(DIST, "." + urlPath));
    if (!file.startsWith(DIST)) { res.writeHead(403); res.end(); return; }
    if (existsSync(file) && statSync(file).isDirectory()) file = resolve(file, "index.html");
    if (!existsSync(file)) { res.writeHead(404); res.end("not found"); return; }
    const ext = extname(file);
    let body = readFileSync(file);
    if (ext === ".html") {
      /* Абсолютные ссылки: в PDF-аннотациях должен быть боевой домен.
         Переписывать href в HTML нельзя дважды проверено (03.08):
         - заденешь <link> — CSS поедет с прода со старым хэшем (404),
           и PDF печатается голым HTML;
         - перепишешь только <a> — React при гидрации вернёт свои
           относительные href, и в PDF уйдут ссылки на локальный порт.
         Поэтому инжектим скрипт, который правит ссылки в живом DOM
         уже после гидрации (и повторяет это до момента печати). */
      const fix =
        `<script>(function(){var f=function(){` +
        `document.querySelectorAll('a[href^="/"]').forEach(function(a){` +
        `a.setAttribute('href','${ORIGIN}'+a.getAttribute('href'))})};` +
        `f();addEventListener('load',f);setInterval(f,250);})();</script>`;
      body = Buffer.from(body.toString("utf8").replace("</body>", fix + "</body>"));
    }
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(body);
  } catch (e) {
    res.writeHead(500); res.end(String(e));
  }
});

await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const port = server.address().port;
mkdirSync(resolve(DIST, "pdf"), { recursive: true });

const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));

async function printOne(path, out) {
  rmSync(out, { force: true });
  const profile = resolve(tmpdir(), `bv-pdf-profile-${port}`);
  const child = spawn(CHROME, [
    "--headless", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    "--hide-scrollbars",
    `--user-data-dir=${profile}`,
    '--host-resolver-rules=MAP mc.yandex.ru 127.0.0.1',
    "--no-pdf-header-footer",
    `--print-to-pdf=${out}`,
    `http://127.0.0.1:${port}${path}`,
  ], { stdio: "ignore" });

  const deadline = Date.now() + 60_000;
  let lastSize = -1;
  let ok = false;
  while (Date.now() < deadline) {
    await sleep(700);
    if (child.exitCode !== null) {
      ok = existsSync(out) && statSync(out).size > 30_000;
      break;
    }
    if (existsSync(out)) {
      const size = statSync(out).size;
      // размер перестал расти — файл дописан, Chrome можно снимать
      if (size > 30_000 && size === lastSize) { ok = true; break; }
      lastSize = size;
    }
  }
  try { child.kill("SIGKILL"); } catch {}
  if (!ok) throw new Error("файл не записан за 60 секунд");
  return statSync(out).size;
}

let failed = 0;
for (const [path, name] of TARGETS) {
  const out = resolve(DIST, "pdf", name);
  try {
    const size = await printOne(path, out);
    console.log(`[pdf] ${name.padEnd(36)} ${(size / 1024).toFixed(0)} КБ`);
  } catch (e) {
    failed++;
    console.error(`[pdf] ОШИБКА ${name}: ${e.message}`);
  }
}

server.close();
if (failed) process.exit(1);
console.log(`[pdf] готово: ${TARGETS.length} файла в dist/pdf/`);
