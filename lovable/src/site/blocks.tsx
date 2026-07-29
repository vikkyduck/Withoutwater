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
  SectionLabel, GlassCard, PaperCard, Scene, NodeScene,
  RevealHeading, Field, StencilLogo,
  CTA_LABEL, CTA_NOTE,
} from "./core";
import {
  BRICKS, visibleCases, homeReviews, SHOW_DEMO,
  type CaseItem, type Review,
} from "./data";

const bookCover = { url: "/img/book-cover.webp" };

/* --------------------------------- Hero ---------------------------------- */
/* Из сборки Lovable; по ТЗ v3: строка «460+…» убрана из hero (дублирует
   полосу цифр), CTA — единая «Разбор задачи за 30 минут». */

export function Hero() {
  return (
    <section id="top" className="stage sec-dark grain border-b border-[color:var(--color-line-dark)]">
      {/* Сцена обложки: узлы, хромовое кольцо и стеклянные плашки поверх.
          Хром — только объект, под текст не кладётся. */}
      <div className="stage__bg" aria-hidden>
        <div
          className="absolute right-[-4%] top-1/2 hidden aspect-square w-[min(34vw,440px)] -translate-y-1/2 md:block"
          style={{ opacity: 0.92 }}
        >
          <div className="chrome-ring absolute inset-[8%]" />
          <NodeScene className="text-[color:var(--color-text-inverse-2)]" opacity={0.55} />
        </div>
        {/* тёплое свечение за кольцом */}
        <div
          className="absolute right-[2%] top-1/2 hidden h-[420px] w-[420px] -translate-y-1/2 rounded-pill md:block"
          style={{
            background:
              "radial-gradient(closest-side, rgba(233,196,189,0.20), rgba(233,196,189,0))",
            filter: "blur(10px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-14 pt-10 md:px-8 md:pb-24 md:pt-24">
        {/* Надзаголовок с узлами-разделителями */}
        <div className="t-eyebrow flex flex-wrap items-center gap-x-3 gap-y-2 text-[color:var(--color-text-inverse-2)]">
          <span>Методологическое бюро</span>
          <span className="node-dot node-dot-active" />
          <span>Практика в стандарт</span>
        </div>

        {/* Центральная история. Срез — на акцентном слове, один на макет. */}
        <RevealHeading as="h1" className="t-h1 mt-6 max-w-3xl text-[color:var(--color-text-inverse)] md:mt-9">
          Практика сильнейшего сотрудника становится{" "}
          <span className="text-[color:var(--color-accent-glass)]">стандартом всей команды</span>
        </RevealHeading>

        <p className="t-lead measure mt-5 text-[color:var(--color-text-inverse-2)] md:mt-8">
          Выделяем решения, которые дают результат, проверяем их и переводим
          в алгоритмы, стандарты, кейсы и материалы. Если нужной практики нет
          внутри — находим её на рынке и адаптируем под контекст компании.
        </p>

        {/* Два аргумента — стеклянными плашками на тёмной сцене */}
        <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-2 md:mt-12">
          {[
            ["Без ТЗ", "Принимаем вводные в любом виде и собираем из них архитектуру решения и план работ"],
            ["24 часа", "После согласования назначаем команду и проводим стартовую встречу"],
          ].map(([label, desc]) => (
            <div key={label} className="lg lg-dark rounded-md px-5 py-5 md:px-6">
              <div className="font-display text-[19px] font-medium leading-none tracking-[-0.015em] text-[color:var(--color-text-inverse)] md:text-[21px]">
                {label}
              </div>
              <p className="t-body-sm mt-3 text-[color:var(--color-text-inverse-2)]">
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 md:mt-12">
          <a href="#contact" className="btn btn-invert group w-full sm:w-auto">
            <span>{CTA_LABEL}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </a>
          <div className="t-body-sm flex items-center gap-2.5 text-[color:var(--color-text-inverse-2)]">
            <span className="node-dot node-dot-active" />
            <span>{CTA_NOTE}</span>
          </div>
        </div>

        {/* Характер бюро — как в обложке системы */}
        <div className="t-label mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[color:var(--color-text-inverse)] md:mt-16">
          <span>точный</span>
          <span className="node-dot node-dot-active" />
          <span>осязаемый</span>
          <span className="node-dot node-dot-active" />
          <span>интеллектуальный</span>
        </div>
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
    <section className="relative overflow-hidden border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-secondary)]">
      <div className="relative mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <p className="t-eyebrow text-[color:var(--color-text-secondary)]">
          Работали с командами
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
          {BRICKS.map((b, i) => (
            <motion.a
              key={b.name}
              href={b.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05, duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              className="group relative flex min-h-[108px] flex-col justify-between rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-accent)]/35 md:min-h-[124px] md:p-6"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-display text-[16px] font-medium leading-tight tracking-[-0.01em] text-[color:var(--color-text-primary)] transition group-hover:text-foreground md:text-[19px]">
                  {b.name}
                </span>
                {b.year && (
                  <span className="shrink-0 rounded-pill border border-[color:var(--color-line)] px-2 py-0.5 t-caption font-semibold tabular-nums text-[color:var(--color-text-secondary)]">
                    {b.year}
                  </span>
                )}
              </div>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-[color:var(--color-text-secondary)] transition group-hover:text-[color:var(--color-accent)]">
                Отзыв клиента
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Демо-блок -------------------------------- */
/* По ТЗ — центральный блок главной («до и после»). Формат Виктория ещё
   выбирает, поэтому блок выключен (SHOW_DEMO=false) и на странице его НЕТ —
   по правилу «страниц, которых нет, просто нет». */

export function DemoBlock() {
  if (!SHOW_DEMO) return null;
  return (
    <section id="demo" className="relative overflow-hidden border-b border-[color:var(--color-line)]">
      <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        {/* Контент демо появится здесь: слева фрагмент сырого интервью,
            справа — стандарт/алгоритм, в который он превратился. Открывается
            без формы; цель метрики demo_opened. */}
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
    <section className="relative overflow-hidden border-b border-[color:var(--color-line)]">
      <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <div className="flex items-center gap-3 t-eyebrow text-[color:var(--color-text-secondary)]">
          <span className="tex-chrome h-[2px] w-12 rounded-pill" />
          <span>Наш опыт в цифрах</span>
        </div>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-6">
          {items.map(([n, d]) => (
            <div key={n} className="relative pt-6">
              <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-[color:var(--color-line)]" />
              <span aria-hidden className="tex-chrome absolute left-0 top-0 h-[2px] w-12 rounded-pill" />
              <div className="font-display text-5xl font-medium leading-none tabular-nums tracking-[-0.02em] md:text-[64px]">{n}</div>
              <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-[color:var(--color-text-secondary)]">{d}</p>
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
      <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-24">
        <div className="t-eyebrow flex items-center gap-3 text-[color:var(--color-text-inverse-2)]"><span className="font-display tracking-normal text-[color:var(--color-accent-glass)]">02</span><span className="h-px w-10 bg-[color:var(--color-line-dark)]" /><span>Производство</span></div>
        <RevealHeading className="mt-6 max-w-4xl font-display text-3xl font-medium leading-tight sm:text-4xl md:text-5xl">
          Как устроено наше производство
        </RevealHeading>
        <p className="mt-5 max-w-2xl t-lead text-[color:var(--color-text-inverse-2)]">
          Отличие проектной команды от группы фрилансеров — производственная
          система: сроки, параллельность и приёмка, о которых договорились заранее.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06 }}
              className="lg lg-dark rounded-md p-6"
            >
              <div className="font-display text-xl font-medium tracking-tight md:text-2xl">{t}</div>
              <p className="mt-2.5 text-sm leading-relaxed text-[color:var(--color-text-inverse-2)] md:text-[15px]">{d}</p>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 max-w-2xl t-caption text-[color:var(--color-text-inverse-2)]">
          * Типовой курс — программа стандартной структуры на подготовленной
          фактуре заказчика, без исследовательского этапа и продуктовой разработки
          с нуля.
        </p>
        <a
          href="/for-your-boss"
          className="group mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-[color:var(--color-accent)] transition hover:text-foreground"
        >
          Бизнес-эффект от методологии
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}

/* Блок 3: четыре ситуации, в которых подход даёт максимальный эффект. */

export function WhenNeeded() {
  /* Формулировки из разбора 26.07: три УПРАВЛЕНЧЕСКИЕ ситуации одного
     уровня, по две строки — не «боли» и не разнобой операционка/стратегия. */
  const items = [
    {
      t: "Тиражировать практику сильных сотрудников",
      d: "Чтобы результат не зависел от нескольких людей, а их рабочий подход могли применять другие команды",
      href: "/tasks#practice",
    },
    {
      t: "Запустить больше инициатив без расширения постоянного штата",
      d: "Чтобы внутренний L&D сохранил управление портфелем, а производство не стало ограничением",
      href: "/tasks#capacity",
    },
    {
      t: "Быстро привнести практику, которой пока нет внутри",
      d: "Чтобы команда получила проверенный способ работы быстрее найма и самостоятельного поиска",
      href: "/tasks#external",
    },
  ];
  return (
    <section id="when" className="stage border-b border-[color:var(--color-line)]">
      <Scene blobs={[{ className: "-left-40 top-10", tone: "rose", size: 520 }]} />
      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-24">
        <SectionLabel n="01">Когда к нам обращаются</SectionLabel>
        <RevealHeading className="mt-6 max-w-3xl font-display text-3xl font-medium leading-tight sm:text-4xl md:text-5xl">
          Когда нужна команда «Без Воды»
        </RevealHeading>
        <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-text-secondary)]">
          3 ситуации, в которых наш подход дает максимальный эффект
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <a href={c.href} className="group block h-full">
                <GlassCard className="flex h-full flex-col p-6 transition-transform duration-300 group-hover:-translate-y-1 md:p-8">
                  <div className="font-display text-sm font-bold tabular-nums text-[color:var(--color-accent)]">
                    0{i + 1}
                  </div>
                  <h3 className="mt-3 font-display text-base font-medium leading-snug md:text-lg">
                    {c.t}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-[15px]">
                    {c.d}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-semibold text-[color:var(--color-accent)] transition group-hover:text-foreground">
                    Как решаем
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </GlassCard>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
/* --------------------- Flow (схема взаимодействия) ---------------------- */

export function Flow() {
  const stages = [
    { n: "01", t: "2 рабочих часа", d: "отвечаем на заявку" },
    { n: "02", t: "30 минут", d: "проводим первичный разбор" },
  ];
  const branches = [
    {
      tag: "Масштабировать внутренний опыт",
      time: "24 часа",
      desc: "назначаем команду и проводим стартовую встречу",
    },
    {
      tag: "Привлечь экспертность с рынка",
      time: "72 часа",
      desc: "представляем первые релевантные профили",
    },
  ];
  return (
    <section className="stage border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-secondary)]">
      <Scene blobs={[{ className: "-left-40 top-10", tone: "rose", size: 420 }, { className: "-right-56 bottom-10", tone: "rose", size: 360 }]} />
      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-24">
        <div className="t-eyebrow text-[color:var(--color-text-secondary)]">
          Схема взаимодействия
        </div>
        <h2 className="mt-4 max-w-3xl font-display text-2xl font-medium leading-tight sm:text-3xl md:text-4xl">
          Как мы двигаемся от заявки до старта работы
        </h2>

        {/* ===== Линейные шаги 01 → 02 ===== */}
        <div className="relative mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
          {/* соединительная линия между 01 и 02 (desktop) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-px w-16 -translate-x-1/2 -translate-y-1/2 md:block"
            style={{
              background:
                "linear-gradient(to right, transparent, color-mix(in oklab, var(--color-accent) 55%, transparent), transparent)",
            }}
          />
          {stages.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1 }}
              className="relative flex items-start gap-5 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-6 md:p-7"
            >
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-pill border border-[color:var(--color-accent)]/40 bg-[color:var(--color-accent)]/10 font-display text-sm font-medium tracking-tight text-[color:var(--color-accent)]">
                {s.n}
              </span>
              <div className="min-w-0">
                <div className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                  {s.t}
                </div>
                <div className="mt-2 text-[15px] leading-relaxed text-[color:var(--color-text-secondary)]">
                  {s.d}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ===== Развилка ===== */}
        <div className="relative mt-10 md:mt-14">
          {/* Вертикальная линия сверху к «развилке» */}
          <div
            aria-hidden
            className="mx-auto h-10 w-px"
            style={{
              background:
                "linear-gradient(to bottom, color-mix(in oklab, var(--color-accent) 45%, transparent), transparent)",
            }}
          />
          {/* Точка развилки */}
          <div className="relative mx-auto -mt-1 flex h-6 w-6 items-center justify-center">
            <span className="absolute inset-0 rounded-pill bg-[color:var(--color-accent)]/15" />
            <span className="h-2.5 w-2.5 rounded-pill bg-[color:var(--color-accent)]" />
          </div>

          {/* SVG-развилка (desktop) */}
          <svg
            aria-hidden
            viewBox="0 0 800 90"
            preserveAspectRatio="none"
            className="mx-auto -mt-3 hidden h-16 w-full max-w-4xl md:block"
          >
            <defs>
              <linearGradient id="flowFork" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            <path
              d="M400 0 C 400 45, 160 40, 160 90"
              fill="none"
              stroke="url(#flowFork)"
              strokeWidth="1.5"
            />
            <path
              d="M400 0 C 400 45, 640 40, 640 90"
              fill="none"
              stroke="url(#flowFork)"
              strokeWidth="1.5"
            />
          </svg>

          {/* Подпись «развилка» */}
          <div className="mt-4 text-center t-eyebrow text-[color:var(--color-text-secondary)] md:mt-2">
            дальше — зависит от задачи
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-8">
            {branches.map((b, i) => (
              <motion.div
                key={b.tag}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                className="group relative overflow-hidden rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-6 md:p-8"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[2px]"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, color-mix(in oklab, var(--color-accent) 65%, transparent), transparent)",
                  }}
                />
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-2 w-2 rounded-pill bg-[color:var(--color-accent)]" />
                  <div className="t-eyebrow text-[color:var(--color-text-secondary)]">
                    {b.tag}
                  </div>
                </div>
                <div className="mt-6 flex items-baseline gap-3">
                  <div className="font-display text-4xl font-medium tracking-tight text-foreground md:text-5xl">
                    {b.time}
                  </div>
                </div>
                <div className="mt-3 text-[15px] leading-relaxed text-[color:var(--color-text-secondary)]">
                  {b.desc}
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <GlassCard className="group flex h-full flex-col gap-5 p-6 transition-transform duration-300 hover:-translate-y-1 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="t-eyebrow text-[color:var(--color-accent)]">
            {item.category}
          </div>
          {item.nda && (
            <span className="shrink-0 rounded-pill border border-[color:var(--color-line)] px-2 py-1 t-label text-[color:var(--color-text-secondary)]">
              NDA
            </span>
          )}
        </div>

        <div>
          <h3 className="font-display text-2xl font-bold leading-tight">{item.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[color:var(--color-text-secondary)]">
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-medium text-[color:var(--color-text-primary)] transition hover:text-[color:var(--color-accent)]"
              >
                {item.client}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span className="font-medium text-[color:var(--color-text-primary)]">{item.client}</span>
            )}
            <span className="hidden text-border sm:inline">·</span>
            <span>{item.role}</span>
          </div>
        </div>

        <div className={`grid grid-cols-2 gap-2 sm:gap-2.5 ${item.metrics.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-4"}`}>
          {item.metrics.map(([value, label]) => (
            <div
              key={label}
              className="flex min-w-0 flex-col items-center rounded-sm border border-[color:var(--color-line)] bg-[color:var(--color-bg-secondary)] px-2 py-3 text-center transition group-hover:border-[color:var(--color-accent)]/20 group-hover:bg-[color:var(--color-bg-secondary)]"
            >
              <div className="w-full font-display text-[clamp(1.05rem,2.2vw,1.5rem)] font-medium leading-none tabular-nums tracking-[-0.015em] text-[color:var(--color-accent)] [overflow-wrap:anywhere] hyphens-none">
                {value}
              </div>
              <div className="t-caption mt-1.5 text-[color:var(--color-text-secondary)] [overflow-wrap:anywhere]">
                {label}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="t-eyebrow text-[color:var(--color-text-secondary)]">
            Что сделано
          </div>
          <ul className="space-y-1.5 text-sm leading-relaxed text-[color:var(--color-text-primary)]">
            {item.done.map((d) => (
              <li key={d} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-pill bg-[color:var(--color-accent)]" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        {item.changed && (
          <div className="rounded-sm border-l-[3px] border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/5 px-4 py-3">
            <div className="t-label text-[color:var(--color-text-secondary)]">
              Что изменилось у клиента
            </div>
            <p className="mt-1 text-sm font-medium leading-relaxed text-foreground/90">{item.changed}</p>
          </div>
        )}

        <div className="mt-auto pt-2 t-caption italic text-[color:var(--color-text-secondary)]">
          {item.source}
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function CasesBlock({ compactHeader = false }: { compactHeader?: boolean }) {
  const items = visibleCases();
  return (
    <section id="cases" className="stage border-b border-[color:var(--color-line)]">
      <Scene blobs={[{ className: "-right-40 top-10", tone: "chrome", size: 600 }, { className: "-left-40 bottom-10", tone: "chrome", size: 520 }]} />

      <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-24">
        {!compactHeader && (
          <>
            <SectionLabel n="04">Результаты клиентов</SectionLabel>
            <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <RevealHeading className="max-w-3xl font-display text-3xl font-medium leading-tight sm:text-4xl md:text-5xl">
                Кейсы с конкретными метриками
              </RevealHeading>
              <p className="max-w-md text-[color:var(--color-text-secondary)]">
                Реальные проекты: от запусков продуктов до корпоративных программ и MVP ДПО.
              </p>
            </div>
          </>
        )}
        <div className={`grid gap-6 md:grid-cols-2 ${compactHeader ? "" : "mt-14"}`}>
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="h-full scroll-mt-28"
    >
      <GlassCard className="flex h-full flex-col gap-4 p-5 md:p-6">
        <span className="font-display text-3xl leading-none text-[color:var(--color-accent)]">«</span>
        <blockquote className="flex flex-col gap-2.5 text-sm leading-relaxed text-[color:var(--color-text-primary)]">
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
            <div className="font-display text-sm font-bold leading-tight">{r.name}</div>
            <p className="mt-0.5 t-caption text-[color:var(--color-text-secondary)]">{r.role}</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function ReviewsBlock() {
  const items = homeReviews();
  return (
    <section id="reviews" className="stage border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-secondary)]">
      <Scene blobs={[{ className: "-left-40 top-10", tone: "rose", size: 560 }, { className: "-right-40 bottom-10", tone: "chrome", size: 480 }]} />
      <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-24">
        <SectionLabel n="05">Отзывы</SectionLabel>
        <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <RevealHeading className="max-w-3xl font-display text-3xl font-medium leading-tight sm:text-4xl md:text-5xl">
            Что говорят клиенты
          </RevealHeading>
          <p className="max-w-md text-[color:var(--color-text-secondary)]">
            О работе методологов «Без Воды» — дословно.
          </p>
        </div>
        <div className="mt-12 grid items-stretch gap-5 md:grid-cols-3">
          {items.map((r, i) => (
            <ReviewCard key={r.slug} r={r} index={i} />
          ))}
        </div>
        <a
          href="/reviews"
          className="group mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-[color:var(--color-accent)] transition hover:text-foreground"
        >
          Все отзывы
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
    <section id="book" className="stage border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-secondary)]">
      <Scene blobs={[{ className: "-right-40 top-0", tone: "rose", size: 560 }, { className: "-left-40 bottom-0", tone: "chrome", size: 480 }]} />

      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-24">
        <SectionLabel n="07">Методология издана</SectionLabel>
        <div className="mt-14">
          <GlassCard className="overflow-hidden p-0">
            <div className="grid items-stretch gap-0 md:grid-cols-[360px_1fr]">
              {/* Cover */}
              <div className="relative flex items-center justify-center bg-[color:var(--color-chrome)]/10 p-8 md:p-10">
                <motion.div
                  initial={{ opacity: 0, y: 20, rotateY: -8 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                  className="relative w-full max-w-[260px] md:max-w-[300px]"
                  style={{ perspective: 1000 }}
                >
                  <div
                    className="relative aspect-[3/4] w-full overflow-hidden rounded-r-lg rounded-l-md shadow-2xl"
                    style={{
                      boxShadow:
                        "20px 30px 60px -20px rgba(0,0,0,0.4), inset 12px 0 24px rgba(0,0,0,0.15)",
                    }}
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
                  {/* soft glow behind cover */}
                  <div
                    className="pointer-events-none absolute -inset-6 -z-10 rounded-pill blur-3xl"
                    style={{
                      background:
                        "radial-gradient(circle, color-mix(in oklab, var(--color-accent) 45%, transparent), transparent 65%)",
                      opacity: 0.6,
                    }}
                  />
                </motion.div>
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                  className="font-display text-3xl font-medium leading-tight sm:text-4xl md:text-5xl"
                >
                  Книга «Эксперт под ключ»
                </motion.h2>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
                  Как мы извлекаем знания экспертов-практиков и собираем из них
                  образовательные продукты с измеримым результатом — методология
                  команды, изданная книгой. Литрес, 2025.
                </p>
                <a
                  href="https://www.litres.ru/book/viktoriya-utkina/ekspert-pod-kluch-kak-izvlech-i-upakovat-znaniya-dlya-biz-72669850/"
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-8 inline-flex w-max items-center gap-2 text-lg font-semibold text-[color:var(--color-accent)] underline underline-offset-4 transition hover:text-foreground"
                >
                  Читать на Литрес
                  <ExternalLink className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <div className="mt-10 flex flex-wrap gap-3">
                  {["Продуктовая методология", "Извлечение знаний", "Измеримый результат"].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-pill border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-text-primary)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
/* ------------- NotFit («Когда нужен другой подрядчик») + FAQ ------------- */

export function NotFit() {
  const items = [
    "если требуется подбор сотрудника в штат или аутстаффинг",
    "если нужно внедрение или техническая поддержка LMS",
    "если требуется внедрение организационных изменений за пределами образовательного проекта",
    "если нужна организация и логистика мероприятия",
  ];
  return (
    <section id="notfit" className="relative overflow-hidden border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-secondary)]">
      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-24">
        <SectionLabel n="08">Границы</SectionLabel>
        <RevealHeading className="mt-6 max-w-3xl font-display text-3xl font-medium leading-tight sm:text-4xl md:text-5xl">
          Когда нужен другой подрядчик
        </RevealHeading>
        <ul className="mt-10 max-w-3xl divide-y divide-border border-y border-[color:var(--color-line)]">
          {items.map((t) => (
            <li key={t} className="flex items-start gap-4 py-4 text-[15px] leading-relaxed text-[color:var(--color-text-primary)]">
              <span className="mt-1 flex-none font-display text-sm font-bold text-[color:var(--color-accent)]">—</span>
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
            onClick={() => setOpen(isOpen ? null : i)}
            className={`group flex w-full items-start gap-5 px-2 py-5 text-left transition hover:bg-[color:var(--color-surface)] ${isOpen ? "bg-[color:var(--color-surface)]" : ""}`}
          >
            <span className={`mt-1 font-display text-sm font-bold tabular-nums transition ${isOpen ? "text-[color:var(--color-accent)]" : "text-[color:var(--color-text-secondary)] group-hover:text-foreground"}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1">
              <div className={`font-display text-lg font-bold transition ${isOpen ? "text-foreground" : "text-[color:var(--color-text-primary)] group-hover:text-foreground"}`}>
                {item.q}
              </div>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                    className="mt-2 overflow-hidden text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-[15px]"
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
  const [pd, setPd] = useState(false);
  const [ads, setAds] = useState(false);

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
    if (!name || !contact) {
      setErr("Заполните имя и контакт — иначе нам некуда ответить.");
      return;
    }
    if (!pd) {
      setErr("Чтобы отправить заявку, отметьте согласие на обработку персональных данных.");
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
          consent_ads: ads,
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
    <section id="contact" className="stage sec-dark">
      <Scene blobs={[{ className: "-left-40 top-0", tone: "rose", size: 560 }, { className: "right-1/4 top-1/3", tone: "rose", size: 360 }]} />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-4 py-14 md:px-6 md:py-24 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="flex items-center gap-4 t-eyebrow text-[color:var(--color-text-inverse-2)]">
            <span className="font-display text-sm font-bold tabular-nums text-[color:var(--color-accent-glass)]">10</span>
            <span className="h-px w-10 bg-background/25" />
            <span>Контакты</span>
          </div>
          <RevealHeading as={asH1 ? "h1" : "h2"} className="mt-6 font-display text-3xl font-medium leading-[1.05] sm:text-4xl md:text-6xl">
            С чего начинается наше сотрудничество
          </RevealHeading>
          <p className="mt-8 max-w-md text-lg text-[color:var(--color-text-inverse-2)]">
            Расскажите, что должно измениться в работе компании и к какому
            сроку. Готовить презентацию и подробное ТЗ не нужно.
          </p>
          <p className="mt-4 max-w-md text-base text-[color:var(--color-text-inverse-2)]">
            30 минут онлайн: сверим задачу, доступные источники опыта и
            возможный результат первого этапа.
          </p>
          <p className="mt-4 max-w-md text-base text-[color:var(--color-text-inverse-2)]">
            Готовитесь выступать на конференции для HR или T&D? Поможем собрать
            выступление — бесплатно. Напишите об этом в заявке.
          </p>

          <div className="mt-12">
            <StencilLogo className="text-[18px] text-background" />
          </div>
        </div>

        <GlassCard dark className="p-8 md:p-10">
        <form
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
                className="flex min-h-[420px] flex-col items-start justify-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-pill border border-[color:var(--color-line-dark)] bg-white/10 text-background">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-3xl font-bold text-background">
                  {sentName ? `Спасибо, ${sentName}!` : "Заявка отправлена"}
                </h3>
                <p className="mt-3 text-[color:var(--color-text-inverse-2)]">
                  Заявка отправлена. Ответим в течение двух рабочих часов.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-8 text-sm font-semibold text-[color:var(--color-text-inverse)] underline-offset-4 hover:text-background hover:underline"
                >
                  Отправить ещё одну заявку
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-5"
              >
                <Field label="Ваше имя" name="name" placeholder="Ирина" dark />
                <Field label="Компания и роль" name="company" placeholder="Avito, HRD / L&D" dark />
                <Field label="Email / Telegram / телефон" name="contact" placeholder="name@company.ru" dark />
                <div>
                  <label className="t-label mb-2 block text-[color:var(--color-text-inverse-2)]">
                    Запрос на разбор <span className="text-[color:var(--color-text-inverse-2)] normal-case tracking-normal">(не обязательно)</span>
                  </label>
                  <textarea
                    rows={3}
                    name="about"
                    placeholder="Не обязательно"
                    className="w-full resize-none rounded-sm border border-[color:var(--color-line-dark)] bg-white/5 px-4 py-3 text-base text-background outline-none transition placeholder:text-background/35 focus:border-background/40 focus:bg-white/10"
                  />
                </div>
                <p className="hidden" aria-hidden="true">
                  <label>
                    Не заполняйте это поле
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-[color:var(--color-text-inverse-2)]">
                  <input
                    type="checkbox"
                    checked={pd}
                    onChange={(e) => setPd(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-accent)]"
                  />
                  <span>
                    Нажимая кнопку, вы соглашаетесь на обработку персональных данных —{" "}
                    <a href="/consent_pd" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-background">условия</a>{" "}
                    и{" "}
                    <a href="/politics_pd" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-background">политика конфиденциальности</a>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-[color:var(--color-text-inverse-2)]">
                  <input
                    type="checkbox"
                    checked={ads}
                    onChange={(e) => setAds(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-accent)]"
                  />
                  <span>Хочу получать новости и предложения «Без Воды» (необязательно)</span>
                </label>
                {err && (
                  <p className="rounded-sm border border-[color:var(--color-accent)]/40 bg-[color:var(--color-accent)]/15 px-4 py-3 text-sm text-[color:var(--color-text-inverse)]">
                    {err}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="group relative mt-4 inline-flex items-center justify-center gap-3 overflow-hidden rounded-pill border border-[color:var(--color-line-dark)] bg-white/10 px-7 py-4 text-base font-semibold text-background transition hover:border-background/50 hover:bg-background/20 disabled:cursor-default disabled:opacity-60"
                >
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 to-transparent opacity-60" />
                  <span className="relative">{sending ? "Отправляем…" : "Назначить разбор"}</span>
                  <ArrowUpRight className="relative h-5 w-5 transition group-hover:rotate-45" />
                </button>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-[color:var(--color-text-inverse-2)]">Ответим в течение двух рабочих часов.</p>
                  <a
                    href="https://t.me/vikki_duck"
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-text-inverse)] transition hover:text-background"
                  >
                    Спросить в Telegram
                    <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
        </GlassCard>

      </div>
    </section>
  );
}
