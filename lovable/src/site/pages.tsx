/* ============================================================================
   pages.tsx — страницы многостраничника и карта маршрутов (финальная
   структура от 02.08): главная (облегчённая), хаб /tasks, три продуктовые
   страницы + три подстраницы эффекта + общий /business-effect (все — в
   pages-effect.tsx), кейсы, отзывы, команда, как мы работаем, FAQ, контакты.
   /for-your-boss закрыт: 301 на /business-effect (nginx).
   ========================================================================== */
import type { ReactElement } from "react";
import {
  motion,
  ArrowUpRight, ArrowRight, ArrowDown, Check,
  PageShell, PageHead, SectionLabel, PaperCard, Scene, CtaBand,
  RevealHeading, NodeBullet, NodeList, NodeScene, Stencil, CatMark, Swash, HandArrow, LineIcon,
  reveal,
} from "./core";
import {
  Hero, Bricks, WhenNeeded, NumbersBand, Flow,
  CasesBlock, ReviewsBlock, ReviewCard, BookSection, NotFit, Contact,
  FaqAccordion,
} from "./blocks";
import { FAQ_ITEMS, TEAM, FOUNDER_WORDS, visibleReviews, SITUATIONS } from "./data";
import {
  BE,
  BusinessEffectGeneralPage,
  InternalExpertsPage, InternalExpertsEffectPage,
  TeamSubscriptionPage, TeamSubscriptionEffectPage,
  ExternalExpertsPage, ExternalExpertsEffectPage,
} from "./pages-effect";

/* -------------------------------- Главная -------------------------------- */

function HomePage() {
  return (
    <PageShell path="/">
      <Hero />
      <WhenNeeded />
      {/* «Схема взаимодействия» убрана с главной (финальная структура 02.08),
          блок остаётся на /how-we-work */}
      <CasesBlock />
      <ReviewsBlock />
      <NumbersBand />
      <Bricks />
      <BookSection />
      <NotFit />
      <Contact />
    </PageShell>
  );
}

/* --------------------------- Задачи и решения ----------------------------- */
/* Хаб (финальная структура 02.08): три карточки-входа — заголовок ситуации,
   текст ситуации, «Как решаем: …» и кнопка «Подробнее» на продуктовую
   страницу. Ничего больше: развёрнутые решения живут на продуктовых
   страницах. Старые якоря #practice/#capacity/#external перенаправляются
   скриптом (main.tsx → TASKS_HASH_REDIRECTS). */

