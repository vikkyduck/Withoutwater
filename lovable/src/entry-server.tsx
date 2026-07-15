// SSR-точка входа для пререндера (см. prerender.mjs).
// Рендерит лендинг в статический HTML, чтобы боты без JS (Яндекс и текстовые
// краулеры) получали полный текст страницы, а не пустой <div id="root">.
// На клиенте main.tsx всё равно монтирует интерактивную версию поверх.
import { renderToStaticMarkup } from "react-dom/server";
import Landing from "./landing";

export function render(): string {
  return renderToStaticMarkup(<Landing />);
}
