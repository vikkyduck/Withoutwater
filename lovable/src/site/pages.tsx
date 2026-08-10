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
  RevealHeading, NodeBullet, NodeList, Stencil, CatMark, Swash, HandArrow, LineIcon,
  reveal,
} from "./core";
import {
  Hero, Bricks, WhenNeeded, Flow, WorkRhythm, TeamBlock,
  CasesBlock, ReviewsBlock, ReviewCard, BookSection, NotFit, Contact,
  FaqAccordion,
} from "./blocks";
import { FAQ_ITEMS, TEAM, FOUNDER_QUOTE, visibleReviews, SITUATIONS } from "./data";
import { ConstructorPage } from "./pages-constructor";
import { ExpertiseMapPage } from "./pages-expertise";
import { CASE_PAGES } from "./pages-case";
import {
  BE,
  BusinessEffectGeneralPage,
  InternalExpertsPage, InternalExpertsEffectPage,
  TeamSubscriptionPage, TeamSubscriptionEffectPage,
  ExternalExpertsPage, ExternalExpertsEffectPage,
} from "./pages-effect";

/* Следующий логичный шаг страницы — одна ссылка в финальной полосе
   (приёмка, п. 6). Ставится вместо дефолтной «Бизнес-эффект». */
function NextLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="link-arrow group t-body text-[color:var(--color-text-inverse-2)] hover:text-[color:var(--color-text-inverse)]"
    >
      {children}
      <ArrowUpRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

/* -------------------------------- Главная -------------------------------- */

function HomePage() {
  return (
    <PageShell path="/">
      <Hero />
      {/* Порядок приёмки 05.08: сначала зачем мы нужны и доказательства,
          лица — после. Кейсы и отзывы — одна полоса доказательств. */}
      <WhenNeeded />
      <CasesBlock limit={2} moreHref="/cases" teaser proofHeader />
      <ReviewsBlock bare />
      <TeamBlock />
      {/* «Наш опыт в цифрах» слит с «Работали с командами» (внутри Bricks):
          две соседние секции доказывали одно и то же */}
      <Bricks />
      <BookSection />
      <NotFit />
      <Contact />

    </PageShell>
  );
}

