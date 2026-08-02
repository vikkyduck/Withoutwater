/* ============================================================================
   blocks.tsx — секции страниц. Дизайн-код перенесён 1:1 из сборки Lovable
   Виктории; новые блоки (кирпичики клиентов, производство, полоса цифр,
   два входа) — по ТЗ v3 от 26.07.
   ========================================================================== */
import {
  motion, AnimatePresence,
  ArrowUpRight, ArrowRight, Plus, Check, ExternalLink,
  useRef, useState, useEffect,
  ymGoal,
  SectionLabel, GlassCard, PaperCard, Scene, NodeScene, ScrollRing,
  RevealHeading, Field, StencilLogo,
  NodeBullet, NodeList, Stencil, CatMark, Swash, HandArrow, LineIcon,
  CTA_LABEL, CTA_NOTE,
  reveal,
  REVEAL_EASE,
} from "./core";
import {
  BRICKS, visibleCases, homeReviews, SITUATIONS,
  type CaseItem, type Review,
} from "./data";

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
              "repeating-linear-gradient(to right, rgba(241,239,234,0.055) 0 1px, transparent 1px 8.3333%)," +
              "repeating-linear-gradient(to bottom, rgba(241,239,234,0.035) 0 1px, transparent 1px 88px)",
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
              "radial-gradient(80% 70% at 12% 96%, rgba(163,86,75,0.10), transparent 62%)",
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

      {/* Единственный объект первого экрана — кольцо-индикатор прогресса */}
      <ScrollRing className="right-[5%] top-[12%] z-20 w-[min(14vw,220px)]" />



      <div className="hero-pad relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        {/* Один срез на макет — на акцентном слове заголовка */}
        <div className="mb-6 [--color-text-secondary:var(--color-text-inverse-2)]">
          <SectionLabel n="00">Ваша внешняя команда по обучению</SectionLabel>
        </div>
        <RevealHeading as="h1" className="t-h1 max-w-[900px] text-[color:var(--color-text-inverse)]">
          Дополнительные мощности для вашей T&D-команды
        </RevealHeading>

        <p className="t-body measure mt-6 text-[color:var(--color-text-inverse)]/85 md:mt-7">
          Берём на себя реализацию T&D-проектов: поиск внешних экспертов,
          оцифровку ваших лучших практик и управление созданием готовых
          продуктов обучения.
        </p>

        {/* Одно главное действие — сразу под смыслом, до всех аргументов */}
        <div className="mt-9 flex flex-col items-start gap-3 md:mt-10">
          <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-6">
            <a href="#contact" className="btn btn-invert group w-full sm:w-auto">
              <span>{CTA_LABEL}</span>
              <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
            <a
              href="/business-effect"
              className="link-arrow group t-body"
            >
              Бизнес-эффект от сотрудничества
              <ArrowUpRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Два аргумента — легче H1: ниже по макету, приглушённое стекло */}
        <div className="relative mt-12 grid max-w-2xl gap-3 sm:grid-cols-2 md:mt-16">
          {[
            ["Без ТЗ", "Принимаем вводные в любом виде и собираем из них архитектуру решения и план работ"],
            ["24 часа", "После согласования назначаем команду и проводим стартовую встречу"],
          ].map(([label, desc]) => (
            <GlassCard key={label} dark interactive className="px-4 py-4 md:px-5 md:py-5">
              <div className="font-display t-body font-medium text-[color:var(--color-text-inverse)]">
                {label}
              </div>
              <p className="t-body mt-1.5 text-[color:var(--color-text-inverse-2)]">
                {desc}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* Явный указатель прокрутки: экран заканчивается, страница — нет */}
        <a
          href="#when"
          className="mt-12 inline-flex items-center gap-3 t-eyebrow text-[color:var(--color-text-inverse-2)] transition-colors hover:text-[color:var(--color-text-inverse)] md:mt-16"
        >
          <span
            aria-hidden
            className="inline-flex h-8 w-5 items-start justify-center rounded-pill border border-[color:var(--color-line-dark)] pt-1.5"
          >
            <span className="scroll-cue block h-1.5 w-px bg-current" />
          </span>
          Дальше — когда мы нужны
        </a>
      </div>

    </section>
  );
}


