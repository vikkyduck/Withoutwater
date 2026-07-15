// Пререндер лендинга в статический HTML (SEO для ботов без JS: Яндекс + текстовые краулеры).
// Запускается после `vite build` (см. package.json → "build").
// Шаги: SSR-сборка landing → renderToStaticMarkup → вставка в dist/index.html → уборка.
// Клиент (main.tsx) поверх монтирует ту же интерактивную страницу через createRoot.
import { build } from "vite";
import { readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const SSR_DIR = resolve(root, "dist-ssr");
const INDEX = resolve(root, "dist/index.html");
const MARKER = '<div id="root"></div>';

// 1. SSR-сборка компонента (в отдельный dist-ssr, клиентский dist не трогаем)
await build({
  root,
  logLevel: "warn",
  build: { ssr: "src/entry-server.tsx", outDir: "dist-ssr", emptyOutDir: true },
});

// 2. рендер в статический HTML
const entry = readdirSync(SSR_DIR).find((f) => f.endsWith(".js") || f.endsWith(".mjs"));
if (!entry) throw new Error("[prerender] SSR-бандл не найден в dist-ssr");
const mod = await import(pathToFileURL(resolve(SSR_DIR, entry)).href);
const appHtml = mod.render();
if (!appHtml || appHtml.length < 1000) {
  throw new Error(`[prerender] подозрительно мало HTML (${appHtml?.length ?? 0} симв.) — рендер сорвался`);
}

// 3. вставка в dist/index.html
let html = readFileSync(INDEX, "utf8");
if (!html.includes(MARKER)) throw new Error(`[prerender] не найден ${MARKER} в dist/index.html`);
writeFileSync(INDEX, html.replace(MARKER, `<div id="root">${appHtml}</div>`), "utf8");

// 4. уборка
rmSync(SSR_DIR, { recursive: true, force: true });

console.log(`[prerender] вставлено ${appHtml.length.toLocaleString("ru")} символов статического HTML в dist/index.html`);
