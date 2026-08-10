/* ============================================================================
   pages-case.tsx — страница одного кейса: /cases/<slug>.

   Архитектура от 06.08.2026 (вариант 2 по выбору Виктории):
   • один кейс = одна страница со своим адресом, мета и превью для мессенджера;
   • внизу страницы — отзыв клиента этого же проекта, если он есть;
   • отзыв открывается КРУПНЫМ МОДАЛЬНЫМ ОКНОМ, без ухода на другую страницу
     (ReviewModal в blocks.tsx); общая витрина отзывов остаётся на /reviews.

   Маршруты кейсов разворачиваются из данных — см. CASE_ROUTES в pages.tsx.
   ========================================================================== */
import {
  motion,
  PageShell, PageHead, SectionLabel, PaperCard, Scene, CtaBand,
  RevealHeading, NodeList, NodeBullet, ArrowRight,
  reveal,
} from "./core";
import { CASES, REVIEWS, type CaseItem } from "./data";
import { ReviewOpener } from "./blocks";

function MetricTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-col rounded-sm border border-[color:var(--color-line)] bg-[color:var(--color-bg-secondary)] px-4 py-5">
      <div className="font-display t-h2 tabular-nums text-[color:var(--color-accent)] [overflow-wrap:anywhere]">
        {value}
      </div>
      <div className="mt-2 t-body text-[color:var(--color-text-secondary)]">{label}</div>
    </div>
  );
}

export function CasePage({ item }: { item: CaseItem }) {
  const review = item.reviewSlug
    ? REVIEWS.find((r) => r.slug === item.reviewSlug)
    : undefined;

  return (
    <PageShell path={`/cases/${item.slug}`}>
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-right-40 top-[20%]", tone: "rose", size: 500 }]} />
        <PageHead
          compact
          kicker={item.category}
          title={<>{item.title}</>}
          lead={item.client}
          chips={[
            ["Роль команды", item.role],
            ...(item.timing ? ([["Срок и объём", item.timing]] as [string, string][]) : []),
          ]}
        />

        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          {/* Отрасли: те же теги, по которым работает фильтр на /cases */}
          {item.industries && item.industries.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.industries.map((ind) => (
                <span
                  key={ind}
                  className="rounded-pill border border-[color:var(--color-line)] px-3 py-1 t-caption text-[color:var(--color-text-secondary)]"
                >
                  {ind}
                </span>
              ))}
              {item.nda && (
                <span className="rounded-pill border border-[color:var(--color-line)] px-3 py-1 t-caption text-[color:var(--color-text-secondary)]">
                  NDA
                </span>
              )}
            </div>
          )}

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {item.metrics.slice(0, 3).map(([value, label]) => (
              <MetricTile key={label} value={value} label={label} />
            ))}
          </div>

          {item.done && item.done.length > 0 && (
            <div className="mt-14">
              <SectionLabel n="01">Что сделали</SectionLabel>
              <div className="mt-6 max-w-3xl">
                <NodeList divided items={item.done} />
              </div>
            </div>
          )}

          {item.changed && (
            <div className="mt-14">
              <SectionLabel n="02">Что изменилось у клиента</SectionLabel>
              <PaperCard className="mt-6 max-w-3xl border-l-[3px] border-l-[color:var(--color-accent)] p-6">
                <p className="t-body text-[color:var(--color-text-primary)]">{item.changed}</p>
              </PaperCard>
            </div>
          )}

          {item.source && (
            <p className="mt-8 max-w-3xl t-caption text-[color:var(--color-text-secondary)]">
              {item.source}
            </p>
          )}

          {/* Оговорка о цифрах — в каждом кейсе (решение Виктории 10.08).
              Отдельным абзацем с линейкой сверху: это сноска к показателям,
              а не продолжение рассказа о проекте. */}
          <p className="mt-8 max-w-3xl border-t border-[color:var(--color-line)] pt-4 t-caption text-[color:var(--color-text-secondary)]">
            На основе данных заказчика. Наш продукт — один из факторов, влияющих
            на эти показатели
          </p>

          {/* Отзыв клиента этого проекта — открывается модальным окном */}
          {review && (
            <div className="mt-14">
              <SectionLabel n="03">Отзыв клиента</SectionLabel>
              <PaperCard className="mt-6 max-w-3xl p-6">
                <div className="flex items-center gap-4">
                  <div className="size-16 shrink-0 overflow-hidden rounded-pill border border-[color:var(--color-line)] bg-[color:var(--color-bg-secondary)]">
                    <img
                      src={review.photo}
                      alt={review.name}
                      loading="lazy"
                      width={240}
                      height={240}
                      className="size-full object-cover grayscale"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display t-body font-semibold">{review.name}</div>
                    <p className="mt-1 t-caption text-[color:var(--color-text-secondary)]">
                      {review.role}
                    </p>
                  </div>
                </div>
                <p className="mt-5 t-body text-[color:var(--color-text-primary)]">
                  {review.text[0]}
                </p>
                <div className="mt-5">
                  <ReviewOpener slug={review.slug}>Читать отзыв целиком</ReviewOpener>
                </div>
              </PaperCard>
            </div>
          )}

          <div className="mt-14">
            <a href="/cases" className="link-arrow group t-body">
              Все кейсы
              <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      <CtaBand path={`/cases/${item.slug}`} />
    </PageShell>
  );
}

/* Компоненты страниц по одному на кейс — их подхватывает карта маршрутов. */
export const CASE_PAGES = CASES.filter((c) => c.slug).map((item) => ({
  slug: item.slug as string,
  item,
  Component: () => <CasePage item={item} />,
}));
