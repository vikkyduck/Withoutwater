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
  BRICKS, visibleCases, homeReviews, SITUATIONS, TEAM,
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
        {/* Фразы поменяны ролями (решение Виктории 03.08): самая прямая —
            «Ваша внешняя команда по обучению» — стала заголовком, образ
            «мощностей» ушёл в надзаголовок. Обе формулировки её, дословно. */}
        <div className="mb-6 [--color-text-secondary:var(--color-text-inverse-2)]">
          <SectionLabel n="01">Дополнительные мощности T&D</SectionLabel>
        </div>
        <RevealHeading as="h1" className="t-h1 max-w-[900px] text-[color:var(--color-text-inverse)]">
          Ваша внешняя команда по обучению
        </RevealHeading>

        <p className="t-body measure mt-6 text-[color:var(--color-text-inverse)]/85 md:mt-7">
          Реализуем проекты — от привлечения внешних экспертов до готовых
          образовательных продуктов.
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
              className="link-arrow group t-eyebrow text-[color:var(--color-text-inverse-2)] hover:text-[color:var(--color-text-inverse)]"
            >
              Бизнес-эффект от сотрудничества
              <ArrowUpRight data-arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Три плитки жидкого стекла: что от вас нужно → что произойдёт → цена */}
        <div className="relative mt-12 grid max-w-4xl items-stretch gap-4 sm:grid-cols-3 md:mt-16">
          {[
            ["Без ТЗ", "Вводные в любом виде"],
            ["24 часа", "Старт проекта"],
            ["от 180 000 ₽", "Подписка на команду"],
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
  /* Цифры опыта переехали сюда из отдельной секции «Наш опыт в цифрах»
     (решение 03.08): две секции рядом доказывали одно и то же. Тексты
     дословно из прежней секции. */
  const numbers: [string, string][] = [
    ["460+", "разработанных продуктов в портфеле команды"],
    ["30+", "компаний-клиентов"],
  ];
  return (
    <section className="relative overflow-hidden border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
      <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
        <SectionLabel n="05">Работали с командами</SectionLabel>
        <div className="mt-8 flex flex-col gap-x-14 gap-y-4 sm:flex-row">
          {numbers.map(([n, d]) => (
            <div key={n} className="flex items-baseline gap-3">
              <span className="font-display t-h2 tabular-nums tracking-[-0.02em]">{n}</span>
              <span className="max-w-[240px] t-body text-[color:var(--color-text-secondary)]">{d}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 t-caption text-[color:var(--color-text-secondary)]">
          По данным внутреннего учёта проектов команды.
        </p>
        {/* Разбор 04.08: между плитками клиентов и кейсами был провал —
            логотипы крупные, а кейсы анонимные, и читатель достраивал
            связь сам. Подпись закрывает разрыв. */}
        <p className="mt-6 max-w-2xl t-body text-[color:var(--color-text-secondary)]">
          Проекты этих компаний под NDA — показываем обезличенно. Там, где
          клиент дал согласие, плитка ведёт на его отзыв.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-line)] sm:grid-cols-3">
          {BRICKS.map((b, i) => {
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
                  {b.year && (
                    <span className="t-caption shrink-0 tabular-nums text-[color:var(--color-steel)]">
                      {b.year}
                    </span>
                  )}
                </div>
                {b.href && (
                  <span className="mt-3 inline-flex items-center gap-1.5 t-eyebrow text-[color:var(--color-steel)] transition group-hover:text-[color:var(--color-accent)]">
                    Отзыв клиента
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
              <div className="font-display t-number tabular-nums tracking-[-0.02em]">{n}</div>
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
              <div className="mt-4 font-display t-body font-semibold tracking-tight">{t}</div>
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

/* Блок 3: три ситуации, для которых подход является рабочим.
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
        <SectionLabel n="02">Когда мы нужны</SectionLabel>
        <RevealHeading className="t-h2 mt-6 max-w-3xl text-[color:var(--color-text-inverse)]">
          Когда нужна команда «Без Воды»
        </RevealHeading>
        <p className="mt-5 max-w-2xl t-body text-[color:var(--color-text-inverse-2)]">
          3 ситуации, для которых наш подход является рабочим
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
                      className="h-7 w-7 text-[color:var(--color-text-inverse-2)] transition-colors duration-300 group-hover:text-[color:var(--color-accent-text)]"
                    />
                  </div>
                  <h3 className="mt-3 font-display t-body font-semibold text-[color:var(--color-text-inverse)]">
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
        {/* Выход для того, кто не узнал себя в трёх карточках: самодиагностика
            не обязательна — её и обещает сам разбор */}
        <a
          href="#contact"
          className="link-arrow group mt-8 t-body text-[color:var(--color-text-inverse-2)] hover:text-[color:var(--color-text-inverse)]"
        >
          Не уверены, какая ситуация ваша — разберём за 30 минут
          <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}
/* --------------------- Flow (схема взаимодействия) ---------------------- */
/* Брендбук: плотная сетка на волосяных линиях, трафаретная нумерация,
   срез угла (notch), без «надутых» макетов и крупных плашек. */

export function Flow({ n = "02" }: { n?: string } = {}) {
  const stages = [
    { n: "01", t: "5 минут", d: "отвечаем на заявку" },
    { n: "02", t: "30 минут", d: "проводим первичный разбор" },
  ];
  const branches = [
    { tag: "Масштабировать внутренний опыт", time: "24 часа", desc: "старт проекта" },
    { tag: "Привлечь экспертность с рынка", time: "60 минут", desc: "представляем первые релевантные профили" },
  ];
  return (
    <section className="stage sec-dark grain border-b border-[color:var(--color-line-dark)]">
      <Scene blobs={[{ className: "-right-56 bottom-0", tone: "rose", size: 280 }]} />
      <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
        <SectionLabel n={n}>Схема взаимодействия</SectionLabel>
        <h2 className="t-h2 mt-6 max-w-3xl">
          Как мы двигаемся от заявки до приёмки этапа
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
                <span className="stencil flex-none t-small text-[color:var(--color-accent)]">
                  {s.n}
                </span>
                <span
                  aria-hidden
                  className="h-px w-4 flex-none bg-[color:var(--color-line)]"
                />
                <div className="min-w-0 flex items-baseline gap-2 flex-wrap">
                  <span className="font-display t-body font-semibold tracking-tight">
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
                  <span className="font-display t-body font-semibold tracking-tight text-foreground">
                    {b.time}
                  </span>
                  <span className="t-caption text-[color:var(--color-text-secondary)]">
                    — {b.desc}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Общий финал: обе ветки сходятся в один результат */}
          <div className="flex items-start gap-3 border-t border-[color:var(--color-line)] bg-[color:var(--color-bg)] px-4 py-3.5 md:px-5">
            <span className="stencil flex-none t-small text-[color:var(--color-accent)]">03</span>
            <span aria-hidden className="mt-[0.7em] h-px w-4 flex-none bg-[color:var(--color-line)]" />
            <div className="min-w-0 flex items-baseline gap-2 flex-wrap">
              <span className="font-display t-body font-semibold tracking-tight">
                Старт работы и приёмка этапа
              </span>
              <span className="t-caption text-[color:var(--color-text-secondary)]">
                — этап закрывается по критериям, зафиксированным до начала работы
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Ритм работы (как идёт) ------------------------ */
/* Схема заканчивалась на старте; клиенту нужен ответ, что происходит дальше:
   кто контакт, как часто статус, чем закрывается этап и что при отклонении. */

export function WorkRhythm({ n = "02" }: { n?: string } = {}) {
  const rows: [string, string][] = [
    [
      "Одно контактное лицо",
      "руководитель проекта с нашей стороны отвечает за сроки и результат; общение — в вашем канале (почта, Telegram или ваш таск-трекер)",
    ],
    [
      "Статус — раз в неделю",
      "короткая сводка: что сделано, что в работе, что нужно от вас и где риск по срокам",
    ],
    [
      "Приёмка — по этапам",
      "каждый этап закрывается материалом, который можно использовать самостоятельно, и сверкой с критериями приёмки",
    ],
    [
      "Отклонение — наша зона",
      "если результат этапа не совпал с критериями, дорабатываем за свой счёт; замена эксперта в проекте — тоже на нашей стороне",
    ],
  ];
  return (
    <section className="stage border-b border-[color:var(--color-line)]">
      <Scene blobs={[{ className: "-right-40 top-10", tone: "chrome", size: 420 }]} />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sec-pad md:px-8">
        <SectionLabel n={n}>Как идёт работа</SectionLabel>
        <RevealHeading className="t-h2 mt-6 max-w-3xl">
          Что происходит после старта
        </RevealHeading>
        <ul className="mt-10 max-w-3xl divide-y divide-border border-y border-[color:var(--color-line)]">
          {rows.map(([t, d], i) => (
            <motion.li key={t} {...reveal(i)} className="py-5">
              <div className="flex items-start gap-4">
                <NodeBullet className="mt-[0.55em]" />
                <div className="min-w-0">
                  <div className="font-display t-body font-semibold text-foreground">{t}</div>
                  <p className="mt-1.5 t-body text-[color:var(--color-text-secondary)]">{d}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}




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
            они давали «пятнистый» чёрный. */}
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
            {/* Разбор 04.08: метрики кейса и гарантии противоречили друг
                другу — в кейсах мы мерили себя оттоком и выручкой, а в
                гарантиях от бизнес-показателей открещивались. Атрибуция
                снимает противоречие, не убирая цифры. */}
            <p className="case-meta mt-3 max-w-[65ch] text-[color:var(--color-text-secondary)]">
              По данным заказчика. Обучение — один из факторов, влияющих на эти показатели.
            </p>
          </div>
        )}

        {item.effectHref && (
          <a href={item.effectHref} className="link-arrow case-body group w-max font-semibold">
            Бизнес-эффект и цифры
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
   повторяла всю страницу /cases слово в слово (36% её длины, 21 экран
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
  const items = limit ? all.slice(0, limit) : all;
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
/* Приёмка 05.08: на главной команда короткая — лица, одна строка о составе
   и ссылка на /team. Развёрнутый экран живёт на отдельной странице. */

export function TeamBlock() {
  const founder = TEAM.find((p) => p.founder)!;
  const others = TEAM.filter((p) => !p.founder);
  const people = [founder, ...others];
  return (
    <section id="team" className="stage border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
      <Scene blobs={[{ className: "-right-40 top-10", tone: "rose", size: 520 }]} />

      <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
        <SectionLabel n="04">О нас</SectionLabel>
        <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <RevealHeading className="t-h2 max-w-3xl">
            Команда и сеть экспертов
          </RevealHeading>
          <p className="t-body max-w-md text-[color:var(--color-text-secondary)]">
            Четыре человека отвечают за результат, за ними — сеть практиков.
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {people.map((p, i) => (
            <motion.div key={p.slug} {...reveal(i)} className="h-full">
              <PaperCard className="flex h-full flex-col overflow-hidden p-0">
                <div className="aspect-[4/5] w-full overflow-hidden bg-[color:var(--color-bg-secondary)]">
                  <img
                    src={p.photo}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top grayscale transition duration-500 hover:grayscale-0"
                  />
                </div>
                <div className="p-5">
                  <div className="font-display t-body font-semibold">{p.name}</div>
                  <p className="mt-1 t-eyebrow text-[color:var(--color-text-secondary)]">{p.role}</p>
                </div>
              </PaperCard>
            </motion.div>
          ))}
          {/* Пятая плитка — сеть практиков за командой (портретов на неё нет) */}
          <motion.a href="/team" {...reveal(people.length)} className="h-full">
            <PaperCard className="card-link group flex h-full flex-col justify-between p-5">
              <span className="font-display t-h2 tabular-nums tracking-[-0.02em]">30+</span>
              <div>
                <div className="font-display t-body font-semibold">Сеть практиков</div>
                <p className="mt-1 t-eyebrow text-[color:var(--color-text-secondary)]">
                  Подключаем под задачу
                </p>
              </div>
            </PaperCard>
          </motion.a>
        </div>


        <a href="/team" className="link-arrow group mt-8 t-body">
          Подробнее о команде и сети экспертов
          <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
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
            <div className="font-display t-label">{r.name}</div>
            <p className="mt-0.5 t-caption text-[color:var(--color-text-secondary)]">{r.role}</p>
          </div>
        </div>
      </PaperCard>
    </motion.div>
  );
}

/* Секция светлая (решение 03.08): на телефоне три тёмных экрана цитат подряд
   сливались со следующей тёмной секцией. На главной два отзыва — «Все отзывы»
   теперь ведёт к тому, чего на главной нет. */
export function ReviewsBlock({ bare = false }: { bare?: boolean } = {}) {
  const items = homeReviews();
  return (
    <section id="reviews" className="stage border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
      <Scene blobs={[{ className: "-left-40 top-10", tone: "rose", size: 560 }, { className: "-right-40 bottom-10", tone: "chrome", size: 480 }]} />
      <div className={`relative mx-auto max-w-7xl px-5 md:px-8 ${bare ? "sec-pad-b pt-10 md:pt-12" : "sec-pad"}`}>
        {!bare && (
          <>
            <SectionLabel n="04">Отзывы</SectionLabel>
            <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <RevealHeading className="t-h2 max-w-3xl">
                Что говорят клиенты
              </RevealHeading>
              <p className="t-body max-w-md text-[color:var(--color-text-secondary)]">
                О работе методологов «Без Воды» — дословно.
              </p>
            </div>
          </>
        )}
        <div className={`grid items-stretch gap-6 md:grid-cols-2 ${bare ? "" : "mt-12"}`}>
          {items.map((r, i) => (
            <ReviewCard key={r.slug} r={r} index={i} />
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          {bare && (
            <a href="/cases" className="link-arrow group t-body">
              Все кейсы
              <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          )}
          <a
            href="/reviews"
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
                <div className="font-display t-body font-semibold">
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

export function NotFit({ n = "07" }: { n?: string } = {}) {
  const items = [
    "требуется подбор сотрудника в штат или аутстаффинг",
    "требуется внедрение организационных изменений за пределами образовательного проекта",
    "нужна организация и логистика мероприятия",
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
        <p className="mt-5 max-w-2xl t-body text-[color:var(--color-text-secondary)]">
          Три задачи, за которые мы не беремся — честнее сказать это до старта.
        </p>
        <ul className="mt-10 max-w-3xl divide-y divide-border border-y border-[color:var(--color-line)]">

          {items.map((t) => (
            <li key={t} className="flex items-start gap-4 py-4 t-body text-[color:var(--color-text-primary)]">
              <NodeBullet className="mt-[0.55em]" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl t-body text-[color:var(--color-text-secondary)]">
          Если задача из этого списка — напишите всё равно: подскажем профиль подрядчика и,
          где можем, порекомендуем конкретных людей из своей сети.
        </p>
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

            <Stencil n={i + 1} active={isOpen} className="mt-1 t-small" />
            <div className="flex-1">
              <div className={`font-display t-body font-semibold text-foreground transition ${isOpen ? "" : "group-hover:text-[color:var(--color-accent-text)]"}`}>
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

/* numbered=false — для /contacts: там секция одна, и порядковый «08»,
   пришедший с главной, выглядел чужим. */
export function Contact({ asH1 = false, numbered = true }: { asH1?: boolean; numbered?: boolean } = {}) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [fieldErr, setFieldErr] = useState<{ name?: string | null; contact?: string | null }>({});
  const [pdErr, setPdErr] = useState<string | null>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const pdRef = useRef<HTMLInputElement>(null);
  const [pd, setPd] = useState(false);

  /* Формат контакта НЕ проверяем. Прежняя проверка отбраковывала живых людей:
     «t.me/irina», «Telegram: @irina», «напишите в телеграм @irina_hr» — то есть
     ровно тот формат, которым сайт печатает собственный контакт. Цена ложного
     отказа (человек уходит) выше цены опечатки: рядом всё равно есть имя,
     компания и запрос, по которым можно вернуться. Ловим только пустое поле. */
  const validate = (field: "name" | "contact", value: string) => {
    const v = value.trim();
    if (field === "name") return v ? null : "Укажите, как к вам обращаться.";
    if (!v) return "Оставьте email, телефон или Telegram — иначе нам некуда ответить.";
    if (v.length < 3 || !/[\wа-яё]/i.test(v)) {
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
    const company = String(data.get("company") || "").trim();
    const contact = String(data.get("contact") || "").trim();
    /* Имя отдельным полем не спрашиваем (приёмка 05.08): в поле контакта
       человек пишет и как его зовут, и куда ответить. В API имя обязательно —
       отправляем ту же строку. */
    const name = contact;
    const about = String(data.get("about") || "").trim();
    const hp = String(data.get("website") || "");
    const contactMsg = validate("contact", contact);
    const pdMsg = pd ? null : "Отметьте согласие на обработку персональных данных.";
    setFieldErr({ contact: contactMsg });
    setPdErr(pdMsg);
    if (contactMsg || pdMsg) {
      const target = contactMsg ? contactRef.current : pdRef.current;
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
      setSent(true);
      ymGoal("lead_sent");
    } catch {
      setErr("Заявка не отправилась. Попробуйте ещё раз или напишите в Telegram: @vikky_duck.");
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
            {asH1 || !numbered ? (
              <span className="tex-chrome h-[2px] w-12 rounded-pill" />
            ) : (
              <>
                <span className="font-display t-label tabular-nums text-[color:var(--color-accent)]">08</span>
                <span className="h-px w-10 bg-[color:var(--color-line)]" />
              </>
            )}
            <span>Контакты</span>
          </div>
          <RevealHeading as={asH1 ? "h1" : "h2"} className={`${asH1 ? "t-h1" : "t-h2"} mt-6 max-w-2xl`}>
            30 минут, без подготовки, с планом на выходе
          </RevealHeading>
          <p className="mt-8 max-w-md t-body text-[color:var(--color-text-secondary)]">
            Расскажите, что должно измениться в работе компании и к какому
            сроку. Готовить презентацию и подробное ТЗ не нужно.
          </p>
          <p className="mt-4 max-w-md t-body text-[color:var(--color-text-secondary)]">
            На встрече сверим задачу, доступные источники опыта и возможный
            результат первого этапа.
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
                <Field
                  label="Как к вам обращаться и куда ответить"
                  name="contact"
                  placeholder="Ирина, name@company.ru или @irina"
                  dark
                  required
                  inputRef={contactRef}
                  error={fieldErr.contact}
                  onBlur={checkField("contact")}
                  onInput={clearOnInput("contact")}
                />

                <div>

                  {/* Поле необязательное (решение Виктории 06.08): контакта
                      достаточно, задачу разберём на встрече. */}
                  <label htmlFor="f-about" className="t-label mb-2 block text-[color:var(--color-text-inverse-2)]">
                    Запрос на разбор — не обязательно
                  </label>
                  {/* Цвета — как у Field dark. Прежний text-background внутри
                      sec-dark резолвился в уголь: человек печатал запрос
                      УГЛЁМ ПО УГЛЮ и не видел собственных букв. */}
                  <textarea
                    id="f-about"
                    rows={3}
                    name="about"
                    placeholder="Что должно измениться и к какому сроку"
                    className="w-full resize-none rounded-sm border border-[color:var(--color-line-dark)] bg-white/5 px-4 py-3 t-body text-[color:var(--color-text-inverse)] outline-none transition placeholder:text-[color:var(--color-text-inverse-2)]/50 focus:border-[color:var(--color-accent-glass)] focus:bg-white/10"
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
                  {/* «Отправить заявку…»: прежний «Назначить разбор» обещал
                      выбор времени, которого в форме нет */}
                  <span>{sending ? "Отправляем…" : "Отправить заявку на разбор"}</span>
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