function TasksPage() {
  return (
    <PageShell path="/tasks">
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-right-40 top-[30%]", tone: "rose", size: 480 }, { className: "-left-52 bottom-[10%]", tone: "chrome", size: 520 }]} />
        <PageHead
          kicker="Задачи и решения"
          title={<>Какие ваши задачи готовы взять на&nbsp;себя</>}
          lead="Три типовые ситуации T&D-команд и то, чем мы закрываем каждую из них: от оцифровки внутренних практик до подключения внешних экспертов."
          chips={[
            ["Без ТЗ", "приходите с задачей — рамку проекта соберём вместе"],
            ["7–14 дней", "срок, за который закрываем дефицит компетенции рыночной практикой"],
          ]}
        />

        {/* Три карточки-входа (жидкое стекло на тёмном) */}
        <div className="sec-dark grain relative">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(90% 70% at 20% 0%, rgba(233,196,189,0.16), transparent 60%)," +
                  "radial-gradient(70% 60% at 88% 100%, rgba(201,205,212,0.10), transparent 62%)",
              }}
            />
            <NodeScene className="text-[color:var(--color-text-inverse-2)]" opacity={0.26} />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <div className="grid gap-5 md:grid-cols-3">
              {SITUATIONS.map((it, i) => (
                <motion.a
                  key={it.id}
                  href={it.href}
                  {...reveal(i)}
                  className="card-link surface-dark group flex h-full flex-col rounded-md p-6 md:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="font-display t-label font-bold tabular-nums text-[color:var(--color-accent-soft,#E9C4BD)]">
                      0{i + 1}
                    </div>
                    <span
                      aria-hidden
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-pill border border-[color:var(--color-line-dark)] text-[color:var(--color-text-inverse)]"
                    >
                      <ArrowRight data-arrow className="h-4 w-4" />
                    </span>
                  </div>
                  <h2 className="t-body mt-3 font-display text-[color:var(--color-text-inverse)] [overflow-wrap:break-word]">
                    {it.situation}
                  </h2>
                  <p className="mt-4 t-body text-[color:var(--color-text-inverse-2)]">{it.detail}</p>
                  <p className="mt-4 t-body font-semibold text-[color:var(--color-text-inverse)]">
                    Как решаем: {it.solutionTitle}
                  </p>
                  <span className="mt-auto block pt-6">
                    <span className="btn btn-invert w-max">
                      Подробнее
                      <ArrowRight data-arrow className="h-4 w-4" />
                    </span>
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CtaBand path="/tasks" />
    </PageShell>
  );
}

/* --------------------------------- Кейсы ---------------------------------- */

function CasesPage() {
  return (
    <PageShell path="/cases">
      <section className="stage">
        <Scene blobs={[{ className: "-left-40 top-1/3", tone: "chrome", size: 480 }]} />
        <PageHead
          kicker="Кейсы"
          title={<>Что мы уже сделали</>}
          lead="Корпоративные проекты и запуски под NDA: что сделали, как посчитали результат и что изменилось в работе заказчика."
          chips={[
            ["Считаем результат", "каждый кейс — с метрикой, а не с описанием процесса"],
            ["Проекты под NDA", "часть работ показываем только с письменного согласия"],
          ]}
        />
      </section>
      <CasesBlock compactHeader />
      <section className="relative border-b border-[color:var(--color-line)]">
        <div className="mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <p className="max-w-2xl t-body text-[color:var(--color-text-secondary)]">
            Готовим к публикации кейсы проектов с Авито, ВкусВилл, Beyond Taylor,
            Global Creative Hub, McDonald's (2021) и World Class — пока
            почитайте, <a href="/reviews" className="font-semibold text-[color:var(--color-accent)] underline underline-offset-2 hover:text-foreground">что говорят сами клиенты</a>.
          </p>
        </div>
      </section>
      <CtaBand path="/cases" />
    </PageShell>
  );
}

/* -------------------------------- Отзывы ----------------------------------- */

function ReviewsPage() {
  const items = visibleReviews();
  return (
    <PageShell path="/reviews">
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-left-40 top-10", tone: "rose", size: 560 }]} />
        <PageHead
          kicker="Отзывы"
          title={<>Что говорят клиенты</>}
          lead="Дословно, без редактуры — мы не переписываем то, что нам написали."
          chips={[
            ["Без правок", "публикуем ровно то, что написали клиенты"],
            ["Проекты под NDA", "часть работ не показываем — только с письменного согласия"],
          ]}
        />
        <div className="relative mx-auto max-w-7xl px-5 sec-pad-b md:px-8">
          <div className="mt-8 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((r, i) => (
              <ReviewCard key={r.slug} r={r} index={i} />
            ))}
          </div>
        </div>
      </section>
      <CtaBand path="/reviews" />
    </PageShell>
  );
}

/* ------------------------ Команда и сеть экспертов ------------------------- */

