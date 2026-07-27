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

/* ------------------- Аргументы для вашего руководителя -------------------- */
/* Не в меню; живёт ссылками с главной, кейсов и из подписи писем.
   Читатель — бизнес-ЛПР: 40 секунд, три вопроса — стоимость, эффект, риск. */

function ForYourBossPage() {
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
          kicker="Для внутренней встречи"
          title={<>Аргументы для вашего руководителя</>}
          lead="Эта страница — для пересылки. Здесь на языке денег, рисков и сроков собрано то, о чём руководитель спросит в первую очередь."
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
              Что бизнес получает за первый этап
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

          {/* Рамка стоимости — черновик формулировки, Виктория поправит */}
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
              Скачать PDF для пересылки
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <a
              href="/contacts#form"
              className="group inline-flex items-center gap-3 rounded-full bg-[color:var(--red)] px-7 py-4 text-[14px] font-semibold tracking-wide text-background transition-all duration-500 hover:bg-foreground"
            >
              Позовите нас на вашу внутреннюю встречу — ответим на вопросы руководителя напрямую
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

/* --------------------------- Задачи и решения ----------------------------- */
/* Навигатор: три входа по роли. Пока страниц ролей нет — ведут на кейсы. */

function TasksPage() {
  const roles = [
    {
      who: "Директору по персоналу и руководителю обучения",
      task: "Инициатив кратно больше, чем рук в L&D, а стандарты разработки у каждого подрядчика свои.",
      result: "Берём согласованный объём разработки на себя: единый стандарт, параллельные проекты, сроки по договору.",
      href: "/cases",
    },
    {
      who: "Руководителю функции",
      task: "Результат держится на одном-двух сильных сотрудниках, остальные работают заметно слабее.",
      result: "Практика сильнейших становится рабочим стандартом всей команды — и перестаёт зависеть от отпусков и увольнений.",
      href: "/cases",
    },
    {
      who: "Владельцу образовательного направления",
      task: "Направление входит в новую нишу, а носителя нужной практики внутри нет.",
      result: "Подключаем практика с релевантным опытом и переводим его решения в программу под ваш контекст.",
      href: "/cases",
    },
  ];
  return (
    <PageShell path="/tasks">
      <section className="relative overflow-hidden border-b border-border/60">
        <AmbientHalo className="-right-40 top-0" color="var(--lav)" size={480} opacity={0.14} />
        <PageHead
          kicker="Задачи и решения"
          title={<>С какой задачей вы пришли</>}
          lead="Вместо перечня услуг — три входа по роли. Выберите свою: одна фраза задачи, одна фраза результата, дальше — кейсы."
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 md:px-8 md:pb-24">
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {roles.map((r, i) => (
              <motion.a
                key={r.who}
                href={r.href}
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
                  <h2 className="mt-3 font-display text-lg font-extrabold leading-snug">{r.who}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground/80">Задача: </span>
                    {r.task}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground/80">Результат: </span>
                    {r.result}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-semibold text-[color:var(--red)] transition group-hover:text-foreground">
                    Смотреть кейсы
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </GlassCard>
              </motion.a>
            ))}
          </div>

          {/* Материальные активы вместо абстракций (разбор 26.07: раздел
              называется по трансформации, «интеллектуальный капитал» —
              вторичное объяснение) */}
          <div className="mt-16 max-w-4xl">
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
          lead="Корпоративные проекты и запуски под NDA. У каждого кейса — метрики, источник данных и что изменилось у клиента."
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
          lead="Дословно, без редактуры: тексты клиентов мы не переписываем."
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
          lead="Эта страница отвечает не на вопрос «кто вы», а на вопрос «почему этим людям можно доверить наших экспертов и нашу внутреннюю кухню»."
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
          lead="Всё на этой странице — страховка заказчика: сроки, о которых договорились заранее, приёмка по критериям и понятные границы."
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
          lead="Ни один ответ здесь не обещает того, что не проверено на последних трёх проектах."
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
    title: "БЕЗ ВОДЫ — результат сильнейшего сотрудника как стандарт для всей команды",
    description:
      "Проектная команда методологов и продактов: превращаем лучшие практики ваших экспертов в рабочие стандарты для всей команды. Без ТЗ, команда за 24 часа.",
    Component: HomePage,
  },
  {
    path: "/for-your-boss",
    title: "Аргументы для вашего руководителя — БЕЗ ВОДЫ",
    description:
      "Страница для пересылки руководителю: что теряет компания, пока опыт заперт в головах, что даёт первый этап и как закрыты риски.",
    Component: ForYourBossPage,
  },
  {
    path: "/tasks",
    title: "Задачи и решения — БЕЗ ВОДЫ",
    description:
      "Три входа по роли: директору по персоналу и руководителю обучения, руководителю функции, владельцу образовательного направления.",
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
      "Четыре лица команды и профессиональная сеть практиков: отбор до подключения, один договор, методолог рядом с практиком.",
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
