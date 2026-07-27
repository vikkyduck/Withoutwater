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
  SectionLabel, GlassCard, LiquidOrb, LiquidDrop, AmbientHalo,
  MeetingSpheres, RevealHeading, Field, StencilLogo,
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
    <section id="top" className="relative overflow-hidden border-b border-border/60">
      <MeetingSpheres className="hidden md:block" />
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
      <AmbientHalo className="-right-40 -top-20" color="var(--lav)" size={520} opacity={0.14} />
      <AmbientHalo className="-left-40 bottom-0" color="oklch(0.85 0.02 260)" size={560} opacity={0.10} />
      <LiquidOrb size={320} className="right-[24px] top-16 hidden opacity-80 lg:block" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-14 pt-12 md:px-8 md:pb-20 md:pt-24">
        {/* Центральная история (разбор 26.07): стандартом становится не
            результат, а СПОСОБ работы. Подзаголовок держит внутреннюю и
            внешнюю экспертизу в одном механизме. */}
        <RevealHeading as="h1" className="max-w-3xl font-display text-[30px] font-extrabold leading-[1.12] tracking-[-0.03em] sm:text-[42px] sm:leading-[1.08] md:max-w-4xl md:text-[52px] md:leading-[1.04]">
          Практика сильнейшего сотрудника становится{" "}
          <span className="text-[color:var(--red)]">стандартом всей команды</span>
        </RevealHeading>

        <div className="mt-5 max-w-2xl border-l-[3px] border-[color:var(--red)] bg-[color:var(--red)]/5 pl-4 py-2 md:mt-7 md:pl-5 md:py-2.5">
          <p className="text-[16px] font-medium leading-[1.5] text-foreground md:text-[19px]">
            Выделяем решения, которые дают результат, проверяем их и переводим
            в алгоритмы, стандарты, кейсы и материалы. Если нужной практики нет
            внутри — находим её на рынке и адаптируем под контекст компании.
          </p>
        </div>

        {/* Два аргумента — компактной строкой. */}
        <div className="mt-8 grid max-w-2xl gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 md:mt-10">
          {[
            ["Без ТЗ", "Принимаем вводные в любом виде и собираем из них архитектуру решения и план работ"],
            ["24 часа", "После согласования назначаем команду и проводим стартовую встречу"],
          ].map(([label, desc]) => (
            <div key={label} className="bg-background/70 px-5 py-5 md:px-6">
              <div className="font-display text-[17px] font-bold leading-none tracking-[-0.02em] md:text-[19px]">
                {label}
              </div>
              <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground md:text-[14px]">
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 md:mt-12">
          <a
            href="#contact"
            className="group relative inline-flex w-full items-center justify-center gap-3 rounded-full bg-[color:var(--red)] px-7 py-4 text-[14px] font-semibold tracking-wide text-background transition-all duration-500 hover:bg-foreground sm:w-auto sm:px-8 sm:py-[18px] sm:text-[15px]"
            style={{ boxShadow: "0 1px 0 0 rgba(255,255,255,0.15) inset, 0 12px 32px -12px color-mix(in oklab, var(--red) 55%, transparent)" }}
          >
            <span>{CTA_LABEL}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </a>
          <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
            <span className="h-1 w-1 shrink-0 rounded-full bg-[color:var(--red)]" />
            <span>{CTA_NOTE}</span>
          </div>
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
    <section className="relative overflow-hidden border-b border-border bg-secondary/30">
      <div className="relative mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
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
              className="group relative flex min-h-[108px] flex-col justify-between rounded-2xl border border-border bg-background/75 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--red)]/35 md:min-h-[124px] md:p-6"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-display text-[16px] font-extrabold leading-tight tracking-[-0.01em] text-foreground/85 transition group-hover:text-foreground md:text-[19px]">
                  {b.name}
                </span>
                {b.year && (
                  <span className="shrink-0 rounded-full border border-border/70 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
                    {b.year}
                  </span>
                )}
              </div>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition group-hover:text-[color:var(--red)]">
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
    <section id="demo" className="relative overflow-hidden border-b border-border">
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
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          <span className="h-px w-8 bg-foreground/25" />
          <span>Наш опыт в цифрах</span>
        </div>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-6">
          {items.map(([n, d]) => (
            <div key={n} className="relative pt-6">
              <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-foreground/15" />
              <span aria-hidden className="absolute left-0 top-0 h-px w-10 bg-[color:var(--red)]" />
              <div className="font-display text-5xl font-extrabold leading-none tabular-nums tracking-[-0.02em] md:text-[64px]">{n}</div>
              <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-xl text-xs leading-relaxed text-muted-foreground/70">
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
    <section id="production" className="relative overflow-hidden border-b border-border bg-[color:var(--lav-soft)]/45">
      <AmbientHalo className="-right-40 top-10" color="var(--lav)" size={520} opacity={0.2} />
      <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-24">
        <SectionLabel n="02">Производство</SectionLabel>
        <RevealHeading className="mt-6 max-w-4xl font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
          Как устроено наше производство
        </RevealHeading>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
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
              className="rounded-2xl border border-border bg-background/70 p-6"
            >
              <div className="font-display text-xl font-extrabold tracking-tight md:text-2xl">{t}</div>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground md:text-[15px]">{d}</p>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-muted-foreground/70">
          * Типовой курс — программа стандартной структуры на подготовленной
          фактуре заказчика, без исследовательского этапа и продуктовой разработки
          с нуля.
        </p>
        <a
          href="/for-your-boss"
          className="group mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-[color:var(--red)] transition hover:text-foreground"
        >
          Аргументы для вашего руководителя
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
    },
    {
      t: "Запустить больше инициатив без расширения постоянного штата",
      d: "Чтобы внутренний L&D сохранил управление портфелем, а производство не стало ограничением",
    },
    {
      t: "Быстро привнести практику, которой пока нет внутри",
      d: "Чтобы команда получила проверенный способ работы быстрее найма и самостоятельного поиска",
    },
  ];
  return (
    <section id="when" className="relative overflow-hidden border-b border-border">
      <AmbientHalo className="-left-40 top-10" color="var(--lav)" size={520} opacity={0.18} />
      <LiquidDrop size={56} className="right-[5%] top-[140px] hidden md:block" tone="red" delay={0.6} duration={11} />
      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-24">
        <SectionLabel n="01">Когда к нам обращаются</SectionLabel>
        <RevealHeading className="mt-6 max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
          Когда нужна команда «Без Воды»
        </RevealHeading>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
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
              <GlassCard className="h-full p-6 md:p-8">
                <div className="font-display text-sm font-bold tabular-nums text-[color:var(--red)]">
                  0{i + 1}
                </div>
                <h3 className="mt-3 font-display text-base font-extrabold leading-snug md:text-lg">
                  {c.t}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                  {c.d}
                </p>
              </GlassCard>
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
    <section className="relative overflow-hidden border-b border-border bg-secondary/30">
      <AmbientHalo className="-left-40 top-10" color="var(--lav)" size={420} opacity={0.10} />
      <AmbientHalo className="-right-56 bottom-10" color="var(--red-glow)" size={360} opacity={0.06} />
      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-24">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Схема взаимодействия
        </div>
        <h2 className="mt-4 max-w-3xl font-display text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">
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
                "linear-gradient(to right, transparent, color-mix(in oklab, var(--red) 55%, transparent), transparent)",
            }}
          />
          {stages.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1 }}
              className="relative flex items-start gap-5 rounded-3xl border border-border bg-background/80 p-6 backdrop-blur-sm md:p-7"
            >
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full border border-[color:var(--red)]/40 bg-[color:var(--red)]/10 font-display text-sm font-extrabold tracking-tight text-[color:var(--red)]">
                {s.n}
              </span>
              <div className="min-w-0">
                <div className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                  {s.t}
                </div>
                <div className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
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
                "linear-gradient(to bottom, color-mix(in oklab, var(--red) 45%, transparent), transparent)",
            }}
          />
          {/* Точка развилки */}
          <div className="relative mx-auto -mt-1 flex h-6 w-6 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[color:var(--red)]/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--red)]" />
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
                <stop offset="0%" stopColor="var(--red)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="var(--red)" stopOpacity="0.15" />
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
          <div className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground md:mt-2">
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
                className="group relative overflow-hidden rounded-3xl border border-border bg-background/80 p-6 backdrop-blur-sm md:p-8"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[2px]"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, color-mix(in oklab, var(--red) 65%, transparent), transparent)",
                  }}
                />
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[color:var(--red)]" />
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {b.tag}
                  </div>
                </div>
                <div className="mt-6 flex items-baseline gap-3">
                  <div className="font-display text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                    {b.time}
                  </div>
                </div>
                <div className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
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
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--red)]">
            {item.category}
          </div>
          {item.nda && (
            <span className="shrink-0 rounded-full border border-border/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              NDA
            </span>
          )}
        </div>

        <div>
          <h3 className="font-display text-2xl font-bold leading-tight">{item.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-medium text-foreground/80 transition hover:text-[color:var(--red)]"
              >
                {item.client}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span className="font-medium text-foreground/80">{item.client}</span>
            )}
            <span className="hidden text-border sm:inline">·</span>
            <span>{item.role}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
          {item.metrics.map(([value, label]) => (
            <div
              key={label}
              className="flex min-w-0 flex-col items-center rounded-xl border border-border/60 bg-secondary/40 px-2 py-3 text-center backdrop-blur-sm transition group-hover:border-[color:var(--red)]/20 group-hover:bg-secondary/70"
            >
              <div className="w-full font-display font-extrabold leading-[1.05] tracking-tight text-[color:var(--red)] text-[clamp(0.95rem,2.2vw,1.35rem)] [overflow-wrap:anywhere] hyphens-none">
                {value}
              </div>
              <div className="mt-1 text-[9px] font-medium uppercase leading-tight tracking-wider text-muted-foreground sm:text-[10px] [overflow-wrap:anywhere]">
                {label}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Что сделано
          </div>
          <ul className="space-y-1.5 text-sm leading-relaxed text-foreground/80">
            {item.done.map((d) => (
              <li key={d} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[color:var(--red)]" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        {item.changed && (
          <div className="rounded-xl border-l-[3px] border-[color:var(--red)] bg-[color:var(--red)]/5 px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Что изменилось у клиента
            </div>
            <p className="mt-1 text-sm font-medium leading-relaxed text-foreground/90">{item.changed}</p>
          </div>
        )}

        <div className="mt-auto pt-2 text-xs italic leading-relaxed text-muted-foreground/80">
          {item.source}
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function CasesBlock({ compactHeader = false }: { compactHeader?: boolean }) {
  const items = visibleCases();
  return (
    <section id="cases" className="relative overflow-hidden border-b border-border">
      <AmbientHalo className="-right-40 top-10" color="oklch(0.72 0.008 260)" size={600} opacity={0.14} />
      <AmbientHalo className="-left-40 bottom-10" color="oklch(0.82 0.02 260)" size={520} opacity={0.12} />
      <LiquidDrop size={76} className="left-[5%] top-[120px] hidden md:block" tone="chrome" delay={0.4} duration={13} />
      <LiquidDrop size={44} className="right-[8%] top-[260px] hidden md:block" tone="red" delay={1.0} duration={10} />

      <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-24">
        {!compactHeader && (
          <>
            <SectionLabel n="04">Результаты клиентов</SectionLabel>
            <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <RevealHeading className="max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
                Кейсы с конкретными метриками
              </RevealHeading>
              <p className="max-w-md text-muted-foreground">
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
        <span className="font-display text-3xl leading-none text-[color:var(--red)]">«</span>
        <blockquote className="flex flex-col gap-2.5 text-sm leading-relaxed text-foreground/85">
          {r.text.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </blockquote>
        <div className="mt-auto flex items-center gap-3 border-t border-border/70 pt-4">
          <div className="size-11 shrink-0 overflow-hidden rounded-full border border-border/70 bg-secondary">
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
            <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{r.role}</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function ReviewsBlock() {
  const items = homeReviews();
  return (
    <section id="reviews" className="relative overflow-hidden border-b border-border bg-[color:var(--lav-soft)]/45">
      <AmbientHalo className="-left-40 top-10" color="var(--lav)" size={560} opacity={0.22} />
      <AmbientHalo className="-right-40 bottom-10" color="oklch(0.85 0.02 260)" size={480} opacity={0.12} />
      <LiquidDrop size={70} className="right-[6%] top-[140px] hidden md:block" tone="red" delay={0.4} duration={12} />
      <LiquidDrop size={42} className="left-[5%] bottom-[110px] hidden md:block" tone="chrome" delay={1.0} duration={10} />
      <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-24">
        <SectionLabel n="05">Отзывы</SectionLabel>
        <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <RevealHeading className="max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            Что говорят клиенты
          </RevealHeading>
          <p className="max-w-md text-muted-foreground">
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
          className="group mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-[color:var(--red)] transition hover:text-foreground"
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
    <section id="book" className="relative overflow-hidden border-b border-border bg-[color:var(--lav-soft)]/45">
      <AmbientHalo className="-right-40 top-0" color="var(--lav)" size={560} opacity={0.2} />
      <AmbientHalo className="-left-40 bottom-0" color="oklch(0.85 0.02 260)" size={480} opacity={0.12} />
      <LiquidDrop size={72} className="left-[6%] top-[120px] hidden md:block" tone="red" delay={0.4} duration={12} />
      <LiquidDrop size={44} className="right-[8%] bottom-[100px] hidden md:block" tone="chrome" delay={1.0} duration={10} />

      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-24">
        <SectionLabel n="07">Методология издана</SectionLabel>
        <div className="mt-14">
          <GlassCard className="overflow-hidden p-0">
            <div className="grid items-stretch gap-0 md:grid-cols-[360px_1fr]">
              {/* Cover */}
              <div className="relative flex items-center justify-center bg-[color:var(--lav)]/10 p-8 md:p-10">
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
                    className="pointer-events-none absolute -inset-6 -z-10 rounded-full blur-3xl"
                    style={{
                      background:
                        "radial-gradient(circle, color-mix(in oklab, var(--red) 45%, transparent), transparent 65%)",
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
                  className="font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl"
                >
                  Книга «Эксперт под ключ»
                </motion.h2>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  Как мы извлекаем знания экспертов-практиков и собираем из них
                  образовательные продукты с измеримым результатом — методология
                  команды, изданная книгой. Литрес, 2025.
                </p>
                <a
                  href="https://www.litres.ru/book/viktoriya-utkina/ekspert-pod-kluch-kak-izvlech-i-upakovat-znaniya-dlya-biz-72669850/"
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-8 inline-flex w-max items-center gap-2 text-lg font-semibold text-[color:var(--red)] underline underline-offset-4 transition hover:text-foreground"
                >
                  Читать на Литрес
                  <ExternalLink className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <div className="mt-10 flex flex-wrap gap-3">
                  {["Продуктовая методология", "Извлечение знаний", "Измеримый результат"].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur-sm"
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
    <section id="notfit" className="relative overflow-hidden border-b border-border bg-secondary/40">
      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-24">
        <SectionLabel n="08">Границы</SectionLabel>
        <RevealHeading className="mt-6 max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
          Когда нужен другой подрядчик
        </RevealHeading>
        <ul className="mt-10 max-w-3xl divide-y divide-border border-y border-border">
          {items.map((t) => (
            <li key={t} className="flex items-start gap-4 py-4 text-[15px] leading-relaxed text-foreground/85">
              <span className="mt-1 flex-none font-display text-sm font-bold text-[color:var(--red)]">—</span>
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
    <div className="mt-10 max-w-3xl divide-y divide-border border-y border-border">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <button
            key={item.q}
            onClick={() => setOpen(isOpen ? null : i)}
            className={`group flex w-full items-start gap-5 px-2 py-5 text-left transition hover:bg-background/70 ${isOpen ? "bg-background/60" : ""}`}
          >
            <span className={`mt-1 font-display text-sm font-bold tabular-nums transition ${isOpen ? "text-[color:var(--red)]" : "text-muted-foreground group-hover:text-foreground"}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1">
              <div className={`font-display text-lg font-bold transition ${isOpen ? "text-foreground" : "text-foreground/85 group-hover:text-foreground"}`}>
                {item.q}
              </div>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                    className="mt-2 overflow-hidden text-sm leading-relaxed text-muted-foreground md:text-[15px]"
                  >
                    {item.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }} className="mt-1">
              <Plus className="h-4 w-4 text-muted-foreground" />
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
    <section id="contact" className="relative overflow-hidden bg-foreground text-background">
      <AmbientHalo className="-left-40 top-0" color="var(--red)" size={560} opacity={0.28} />
      <AmbientHalo className="right-1/4 top-1/3" color="var(--red-glow)" size={360} opacity={0.22} />
      <LiquidDrop size={96} className="right-[8%] top-[140px] hidden md:block" tone="red" delay={0.3} duration={13} />
      <LiquidDrop size={58} className="right-[28%] bottom-[120px] hidden md:block" tone="chrome" delay={1.1} duration={11} />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-4 py-14 md:px-6 md:py-24 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-background/60">
            <span className="font-display text-sm font-bold tabular-nums text-[color:var(--red-bright)]">10</span>
            <span className="h-px w-10 bg-background/25" />
            <span>Контакты</span>
          </div>
          <RevealHeading as={asH1 ? "h1" : "h2"} className="mt-6 font-display text-3xl font-extrabold leading-[1.05] sm:text-4xl md:text-6xl">
            С чего начинается наше сотрудничество
          </RevealHeading>
          <p className="mt-8 max-w-md text-lg text-background/70">
            Расскажите, что должно измениться в работе компании и к какому
            сроку. Готовить презентацию и подробное ТЗ не нужно.
          </p>
          <p className="mt-4 max-w-md text-base text-background/60">
            30 минут онлайн: сверим задачу, доступные источники опыта и
            возможный результат первого этапа.
          </p>
          <p className="mt-4 max-w-md text-base text-background/60">
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
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-background/20 bg-background/10 text-background backdrop-blur">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-3xl font-bold text-background">
                  {sentName ? `Спасибо, ${sentName}!` : "Заявка отправлена"}
                </h3>
                <p className="mt-3 text-background/70">
                  Заявка отправлена. Ответим в течение двух рабочих часов.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-8 text-sm font-semibold text-background/80 underline-offset-4 hover:text-background hover:underline"
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
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-background/60">
                    Запрос на разбор <span className="text-background/40 normal-case tracking-normal">(не обязательно)</span>
                  </label>
                  <textarea
                    rows={3}
                    name="about"
                    placeholder="Не обязательно"
                    className="w-full resize-none rounded-xl border border-background/15 bg-background/5 px-4 py-3 text-base text-background outline-none backdrop-blur transition placeholder:text-background/35 focus:border-background/40 focus:bg-background/10"
                  />
                </div>
                <p className="hidden" aria-hidden="true">
                  <label>
                    Не заполняйте это поле
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-background/60">
                  <input
                    type="checkbox"
                    checked={pd}
                    onChange={(e) => setPd(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--red)]"
                  />
                  <span>
                    Нажимая кнопку, вы соглашаетесь на обработку персональных данных —{" "}
                    <a href="/consent_pd" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-background">условия</a>{" "}
                    и{" "}
                    <a href="/politics_pd" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-background">политика конфиденциальности</a>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-background/60">
                  <input
                    type="checkbox"
                    checked={ads}
                    onChange={(e) => setAds(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--red)]"
                  />
                  <span>Хочу получать новости и предложения «Без Воды» (необязательно)</span>
                </label>
                {err && (
                  <p className="rounded-xl border border-[color:var(--red)]/40 bg-[color:var(--red)]/15 px-4 py-3 text-sm text-background/90">
                    {err}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="group relative mt-4 inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-background/25 bg-background/10 px-7 py-4 text-base font-semibold text-background backdrop-blur-xl transition hover:border-background/50 hover:bg-background/20 disabled:cursor-default disabled:opacity-60"
                >
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 to-transparent opacity-60" />
                  <span className="relative">{sending ? "Отправляем…" : "Назначить разбор"}</span>
                  <ArrowUpRight className="relative h-5 w-5 transition group-hover:rotate-45" />
                </button>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-background/50">Ответим в течение двух рабочих часов.</p>
                  <a
                    href="https://t.me/vikki_duck"
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm font-semibold text-background/80 transition hover:text-background"
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
