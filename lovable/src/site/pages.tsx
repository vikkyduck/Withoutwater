/* ============================================================================
   pages.tsx — страницы многостраничника и карта маршрутов (ТЗ v3 от 26.07).
   Волна 1: главная, аргументы для руководителя, задачи и решения, кейсы,
   команда, как мы работаем, FAQ, контакты (+ отзывы отдельной страницей —
   решение Виктории от 26.07).
   ========================================================================== */
import {
  motion,
  ArrowUpRight, ArrowRight, Check,
  PageShell, PageHead, SectionLabel, GlassCard, AmbientHalo,
  RevealHeading,
} from "./core";
import {
  Hero, Bricks, DemoBlock, WhenNeeded, NumbersBand, Production, Flow,
  CasesBlock, ReviewsBlock, ReviewCard, BookSection, NotFit, Contact,
  FaqAccordion,
} from "./blocks";
import { FAQ_ITEMS, TEAM, FOUNDER_WORDS, visibleReviews } from "./data";

/* -------------------------------- Главная -------------------------------- */

function HomePage() {
  return (
    <PageShell path="/">
      <Hero />
      {/* Кирпичики клиентов сразу под hero (решение Виктории от 26.07) */}
      <Bricks />
      {/* Демо «до и после» — включится, когда Виктория выберет формат */}
      <DemoBlock />
      <WhenNeeded />
      <NumbersBand />
      <Production />
      <Flow />
      <CasesBlock />
      <ReviewsBlock />
      <BookSection />
      <NotFit />
      <Contact />
    </PageShell>
  );
}

/* --------------------- Бизнес-эффект от методологии ----------------------- */
/* Не в меню; живёт ссылками с главной, кейсов и из подписи писем.
   Читатель — внутренний бизнес-заказчик, которому HR/T&D передаёт материал:
   40 секунд, три вопроса — эффект, риск, стоимость. Обращаемся к нему
   напрямую на «вы». НЕЛЬЗЯ писать, что страница «для пересылки» и что
   её читает «руководитель»: читатель узнаёт себя в третьем лице. */