/* --------------------- Кирпичики клиентов (главная) ---------------------- */
/* Решение Виктории от 26.07: плитки-кейсы с именами клиентов вместо «знаков».
   Тексты кейсов придут позже; пока каждая плитка ведёт на отзыв клиента.
   Вордмарки текстовые — заменим на файлы логотипов, когда будут согласованы. */

export function Bricks() {
  return (
    <section className="relative overflow-hidden border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
      <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
        <SectionLabel n="05">Работали с командами</SectionLabel>
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-line)] sm:grid-cols-3">
          {BRICKS.map((b, i) => (
            <motion.a
              key={b.name}
              href={b.href}
              {...reveal(i)}
              className="card-link group relative flex min-h-[92px] flex-col justify-between rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-5 transition-colors duration-300 hover:bg-[color:var(--color-bg-primary)] md:min-h-[104px]"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-display t-body font-medium tracking-[-0.01em] text-[color:var(--color-text-primary)]">
                  {b.name}
                </span>
                {b.year && (
                  <span className="t-caption shrink-0 tabular-nums text-[color:var(--color-steel)]">
                    {b.year}
                  </span>
                )}
              </div>
              <span className="mt-3 inline-flex items-center gap-1.5 t-caption font-medium text-[color:var(--color-steel)] transition group-hover:text-[color:var(--color-accent)]">
                Отзыв клиента
                <ArrowUpRight data-arrow="diag" className="h-3.5 w-3.5" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>

    </section>
  );
}




/* ------------------------- Полоса цифр (главная) -------------------------- */
/* 260+ убрана решением Виктории от 26.07 («нам хватит кейсов поднять вес»).
   Сноска-источник — черновик, точный период подставит Виктория. */

export function NumbersBand() {
  const items: [string, string][] = [
    ["460+", "разработанных продуктов в портфеле команды"],
    ["30+", "компаний-клиентов"],
  ];
  return (
    <section className="relative overflow-hidden border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
      <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
        <SectionLabel n="04">Наш опыт в цифрах</SectionLabel>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-6">
          {items.map(([n, d]) => (
            <div key={n} className="relative pt-6">
              <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-[color:var(--color-line)]" />
              <span aria-hidden className="tex-chrome absolute left-0 top-0 h-[2px] w-12 rounded-pill" />
              <div className="font-display t-number font-medium tabular-nums tracking-[-0.02em]">{n}</div>
              <p className="mt-4 max-w-xs t-body text-[color:var(--color-text-secondary)]">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-xl t-caption text-[color:var(--color-text-secondary)]">
          По данным внутреннего учёта проектов команды.
        </p>
      </div>
    </section>
  );
}

/* --------------------- Производственная система (новый) ------------------- */
/* По ТЗ v3: блок, который отличает команду от группы фрилансеров. */

export function Production() {
  const items: [string, string][] = [
    ["24 рабочих часа", "на типовой курс — от брифа до готовой структуры с материалами*"],
    ["10–12 проектов", "ведём в параллель без потери сроков: конвейер, а не аврал"],
    ["Критерии приёмки", "согласуются до старта — вы заранее знаете, что считается результатом"],
    ["Этапы с результатом", "работа разбита на этапы, каждый завершается самостоятельным результатом"],
  ];
  return (
    <section id="production" className="stage sec-dark grain border-b border-[color:var(--color-line-dark)]">
      <Scene blobs={[{ className: "-right-40 top-10", tone: "rose", size: 520 }]} />
      <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
        <div className="t-eyebrow flex items-center gap-3 text-[color:var(--color-text-inverse-2)]"><span className="font-display tracking-normal text-[color:var(--color-accent-glass)]">02</span><span className="h-px w-10 bg-[color:var(--color-line-dark)]" /><span>Производство</span></div>
        <RevealHeading className="t-h2 mt-6 max-w-4xl">
          Как устроено наше производство
        </RevealHeading>
        <p className="mt-5 max-w-2xl t-body text-[color:var(--color-text-inverse-2)]">
          Отличие проектной команды от группы фрилансеров — производственная
          система: сроки, параллельность и приёмка, о которых договорились заранее.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              {...reveal(i)}
              className="surface-dark notch rounded-md p-6"
            >
              <div className="flex items-center gap-3">
                <Stencil n={i + 1} active className="t-body" />
                <span className="h-px w-6 bg-[color:var(--color-line-dark)]" />
                <LineIcon
                  name={(["term", "process", "quality", "standard"] as const)[i]}
                  className="h-5 w-5 text-[color:var(--color-accent-glass)]"
                />
              </div>
              <div className="mt-4 font-display t-body font-medium tracking-tight">{t}</div>
              <p className="mt-2.5 t-body text-[color:var(--color-text-inverse-2)]">{d}</p>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 max-w-2xl t-caption text-[color:var(--color-text-inverse-2)]">
          * Типовой курс — программа стандартной структуры на подготовленной
          фактуре заказчика, без исследовательского этапа и продуктовой разработки
          с нуля.
        </p>
      </div>
    </section>
  );
}

/* Блок 3: три ситуации, в которых подход даёт максимальный эффект.
   Данные берутся из SITUATIONS (data.tsx), чтобы текст совпадал
   со страницей «Задачи и решения». Под каждой ситуацией — ссылка
   на развёрнутое описание решения. */

export function WhenNeeded() {
  return (
    <section id="when" className="stage sec-dark grain relative overflow-hidden border-b border-[color:var(--color-line)]">
      {/* Под карточки — мягкие пятна материала, чтобы стекло было чему преломлять */}
      <Scene
        blobs={[
          { className: "-left-32 top-[-10%]", tone: "rose", size: 420 },
          { className: "right-[-10%] bottom-[-20%]", tone: "chrome", size: 360 },
        ]}
      />
      <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
        <SectionLabel n="01">Когда мы нужны</SectionLabel>
        <RevealHeading className="t-h2 mt-6 max-w-3xl text-[color:var(--color-text-inverse)]">
          Когда нужна команда «Без Воды»
        </RevealHeading>
        <p className="mt-5 max-w-2xl t-body text-[color:var(--color-text-inverse-2)]">
          3 ситуации, в которых наш подход даёт максимальный эффект
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {SITUATIONS.map((it, i) => (
            <motion.div
              key={it.id}
              {...reveal(i)}
            >
              <a href={it.href} className="card-link group block h-full rounded-md">
                <div className="surface-dark notch flex h-full flex-col rounded-md p-6 transition-transform duration-300 group-hover:-translate-y-1 md:p-8">
                  <div className="flex items-center justify-between">
                    <Stencil n={i + 1} active className="t-body" />
                    <LineIcon
                      name={(["handoff", "graph", "insight"] as const)[i]}
                      className="h-7 w-7 text-[color:var(--color-text-inverse-2)] transition-colors duration-300 group-hover:text-[color:var(--color-accent-soft,var(--color-accent))]"
                    />
                  </div>
                  <h3 className="mt-3 font-display t-body font-medium text-[color:var(--color-text-inverse)]">
                    {it.situation}
                  </h3>
                  <p className="mt-3 t-body text-[color:var(--color-text-inverse-2)]">
                    {it.detail}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 t-body font-semibold text-[color:var(--color-text-inverse)] transition group-hover:opacity-80">
                    Как решаем: {it.solutionTitle}
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
/* Брендбук: плотная сетка на волосяных линиях, трафаретная нумерация,
   срез угла (notch), без «надутых» макетов и крупных плашек. */

export function Flow() {
  const stages = [
    { n: "01", t: "2 рабочих часа", d: "отвечаем на заявку" },
    { n: "02", t: "30 минут", d: "проводим первичный разбор" },
  ];
  const branches = [
    { tag: "Масштабировать внутренний опыт", time: "24 часа", desc: "назначаем команду и проводим стартовую встречу" },
    { tag: "Привлечь экспертность с рынка", time: "72 часа", desc: "представляем первые релевантные профили" },
  ];
  return (
    <section className="stage sec-dark grain border-b border-[color:var(--color-line-dark)]">
      <Scene blobs={[{ className: "-right-56 bottom-0", tone: "rose", size: 280 }]} />
      <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
        <SectionLabel n="02">Схема взаимодействия</SectionLabel>
        <h2 className="t-h2 mt-6 max-w-3xl">
          Как мы двигаемся от заявки до старта работы
        </h2>

        <div className="mt-7 overflow-hidden rounded-sm border border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
          {/* Общий путь — компактный рельс */}
          <ol className="relative grid gap-0 sm:grid-cols-2">
            {stages.map((s, i) => (
              <motion.li
                key={s.n}
                {...reveal(i)}
                className={[
                  "flex items-center gap-3 px-4 py-3.5 md:px-5",
                  i === 0
                    ? "border-b border-[color:var(--color-line)] sm:border-b-0 sm:border-r"
                    : "",
                ].join(" ")}
              >
                <span className="stencil flex-none t-caption tracking-[0.2em] text-[color:var(--color-accent)]">
                  {s.n}
                </span>
                <span
                  aria-hidden
                  className="h-px w-4 flex-none bg-[color:var(--color-line)]"
                />
                <div className="min-w-0 flex items-baseline gap-2 flex-wrap">
                  <span className="font-display t-body font-medium tracking-tight">
                    {s.t}
                  </span>
                  <span className="t-caption text-[color:var(--color-text-secondary)]">
                    — {s.d}
                  </span>
                </div>
              </motion.li>
            ))}
          </ol>

          {/* Развилка */}
          <div className="flex items-center gap-2.5 border-y border-[color:var(--color-line)] bg-[color:var(--color-bg)] px-4 py-2 md:px-5">
            <span className="h-1.5 w-1.5 flex-none rounded-pill bg-[color:var(--color-accent)]" />
            <div className="t-eyebrow text-[color:var(--color-text-secondary)]">
              дальше — зависит от задачи
            </div>
            <span
              aria-hidden
              className="ml-1 hidden h-px flex-1 sm:block"
              style={{
                background:
                  "linear-gradient(to right, color-mix(in oklab, var(--color-accent) 35%, transparent), transparent)",
              }}
            />
          </div>

          {/* Две ветки */}
          <div className="grid sm:grid-cols-2">
            {branches.map((b, i) => (
              <motion.div
                key={b.tag}
                {...reveal(i + 1)}
                className={[
                  "px-4 py-4 md:px-5",
                  i === 0
                    ? "border-b border-[color:var(--color-line)] sm:border-b-0 sm:border-r"
                    : "",
                ].join(" ")}
              >
                <div className="flex items-center gap-2">
                  <NodeBullet />
                  <div className="t-eyebrow min-w-0 truncate text-[color:var(--color-text-secondary)]">
                    {b.tag}
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                  <span className="font-display t-body font-medium tracking-tight text-foreground">
                    {b.time}
                  </span>
                  <span className="t-caption text-[color:var(--color-text-secondary)]">
                    — {b.desc}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



/* -------------------------------- Кейсы ----------------------------------- */
/* Карточка кейса из сборки Lovable + обязательная строка «что изменилось
   у клиента» (языком потребности) по ТЗ v3. */

export function CaseCard({ item, index }: { item: CaseItem; index: number }) {
  return (
    <motion.div
      {...reveal(index)}
      id={item.slug}
      className="h-full scroll-mt-28"
    >
      <div className="card-static group flex h-full flex-col overflow-hidden rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-bg)] shadow-none">
        {/* Шапка — матовое чёрное стекло: название кейса лежит на угольной
            пластине, под ней узловая сцена (брендбук, разд. 7).
            Под текстом — затемняющий скрим: держит контраст ≥ 7:1 даже
            там, где проходит светлый блик. */}
        <div className="relative overflow-hidden bg-[color:var(--color-coal,#131417)] px-5 py-6 sm:px-6 sm:py-7 md:px-7">
          <div className="absolute inset-0" aria-hidden>
            <NodeScene
              className="!left-auto !right-[4%] !top-[8%] !h-[84%] text-[color:var(--color-text-inverse-2)]"
              opacity={0.5}
            />
            <div
              className="absolute inset-0 transition-[backdrop-filter,opacity] duration-500 group-hover:[backdrop-filter:blur(20px)_saturate(140%)]"
              style={{
                background:
                  "radial-gradient(120% 100% at 88% 6%, rgba(233,196,189,0.16), transparent 58%)",
                backdropFilter: "blur(14px) saturate(120%)",
              }}
            />
            {/* Матовый скрим — запас по читаемости */}
            <div
              className="absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(180deg, rgba(4,6,9,0.62) 0%, rgba(4,6,9,0.5) 55%, rgba(4,6,9,0.66) 100%)",
              }}
            />
            {/* Верхняя кромка-линза, ярче при наведении */}
            <div className="absolute inset-x-0 top-0 h-px bg-white/10 transition-colors duration-500 group-hover:bg-white/25" />
          </div>

          <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="t-eyebrow min-w-0 text-[color:var(--color-accent-soft,#F5E4E1)]">
              {item.category}
            </div>
            {item.nda && (
              <span className="shrink-0 rounded-pill border border-white/40 px-2 py-1 t-label text-[color:var(--color-text-inverse)]">
                NDA
              </span>
            )}
          </div>

          <h3 className="relative mt-3 font-display t-body font-bold text-balance text-[color:var(--color-text-inverse)] transition-[color,text-shadow] duration-300 [overflow-wrap:anywhere] group-hover:text-[color:var(--color-accent-soft,#F5E4E1)] group-hover:[text-shadow:0_0_22px_rgba(245,228,225,0.35)]">
            {item.title}
          </h3>

          <div className="relative mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 t-body text-[color:var(--color-text-inverse-2)]">
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-w-0 items-center gap-1 font-medium text-[color:var(--color-text-inverse)] transition hover:text-[color:var(--color-accent-soft,#F5E4E1)]"
              >
                <span className="min-w-0 [overflow-wrap:anywhere]">{item.client}</span>
                <ArrowUpRight data-arrow className="h-3.5 w-3.5 shrink-0" />
              </a>
            ) : (
              <span className="min-w-0 font-medium text-[color:var(--color-text-inverse)] [overflow-wrap:anywhere]">
                {item.client}
              </span>
            )}
            <span className="hidden text-[color:var(--color-text-inverse-2)]/70 sm:inline">·</span>
            <span className="min-w-0 [overflow-wrap:anywhere]">{item.role}</span>
          </div>
        </div>


        <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6 md:p-7">


        <div className={`grid grid-cols-2 gap-2 sm:gap-2.5 ${item.metrics.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {item.metrics.slice(0, 3).map(([value, label]) => (
            <div
              key={label}
              className="flex min-w-0 flex-col items-center justify-start rounded-sm border border-[color:var(--color-line)] bg-[color:var(--color-bg-secondary)] px-2 py-3 text-center transition group-hover:border-[color:var(--color-accent)]/20 group-hover:bg-[color:var(--color-bg-secondary)]"
            >
              <div className="w-full font-display t-body font-medium tabular-nums tracking-[-0.015em] text-[color:var(--color-accent)] [overflow-wrap:anywhere] hyphens-none">
                {value}
              </div>
              <div className="t-caption mt-1 text-[color:var(--color-text-secondary)] [overflow-wrap:anywhere]">
                {label}
              </div>
            </div>
          ))}
        </div>


        {item.done && item.done.length > 0 && (
          <div className="space-y-2">
            <div className="t-eyebrow text-[color:var(--color-text-secondary)]">
              Что сделано
            </div>
            <ul className="space-y-1.5 t-body text-[color:var(--color-text-primary)]">
              {item.done.map((d) => (
                <li key={d} className="flex items-start gap-2.5">
                  <NodeBullet active={false} className="mt-[0.5em] !h-[6px] !w-[6px]" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.changed && (
          <div className="rounded-sm border-l-[3px] border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/5 px-4 py-3">
            <div className="t-label text-[color:var(--color-text-secondary)]">
              Что изменилось у клиента
            </div>
            <p className="mt-1 t-body font-medium text-foreground/90">{item.changed}</p>
          </div>
        )}

        {item.effectHref && (
          <a href={item.effectHref} className="link-arrow group w-max t-body">
            Бизнес-эффект и цифры
            <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        )}

        {item.source && (
          <p className="mt-auto t-small italic text-[color:var(--color-text-secondary)]/70">
            {item.source}
          </p>
        )}
        </div>
      </div>

    </motion.div>
  );
}

export function CasesBlock({ compactHeader = false }: { compactHeader?: boolean }) {
  const items = visibleCases();
  return (
    <section id="cases" className="stage border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
      <Scene blobs={[{ className: "-right-40 top-10", tone: "chrome", size: 600 }, { className: "-left-40 bottom-10", tone: "chrome", size: 520 }]} />

      <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
        {!compactHeader && (
          <>
            <SectionLabel n="02">Результаты клиентов</SectionLabel>
            <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <RevealHeading className="t-h2 max-w-3xl">
                Кейсы с конкретными метриками
              </RevealHeading>
              <p className="max-w-md text-[color:var(--color-text-secondary)]">
                Реальные проекты: от запусков продуктов до корпоративных программ и MVP ДПО.
              </p>
            </div>
          </>
        )}
        <div className={`grid items-stretch gap-6 md:grid-cols-2 ${compactHeader ? "" : "mt-14"}`}>
          {items.map((item, i) => (
            <CaseCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Отзывы ---------------------------------- */
/* Компактные карточки 3 в ряд (вёрстка согласована 26.07), без карусели. */

export function ReviewCard({ r, index = 0 }: { r: Review; index?: number }) {
  return (
    <motion.div
      id={r.slug}
      {...reveal(index)}
      className="h-full scroll-mt-28"
    >
      <PaperCard className="flex h-full flex-col gap-4 p-6">
        <span className="font-display t-h2 text-[color:var(--color-accent)]">«</span>
        <blockquote className="flex flex-col gap-2.5 t-body text-[color:var(--color-text-primary)]">
          {r.text.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </blockquote>
        <div className="mt-auto flex items-center gap-3 border-t border-[color:var(--color-line)] pt-4">
          <div className="size-11 shrink-0 overflow-hidden rounded-pill border border-[color:var(--color-line)] bg-[color:var(--color-bg-secondary)]">
            <img
              src={r.photo}
              alt={r.name}
              loading="lazy"
              width={120}
              height={120}
              className="size-full object-cover grayscale"
            />
          </div>
          <div className="min-w-0">
            <div className="font-display t-label font-bold">{r.name}</div>
            <p className="mt-0.5 t-caption text-[color:var(--color-text-secondary)]">{r.role}</p>
          </div>
        </div>
      </PaperCard>
    </motion.div>
  );
}

export function ReviewsBlock() {
  const items = homeReviews();
  return (
    <section id="reviews" className="stage sec-dark grain border-b border-[color:var(--color-line-dark)]">
      <Scene blobs={[{ className: "-left-40 top-10", tone: "rose", size: 560 }, { className: "-right-40 bottom-10", tone: "chrome", size: 480 }]} />
      <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
        <SectionLabel n="03">Отзывы</SectionLabel>
        <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <RevealHeading className="t-h2 max-w-3xl">
            Что говорят клиенты
          </RevealHeading>
          <p className="max-w-md text-[color:var(--color-text-secondary)]">
            О работе методологов «Без Воды» — дословно.
          </p>
        </div>
        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
          {items.map((r, i) => (
            <ReviewCard key={r.slug} r={r} index={i} />
          ))}
        </div>
        <a
          href="/reviews"
          className="link-arrow group mt-8 t-body"
        >
          Все отзывы
          <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
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
    <section id="book" className="relative border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
      <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
        <SectionLabel n="06">Методология издана</SectionLabel>
        <div className="mt-8">
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
                    width={1200}
                    height={1600}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
                <div className="font-display t-body font-bold">
                  Книга «Эксперт под ключ»
                </div>
                <p className="measure t-body text-[color:var(--color-text-secondary)]">
                  Методология команды: как извлекаем знания экспертов-практиков и
                  собираем из них продукты обучения с измеримым результатом. Литрес, 2025.
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
    </section>
  );
}

/* ------------- NotFit («Когда нужен другой подрядчик») + FAQ ------------- */

export function NotFit() {
  const items = [
    "если требуется подбор сотрудника в штат или аутстаффинг",
    "если требуется внедрение организационных изменений за пределами образовательного проекта",
    "если нужна организация и логистика мероприятия",
  ];

  return (
    <section id="notfit" className="stage sec-dark grain relative overflow-hidden border-b border-[color:var(--color-line-dark)]">
      <Scene blobs={[
        { className: "-left-40 top-0", tone: "chrome", size: 420 },
        { className: "-right-40 bottom-0", tone: "rose", size: 420 },
      ]} />
      <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
        <SectionLabel n="07">Границы</SectionLabel>
        <RevealHeading className="mt-6 t-h2 max-w-3xl">
          Когда нужен другой подрядчик
        </RevealHeading>
        <ul className="mt-10 max-w-3xl divide-y divide-border border-y border-[color:var(--color-line)]">
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

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-10 max-w-3xl divide-y divide-border border-y border-[color:var(--color-line)]">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <button
            key={item.q}
            type="button"
            aria-expanded={isOpen}
            onClick={() => setOpen(isOpen ? null : i)}
            className={`group flex w-full items-start gap-5 px-2 py-5 text-left transition hover:bg-[color:var(--color-surface)] focus-visible:outline-offset-[-2px] ${isOpen ? "bg-[color:var(--color-surface)]" : ""}`}
          >

            <Stencil n={i + 1} active={isOpen} className="mt-1 t-body" />
            <div className="flex-1">
              <div className={`font-display t-body font-bold transition ${isOpen ? "text-foreground" : "text-[color:var(--color-text-primary)] group-hover:text-foreground"}`}>
                {item.q}
              </div>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                    className="mt-2 overflow-hidden t-body text-[color:var(--color-text-secondary)]"
                  >
                    {item.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }} className="mt-1">
              <Plus className="h-4 w-4 text-[color:var(--color-text-secondary)]" />
            </motion.div>
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------- Contact ------------------------------- */

export function Contact({ asH1 = false }: { asH1?: boolean } = {}) {
  const [sent, setSent] = useState(false);
  const [sentName, setSentName] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [fieldErr, setFieldErr] = useState<{ name?: string | null; contact?: string | null }>({});
  const [pdErr, setPdErr] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const pdRef = useRef<HTMLInputElement>(null);
  const [pd, setPd] = useState(false);

  const validate = (field: "name" | "contact", value: string) => {
    const v = value.trim();
    if (field === "name") return v ? null : "Укажите, как к вам обращаться.";
    if (!v) return "Оставьте email, телефон или Telegram — иначе нам некуда ответить.";
    const ok = /\S+@\S+\.\S+/.test(v) || /^@?[\w.]{3,}$/.test(v) || /[\d][\d\s()+-]{6,}/.test(v);
    return ok ? null : "Похоже на опечатку: укажите email, телефон или @telegram.";
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
    const name = String(data.get("name") || "").trim();
    const company = String(data.get("company") || "").trim();
    const contact = String(data.get("contact") || "").trim();
    const about = String(data.get("about") || "").trim();
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
          company,
          comment: about,
          consent_pd: true,
          consent_pd_version: "1.0-2026-07-14",
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
      setSentName(name);
      setSent(true);
      ymGoal("lead_sent");
    } catch {
      setErr("Заявка не отправилась. Попробуйте ещё раз или напишите в Telegram: @vikki_duck.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="stage border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
      <Scene blobs={[{ className: "-left-40 top-0", tone: "rose", size: 560 }, { className: "right-1/4 top-1/3", tone: "rose", size: 360 }]} />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 sec-pad md:px-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="flex items-center gap-4 t-eyebrow text-[color:var(--color-text-secondary)]">
            {asH1 ? (
              <span className="tex-chrome h-[2px] w-12 rounded-pill" />
            ) : (
              <>
                <span className="font-display t-label font-bold tabular-nums text-[color:var(--color-accent)]">08</span>
                <span className="h-px w-10 bg-[color:var(--color-line)]" />
              </>
            )}
            <span>Контакты</span>
          </div>
          <RevealHeading as={asH1 ? "h1" : "h2"} className={`${asH1 ? "t-h1" : "t-h2"} mt-6 max-w-2xl`}>
            С чего начинается наше сотрудничество
          </RevealHeading>
          <p className="mt-8 max-w-md t-body text-[color:var(--color-text-secondary)]">
            Расскажите, что должно измениться в работе компании и к какому
            сроку. Готовить презентацию и подробное ТЗ не нужно.
          </p>
          <p className="mt-4 max-w-md t-body text-[color:var(--color-text-secondary)]">
            30 минут онлайн: сверим задачу, доступные источники опыта и
            возможный результат первого этапа.
          </p>
          <p className="mt-4 max-w-md t-body text-[color:var(--color-text-secondary)]">
            Готовитесь выступать на конференции для HR или T&D? Поможем собрать
            выступление — бесплатно. Напишите об этом в заявке.
          </p>

          <div className="mt-12">
            <StencilLogo className="logo-lg text-[color:var(--color-text-primary)]" />
          </div>
        </div>

        {/* Форма — единственный тёмный акцент светлой секции: локальный
            sec-dark сохраняет тёмные токены внутри карточки. */}
        <PaperCard className="sec-dark p-8 md:p-10">
        <form
          noValidate
          id="form"
          onSubmit={onSubmit}
          onFocusCapture={onFormFocus}
          onPointerDownCapture={onFormFocus}
          className="text-background"
        >

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: REVEAL_EASE }}
                className="flex min-h-[420px] flex-col items-start justify-center"
              >
                <CatMark className="h-24 w-28 text-[color:var(--color-text-inverse)]" strokeWidth={2} />
                <h3 className="t-body mt-6 text-background">
                  {sentName ? `Спасибо, ${sentName}!` : "Спасибо!"}
                </h3>
                <p className="mt-3 text-[color:var(--color-text-inverse-2)]">
                  Что дальше:
                </p>

                <ol className="mt-4 space-y-2 t-body text-[color:var(--color-text-inverse-2)]">
                  <li className="flex gap-3"><span className="node-dot node-dot-active mt-2" />Ответим в течение двух рабочих часов и предложим время.</li>
                  <li className="flex gap-3"><span className="node-dot node-dot-active mt-2" />30 минут онлайн: сверим задачу и определим следующий шаг.</li>
                  <li className="flex gap-3"><span className="node-dot node-dot-active mt-2" />Готовиться не нужно — презентация и ТЗ не требуются.</li>
                </ol>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-8 t-body font-semibold text-[color:var(--color-text-inverse)] underline-offset-4 hover:text-background hover:underline"
                >
                  Отправить ещё одну заявку
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
                <Field label="Ваше имя" name="name" placeholder="Ирина" dark required
                  inputRef={nameRef} error={fieldErr.name} onBlur={checkField("name")} onInput={clearOnInput("name")} />
                <Field label="Email / Telegram / телефон" name="contact" placeholder="name@company.ru" dark required
                  inputRef={contactRef} error={fieldErr.contact} onBlur={checkField("contact")} onInput={clearOnInput("contact")} />

                <Field label="Компания и роль" name="company" placeholder="Компания, роль" dark />
                <div>
                  <label htmlFor="f-about" className="t-label mb-2 block text-[color:var(--color-text-inverse-2)]">
                    Запрос на разбор
                  </label>
                  <textarea
                    id="f-about"
                    rows={3}
                    name="about"
                    placeholder="Что должно измениться и к какому сроку"
                    className="w-full resize-none rounded-sm border border-[color:var(--color-line-dark)] bg-white/5 px-4 py-3 text-base text-background outline-none transition placeholder:text-background/35 focus:border-background/40 focus:bg-white/10"
                  />
                </div>
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
                    <a href="/consent_pd" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-background">условия</a>{" "}
                    и{" "}
                    <a href="/politics_pd" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-background">политика</a>
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
                  <span>{sending ? "Отправляем…" : "Назначить разбор"}</span>
                  <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </button>
                <p className="t-caption text-[color:var(--color-text-inverse-2)]">
                  Без рассылок и звонков. Данные видит только команда «Без Воды».
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
        </PaperCard>

      </div>
    </section>
  );
}
