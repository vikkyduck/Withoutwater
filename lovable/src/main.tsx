import { createRoot } from "react-dom/client";
import "./styles.css";
import { ROUTES, HASH_REDIRECTS } from "./site/pages";

/* Многостраничник без клиентского роутера: каждая страница пререндерена
   в свой dist/<путь>/index.html, бандл один — монтируем компонент по
   location.pathname. Переходы между страницами — обычные ссылки. */

const normalize = (p: string) => {
  let path = p || "/";
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path;
};

/* Редиректы со старых якорей одностраничника (ТЗ п.5): разосланные ссылки
   вида /#faq должны приводить на новые страницы. */
const hash = window.location.hash;
const target = normalize(window.location.pathname) === "/" ? HASH_REDIRECTS[hash] : undefined;
if (target) {
  /* сохраняем query: разосланные ссылки вида /?utm_source=…#faq не должны
     терять атрибуцию при редиректе */
  window.location.replace(target + window.location.search);
} else {
  const path = normalize(window.location.pathname);
  const route = ROUTES.find((r) => r.path === path) ?? ROUTES[0];
  const Page = route.Component;
  createRoot(document.getElementById("root")!).render(<Page />);
}
