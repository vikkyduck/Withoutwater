import { PAGE_REDIRECTS } from "./site/redirects";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { ROUTES, HASH_REDIRECTS, TASKS_HASH_REDIRECTS } from "./site/pages";

/* Многостраничник без клиентского роутера: каждая страница пререндерена
   в свой dist/<путь>/index.html, бандл один — монтируем компонент по
   location.pathname. Переходы между страницами — обычные ссылки. */

const normalize = (p: string) => {
  let path = p || "/";
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path;
};

/* Редиректы со старых якорей: с главной (/#faq и подобные — ТЗ п.5) и
   с /tasks#practice на продуктовые страницы (финальная структура 02.08). */
const hash = window.location.hash;
const page = normalize(window.location.pathname);
const target =
  (page === "/" ? HASH_REDIRECTS[hash] : page === "/tasks" ? TASKS_HASH_REDIRECTS[hash] : undefined) ?? PAGE_REDIRECTS[page];
if (target) {
  /* сохраняем query: разосланные ссылки вида /?utm_source=…#faq не должны
     терять атрибуцию при редиректе */
  const destination = new URL(target, window.location.origin);
  destination.search = window.location.search;
  if (!destination.hash) destination.hash = hash;
  window.location.replace(destination.href);
} else {
  const route = ROUTES.find((r) => r.path === page) ?? ROUTES[0];
  const Page = route.Component;
  function MountedPage() {
    useEffect(() => {
      if (!window.location.hash) return;
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "instant" }));
      return () => cancelAnimationFrame(frame);
    }, []);
    return <Page />;
  }
  createRoot(document.getElementById("root")!).render(<MountedPage />);
}
