/* ============================================================================
   blocks.tsx — секции страниц. Дизайн-код перенесен 1:1 из сборки Lovable
   Виктории; новые блоки (кирпичики клиентов, производство, полоса цифр,
   два входа) — по ТЗ v3 от 26.07.
   ========================================================================== */
import {
  motion, AnimatePresence,
  ArrowUpRight, ArrowRight, Plus, Check, ExternalLink, CookingPot, Send,
  useRef, useState, useEffect,
  ymGoal,
  SectionLabel, GlassCard, PaperCard, Scene, NodeScene, ScrollRing,
  RevealHeading, Field, StencilLogo,
  NodeBullet, NodeList, Stencil, CatMark, Swash, HandArrow, LineIcon,
  CTA_LABEL, CTA_NOTE,
  reveal,
  REVEAL_EASE,
  useOpenReview, openReview, closeReview, reviewLinkHandler, registerReviewModal,
} from "./core";
import {
  BRICKS, BRICK_TASKS, CASE_INDUSTRIES, CASE_SERVICES,
  visibleCases, homeReviews, REVIEWS, SITUATIONS, TEAM,
  LEAD_ERROR, CONTACT, CONSENT_PD_VERSION, type FaqItem,
  type CaseItem, type Review,
} from "./data";

import type React from "react";
import { useId } from "react";

const bookCover = { url: "/img/book-cover.webp" };

/* --------------------------------- Hero ---------------------------------- */
/* Из сборки Lovable; по ТЗ v3: строка «460+…» убрана из hero (дублирует
   полосу цифр), CTA — единая «Разбор задачи за 30 минут». */