/* -------------------------------- Услуги ---------------------------------- */
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
          kicker="Услуги"
          title={<>Какие ваши задачи готовы взять на&nbsp;себя</>}
          lead="Три типовые ситуации T&D-команд и то, чем мы закрываем каждую из них: от описания внутренних практик до подключения внешних экспертов."
          guide="Выберите ситуацию, похожую на вашу, — дальше кейсы с результатами."
          note="Мы привлекаем всех необходимых профильных экспертов для реализации проекта."
          chips={[
            ["Без ТЗ", "приходите с задачей — рамку проекта соберём вместе"],
            ["7–14 дней", "срок, за который закрываем дефицит компетенции рыночной практикой"],
          ]}
        />

        {/* Три карточки-входа — на бумаге (приёмка 03.08): /tasks была
            единственной страницей, где уголь шёл от шапки до футера без
            передышки. Чередование секций — правило системы (разд. 3). */}
        <div className="relative bg-[color:var(--color-bg-primary)]">
          <div className="relative z-10 mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <div className="grid gap-5 md:grid-cols-3">
              {SITUATIONS.map((it, i) => (
                <motion.a
                  key={it.id}
                  href={it.href}
                  {...reveal(i)}
                  className="card-link card group flex h-full flex-col rounded-md p-6 md:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="font-display t-label tabular-nums text-[color:var(--color-accent)]">
                      0{i + 1}
                    </div>
                    <span
                      aria-hidden
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-pill border border-[color:var(--color-line)] text-[color:var(--color-text-primary)]"
                    >
                      <ArrowRight data-arrow className="h-4 w-4" />
                    </span>
                  </div>
                  <h2 className="t-body mt-3 font-display font-semibold text-[color:var(--color-text-primary)] [overflow-wrap:break-word]">
                    {it.situation}
                  </h2>
                  <p className="mt-4 t-body text-[color:var(--color-text-secondary)]">{it.detail}</p>
                  <p className="mt-4 t-body font-semibold text-[color:var(--color-text-primary)]">
                    Как решаем: {it.solutionTitle}
                  </p>
                  {/* Не кнопка: залитый пилюль здесь выглядел ровно как
                      «Разбор задачи за 30 минут» — три навигационные ссылки
                      спорили с единственным действием сайта. */}
                  <span className="link-arrow mt-auto pt-6 t-body">
                    Подробнее
                    <ArrowRight data-arrow className="h-4 w-4" />
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CtaBand path="/tasks" secondary={<NextLink href="/cases">Посмотреть кейсы</NextLink>} />
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
          guide="Здесь — результаты в цифрах; слова самих клиентов — в отзывах."
          chips={[
            ["Считаем результат", "каждый кейс — с метрикой, а не с описанием процесса"],
            ["Проекты под NDA", "часть работ показываем только с письменного согласия"],
          ]}
        />
      </section>
      <CasesBlock compactHeader />
      <CtaBand path="/cases" secondary={<NextLink href="/reviews">Читать отзывы клиентов</NextLink>} />
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
        {/* Компактная шапка (06.08): лид и строка про подход сведены в одну
            фразу, отступы вдвое меньше — отзывы начинаются сразу. */}
        <PageHead
          compact
          kicker="Отзывы"
          title={<>Что говорят клиенты</>}
          lead="Дословно. Отзывы отражают наш подход к работе"
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
      <CtaBand path="/reviews" secondary={<NextLink href="/how-we-work">Как мы работаем</NextLink>} />
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
          guide="Сначала — кто ведёт проекты, ниже — как устроена сеть практиков."
          chips={[
            ["Отбор до подключения", "проверяем опыт практика до того, как он попадает в проект"],
            ["60 минут", "описание опыта и подтвержденные кейсы практиков, которые будут работать над задачей в рамках проекта"],
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
                  Владелица агентства
                </div>
                <h2 className="mt-2 font-display t-body font-semibold">{founder.name}</h2>
                <p className="mt-1 t-body text-[color:var(--color-text-secondary)]">{founder.role} · {founder.fact}</p>
                {/* Слова от первого лица — фрагмент её книги (решение
                    Виктории 04.08). Цитата дословная, см. FOUNDER_QUOTE. */}
                <blockquote className="mt-6 border-l-[3px] border-[color:var(--color-accent)] pl-5">
                  <p className="t-body text-[color:var(--color-text-primary)]">{FOUNDER_QUOTE.text}</p>
                  <footer className="mt-3 t-caption text-[color:var(--color-text-secondary)]">
                    {FOUNDER_QUOTE.source}
                  </footer>
                </blockquote>
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
                    <div className="font-display t-body font-semibold">{p.name}</div>
                    <p className="mt-1 t-eyebrow text-[color:var(--color-text-secondary)]">{p.role}</p>
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
                <div className="font-display t-body font-semibold">{t}</div>
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
      <CtaBand path="/team" secondary={<NextLink href="/cases">Посмотреть кейсы</NextLink>} />
    </PageShell>
  );
}

/* ----------------------------- Как мы работаем ----------------------------- */

function HowWeWorkPage() {
  /* Первые две гарантии — коммерческие обязательства, их выносим крупно;
     остальные две — условия работы, спокойным рядом. */
  const core: [string, string][] = [
    ["Критерии приёмки — до старта", "объём работ, этапы, сроки и критерии приёмки фиксируются до начала работы"],
    ["Доработка без доплаты", "если результат этапа не соответствует согласованным критериям — дорабатываем за свой счёт"],
  ];
  const secondary: [string, string][] = [
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
          guide="Ниже — этапы, ритм работы и гарантии; дальше выберите свою задачу."
          chips={[
            ["Одна точка ответственности", "руководитель проекта с нашей стороны отвечает за сроки и результат"],
            ["Критерии приёмки — до старта", "объём, этапы и сроки фиксируются в договоре до начала работы"],
          ]}
        />
      </section>
      <Flow n="01" />
      <WorkRhythm n="02" />
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-left-40 top-0", tone: "rose", size: 460 }]} />
        <div className="relative z-10 mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <SectionLabel n="03">Ваши гарантии</SectionLabel>
          <RevealHeading className="t-h2 mt-6 max-w-3xl">
            Что защищает ваш результат
          </RevealHeading>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {core.map(([t, d]) => (
              <PaperCard key={t} className="border-l-[3px] border-l-[color:var(--color-accent)] p-7">
                <div className="font-display case-title">{t}</div>
                <p className="mt-3 t-body text-[color:var(--color-text-primary)]">{d}</p>
              </PaperCard>
            ))}
          </div>

          <ul className="mt-8 max-w-3xl divide-y divide-border border-y border-[color:var(--color-line)]">
            {secondary.map(([t, d]) => (
              <li key={t} className="flex items-start gap-3 py-4">
                <Check className="mt-[0.35em] h-4 w-4 flex-none text-[color:var(--color-accent)]" />
                <div>
                  <div className="font-display t-body font-semibold">{t}</div>
                  <p className="mt-1.5 t-body text-[color:var(--color-text-secondary)]">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <NotFit n="04" />
      <CtaBand path="/how-we-work" secondary={<NextLink href="/tasks">Услуги</NextLink>} />
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
          guide="Ответы на частые вопросы; если вашего нет — напишите напрямую."
          chips={[
            ["5 минут", "среднее время ответа на заявку или вопрос"],
            ["Без обязательств", "разбор задачи за 30 минут ни к чему вас не обязывает"],
          ]}
        />
        <div className="relative mx-auto max-w-7xl px-5 sec-pad-b md:px-8">
          <FaqAccordion items={FAQ_ITEMS} />
          <p className="mt-8 max-w-2xl t-body text-[color:var(--color-text-secondary)]">
            Не нашли свой вопрос? <a href="/contacts#form" className="font-semibold text-[color:var(--color-accent)] underline underline-offset-2 hover:text-foreground">Спросите напрямую</a> — ответим в течение 5 минут.
          </p>
        </div>
      </section>
      <CtaBand path="/faq" secondary={<NextLink href="/contacts#form">Написать напрямую</NextLink>} />
    </PageShell>
  );
}

/* -------------------------------- Контакты --------------------------------- */

function ContactsPage() {
  return (
    <PageShell path="/contacts">
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-right-40 top-1/4", tone: "rose", size: 520 }]} />
        {/* Чипы обложки — прямые каналы (решение 03.08): написать или
            позвонить можно, не докручивая до формы. «5 минут» здесь
            был третьим повтором обещания на одной странице. */}
        <PageHead
          kicker="Контакты"
          title={<>Разберём вашу задачу за 30 минут</>}
          lead="Оставьте заявку или напишите напрямую — ответим в течение 5 минут."
          guide="Форма ниже: два поля и одна строка о задаче — этого достаточно."
          chips={[
            ["Telegram: @vikky_duck", "если удобнее — напишите напрямую, без формы"],
            ["+7 964 584 22 25", "или позвоните: разбор задачи ни к чему вас не обязывает"],
          ]}
        />
      </section>
      <Contact numbered={false} />
      <section className="relative border-b border-[color:var(--color-line)]">

        <div className="mx-auto max-w-7xl px-5 sec-pad md:px-8">
          {/* Колонка «Обязательство» убрана: «отвечаем в течение 5 минут
              часов» читалось на странице третий раз (решение 03.08) */}
          <div className="grid gap-8 t-body md:grid-cols-2">
            <div>
              <div className="t-eyebrow text-[color:var(--color-text-secondary)]">Напрямую</div>
              <ul className="mt-4 space-y-2">
                <li><a href="tel:+79645842225" className="text-[color:var(--color-text-primary)] transition hover:text-[color:var(--color-accent)]">+7 964 584 22 25</a></li>
                <li><a href="https://t.me/vikky_duck" target="_blank" rel="noreferrer" className="text-[color:var(--color-text-primary)] transition hover:text-[color:var(--color-accent)]">Telegram: @vikky_duck</a></li>
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
          </div>
        </div>
      </section>
      {/* Финальный блок «Разберём вашу задачу за 30 минут» здесь убран:
          его заголовок дословно повторял заголовок страницы, а кнопка вела
          на эту же страницу — человек уже стоит перед формой. */}
    </PageShell>
  );
}

/* ------------------------------ Карта маршрутов ----------------------------- */

export type RouteDef = {
  path: string;
  title: string;
  description: string;
  Component: () => ReactElement;
  /* Страница собирается и живёт на домене, но не индексируется и не попадает
     в sitemap: prerender.mjs ставит ей robots noindex,nofollow. Так сделан
     /constructor — ссылку отправляют клиенту напрямую. */
  noindex?: boolean;
};

export const ROUTES: RouteDef[] = [
  {
    path: "/",
    title: "БЕЗ ВОДЫ — проектное бюро по обучению",
    description:
      "Проектное бюро по обучению: проектируем образовательные решения с привлечением профильных экспертов. Берем на себя реализацию T&D-проектов — перевод ваших рабочих практик в обучающие материалы, управление проектами и сборку готовых продуктов обучения.",
    Component: HomePage,
  },
  {
    path: BE.general,
    title: "Бизнес-эффект от сотрудничества — БЕЗ ВОДЫ",
    description:
      "Результат в компании создают люди — мы переводим их опыт в инструменты: пять принципов, гарантии, стоимость и скорость старта.",
    Component: BusinessEffectGeneralPage,
  },
  {
    path: "/tasks",
    title: "Услуги — БЕЗ ВОДЫ",
    description:
      "Три ситуации и решения к ним: результат держится на одном-двух ключевых сотрудниках, инициатив больше, чем ресурсов команды, нужна практика, которой нет внутри.",
    Component: TasksPage,
  },
  {
    path: BE.internal,
    title: "Опыт ключевых сотрудников в работе всей команды — БЕЗ ВОДЫ",
    description:
      "Как опыт ключевых сотрудников становится рабочим инструментом команды: путь от практики к рабочей системе, форматы и первый шаг — карта экспертности.",
    Component: InternalExpertsPage,
  },
  {
    path: BE.internalEffect,
    title: "Бизнес-эффект · Внутренние эксперты — БЕЗ ВОДЫ",
    description:
      "Что меняется для бизнеса, когда практика ключевых сотрудников становится рабочим инструментом команды: пример федеральной ювелирной сети и снижение рисков.",
    Component: InternalExpertsEffectPage,
  },
  {
    path: BE.team,
    title: "Реализация большого объёма обучения без потери качества — БЕЗ ВОДЫ",
    description:
      "План обучения выполняется, а штат не растет: подписка на наши услуги, состав из единиц результата и разбор объема на квартал.",
    Component: TeamSubscriptionPage,
  },
  {
    path: BE.teamEffect,
    title: "Бизнес-эффект · Подписка на наши услуги — БЕЗ ВОДЫ",
    description:
      "Что меняется для бизнеса с подпиской на наши услуги: сравнение со стоимостью той же мощности внутри и устройство работы в течение года.",
    Component: TeamSubscriptionEffectPage,
  },
  {
    path: BE.external,
    title: "Ускорение запуска новых направлений в бизнесе — БЕЗ ВОДЫ",
    description:
      "Практика, которой внутри нет — без долгого поиска и консалтинга: описание опыта и подтвержденные кейсы практиков, которые будут работать над задачей в рамках проекта — за 60 минут, бесплатно, опыт остается у вас по окончании проекта.",
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
      "Форма заявки, телефон, Telegram и почта. Отвечаем в течение 5 минут.",
    Component: ContactsPage,
  },
  /* Страница продукта «Карта экспертности» (06.08.2026): на неё ведут все
     упоминания карты экспертности на сайте. Индексируется — это витрина
     первого этапа с показанными артефактами. */
  {
    path: "/expertise-map",
    title: "Карта экспертности — первый шаг — БЕЗ ВОДЫ",
    description:
      "Самостоятельный законченный этап: карта знаний, карта процесса, матрица компетенций, архитектура базы знаний и дорожная карта. Семь документов, которые остаются у вас.",
    Component: ExpertiseMapPage,
  },
  /* Страницы кейсов: /cases/<slug>. Разворачиваются из данных — добавить
     кейс в CASES достаточно, маршрут и мета появятся сами (архитектура
     06.08.2026). */
  ...CASE_PAGES.map(({ slug, item, Component }) => ({
    path: `/cases/${slug}`,
    title: `${item.title} — кейс — БЕЗ ВОДЫ`,
    description: [item.client, item.role].filter(Boolean).join(". "),
    Component,
  })),
  /* НЕ ПРИКРЕПЛЁН К САЙТУ (решение Виктории 05.08.2026): ссылки на
     /constructor нет ни в шапке, ни в подвале, ни в sitemap; noindex.
     Страница существует только чтобы отправлять ссылку клиенту. */
  /* Заголовок и описание — тоже слова Виктории: их видит клиент в превью
     ссылки, когда она присылает /constructor в мессенджере. */
  {
    path: "/constructor",
    title: "Подписка на наши услуги: конструктор — БЕЗ ВОДЫ",
    description:
      "Выберите задачи и нажмите на кнопку «Отправить», когда соберете пакет услуг, мы напишем вам в течение 5 минут.",
    Component: ConstructorPage,
    noindex: true,
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
