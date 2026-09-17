// Пререндер МНОГОСТРАНИЧНИКА в статический HTML (SEO: Яндекс + текстовые краулеры).
// Запускается после `vite build` (package.json → "build").
// Для каждого маршрута из src/site/pages.tsx: SSR-рендер → своя мета
// (title/description/canonical/og) → dist/<путь>/index.html.
// Клиент (main.tsx) монтирует ту же страницу по location.pathname.
import { build } from "vite";
import { readFileSync, writeFileSync, readdirSync, rmSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const SSR_DIR = resolve(root, "dist-ssr");
const DIST = resolve(root, "dist");
const MARKER = '<div id="root"></div>';
const ORIGIN = "https://withoutwater.ru";

// 1. SSR-сборка (в отдельный dist-ssr, клиентский dist не трогаем)
await build({
  root,
  logLevel: "warn",
  build: { ssr: "src/entry-server.tsx", outDir: "dist-ssr", emptyOutDir: true },
});

const entry = readdirSync(SSR_DIR).find((f) => f.endsWith(".js") || f.endsWith(".mjs"));
if (!entry) throw new Error("[prerender] SSR-бандл не найден в dist-ssr");
const mod = await import(pathToFileURL(resolve(SSR_DIR, entry)).href);

let template = readFileSync(resolve(DIST, "index.html"), "utf8");
if (!template.includes(MARKER)) throw new Error(`[prerender] не найден ${MARKER} в dist/index.html`);

// fonts.css — инлайном: отдельный блокирующий запрос за 1 КБ не нужен.
// Комментарии вырезаем, сам файл остаётся для 404.html и юрстраниц.
{
  const fontsCss = readFileSync(resolve(root, "public/fonts/fonts.css"), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\n\s*\n/g, "\n")
    .trim();
  const link = '<link rel="stylesheet" href="/fonts/fonts.css" />';
  if (!template.includes(link)) throw new Error("[prerender] не найден тег fonts.css в шаблоне");
  template = template.replace(link, `<style>${fontsCss}</style>`);
}

// JSON-LD: организация на главной, FAQPage на /faq, хлебные крошки у кейсов.
// Только данные, которые уже есть на страницах (CONTACT, FAQ_ITEMS, CASES).
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
function jsonLd(path) {
  if (path === "/") {
    return ld({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Без Воды",
      alternateName: "withoutwater",
      url: ORIGIN + "/",
      logo: ORIGIN + "/favicon.svg",
      email: mod.CONTACT.email,
      telephone: mod.CONTACT.phone,
      sameAs: [mod.CONTACT.tgUrl],
    });
  }
  if (path === "/faq") {
    return ld({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: mod.FAQ_ITEMS.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: { "@type": "Answer", text: [...it.a, ...(it.list ?? [])].join(" ") },
      })),
    });
  }
  if (path.startsWith("/cases/")) {
    const item = mod.CASES.find((c) => c.slug && path === `/cases/${c.slug}`);
    return ld({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Кейсы", item: ORIGIN + "/cases/" },
        { "@type": "ListItem", position: 2, name: item?.title ?? path, item: ORIGIN + path + "/" },
      ],
    });
  }
  return "";
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
// $ в строке замены — спецсимвол для String.replace ($&, $1, $`); экранируем
const rep = (s) => s.replace(/\$/g, "$$$$");

let totalPages = 0;
for (const route of mod.ROUTES) {
  let appHtml = mod.render(route.path);
  if (!appHtml || appHtml.length < 1000) {
    throw new Error(`[prerender] ${route.path}: подозрительно мало HTML (${appHtml?.length ?? 0} симв.)`);
  }

  // LCP-фикс: framer вписывает стартовое скрытие инлайном (opacity:0 + blur +
  // translateY) — вычищаем у контента; декор (opacity:0 в середине style) не трогаем.
  let unhidden = 0;
  appHtml = appHtml.replace(/style="opacity:0([^"]*)"/g, (_mm, rest) => {
    unhidden++;
    const cleaned = rest
      .replace(/;?filter:blur\([^)]*\)/g, "")
      .replace(/;?transform:translateY\([^)]*\)/g, "");
    return `style="opacity:1${cleaned}"`;
  });

  // Мета конкретной страницы
  const url = ORIGIN + (route.path === "/" ? "/" : route.path + "/");
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${rep(esc(route.title))}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${rep(esc(route.description))}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${rep(esc(route.title))}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${rep(esc(route.description))}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(MARKER, `<div id="root">${rep(appHtml)}</div>`);
  const structured = jsonLd(route.path);
  if (structured) html = html.replace("</head>", `${rep(structured)}\n</head>`);

  // Страницы вне сайта (route.noindex): не индексируем и не пускаем по ссылкам.
  // Ссылку на такую страницу отправляют клиенту напрямую — см. /constructor.
  if (route.noindex) {
    html = html.replace(
      /<link rel="canonical"[^>]*>/,
      '<meta name="robots" content="noindex, nofollow" />',
    );
  }

  const outDir = route.path === "/" ? DIST : resolve(DIST, route.path.slice(1));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), html, "utf8");
  totalPages++;
  console.log(`[prerender] ${route.path.padEnd(15)} ${appHtml.length.toLocaleString("ru")} симв. (LCP-фикс: ${unhidden})`);
}

// sitemap.xml по фактическим маршрутам. lastmod — дата последнего коммита
// по исходникам сайта, а не день сборки: иначе каждая выкатка объявляла
// «всё изменилось». Юрстраницы (public/*_pd, pub_oferta) стоят с noindex —
// в карте им не место.
let lastmod = new Date().toISOString().slice(0, 10);
try {
  lastmod = execSync("git log -1 --format=%cs -- src public index.html", { cwd: root, encoding: "utf8" }).trim() || lastmod;
} catch {}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mod.ROUTES.filter((r) => !r.noindex).map((r) => `  <url><loc>${ORIGIN}${r.path === "/" ? "/" : r.path + "/"}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n")}
</urlset>
`;
writeFileSync(resolve(DIST, "sitemap.xml"), sitemap, "utf8");

rmSync(SSR_DIR, { recursive: true, force: true });
console.log(`[prerender] готово: ${totalPages} страниц + sitemap.xml`);