function BusinessEffectPage() {
  const risks: [string, string][] = [
    ["Критерии приёмки — до старта", "вы заранее знаете, что считается результатом, и принимаете работу по согласованным критериям"],
    ["Доработка без доплаты", "если результат этапа не соответствует критериям, дорабатываем за свой счёт"],
    ["Один договор", "вместо оформления каждого эксперта через закупку и службу безопасности — одна проектная команда и одна точка ответственности"],
    ["Соглашение о неразглашении", "внутренняя кухня компании остаётся внутри компании"],
  ];
  return (
    <PageShell path="/for-your-boss">
      <section className="relative overflow-hidden border-b border-border/60 print:border-0">
        <PageHead
          kicker="Эффект для бизнеса"
          title={<>Бизнес-эффект от методологии</>}
          lead="Что меняется в работе компании, когда практика сильных сотрудников становится общим стандартом: результат, сроки, риски и порядок расчёта стоимости."
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 md:px-8 md:pb-24">

          {/* Что теряет компания */}
          <div className="mt-10 max-w-3xl">
            <h2 className="font-display text-2xl font-extrabold leading-tight md:text-3xl">
              Что компания теряет прямо сейчас
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/85 md:text-base">
              Ключевая практика заперта в головах двух-трёх сильных людей. Пока
              это так, компания платит дважды: результат зависит от их загрузки,
              а каждый уход — в отпуск, на повышение, к конкуренту — уносит
              практику вместе с человеком. Новых сотрудников при этом учат
              «с голоса», каждый раз заново и по-разному.
            </p>
          </div>

          {/* Что бизнес получает за первый этап */}
          <div className="mt-12 max-w-3xl">
            <h2 className="font-display text-2xl font-extrabold leading-tight md:text-3xl">
              Что вы получаете за первый этап
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/85 md:text-base">
              Первый этап завершается самостоятельным результатом: модель решения
              и дорожная карта. Это готовый рабочий материал — он остаётся у
              компании и применим даже в том случае, если сотрудничество не
              продолжится. Продолжать проект с нами или силами своей команды —
              решение за вами, и оно принимается уже на фактуре, а не на обещаниях.
            </p>
          </div>

          {/* Как закрыты риски */}
          <div className="mt-12">
            <h2 className="font-display text-2xl font-extrabold leading-tight md:text-3xl">
              Как закрыты риски
            </h2>
            <div className="mt-6 grid max-w-4xl gap-4 sm:grid-cols-2">
              {risks.map(([t, d]) => (
                <div key={t} className="rounded-2xl border border-border bg-background/70 p-5">
                  <div className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-[color:var(--red)]" />
                    <div>
                      <div className="font-display text-[15px] font-bold">{t}</div>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{d}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Порядок расчёта — черновик формулировки, Виктория поправит */}
          <div className="mt-12 max-w-3xl rounded-2xl border-l-[3px] border-[color:var(--red)] bg-[color:var(--red)]/5 p-6 md:p-7">
            <h2 className="font-display text-xl font-extrabold leading-tight md:text-2xl">
              Как считается стоимость
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">
              Стоимость считается по формуле: объём материала × число носителей
              опыта × глубина проверки знаний × срок. Срочность — отдельным
              коэффициентом. После 30-минутного разбора вы получаете расчёт под
              вашу задачу — с фиксацией объёма и критериев приёмки до старта,
              без «часов по факту».
            </p>
          </div>

          {/* Действия */}
          <div className="mt-12 flex flex-col items-start gap-4 print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="group inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-[14px] font-semibold text-foreground transition hover:border-[color:var(--red)] hover:text-[color:var(--red)]"
            >
              Сохранить в PDF
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <a
              href="/contacts#form"
              className="group inline-flex items-center gap-3 rounded-full bg-[color:var(--red)] px-7 py-4 text-[14px] font-semibold tracking-wide text-background transition-all duration-500 hover:bg-foreground"
            >
              Позовите нас на встречу с командой — ответим на вопросы напрямую
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

/* --------------------------- Задачи и решения ----------------------------- */
/* Ситуации, а НЕ роли-адресаты (правка Виктории 26.07): одна и та же
   ситуация возникает у разных людей, поэтому обращения «директору по
   персоналу», «руководителю функции» убраны. Карточка ведёт не на кейсы,
   а на развёрнутое решение ниже по странице. */

const SITUATIONS = [
  {
    id: "practice",
    situation: "Результат держится на одном-двух сильных сотрудниках",
    detail:
      "Они закрывают сложные задачи, остальные работают заметно слабее. Как именно работают сильные — нигде не записано: знание живёт в голове, передаётся «с голоса» и уходит вместе с человеком.",
    solutionTitle: "Тиражируем практику сильных сотрудников",
    solutionLead:
      "Разбираем, что именно делают сильные, и превращаем это в способ работы, которым пользуется вся команда.",
    steps: [
      "проводим интервью с носителями практики и разбираем их реальные решения",
      "отделяем то, что даёт результат, от личного стиля и случайностей",
      "переводим в алгоритмы, стандарты, разборы кейсов и рабочие материалы",
      "проверяем на реальных задачах и дорабатываем по обратной связи",
    ],
    outcome:
      "Команда работает по единому подходу, а результат перестаёт зависеть от отпусков, загрузки и увольнений.",
  },
  {
    id: "capacity",
    situation: "Инициатив больше, чем ресурсов внутренней команды",
    detail:
      "Портфель задач растёт быстрее, чем штат. Часть инициатив уходит подрядчикам — и у каждого свой стандарт разработки, свои сроки и своё качество на выходе.",
    solutionTitle: "Берём согласованный объём разработки на себя",
    solutionLead:
      "Работаем как производственное продолжение вашей команды: вы управляете портфелем, мы закрываем производство.",
    steps: [
      "фиксируем объём, этапы, сроки и критерии приёмки до старта",
      "ведём до 10–12 проектов параллельно по единому стандарту",
      "держим контрольные точки — вы видите промежуточный результат, а не только финал",
      "дорабатываем без доплаты, если результат не соответствует критериям",
    ],
    outcome:
      "Производство перестаёт быть ограничением: инициативы выходят в срок, качество не зависит от того, кому достался проект.",
  },
  {
    id: "external",
    situation: "Нужна практика, которой пока нет внутри компании",
    detail:
      "Компания заходит в новую нишу, запускает незнакомое направление или сталкивается с задачей, по которой внутри нет носителя опыта. Искать и проверять экспертов самостоятельно — долго.",
    solutionTitle: "Находим практика на рынке и переводим его опыт в ваш контекст",
    solutionLead:
      "Подключаем специалиста, который уже решал сопоставимую задачу, — и отвечаем за то, что его опыт станет применимым материалом.",
    steps: [
      "фиксируем, какой именно опыт нужен и какие вопросы должен закрыть специалист",
      "представляем первые релевантные профили в течение 72 часов",
      "методолог работает рядом с практиком и переводит его решения в программу",
      "адаптируем под ваш контекст: процессы, ограничения и язык компании",
    ],
    outcome:
      "Команда получает проверенный способ работы быстрее, чем через наём и самостоятельный поиск. Договор один — с нами.",
  },
];

function TasksPage() {
  return (
    <PageShell path="/tasks">
      <section className="relative overflow-hidden border-b border-border/60">
        <AmbientHalo className="-right-40 top-0" color="var(--lav)" size={480} opacity={0.14} />
        <PageHead
          kicker="Задачи и решения"
          title={<>С какой задачей вы пришли</>}
          lead="Выберите ситуацию, похожую на вашу, — ниже разобрано, что делаем в каждой и что остаётся у вас на руках."
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 md:px-8 md:pb-24">
          {/* Навигатор: ситуация → якорь решения ниже */}
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {SITUATIONS.map((it, i) => (
              <motion.a
                key={it.id}
                href={`#${it.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group"
              >
                <GlassCard className="flex h-full flex-col p-6 transition-transform duration-300 group-hover:-translate-y-1 md:p-7">
                  <div className="font-display text-sm font-bold tabular-nums text-[color:var(--red)]">
                    0{i + 1}
                  </div>
                  <h2 className="mt-3 font-display text-[19px] font-extrabold leading-snug [overflow-wrap:break-word]">
                    {it.situation}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{it.detail}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-semibold text-[color:var(--red)] transition group-hover:text-foreground">
                    Как решаем
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </GlassCard>
              </motion.a>
            ))}
          </div>

          {/* Развёрнутые решения */}
          <div className="mt-20 flex flex-col gap-16 md:mt-24 md:gap-20">
            {SITUATIONS.map((it, i) => (
              <div key={it.id} id={it.id} className="scroll-mt-28">
                <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-12">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      <span className="font-display text-[color:var(--red)]">0{i + 1}</span>
                      <span className="h-px w-8 bg-border" />
                      <span>Решение</span>
                    </div>
                    <RevealHeading className="mt-5 font-display text-2xl font-extrabold leading-tight md:text-[32px]">
                      {it.solutionTitle}
                    </RevealHeading>
                    <p className="mt-4 text-[15px] leading-relaxed text-foreground/85 md:text-base">
                      {it.solutionLead}
                    </p>
                    <a
                      href="/cases"
                      className="group mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-[color:var(--red)] transition hover:text-foreground"
                    >
                      Где это уже сработало
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Что делаем
                    </div>
                    <ul className="mt-5 divide-y divide-border border-y border-border">
                      {it.steps.map((step) => (
                        <li key={step} className="flex items-start gap-3 py-3.5 text-[15px] leading-relaxed text-foreground/85">
                          <Check className="mt-1 h-4 w-4 flex-none text-[color:var(--red)]" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 rounded-2xl border-l-[3px] border-[color:var(--red)] bg-[color:var(--red)]/5 px-5 py-4">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Что меняется
                      </div>
                      <p className="mt-1.5 text-[15px] font-medium leading-relaxed text-foreground/90">
                        {it.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Материальные активы вместо абстракций (разбор 26.07: раздел
              называется по трансформации, «интеллектуальный капитал» —
              вторичное объяснение) */}
          <div className="mt-20 max-w-4xl md:mt-24">
            <RevealHeading className="font-display text-2xl font-extrabold leading-tight md:text-3xl">
              Опыт перестаёт зависеть от его носителя
            </RevealHeading>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Экспертный опыт становится интеллектуальным капиталом компании —
              и это не метафора, а перечень передаваемых активов:
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "карта решений и алгоритмы работы",
                "стандарты и библиотека кейсов",
                "сценарии применения и материалы для руководителей",
                "исходники и правила обновления — материалы живут без нас",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 rounded-2xl border border-border bg-background/70 p-5 text-sm leading-relaxed text-foreground/85 md:text-[15px]">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-[color:var(--red)]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

/* --------------------------------- Кейсы ---------------------------------- */

function CasesPage() {
  return (
    <PageShell path="/cases">
      <section className="relative overflow-hidden">
        <PageHead
          kicker="У нас получилось"
          title={<>Кейсы</>}
          lead="Корпоративные проекты и запуски под NDA: что сделали, как посчитали результат и что изменилось в работе заказчика."
        />
      </section>
      <CasesBlock compactHeader />
      <section className="relative border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Готовим к публикации кейсы проектов с Авито, ВкусВилл, Beyond Taylor,
            Global Creative Hub, McDonald's (2021) и World Class — пока
            почитайте, <a href="/reviews" className="font-semibold text-[color:var(--red)] underline underline-offset-2 hover:text-foreground">что говорят сами клиенты</a>.
          </p>
        </div>
      </section>
    </PageShell>
  );
}

/* -------------------------------- Отзывы ----------------------------------- */

function ReviewsPage() {
  const items = visibleReviews();
  return (
    <PageShell path="/reviews">
      <section className="relative overflow-hidden border-b border-border bg-[color:var(--lav-soft)]/30">
        <AmbientHalo className="-left-40 top-10" color="var(--lav)" size={560} opacity={0.2} />
        <PageHead
          kicker="У нас получилось"
          title={<>Что говорят клиенты</>}
          lead="Дословно, без редактуры — мы не переписываем то, что нам написали."
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 md:px-8 md:pb-24">
          <div className="mt-8 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((r, i) => (
              <ReviewCard key={r.slug} r={r} index={i} />
            ))}
          </div>
        </div>
      </section>
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
      <section className="relative overflow-hidden border-b border-border/60">
        <AmbientHalo className="-right-40 top-0" color="var(--lav)" size={520} opacity={0.16} />
        <PageHead
          kicker="О нас"
          title={<>Команда и сеть экспертов</>}
          lead="Люди, которые отвечают за результат вашего проекта, и профессиональная сеть практиков за ними."
        />

        {/* Карточка владелицы + слова от первого лица */}
        <div className="relative mx-auto max-w-7xl px-5 pb-4 md:px-8">
          <GlassCard className="mt-8 overflow-hidden p-0">
            <div className="grid items-stretch md:grid-cols-[320px_1fr]">
              <div className="relative min-h-[320px] bg-[color:var(--lav)]/10 md:min-h-0">
                <img
                  src={founder.photo}
                  alt={founder.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-top grayscale"
                />
              </div>
              <div className="p-7 md:p-10">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--red)]">
                  Основатель
                </div>
                <h2 className="mt-2 font-display text-2xl font-extrabold md:text-3xl">{founder.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{founder.role} · {founder.fact}</p>
                <div className="mt-6 flex flex-col gap-3.5 border-l-[3px] border-[color:var(--red)] pl-4 md:pl-5">
                  {FOUNDER_WORDS.map((p) => (
                    <p key={p} className="text-[15px] leading-relaxed text-foreground/85">{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Три лица команды */}
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {others.map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <GlassCard className="h-full overflow-hidden p-0">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-secondary">
                    <img
                      src={p.photo}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-top grayscale transition duration-500 hover:grayscale-0"
                    />
                  </div>
                  <div className="p-5">
                    <div className="font-display text-lg font-bold leading-tight">{p.name}</div>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{p.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/80">{p.fact}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Как устроена сеть */}
        <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
          <SectionLabel n="02">Сеть экспертов</SectionLabel>
          <RevealHeading className="mt-6 max-w-3xl font-display text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">
            Как устроена профессиональная сеть команды
          </RevealHeading>
          <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {network.map(([t, d]) => (
              <div key={t} className="border-t border-border pt-6">
                <div className="font-display text-lg font-bold">{t}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Фотографии и имена экспертов сети мы не публикуем: у многих действуют
            соглашения о неразглашении с работодателями, а прямой контакт в обход
            проектной рамки обесценил бы работу для всех сторон. На проекте вы
            знакомитесь с экспертами лично.
          </p>
        </div>
      </section>
      <BookSection />
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
      <section className="relative overflow-hidden">
        <PageHead
          kicker="Мы вместе"
          title={<>Как мы работаем</>}
          lead="Сроки, о которых договариваемся заранее, приёмка по согласованным критериям и понятные границы — чтобы вы знали, что получите и когда."
        />
      </section>
      <Flow />
      <section className="relative overflow-hidden border-b border-border">
        <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <SectionLabel n="02">Страховки заказчика</SectionLabel>
          <RevealHeading className="mt-6 max-w-3xl font-display text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">
            Что защищает ваш результат
          </RevealHeading>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {guarantees.map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-border bg-background/70 p-6">
                <div className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-[color:var(--red)]" />
                  <div>
                    <div className="font-display text-[16px] font-bold">{t}</div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 max-w-3xl rounded-2xl border-l-[3px] border-[color:var(--red)] bg-[color:var(--red)]/5 p-6">
            <div className="font-display text-[16px] font-bold">Один договор. Одна команда. Одна точка ответственности</div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              Подключаем практиков, оформляем договорённости, координируем их
              работу и переводим опыт в согласованный результат. Вы работаете
              с одной проектной командой и одним договором — без оформления
              каждого эксперта через закупку и службу безопасности.
            </p>
          </div>
        </div>
      </section>
      <Production />
      <NotFit />
    </PageShell>
  );
}

/* ---------------------------------- FAQ ------------------------------------ */

function FaqPage() {
  return (
    <PageShell path="/faq">
      <section className="relative overflow-hidden border-b border-border">
        <PageHead
          kicker="Мы вместе"
          title={<>Частые вопросы</>}
          lead="Не обещаем того, что не проверено на последних проектах."
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 md:px-8 md:pb-24">
          <FaqAccordion items={FAQ_ITEMS} />
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Не нашли свой вопрос? <a href="/contacts#form" className="font-semibold text-[color:var(--red)] underline underline-offset-2 hover:text-foreground">Спросите напрямую</a> — ответим в течение двух рабочих часов.
          </p>
        </div>
      </section>
    </PageShell>
  );
}

/* -------------------------------- Контакты --------------------------------- */

function ContactsPage() {
  return (
    <PageShell path="/contacts">
      <Contact asH1 />
      <section className="relative border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
          <div className="grid gap-8 text-sm md:grid-cols-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Напрямую</div>
              <ul className="mt-4 space-y-2">
                <li><a href="tel:+79645842225" className="text-foreground/80 transition hover:text-[color:var(--red)]">+7 964 584 22 25</a></li>
                <li><a href="https://t.me/vikki_duck" target="_blank" rel="noreferrer" className="text-foreground/80 transition hover:text-[color:var(--red)]">Telegram: @vikki_duck</a></li>
                <li><a href="mailto:vu@withoutwater.ru" className="text-foreground/80 transition hover:text-[color:var(--red)]">vu@withoutwater.ru</a></li>
              </ul>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Реквизиты</div>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                ИП Уткина Виктория Викторовна<br />
                ИНН 771586055972
              </p>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Обязательство</div>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Отвечаем в течение двух рабочих часов.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

/* ------------------------------ Карта маршрутов ----------------------------- */

export type RouteDef = {
  path: string;
  title: string;
  description: string;
  Component: () => JSX.Element;
};

export const ROUTES: RouteDef[] = [
  {
    path: "/",
    title: "БЕЗ ВОДЫ — практика сильнейшего сотрудника как стандарт всей команды",
    description:
      "Переводим решения ваших сильных сотрудников в алгоритмы, стандарты и материалы, которыми пользуется вся команда. Нужной практики нет внутри — находим её на рынке. Без ТЗ, команда за 24 часа.",
    Component: HomePage,
  },
  {
    path: "/for-your-boss",
    title: "Бизнес-эффект от методологии — БЕЗ ВОДЫ",
    description:
      "Что меняется в работе компании, когда практика сильных сотрудников становится общим стандартом: результат первого этапа, закрытые риски и порядок расчёта стоимости.",
    Component: BusinessEffectPage,
  },
  {
    path: "/tasks",
    title: "Задачи и решения — БЕЗ ВОДЫ",
    description:
      "Три ситуации и решения к ним: результат держится на одном-двух сильных сотрудниках, инициатив больше, чем ресурсов команды, нужна практика, которой нет внутри.",
    Component: TasksPage,
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