export function Hero() {
  return (
    <section id="top" className="stage sec-dark grain border-b border-[color:var(--color-line-dark)]">
      {/* Сцена обложки (брендбук, разд. 7): графитовая пыль, сетка узлов,
          хромовое кольцо-объект. Под стеклянными плашками обязана быть
          графика — иначе стекло читается серой заплаткой. */}
      <div className="stage__bg" aria-hidden>
        {/* Волосяные колонки сетки — строгий каркас под свободной графикой */}
        <div
          className="absolute inset-y-0 left-0 right-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(232,238,247,0.055) 0 1px, transparent 1px 8.3333%)," +
              "repeating-linear-gradient(to bottom, rgba(232,238,247,0.035) 0 1px, transparent 1px 88px)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)",
            maskImage: "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)",
          }}
        />


        {/* Графитовая пыль: сцена не плоская, у угля есть температура */}
        <div
          className="hero-dust hero-dust--chrome absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 78% 18%, rgba(201,205,212,0.06), transparent 58%)," +
              "radial-gradient(80% 70% at 12% 96%, rgba(126,92,158,0.10), transparent 62%)",
          }}
        />

        {/* Паутинка: крупный слой справа + слой под стеклянными плашками */}
        <NodeScene
          className="!right-[-6%] !top-1/2 !h-[min(88%,620px)] text-[color:var(--color-text-inverse-2)]"
          opacity={0.4}
        />
        <NodeScene
          className="!right-auto !left-[2%] !top-auto !bottom-[-6%] !h-[min(70%,440px)] text-[color:var(--color-text-inverse-2)]"
          opacity={0.45}
        />
      </div>

      {/* Кольцо прогресса убрано (см. комментарий в core.tsx → PageHead) */}

      <div className="hero-pad relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        {/* Заголовок первого экрана — «Проектное бюро по обучению»
            (решение Виктории 10.08): не «ваша команда», а подрядчик с
            собственной рамкой. Образ «мощностей» остается в надзаголовке.
            Формулировки ее, дословно. */}
        <div className="mb-6 [--color-text-secondary:var(--color-text-inverse-2)]">
          <SectionLabel n="01">Для HR, T&D и EdTech</SectionLabel>
        </div>
        <RevealHeading as="h1" className="t-h1 max-w-[900px] text-[color:var(--color-text-inverse)]">
          Проектное бюро по обучению
        </RevealHeading>

        <p className="t-body measure mt-6 text-[color:var(--color-text-inverse)]/85 md:mt-7">
          Реализуем образовательные продукты заказчика в срок и в соответствии с ожиданиями по качеству. Проектируем программы обучения с привлечением профильных специалистов
        </p>

        {/* Одно главное действие — сразу под смыслом, до всех аргументов */}
        <div className="mt-9 flex flex-col items-start gap-3 md:mt-10">
          <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-6">
            <a href="#contact" className="btn btn-invert group w-full sm:w-auto">
              <span>Оставить заявку на разбор задачи</span>
              <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
            <a
              href="/business-effect/"
              className="link-arrow group t-body text-[color:var(--color-text-inverse-2)] hover:text-[color:var(--color-text-inverse)]"
            >
              Экономический эффект от услуг БЕЗ ВОДЫ
              <ArrowUpRight data-arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Три плитки жидкого стекла: что от вас нужно → что произойдет → цена */}
        <div className="relative mt-12 grid max-w-4xl items-stretch gap-4 sm:grid-cols-3 md:mt-16">
          {[
            ["Без ТЗ", "Вводные в любом виде"],
            ["24 часа", "Включаемся в работу"],
            ["от 180 000 ₽/мес", "Подписка на отдел обучения"],
          ].map(([label, desc], i) => (
            <div
              key={label}
              className="lg lg-dark flex h-full flex-col rounded-2xl p-5 md:p-6"
            >
              <div
                className={`font-display tabular-nums text-[color:var(--color-text-inverse)] ${
                  i === 2 ? "t-h2 tracking-[-0.02em]" : "t-body font-semibold"
                }`}
              >
                {label}
              </div>
              <p className="t-body mt-auto pt-2 text-[color:var(--color-text-inverse-2)]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}


/* Полоса фильтров: одна на «Отрасли», вторая на «Услуги». Фильтруем на
   клиенте — пререндер отдает полный список, поэтому поиск видит все. */
/* Класс пилюли фильтра — одна функция на оба состояния (кнопка «Все» и
   варианты дублировали тройную строку классов). */
const filterPill = (active: boolean) =>
  `rounded-pill border px-4 py-2 t-caption transition-colors ${
    active
      ? "border-[color:var(--color-accent)] text-[color:var(--color-accent)]"
      : "border-[color:var(--color-line)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]"
  }`;

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  if (options.length < 2) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 t-label text-[color:var(--color-text-secondary)]">{label}</span>
      <button type="button" onClick={() => onChange(null)} aria-pressed={value === null} className={filterPill(value === null)}>
        Все
      </button>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt === value ? null : opt)}
          aria-pressed={opt === value}
          className={filterPill(opt === value)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* Пустой срез: оба фильтра могут дать 0 карточек — молчаливая пустая сетка
   выглядела как поломка. Формулировку можно заменить на слова Виктории. */
function FilterEmpty({ onReset, dark = false }: { onReset: () => void; dark?: boolean }) {
  return (
    <div className="py-10">
      <p className={`t-body ${dark ? "text-[color:var(--color-text-inverse-2)]" : "text-[color:var(--color-text-secondary)]"}`}>
        Под это сочетание фильтров пока пусто.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-3 t-body font-semibold text-[color:var(--color-accent)] underline underline-offset-4"
      >
        Показать все
      </button>
    </div>
  );
}

/* --------------------- Кирпичики клиентов (главная) ---------------------- */
/* Решение Виктории от 26.07: плитки-кейсы с именами клиентов вместо «знаков».
   Тексты кейсов придут позже; пока каждая плитка ведет на отзыв клиента.
   Вордмарки текстовые — заменим на файлы логотипов, когда будут согласованы. */

export function Bricks() {
  /* Один фильтр — по типу задачи (ред. Виктории 17.09.2026). Фильтруем на
     клиенте: пререндер отдает все плитки, поэтому поиск видит полный список. */
  const [task, setTask] = useState<string | null>(null);
  const bricks = task ? BRICKS.filter((b) => b.task === task) : BRICKS;

  const numbers: [string, string][] = [
    ["460+", "разработанных обучающих продуктов в портфолио"],
    ["30+", "корпоративных клиентов"],
  ];
  return (
    <section className="relative overflow-hidden border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
      <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
        <SectionLabel n="04" heading>Опыт и портфолио</SectionLabel>
        <div className="mt-8 flex flex-col gap-x-14 gap-y-4 sm:flex-row">
          {numbers.map(([n, d]) => (
            <div key={n} className="flex items-baseline gap-3">
              <span className="font-display t-h2 tabular-nums tracking-[-0.02em]">{n}</span>
              <span className="max-w-[240px] t-body text-[color:var(--color-text-secondary)]">{d}</span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <FilterRow label="Тип задачи" options={BRICK_TASKS} value={task} onChange={setTask} />
        </div>

        {bricks.length === 0 && <FilterEmpty dark onReset={() => setTask(null)} />}
        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-line)] sm:grid-cols-3">
          {bricks.map((b, i) => {
            const Tag: any = b.href ? motion.a : motion.div;
            return (
              <Tag
                key={b.name}
                {...(b.href ? { href: b.href } : {})}
                {...reveal(i)}
                className={`group relative flex min-h-[92px] flex-col justify-between rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-5 md:min-h-[104px] ${
                  b.href ? "card-link transition-colors duration-300 hover:bg-[color:var(--color-bg-primary)]" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-display t-body font-semibold tracking-[-0.01em] text-[color:var(--color-text-primary)]">
                    {b.name}
                  </span>
                  {b.nda && (
                    <span className="shrink-0 rounded-pill border border-[color:var(--color-line)] px-2 py-0.5 t-label text-[color:var(--color-text-secondary)]">
                      NDA
                    </span>
                  )}
                </div>
                {b.note && (
                  <p className="mt-2 t-caption text-[color:var(--color-text-secondary)]">
                    {b.note}
                  </p>
                )}
                {b.pending && (
                  <p className="mt-2 inline-flex items-center gap-2 t-caption text-[color:var(--color-text-secondary)]">
                    <CookingPot aria-hidden className="h-4 w-4 shrink-0 text-[color:var(--color-accent)]" />
                    {b.pending}
                  </p>
                )}
                <p className="mt-3 t-caption text-[color:var(--color-accent)]">{b.task}</p>
                {b.href && (
                  <span className="mt-3 inline-flex items-center gap-1.5 t-eyebrow text-[color:var(--color-steel)] transition group-hover:text-[color:var(--color-accent)]">
                    Смотреть
                    <ArrowUpRight data-arrow="diag" className="h-3.5 w-3.5" />
                  </span>
                )}
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------- Полоса цифр (главная) -------------------------- */

/* --------------------- Производственная система (новый) ------------------- */

export function WhenNeeded() {
  return (
    <section id="when" className="stage sec-dark grain relative overflow-hidden border-b border-[color:var(--color-line)]">
      <Scene
        blobs={[
          { className: "-left-32 top-[-10%]", tone: "rose", size: 420 },
          { className: "right-[-10%] bottom-[-20%]", tone: "chrome", size: 360 },
        ]}
      />
      <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
        <SectionLabel n="02" heading>Когда подключается команда БЕЗ ВОДЫ</SectionLabel>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {SITUATIONS.map((it, i) => (
            <motion.div key={it.id} {...reveal(i)}>
              <a href={it.href} className="card-link group block h-full rounded-md">
                <div className="surface-dark notch flex h-full flex-col rounded-md p-6 transition-transform duration-300 group-hover:-translate-y-1 md:p-8">
                  <div className="flex items-center justify-between">
                    <Stencil n={i + 1} active className="t-body" />
                    <LineIcon
                      name={(["handoff", "graph", "insight"] as const)[i]}
                      className="h-7 w-7 text-[color:var(--color-text-inverse-2)] transition-colors duration-300 group-hover:text-[color:var(--color-accent-text)]"
                    />
                  </div>
                  <h3 className="mt-3 font-display t-body font-semibold text-[color:var(--color-text-inverse)]">
                    {it.situation}
                  </h3>
                  {it.intro && (
                    <p className="mt-3 t-body font-semibold text-[color:var(--color-text-inverse)]">{it.intro}</p>
                  )}
                  <p className="mt-3 t-body text-[color:var(--color-text-inverse-2)]">
                    {it.detail}
                  </p>
                  <p className="mt-3 t-body text-[color:var(--color-text-inverse)]">
                    Решение: {it.solutionTitle}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 t-body font-semibold text-[color:var(--color-text-inverse)] transition group-hover:opacity-80">
                    {it.linkLabel}
                    <ArrowRight data-arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
/* --------------------- Flow (схема взаимодействия) ---------------------- */

/* --------------------------- Ритм работы (как идет) ------------------------ */

/* -------------------------------- Кейсы ----------------------------------- */
/* Карточка кейса из сборки Lovable + обязательная строка «что изменилось
   у клиента» (языком потребности) по ТЗ v3. */

/* teaser — компактный вывод для главной: клиент, метрики, «что изменилось»
   и ссылка. Список «Что сделано» не выводится — иначе карточка дословно
   повторяла страницу эффекта, и ссылка «Бизнес-эффект и цифры» приводила
   к уже прочитанному. */
export function CaseCard({ item, index, teaser = false }: { item: CaseItem; index: number; teaser?: boolean }) {
  return (
    <motion.div
      {...reveal(index)}
      id={item.slug}
      className="h-full scroll-mt-28"
    >
      <div className="card-static group flex h-full flex-col overflow-hidden rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-bg)] shadow-none">
        {/* Шапка — чистая угольная пластина. Один слой подложки: узловая
            сцена на низкой непрозрачности. Никаких цветных градиентов —
            они давали «пятнистый» черный. */}
        <div className="relative overflow-hidden bg-[color:var(--color-coal,#131417)] px-5 py-6 sm:px-6 sm:py-7 md:px-7">
          <div className="absolute inset-0" aria-hidden>
            <NodeScene
              className="!left-auto !right-[4%] !top-[8%] !h-[84%] text-[color:var(--color-text-secondary)]"
              opacity={0.22}
            />
            <div className="absolute inset-x-0 top-0 h-px bg-white/10 transition-colors duration-500 group-hover:bg-white/20" />
          </div>

          <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="case-meta min-w-0 text-[color:var(--color-text-inverse-2)]">
              {item.category}
            </div>
            {item.nda && (
              <span className="case-label shrink-0 rounded-pill border border-white/25 px-2 py-1 text-[color:var(--color-text-inverse-2)]">
                NDA
              </span>
            )}
          </div>

          <h3 className="case-title relative mt-4 text-balance text-[color:var(--color-text-inverse)] transition-colors duration-300 [overflow-wrap:anywhere] group-hover:text-[color:var(--color-accent-text)]">
            {item.title}
          </h3>

          <div className="case-body relative mt-4 max-w-[60ch] text-[color:var(--color-text-inverse-2)]">
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-w-0 items-center gap-1 text-[color:var(--color-text-inverse-2)] underline-offset-4 transition hover:text-[color:var(--color-accent-text)] hover:underline"
              >
                <span className="min-w-0 [overflow-wrap:anywhere]">{item.client}</span>
                <ArrowUpRight data-arrow className="h-3.5 w-3.5 shrink-0" />
              </a>
            ) : (
              <span className="min-w-0 [overflow-wrap:anywhere]">
                {item.client}
              </span>
            )}
            {item.role && (
              <p className="mt-1.5 [overflow-wrap:anywhere]">{item.role}</p>
            )}
          </div>


        </div>



        <div className="flex flex-1 flex-col gap-8 p-5 sm:p-6 md:p-7">

        {/* Метрики без плиток: цифры живут на общем фоне, разделены
            вертикальными хайрлайнами. Выравнивание — по левому краю,
            как весь остальной текст карточки. */}
        <div className="space-y-4">
          <div className="case-meta text-[color:var(--color-text-secondary)]">Цифры проекта</div>
          <div className={`grid gap-y-0 ${item.metrics.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {item.metrics.slice(0, 3).map(([value, label], i) => (
              <div
                key={label}
                className={`min-w-0 border-t border-[color:var(--color-line)] py-4 first:border-t-0 first:pt-0 sm:border-l sm:border-t-0 sm:px-5 sm:py-0 sm:first:border-l-0 sm:first:pl-0`}
              >
                <div className="case-title tabular-nums text-[color:var(--color-accent)] [overflow-wrap:anywhere] hyphens-none">
                  {value}
                </div>
                <div className="case-body mt-1 text-[color:var(--color-text-secondary)] [overflow-wrap:anywhere]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!teaser && item.done && item.done.length > 0 && (
          <div className="space-y-4">
            <div className="case-meta text-[color:var(--color-text-secondary)]">
              Что сделано
            </div>
            <ul className="case-body max-w-[65ch] space-y-2 text-[color:var(--color-text-primary)]">
              {item.done.map((d) => (
                <li key={d} className="flex items-start gap-2.5">
                  <NodeBullet active={false} className="mt-[0.5em] !h-[6px] !w-[6px]" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Единственный акцент карточки: тонкая линия слева, без заливки. */}
        {item.changed && (
          <div className="border-l border-[color:var(--color-accent)] pl-4">
            <div className="case-meta text-[color:var(--color-text-secondary)]">
              Что изменилось у клиента
            </div>
            <p className="case-body mt-3 max-w-[65ch] text-[color:var(--color-text-secondary)]">{item.changed}</p>
          </div>
        )}

        {/* Карточка ведет на страницу кейса: /cases/<slug> (архитектура 06.08) */}
        {item.slug && (
          <a href={`/cases/${item.slug}/`} className="link-arrow case-body group w-max font-semibold">
            Смотреть кейс
            <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        )}
        {item.effectHref && (
          <a href={item.effectHref} className="link-arrow case-body group w-max">
            Экономический эффект
            <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        )}

        {!teaser && item.source && (
          <p className="case-meta mt-auto max-w-[65ch] text-[color:var(--color-text-secondary)]">
            {item.source}
          </p>
        )}

        </div>
      </div>

    </motion.div>
  );
}

/* limit — сколько карточек показать. На главной их две: раньше главная
   повторяла всю страницу /cases слово в слово (36% ее длины, 21 экран
   телефона) и делала /cases бессмысленной. */
export function CasesBlock({
  compactHeader = false,
  limit,
  moreHref,
  teaser = false,
  proofHeader = false,
}: {
  compactHeader?: boolean;
  limit?: number;
  moreHref?: string;
  teaser?: boolean;
  proofHeader?: boolean;
}) {
  const all = visibleCases();
  /* Фильтр по отрасли — только на странице кейсов (там compactHeader).
     На главной показываем два кейса без фильтра. */
  const [industry, setIndustry] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);
  const filtered = all.filter(
    (c) =>
      (!industry || c.industries?.includes(industry)) &&
      (!service || c.services?.includes(service)),
  );
  const items = limit ? filtered.slice(0, limit) : filtered;
  return (
    <section id="cases" className={`stage bg-[color:var(--color-bg-primary)] ${proofHeader ? "" : "border-b border-[color:var(--color-line)]"}`}>
      <Scene blobs={[{ className: "-right-40 top-10", tone: "chrome", size: 600 }, { className: "-left-40 bottom-10", tone: "chrome", size: 520 }]} />

      <div className={`relative mx-auto max-w-7xl px-5 md:px-8 ${proofHeader ? "sec-pad-t" : "sec-pad"}`}>
        {!compactHeader && (
          <>
            <SectionLabel n="03">{proofHeader ? "Доказательства" : "Результаты клиентов"}</SectionLabel>
            <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <RevealHeading className="t-h2 max-w-3xl">
                {proofHeader ? "Результаты клиентов и их слова" : "Кейсы с конкретными метриками"}
              </RevealHeading>
              <p className="t-body max-w-md text-[color:var(--color-text-secondary)]">
                Реальные проекты: от запусков продуктов до корпоративных программ и MVP ДПО.
              </p>
            </div>
          </>
        )}
        {compactHeader && (
          <div className="mb-8 flex flex-col gap-3">
            <FilterRow label="Отрасль" options={CASE_INDUSTRIES} value={industry} onChange={setIndustry} />
            <FilterRow label="Услуга" options={CASE_SERVICES} value={service} onChange={setService} />
          </div>
        )}
        {compactHeader && items.length === 0 && (
          <FilterEmpty onReset={() => { setIndustry(null); setService(null); }} />
        )}
        <div className={`grid items-stretch gap-6 md:grid-cols-2 ${compactHeader ? "" : "mt-14"}`}>

          {items.map((item, i) => (
            <CaseCard key={item.title} item={item} index={i} teaser={teaser} />
          ))}
        </div>
        {moreHref && !proofHeader && all.length > items.length && (
          <a href={moreHref} className="link-arrow group mt-8 t-body">
            Все кейсы
            <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        )}
      </div>
    </section>
  );
}

/* -------------------------------- Команда --------------------------------- */
/* Приемка 05.08: на главной команда короткая — лица, одна строка о составе
   и ссылка на /team. Развернутый экран живет на отдельной странице. */

export function TeamBlock() {
  const people = TEAM.filter((p) => p.homeRole);
  return (
    <section id="team" className="stage border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
      <Scene blobs={[{ className: "-right-40 top-10", tone: "rose", size: 520 }]} />

      <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
        <SectionLabel n="05" heading>Ядро команды и отраслевые эксперты</SectionLabel>

        <div className="mt-10 grid items-stretch gap-5 sm:grid-cols-3">
          {people.map((p, i) => (
            <motion.div key={p.slug} {...reveal(i)} className="h-full">
              <PaperCard className="flex h-full flex-col overflow-hidden p-0">
                <PersonPhoto person={p} />
                <div className="p-5">
                  <div className="font-display t-body font-semibold">{p.name}</div>
                  <p className="mt-1 t-body text-[color:var(--color-text-secondary)]">{p.homeRole}</p>
                </div>
              </PaperCard>
            </motion.div>
          ))}
        </div>

        <BookSection />
      </div>
    </section>
  );
}

/* Портрет в карточке. Фото есть не у всех (Дарья Жданова, 17.09.2026) —
   без фото карточка держит те же пропорции пустой плашкой. */
export function PersonPhoto({ person }: { person: { name: string; photo?: string } }) {
  return (
    <div className="aspect-[4/5] w-full overflow-hidden bg-[color:var(--color-bg-secondary)]">
      {person.photo && (
        <img
          src={person.photo}
          alt={person.name}
          loading="lazy"
          width={1200}
          height={900}
          className="h-full w-full object-cover object-top grayscale transition duration-500 hover:grayscale-0"
        />
      )}
    </div>
  );
}

/* -------------------------------- Отзывы ---------------------------------- */
/* Компактные карточки 3 в ряд (верстка согласована 26.07), без карусели. */

/* Ссылка-открывалка: показывает отзыв модальным окном. */
export function ReviewOpener({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <a
      href={`/reviews/#${slug}`}
      onClick={reviewLinkHandler(`/reviews/#${slug}`)}
      className="link-arrow group t-body"
    >
      {children}
      <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  );
}

/* Само окно: крупная копия отзыва — фото, имя, роль и полный текст.
   Монтируется один раз в PageShell, поэтому доступно на любой странице. */
export function ReviewModal() {
  const slug = useOpenReview();
  const review = slug ? REVIEWS.find((r) => r.slug === slug) : undefined;

  const boxRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  /* Как у бургера в core.tsx: фокус на «Закрыть», Tab не выходит из окна,
     Esc закрывает, фокус возвращается туда, откуда открыли; страница под
     окном не прокручивается (ревизия 17.09.2026). */
  useEffect(() => {
    if (!slug) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeReview();
        return;
      }
      if (e.key !== "Tab" || !boxRef.current) return;
      const items = Array.from(
        boxRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const edge = e.shiftKey ? items[0] : items[items.length - 1];
      if (document.activeElement === edge) {
        e.preventDefault();
        (e.shiftKey ? items[items.length - 1] : items[0]).focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      opener?.focus?.();
    };
  }, [slug]);

  return (
    <AnimatePresence>
      {/* Подложка без анимации прозрачности: если анимация почему-то не
          отработает, окно все равно остается читаемым, а не полупрозрачным. */}
      {review && (
        <motion.div
          key="review-modal"
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[color:var(--color-bg-dark)]/85 p-4 backdrop-blur-sm md:p-10"
          onClick={closeReview}
          role="dialog"
          aria-modal="true"
          aria-label={`Отзыв: ${review.name}`}
        >
          <motion.div
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.24, ease: REVEAL_EASE }}
            onClick={(e) => e.stopPropagation()}
            ref={boxRef}
            className="relative my-auto w-full max-w-2xl rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-6 shadow-[var(--shadow-float)] md:p-10"
          >
            <button
              type="button"
              ref={closeRef}
              onClick={closeReview}
              aria-label="Закрыть"
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-pill border border-[color:var(--color-line)] text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)]"
            >
              <Plus aria-hidden className="h-5 w-5 rotate-45" />
            </button>

            <div className="size-28 overflow-hidden rounded-pill border border-[color:var(--color-line)] bg-[color:var(--color-bg-secondary)] md:size-32">
              <img
                src={review.photo}
                alt={review.name}
                width={240}
                height={240}
                className="size-full object-cover grayscale"
              />
            </div>
            <div className="mt-5">
              <div className="font-display t-h2">{review.name}</div>
              <p className="mt-2 t-body text-[color:var(--color-text-secondary)]">{review.role}</p>
            </div>
            <span className="mt-6 block font-display t-h2 text-[color:var(--color-accent)]">«</span>
            <blockquote className="mt-2 flex flex-col gap-3 t-body text-[color:var(--color-text-primary)]">
              {review.text.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </blockquote>
            <a href="/reviews/" className="link-arrow group mt-8 t-body">
              Все отзывы
              <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ReviewCard({ r, index = 0 }: { r: Review; index?: number }) {
  return (
    <motion.div
      id={r.slug}
      {...reveal(index)}
      className="h-full scroll-mt-28"
    >
      {/* Фото сверху и крупно (решение Виктории 06.08): раньше лицо было
          пятачком 44 px в подвале карточки — человека не разглядеть.
          Теперь портрет открывает карточку, под ним имя и должность,
          дальше сама цитата. */}
      <PaperCard className="flex h-full flex-col p-6">
        <div className="mx-auto size-28 shrink-0 overflow-hidden rounded-pill border border-[color:var(--color-line)] bg-[color:var(--color-bg-secondary)] md:size-32">
          <img
            src={r.photo}
            alt={r.name}
            loading="lazy"
            width={240}
            height={240}
            className="size-full object-cover grayscale"
          />
        </div>
        <div className="mt-4 text-center">
          <div className="font-display t-body font-semibold">{r.name}</div>
          <p className="mt-1 t-caption text-[color:var(--color-text-secondary)]">{r.role}</p>
        </div>
        <span className="mt-5 font-display t-h2 text-[color:var(--color-accent)]">«</span>
        <blockquote className="mt-2 flex flex-col gap-2.5 t-body text-[color:var(--color-text-primary)]">
          {r.text.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </blockquote>
      </PaperCard>
    </motion.div>
  );
}

/* Секция светлая (решение 03.08): на телефоне три темных экрана цитат подряд
   сливались со следующей темной секцией. На главной два отзыва — «Все отзывы»
   теперь ведет к тому, чего на главной нет. */
export function ReviewsBlock({ bare = false }: { bare?: boolean } = {}) {
  const items = homeReviews();
  return (
    <section id="reviews" className="stage border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
      <Scene blobs={[{ className: "-left-40 top-10", tone: "rose", size: 560 }, { className: "-right-40 bottom-10", tone: "chrome", size: 480 }]} />
      <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
        {bare && <SectionLabel n="03" heading>Отзывы клиентов</SectionLabel>}
        {!bare && (
          <>
            <SectionLabel n="04">Отзывы</SectionLabel>
            <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <RevealHeading className="t-h2 max-w-3xl">
                Что говорят клиенты
              </RevealHeading>
              <p className="t-body max-w-md text-[color:var(--color-text-secondary)]">
                О работе методологов БЕЗ ВОДЫ — дословно.
              </p>
            </div>
          </>
        )}
        <div className={`grid items-stretch gap-6 md:grid-cols-2 ${bare ? "mt-8" : "mt-12"}`}>
          {items.map((r, i) => (
            <ReviewCard key={r.slug} r={r} index={i} />
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          {bare && (
            <a href="/cases/" className="link-arrow group t-body">
              Все кейсы
              <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          )}
          <a
            href="/reviews/"
            className="link-arrow group t-body"
          >
            Все отзывы
            <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>

    </section>
  );
}

/* ------------------------------- Два входа --------------------------------- */
/* По ТЗ: разбор за 30 минут + бесплатная помощь со сборкой выступления
   (страницы конференций пока нет — вторым абзацем формы). Реализовано
   вводкой над формой в Contact. */


/* ------------------------------- Book ---------------------------------- */

export function BookSection() {
  return (
    <div id="book" className="mt-12">
      <div className="t-eyebrow text-[color:var(--color-text-secondary)]">Подход описан и издан без воды</div>
      <div className="mt-6">
        <PaperCard className="overflow-hidden p-0">
          <div className="grid items-center gap-0 sm:grid-cols-[168px_1fr]">
            <div className="flex items-center justify-center bg-[color:var(--color-chrome)]/10 p-6">
              <div
                className="relative aspect-[3/4] w-full max-w-[120px] overflow-hidden rounded-r-md rounded-l-sm"
                style={{ boxShadow: "10px 14px 30px -14px rgba(0,0,0,0.35)" }}
              >
                <img
                  src={bookCover.url}
                  alt="Обложка книги «Эксперт под ключ»"
                  loading="lazy"
                  decoding="async"
                  width={415}
                  height={593}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
              <p className="measure t-body text-[color:var(--color-text-primary)]">
                Книга <span className="font-semibold">«Эксперт под ключ»</span> (Литрес, 2025) — прикладное руководство по извлечению практических знаний и их переработке в программы с измеримым бизнес-результатом.
              </p>
              <a
                href="https://www.litres.ru/book/viktoriya-utkina/ekspert-pod-kluch-kak-izvlech-i-upakovat-znaniya-dlya-biz-72669850/"
                target="_blank"
                rel="noreferrer"
                className="link-arrow group w-max t-body"
              >
                Читать на Литрес
                <ExternalLink data-arrow className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </PaperCard>
      </div>
    </div>
  );
}

/* ------------- NotFit («Когда нужен другой подрядчик») + FAQ ------------- */

export function NotFit({ n = "06" }: { n?: string } = {}) {
  /* Четыре задачи — текст Виктории 17.09.2026. Заявление про агентство
     ушло из отдельного абзаца в четвертый пункт списка. */
  const items = [
    "подбор сотрудника в штат или аутстаффинг",
    "внедрение организационных изменений за пределами образовательного проекта",
    "организация и логистика мероприятия",
    "посредническая (агентская) деятельность по поиску подрядчиков",
  ];

  return (
    <section id="notfit" className="stage sec-dark grain relative overflow-hidden border-b border-[color:var(--color-line-dark)]">
      <Scene blobs={[
        { className: "-left-40 top-0", tone: "chrome", size: 420 },
        { className: "-right-40 bottom-0", tone: "rose", size: 420 },
      ]} />
      <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
        <SectionLabel n={n}>Границы</SectionLabel>
        <RevealHeading className="mt-6 t-h2 max-w-3xl">
          Когда нужен другой подрядчик
        </RevealHeading>
        <ul className="mt-8 max-w-3xl divide-y divide-border border-y border-[color:var(--color-line)]">
          {items.map((t) => (
            <li key={t} className="flex items-start gap-4 py-4 t-body text-[color:var(--color-text-primary)]">
              <NodeBullet className="mt-[0.55em]" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}


/* ------------------------------ FAQ-аккордеон ------------------------------ */

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();
  /* Вопрос — кнопка, ответ — соседний region (ревизия 17.09.2026):
     раньше ответ лежал внутри <button> — невалидно, скринридер читал
     весь ответ как имя кнопки, а краулер не видел закрытые ответы.
     Ответы всегда в DOM; закрытый схлопнут по высоте и вырезан из
     дерева доступности через inert. */
  return (
    <div className="mt-8 max-w-3xl divide-y divide-border border-y border-[color:var(--color-line)]">
      {items.map((item, i) => {
        const isOpen = open === i;
        const qId = `${uid}-q${i}`;
        const aId = `${uid}-a${i}`;
        return (
          <div
            key={item.q}
            className={`group transition hover:bg-[color:var(--color-surface)] ${isOpen ? "bg-[color:var(--color-surface)]" : ""}`}
          >
            <button
              id={qId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={aId}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start gap-5 py-5 text-left focus-visible:outline-offset-[-2px]"
            >
              <Stencil n={i + 1} active={isOpen} className="mt-1 t-small" />
              <span className={`flex-1 font-display t-body font-semibold text-foreground transition ${isOpen ? "" : "group-hover:text-[color:var(--color-accent-text)]"}`}>
                {item.q}
              </span>
              <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }} className="mt-1 inline-flex">
                <Plus aria-hidden className="h-4 w-4 text-[color:var(--color-text-secondary)]" />
              </motion.span>
            </button>
            <motion.div
              id={aId}
              role="region"
              aria-labelledby={qId}
              inert={!isOpen}
              initial={false}
              animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              className="overflow-hidden"
            >
              {/* Невидимый номер и место под плюс повторяют ряд вопроса:
                  ответ выравнивается по тексту вопроса без подбора отступов. */}
              <div className="-mt-3 flex items-start gap-5 pb-5">
                <Stencil n={i + 1} className="invisible t-small" />
                <div className="flex-1">
                  {item.a.map((para) => (
                    <p key={para} className="mt-2 t-body text-[color:var(--color-text-secondary)]">{para}</p>
                  ))}
                  {item.list && (
                    <ul className="mt-2 space-y-2">
                      {item.list.map((t) => (
                        <li key={t} className="flex items-start gap-3 t-body text-[color:var(--color-text-secondary)]">
                          <NodeBullet className="mt-[0.55em]" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <span aria-hidden className="h-4 w-4 shrink-0" />
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------- Contact ------------------------------- */

/* numbered=false — для /contacts: там секция одна, и порядковый «08»,
   пришедший с главной, выглядел чужим. */
export function Contact({ asH1 = false }: { asH1?: boolean } = {}) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [fieldErr, setFieldErr] = useState<{ name?: string | null; contact?: string | null }>({});
  const [pdErr, setPdErr] = useState<string | null>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const pdRef = useRef<HTMLInputElement>(null);
  const [pd, setPd] = useState(false);

  /* Формат контакта НЕ проверяем. Прежняя проверка отбраковывала живых людей:
     «t.me/irina», «Telegram: @irina», «напишите в телеграм @irina_hr» — то есть
     ровно тот формат, которым сайт печатает собственный контакт. Цена ложного
     отказа (человек уходит) выше цены опечатки: рядом все равно есть имя,
     компания и запрос, по которым можно вернуться. Ловим только пустое поле. */
  const validate = (field: "name" | "contact", value: string) => {
    const v = value.trim();
    if (field === "name") return v ? null : "Укажите, как к вам обращаться.";
    if (!v) return "Оставьте email, телефон или Telegram — иначе нам некуда ответить.";
    if (v.length < 3 || !/[\wа-яе]/i.test(v)) {
      return "Слишком коротко — оставьте email, телефон или Telegram.";
    }
    return null;
  };
  const checkField = (field: "name" | "contact") => (e: React.SyntheticEvent<HTMLInputElement>) => {
    const msg = validate(field, e.currentTarget.value);
    setFieldErr((p) => ({ ...p, [field]: msg }));
  };
  const clearOnInput = (field: "name" | "contact") => (e: React.SyntheticEvent<HTMLInputElement>) => {
    /* значение читаем синхронно: внутри ленивого апдейтера currentTarget уже null */
    const value = e.currentTarget.value;
    setFieldErr((p) => (p[field] && !validate(field, value) ? { ...p, [field]: null } : p));
  };


  const formStarted = useRef(false);
  const onFormFocus = () => {
    if (formStarted.current) return;
    formStarted.current = true;
    ymGoal("form_started");
  };

  useEffect(() => {
    try {
      if (/utm_|yclid|gclid/.test(window.location.search)) {
        window.sessionStorage.setItem("bv-src", window.location.search);
      }
    } catch {}
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    const f = e.currentTarget;
    const data = new FormData(f);
    const contact = String(data.get("contact") || "").trim();
    /* Два поля — имя и контакт (ред. Виктории 17.09.2026); поля о задаче
       в форме больше нет. */
    const name = String(data.get("name") || "").trim();
    const about = "";
    const hp = String(data.get("website") || "");
    const nameMsg = validate("name", name);
    const contactMsg = validate("contact", contact);
    const pdMsg = pd ? null : "Отметьте согласие на обработку персональных данных.";
    setFieldErr({ name: nameMsg, contact: contactMsg });
    setPdErr(pdMsg);
    if (nameMsg || contactMsg || pdMsg) {
      const target = nameMsg ? nameRef.current : contactMsg ? contactRef.current : pdRef.current;
      /* На мобильном поле может уйти под липкую шапку — сначала центрируем. */
      target?.scrollIntoView({ block: "center", behavior: "smooth" });
      target?.focus({ preventScroll: true });
      return;
    }


    setSending(true);
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          comment: about,
          consent_pd: true,
          consent_pd_version: CONSENT_PD_VERSION,
          consent_ads: false,
          website: hp,
          page: (() => {
            let srcQ = window.location.search;
            try {
              if (!/utm_|yclid|gclid/.test(srcQ)) {
                srcQ = window.sessionStorage.getItem("bv-src") || srcQ;
              }
            } catch {}
            return (window.location.pathname || "/") + srcQ;
          })(),
        }),
      });
      if (!r.ok) throw new Error(String(r.status));
      setSent(true);
      ymGoal("lead_sent");
    } catch {
      setErr(LEAD_ERROR);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="stage border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
      <Scene blobs={[{ className: "-left-40 top-0", tone: "rose", size: 560 }, { className: "right-1/4 top-1/3", tone: "rose", size: 360 }]} />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 sec-pad md:px-8 lg:grid-cols-[1fr_1fr]">
        <div>
          {/* Ревизия 17.09.2026: надзаголовок — общий SectionLabel (номер
              считается сам), без повтора слов заголовка; логотип из колонки
              убран (он уже в шапке); один правый край у всех строк. */}
          <SectionLabel n="07">Первый шаг</SectionLabel>
          <RevealHeading as={asH1 ? "h1" : "h2"} className={`${asH1 ? "t-h1" : "t-h2"} mt-6 max-w-md`}>
            Форма заявки
          </RevealHeading>
          {/* Тексты Виктории 17.09.2026, слово в слово. */}
          <p className="mt-6 max-w-md t-body text-[color:var(--color-text-secondary)]">
            Обсудим задачу и найдем оптимальное решение. Презентация и подробное ТЗ не требуются. На 30-минутной онлайн-встрече:
          </p>
          <ol className="mt-4 max-w-md space-y-2">
            {[
              "Сверим понимание бизнес-цели и образ результата",
              "Определим доступные источники опыта и формат его передачи",
              "Рассчитаем сроки, состав команды и план первого этапа",
            ].map((t, i) => (
              <li key={t} className="flex items-baseline gap-5 t-body text-[color:var(--color-text-primary)]">
                <span className="font-display t-label tabular-nums text-[color:var(--color-accent)]">{String(i + 1).padStart(2, "0")}</span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Форма — единственный темный акцент светлой секции: локальный
            sec-dark сохраняет темные токены внутри карточки. */}
        <PaperCard className="sec-dark p-8">
        <form
          noValidate
          id="form"
          onSubmit={onSubmit}
          onFocusCapture={onFormFocus}
          onPointerDownCapture={onFormFocus}
          className="text-[color:var(--color-text-inverse)]"
        >

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: REVEAL_EASE }}
                className="flex min-h-[420px] flex-col items-start justify-center"
                role="status"
                aria-live="polite"
              >
                <CatMark className="h-24 w-28 text-[color:var(--color-text-inverse)]" strokeWidth={2} />
                <h3 className="t-body mt-6 text-[color:var(--color-text-inverse)]">
                  Спасибо!
                </h3>
                <p className="mt-3 text-[color:var(--color-text-inverse-2)]">
                  Что дальше:
                </p>

                <ol className="mt-4 space-y-2 t-body text-[color:var(--color-text-inverse-2)]">
                  <li className="flex gap-3"><span className="node-dot node-dot-active mt-2" />Ответим в течение 5 минут и предложим время.</li>
                  <li className="flex gap-3"><span className="node-dot node-dot-active mt-2" />30 минут онлайн: сверим задачу и определим следующий шаг.</li>
                  <li className="flex gap-3"><span className="node-dot node-dot-active mt-2" />Готовиться не нужно — презентация и ТЗ не требуются.</li>
                </ol>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-8 t-body font-semibold text-[color:var(--color-text-inverse)] underline-offset-4 hover:text-[color:var(--color-accent-glass)] hover:underline"
                >
                  Отправить еще одну заявку
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.32, ease: REVEAL_EASE }}
                className="flex flex-col gap-5"
              >
                <Field
                  label="Ваше имя"
                  name="name"
                  placeholder=""
                  autoComplete="name"
                  dark
                  required
                  inputRef={nameRef}
                  error={fieldErr.name}
                  onBlur={checkField("name")}
                  onInput={clearOnInput("name")}
                />
                <Field
                  label="Контакт для связи"
                  name="contact"
                  placeholder="Email, телефон или Telegram"
                  autoComplete="on"
                  dark
                  required
                  inputRef={contactRef}
                  error={fieldErr.contact}
                  onBlur={checkField("contact")}
                  onInput={clearOnInput("contact")}
                />
                <p className="hidden" aria-hidden="true">
                  <label>
                    Не заполняйте это поле
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>
                <label className="flex cursor-pointer items-start gap-3 t-caption text-[color:var(--color-text-inverse-2)]">
                  <input
                    type="checkbox"
                    ref={pdRef}
                    checked={pd}
                    aria-invalid={pdErr ? true : undefined}
                    aria-describedby={pdErr ? "f-pd-error" : undefined}
                    onChange={(e) => { setPd(e.target.checked); if (e.target.checked) setPdErr(null); }}
                    className={`mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-accent)] ${pdErr ? "rounded-[2px] outline outline-2 outline-offset-2 outline-[color:var(--color-accent)]" : ""}`}
                  />
                  <span>
                    Согласен(а) на обработку персональных данных —{" "}
                    <a href="/consent_pd/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[color:var(--color-accent-glass)]">условия</a>{" "}
                    и{" "}
                    <a href="/politics_pd/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[color:var(--color-accent-glass)]">политика</a>
                  </span>
                </label>
                {pdErr && (
                  <p id="f-pd-error" role="alert" className="mt-2 t-caption text-[color:var(--color-accent-glass)]">{pdErr}</p>
                )}

                {err && (
                  <p role="alert" className="rounded-sm border border-[color:var(--color-accent)]/40 bg-[color:var(--color-accent)]/15 px-4 py-3 t-body text-[color:var(--color-text-inverse)]">
                    {err}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="btn btn-invert group mt-4 w-full"
                >
                  {/* «Отправить заявку…»: прежний «Назначить разбор» обещал
                      выбор времени, которого в форме нет */}
                  <span>{sending ? "Отправляем…" : "Отправить заявку на разбор"}</span>
                  <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </button>
                <div className="space-y-2">
                  <p className="t-caption text-[color:var(--color-text-inverse-2)]">
                    Ответим в течение 5 минут в рабочее время.
                  </p>
                  <a
                    href={CONTACT.tgUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 t-caption text-[color:var(--color-text-inverse-2)] underline underline-offset-2 hover:text-[color:var(--color-text-inverse)]"
                  >
                    <Send aria-hidden className="h-4 w-4" />
                    {CONTACT.tg}
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
        </PaperCard>

      </div>
    </section>
  );
}

/* Регистрируем окно в ядре: PageShell рисует его через слот. */
registerReviewModal(() => <ReviewModal />);
