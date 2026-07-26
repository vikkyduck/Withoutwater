// SSR-точка входа для пререндера (см. prerender.mjs).
// Рендерит КАЖДУЮ страницу многостраничника в статический HTML, чтобы боты
// без JS (Яндекс и текстовые краулеры) получали полный текст, а не пустой
// <div id="root">. На клиенте main.tsx монтирует интерактивную версию поверх.
import { renderToStaticMarkup } from "react-dom/server";
import { ROUTES } from "./site/pages";

export { ROUTES };

export function render(path: string): string {
  const route = ROUTES.find((r) => r.path === path);
  if (!route) throw new Error(`[entry-server] неизвестный маршрут: ${path}`);
  const Page = route.Component;
  return renderToStaticMarkup(<Page />);
}