function TeamPage() {
  const founder = TEAM.find((p) => p.founder)!;
  const others = TEAM.filter((p) => !p.founder);
  const network: [string, string][] = [
    ["Отбор до подключения", "Каждый практик проходит проверку опыта до того, как попадает в проект: что именно человек делал руками и какие результаты за этим стоят. Механику отбора описали в книге «Эксперт под ключ»."],
    ["Один договор", "Вы не ведёте переговоры с каждым специалистом: договор один — с командой «Без Воды», координация и договорённости на нашей стороне."],
    ["Методолог рядом с практиком", "Практик отвечает за опыт, методолог — за то, чтобы опыт превратился в применимый материал: структуру, задания, проверку знаний."],
  ];
  return (
    <PageShell path="/team">
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-right-40 top-0", tone: "rose", size: 520 }]} />
        <PageHead
          kicker="О нас"
          title={<>Команда и сеть экспертов</>}
          lead="Люди, которые отвечают за результат вашего проекта, и профессиональная сеть практиков за ними."
          chips={[
            ["Отбор до подключения", "проверяем опыт практика до того, как он попадает в проект"],
            ["72 часа", "представляем первые релевантные профили под вашу задачу"],
          ]}
        />

        {/* Карточка владелицы + слова от первого лица */}
        <div className="relative mx-auto max-w-7xl px-5 sec-pad-b md:px-8">
          <PaperCard className="mt-8 overflow-hidden p-0">
            <div className="grid items-stretch md:grid-cols-[320px_1fr]">
              <div className="relative min-h-[320px] bg-[color:var(--color-chrome)]/10 md:min-h-0">
                <img
                  src={founder.photo}
                  alt={founder.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-top grayscale"
                />
              </div>
              <div className="p-7 md:p-10">
                <div className="t-eyebrow text-[color:var(--color-accent)]">
                  Основатель
                </div>
                <h2 className="mt-2 font-display t-body font-medium">{founder.name}</h2>
                <p className="mt-1 t-body text-[color:var(--color-text-secondary)]">{founder.role} · {founder.fact}</p>
                <div className="mt-6 flex flex-col gap-3.5 border-l-[3px] border-[color:var(--color-accent)] pl-4 md:pl-5">
                  {FOUNDER_WORDS.map((p) => (
                    <p key={p} className="t-body text-[color:var(--color-text-primary)]">{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </PaperCard>

          {/* Три лица команды */}
          <div className="mt-10 grid items-stretch gap-5 sm:grid-cols-3">
            {others.map((p, i) => (
              <motion.div
                key={p.slug}
                {...reveal(i)}
                className="h-full"
              >
                <PaperCard className="flex h-full flex-col overflow-hidden p-0">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[color:var(--color-bg-secondary)]">
                    <img
                      src={p.photo}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-top grayscale transition duration-500 hover:grayscale-0"
                    />
                  </div>
                  <div className="p-6">
                    <div className="font-display t-body font-bold">{p.name}</div>
                    <p className="mt-1 t-caption font-medium uppercase tracking-wide text-[color:var(--color-text-secondary)]">{p.role}</p>
                    <p className="mt-3 t-body text-[color:var(--color-text-primary)]">{p.fact}</p>
                  </div>
                </PaperCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Как устроена сеть */}
        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <SectionLabel n="01">Сеть экспертов</SectionLabel>
          <RevealHeading className="t-h2 mt-6 max-w-3xl">
            Как устроена профессиональная сеть команды
          </RevealHeading>
          <div className="mt-10 grid items-stretch gap-8 md:grid-cols-3 md:gap-10">
            {network.map(([t, d]) => (
              <PaperCard key={t} className="h-full p-6">
                <div className="font-display t-body font-bold">{t}</div>
                <p className="mt-3 t-body text-[color:var(--color-text-secondary)]">{d}</p>
              </PaperCard>
            ))}
          </div>
          <p className="mt-10 max-w-2xl t-body text-[color:var(--color-text-secondary)]">
            Фотографии и имена экспертов сети мы не публикуем: у многих действуют
            соглашения о неразглашении с работодателями, а прямой контакт в обход
            проектной рамки обесценил бы работу для всех сторон. На проекте вы
            знакомитесь с экспертами лично.
          </p>
        </div>
      </section>
      <BookSection />
      <CtaBand path="/team" />
    </PageShell>
  );
}

/* ----------------------------- Как мы работаем ----------------------------- */

function HowWeWorkPage() {
  const guarantees: [string, string][] = [
    ["Критерии приёмки — до старта", "объём работ, этапы, сроки и критерии приёмки фиксируются до начала работы"],
    ["Доработка без доплаты", "если результат этапа не соответствует согласованным критериям — дорабатываем за свой счёт"],
    ["Этап с самостоятельным результатом", "первый этап завершается моделью решения и дорожной картой; продолжать можно с нами или своими силами"],
    ["Конфиденциальность", "NDA; обезличенные фрагменты — только с письменного согласия; часть проектов не показываем вовсе"],
  ];
  return (
    <PageShell path="/how-we-work">
      <section className="stage">
        <Scene blobs={[{ className: "-right-44 top-1/4", tone: "chrome", size: 520 }]} />
        <PageHead
          kicker="Как мы работаем"
          title={<>Один договор. Одна команда. Одна точка ответственности.</>}

          lead="Принцип одного окна: всю дальнейшую работу с пулом разных экспертов мы забираем на себя — для вас процесс остаётся бесшовным."
          chips={[
            ["2 рабочих часа", "отвечаем на заявку и предлагаем время разбора"],
            ["Доработка без доплаты", "если результат этапа не совпал с критериями приёмки"],
          ]}
        />
      </section>
      <Flow />
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-left-40 top-0", tone: "rose", size: 460 }]} />
        <div className="relative z-10 mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <div className="t-eyebrow text-[color:var(--color-text-secondary)]">ваши гарантии</div>
          <RevealHeading className="t-h2 mt-6 max-w-3xl">
            Что защищает ваш результат
          </RevealHeading>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {guarantees.map(([t, d]) => (
              <PaperCard key={t} className="p-6">
                <div className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-[color:var(--color-accent)]" />
                  <div>
                    <div className="font-display t-body font-bold">{t}</div>
                    <p className="mt-2 t-body text-[color:var(--color-text-secondary)]">{d}</p>
                  </div>
                </div>
              </PaperCard>
            ))}
          </div>
          <PaperCard className="mt-10 max-w-3xl border-l-[3px] border-l-[color:var(--color-accent)] p-6">
            <div className="font-display t-body font-bold">Один договор. Одна команда. Одна точка ответственности</div>
            <p className="mt-2 t-body text-[color:var(--color-text-primary)]">
              Принцип одного окна: одно контактное лицо, ответственное за результат, один договор. Всю дальнейшую работу с пулом разных экспертов мы забираем на себя, для вас процесс будет бесшовным.
            </p>
          </PaperCard>
        </div>
      </section>
      <NotFit />
      <CtaBand path="/how-we-work" />
    </PageShell>
  );
}

/* ---------------------------------- FAQ ------------------------------------ */

function FaqPage() {
  return (
    <PageShell path="/faq">
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-right-40 top-1/3", tone: "rose", size: 460 }, { className: "-left-40 bottom-0", tone: "chrome", size: 420 }]} />
        <PageHead
          kicker="Вопросы и ответы"
          title={<>Частые вопросы</>}
          lead="Не обещаем того, что не проверено на последних проектах: сроки, стоимость, конфиденциальность и формат работы — как есть."
          chips={[
            ["2 рабочих часа", "среднее время ответа на заявку или вопрос"],
            ["Без обязательств", "разбор задачи за 30 минут ни к чему вас не обязывает"],
          ]}
        />
        <div className="relative mx-auto max-w-7xl px-5 sec-pad-b md:px-8">
          <FaqAccordion items={FAQ_ITEMS} />
          <p className="mt-8 max-w-2xl t-body text-[color:var(--color-text-secondary)]">
            Не нашли свой вопрос? <a href="/contacts#form" className="font-semibold text-[color:var(--color-accent)] underline underline-offset-2 hover:text-foreground">Спросите напрямую</a> — ответим в течение двух рабочих часов.
          </p>
        </div>
      </section>
      <CtaBand path="/faq" />
    </PageShell>
  );
}

/* -------------------------------- Контакты --------------------------------- */

function ContactsPage() {
  return (
    <PageShell path="/contacts">
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-right-40 top-1/4", tone: "rose", size: 520 }]} />
        <PageHead
          kicker="Контакты"
          title={<>Разберём вашу задачу за 30 минут</>}
          lead="Оставьте заявку или напишите напрямую — готовить презентацию и ТЗ не нужно. Отвечаем в течение двух рабочих часов."
          chips={[
            ["2 рабочих часа", "среднее время ответа на заявку или вопрос"],
            ["Без обязательств", "разбор задачи ни к чему вас не обязывает"],
          ]}
        />
      </section>
      <Contact />
      <section className="relative border-b border-[color:var(--color-line)]">

        <div className="mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <div className="grid gap-8 t-body md:grid-cols-3">
            <div>
              <div className="t-eyebrow text-[color:var(--color-text-secondary)]">Напрямую</div>
              <ul className="mt-4 space-y-2">
                <li><a href="tel:+79645842225" className="text-[color:var(--color-text-primary)] transition hover:text-[color:var(--color-accent)]">+7 964 584 22 25</a></li>
                <li><a href="https://t.me/vikki_duck" target="_blank" rel="noreferrer" className="text-[color:var(--color-text-primary)] transition hover:text-[color:var(--color-accent)]">Telegram: @vikki_duck</a></li>
                <li><a href="mailto:vu@withoutwater.ru" className="text-[color:var(--color-text-primary)] transition hover:text-[color:var(--color-accent)]">vu@withoutwater.ru</a></li>
              </ul>
            </div>
            <div>
              <div className="t-eyebrow text-[color:var(--color-text-secondary)]">Реквизиты</div>
              <p className="mt-4 text-[color:var(--color-text-secondary)]">
                ИП Уткина Виктория Викторовна<br />
                ИНН 771586055972
              </p>
            </div>
            <div>
              <div className="t-eyebrow text-[color:var(--color-text-secondary)]">Обязательство</div>
              <p className="mt-4 text-[color:var(--color-text-secondary)]">
                Отвечаем в течение двух рабочих часов.
              </p>
            </div>
          </div>
        </div>
      </section>
      <CtaBand path="/contacts" />

    </PageShell>
  );
}

/* ------------------------------ Карта маршрутов ----------------------------- */

export type RouteDef = {
  path: string;
  title: string;
  description: string;
  Component: () => ReactElement;
};

export const ROUTES: RouteDef[] = [
  {
    path: "/",
    title: "БЕЗ ВОДЫ — дополнительные мощности для T&D команд без расширения штата",
    description:
      "Дополнительные мощности для T&D команд без расширения штата: берем на себя реализацию T&D-проектов — от поиска внешних экспертов и оцифровки ваших лучших практик до управления процессом создания готовых продуктов обучения.",
    Component: HomePage,
  },
  {
    path: BE.general,
    title: "Бизнес-эффект от сотрудничества — БЕЗ ВОДЫ",
    description:
      "Опыт, на котором держится бизнес, перестает зависеть от того, кто именно сейчас работает в компании: пять принципов, гарантии, стоимость и скорость старта.",
    Component: BusinessEffectGeneralPage,
  },
  {
    path: "/tasks",
    title: "Задачи и решения — БЕЗ ВОДЫ",
    description:
      "Три ситуации и решения к ним: результат держится на одном-двух сильных сотрудниках, инициатив больше, чем ресурсов команды, нужна практика, которой нет внутри.",
    Component: TasksPage,
  },
  {
    path: BE.internal,
    title: "Масштабирование результатов ваших сильных сотрудников — БЕЗ ВОДЫ",
    description:
      "Как экспертность сотрудников превращается в масштабируемый актив компании: путь от практики к рабочей системе, форматы и первый шаг — карта экспертности.",
    Component: InternalExpertsPage,
  },
  {
    path: BE.internalEffect,
    title: "Бизнес-эффект · Внутренние эксперты — БЕЗ ВОДЫ",
    description:
      "Что меняется для бизнеса, когда практика сильных сотрудников становится системой: пример федеральной ювелирной сети и снижение рисков.",
    Component: InternalExpertsEffectPage,
  },
  {
    path: BE.team,
    title: "Реализация амбициозных планов по обучению без потери качества — БЕЗ ВОДЫ",
    description:
      "План обучения выполняется, а штат не растет: команда производства обучения по подписке, состав из единиц результата и разбор объема на квартал.",
    Component: TeamSubscriptionPage,
  },
  {
    path: BE.teamEffect,
    title: "Бизнес-эффект · Команда по подписке — БЕЗ ВОДЫ",
    description:
      "Что меняется для бизнеса с командой обучения по подписке: сравнение со стоимостью той же мощности внутри и устройство работы в течение года.",
    Component: TeamSubscriptionEffectPage,
  },
  {
    path: BE.external,
    title: "Ускорение запуска новых направлений в бизнесе — БЕЗ ВОДЫ",
    description:
      "Практика, которой внутри нет — без долгого поиска и консалтинга: профили экспертов за 72 часа бесплатно, опыт остается у вас по окончании проекта.",
    Component: ExternalExpertsPage,
  },
  {
    path: BE.externalEffect,
    title: "Бизнес-эффект · Внешние эксперты — БЕЗ ВОДЫ",
    description:
      "Что меняется, когда опыт практика с рынка становится материалами компании: пример B2B-компании и снижение оттока на 16% по данным заказчика.",
    Component: ExternalExpertsEffectPage,
  },
  {
    path: "/cases",
    title: "Кейсы — БЕЗ ВОДЫ",
    description:
      "Корпоративные проекты и запуски под NDA: метрики, источник данных и что изменилось у клиента.",
    Component: CasesPage,
  },
  {
    path: "/reviews",
    title: "Отзывы клиентов — БЕЗ ВОДЫ",
    description: "Что говорят клиенты о работе методологов «Без Воды» — дословно, без редактуры.",
    Component: ReviewsPage,
  },
  {
    path: "/team",
    title: "Команда и сеть экспертов — БЕЗ ВОДЫ",
    description:
      "Кто отвечает за результат вашего проекта и как устроена профессиональная сеть практиков: отбор до подключения, один договор, методолог рядом с практиком.",
    Component: TeamPage,
  },
  {
    path: "/how-we-work",
    title: "Как мы работаем — БЕЗ ВОДЫ",
    description:
      "Лестница сроков от заявки до старта, критерии приёмки до начала работы, доработка без доплаты и границы применимости.",
    Component: HowWeWorkPage,
  },
  {
    path: "/faq",
    title: "Частые вопросы — БЕЗ ВОДЫ",
    description:
      "Ответы на частые вопросы: работа без ТЗ, конфиденциальность, время экспертов, права на материалы, субподряд.",
    Component: FaqPage,
  },
  {
    path: "/contacts",
    title: "Контакты — БЕЗ ВОДЫ",
    description:
      "Форма заявки, телефон, Telegram и почта. Отвечаем в течение двух рабочих часов.",
    Component: ContactsPage,
  },
];

/* Редиректы со старых якорей одностраничника на новые страницы (ТЗ, п.5) —
   чтобы не умерли разосланные ссылки. Якоря, оставшиеся на главной
   (#contact, #cases, #reviews, #when, #book), работают как раньше. */
export const HASH_REDIRECTS: Record<string, string> = {
  "#faq": "/faq",
  "#approach": "/how-we-work",
  "#firststage": "/how-we-work",
  "#notfit": "/how-we-work",
  "#capital": "/tasks",
};

/* Якоря бывших развёрнутых решений на /tasks (финальная структура 02.08):
   разосланные ссылки /tasks#practice и подобные ведут на продуктовые страницы. */
export const TASKS_HASH_REDIRECTS: Record<string, string> = {
  "#practice": BE.internal,
  "#capacity": BE.team,
  "#external": BE.external,
};
