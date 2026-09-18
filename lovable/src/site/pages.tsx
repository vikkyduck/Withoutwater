/* ============================================================================
   pages.tsx — страницы многостраничника и карта маршрутов (финальная
   структура от 02.08): главная (облегченная), хаб /tasks, три продуктовые
   страницы + три подстраницы эффекта + общий /business-effect (все — в
   pages-effect.tsx), кейсы, отзывы, команда, как мы работаем, FAQ, контакты.
   /for-your-boss закрыт: 301 на /business-effect (nginx).
   ========================================================================== */
import type { ReactElement } from "react";
import {
  motion,
  ArrowRight,
  PageShell, PageHead, SectionLabel, PaperCard, Scene,
  NodeList,
  reveal,
} from "./core";
import {
  Hero, Bricks, WhenNeeded, TeamBlock, PersonPhoto,
  CasesBlock, ReviewsBlock, ReviewCard, NotFit, Contact,
  FaqAccordion,
} from "./blocks";
import { FAQ_ITEMS, TEAM, FOUNDER_QUOTE, visibleReviews, CONTACT } from "./data";
import { ConstructorPage } from "./pages-constructor";
import { ExpertiseMapPage } from "./pages-expertise";
import { CASE_PAGES } from "./pages-case";
import { BE, BE_LINK } from "./pages-effect";
import { BusinessEffectGeneralPage, InternalExpertsPage, TeamSubscriptionPage, ExternalExpertsPage,
  SubscriptionOverview, CompactTeam, SelectedCases } from "./subscription";

/* -------------------------------- Главная -------------------------------- */

function HomePage() {
  /* Порядок секций — по редакции Виктории 17.09.2026: обложка → когда
     подключается команда → отзывы → опыт и портфолио → команда и книга →
     границы → первый шаг и форма. Блока кейсов на главной больше нет. */
  return (
    <PageShell path="/">
      <Hero />
      <WhenNeeded />
      <SubscriptionOverview compact />
      <SelectedCases home />
      <CompactTeam />
      <Contact />
    </PageShell>
  );
}

/* Хаб /tasks снят 17.09.2026 (ред. Виктории): трех карточек на главной
   достаточно, они ведут прямо на страницы услуг. Пункт меню «Услуги» ведет
   на этот блок главной (#when); адрес /tasks отдает 301 в nginx. */

function CasesPage() {
  return (
    <PageShell path="/cases">
      <section className="stage">
        <Scene blobs={[{ className: "-left-40 top-1/3", tone: "chrome", size: 480 }]} />
        <PageHead
          kicker="Кейсы"
          title={<>Реализованные проекты</>}
          lead="Задачи, состав работ и результаты корпоративных и образовательных проектов."
          chips={[
            ["Проекты под NDA", "публикация — с письменного согласия заказчика"],
          ]}
        />
      </section>
      <CasesBlock compactHeader />
      <Contact />
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
        <PageHead compact kicker="Отзывы" title={<>Отзывы клиентов</>} />
        <div className="relative mx-auto max-w-7xl px-5 sec-pad-b md:px-8">
          <div className="mt-8 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((r, i) => (
              <ReviewCard key={r.slug} r={r} index={i} />
            ))}
          </div>
        </div>
      </section>
      <Contact />
    </PageShell>
  );
}

/* ------------------------ Команда и сеть экспертов ------------------------- */

function TeamPage() {
  const founder = TEAM.find((p) => p.founder)!;
  const others = TEAM.filter((p) => !p.founder);
  /* Сеть отраслевых экспертов — четыре тезиса, текст Виктории 17.09.2026. */
  const network: [string, string][] = [
    ["Действующие практики", "C-level руководители и предприниматели с подтвержденным опытом"],
    ["Эксперт и методолог", "эксперт объясняет рабочие ситуации и логику решений; методолог готовит учебные материалы и задания"],
    ["Один договор", "расчеты и обязательства всех привлеченных специалистов включены в рамочный договор с БЕЗ ВОДЫ"],
    ["Защита данных (NDA)", "до передачи конфиденциальных материалов согласуем NDA, состав участников и порядок доступа к данным"],
  ];
  return (
    <PageShell path="/team">
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-right-40 top-[20%]", tone: "rose", size: 520 }]} />
        <PageHead
          kicker="БЕЗ ВОДЫ"
          title={<>Команда и сеть экспертов</>}
          lead="Методологи, тренеры и отраслевые эксперты разрабатывают программы и проводят обучение."
          actions={
            <a href="#contact" className="btn btn-invert group w-full sm:w-auto">
              <span>Оставить заявку на разбор задачи</span>
              <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          }
        />

        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <SectionLabel n="01">Команда</SectionLabel>

          {/* Основатель — крупная карточка: портрет, должность, факты, слова */}
          <motion.div {...reveal(0)} className="mt-8">
            <PaperCard className="overflow-hidden p-0">
              <div className="grid items-center gap-0 md:grid-cols-[280px_1fr]">
                <PersonPhoto person={founder} />
                <div className="flex flex-col justify-center p-6 md:p-8">
                  <h2 className="font-display t-body font-semibold">{founder.name}</h2>
                  <p className="mt-1 t-body text-[color:var(--color-text-secondary)]">{founder.role}</p>
                  <div className="mt-4">
                    <NodeList items={founder.facts} />
                  </div>
                  <blockquote className="mt-6 border-l-2 border-[color:var(--color-accent)] pl-5">
                    <p className="t-body text-[color:var(--color-text-primary)]">«{FOUNDER_QUOTE.text}»</p>
                  </blockquote>
                </div>
              </div>
            </PaperCard>
          </motion.div>

          <div className="mt-5 grid items-stretch gap-5 md:grid-cols-3">
            {others.map((p, i) => (
              <motion.div key={p.slug} {...reveal(i + 1)} className="h-full">
                <PaperCard className="flex h-full flex-col overflow-hidden p-0">
                  <PersonPhoto person={p} />
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display t-body font-semibold">{p.name}</h2>
                    <p className="mt-1 t-body text-[color:var(--color-text-secondary)]">{p.role}</p>
                    <div className="mt-4">
                      <NodeList items={p.facts} />
                    </div>
                  </div>
                </PaperCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <SectionLabel n="02">Сеть отраслевых экспертов</SectionLabel>
          <div className="mt-8 grid items-stretch gap-4 sm:grid-cols-2">
            {network.map(([t, d], i) => (
              <motion.div key={t} {...reveal(i)} className="h-full">
                <PaperCard className="h-full p-6">
                  <div className="font-display t-body font-semibold">{t}</div>
                  <p className="mt-2.5 t-body text-[color:var(--color-text-secondary)]">{d}</p>
                </PaperCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Contact />
    </PageShell>
  );
}

/* ---------------------------------- FAQ ------------------------------------ */

function FaqPage() {
  return (
    <PageShell path="/faq">
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-right-40 top-[20%]", tone: "rose", size: 480 }]} />
        <PageHead compact kicker="Вопросы и ответы" title={<>Частые вопросы</>} />
        <div className="relative mx-auto max-w-7xl px-5 sec-pad-b md:px-8">
          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </section>
      <Contact />
    </PageShell>
  );
}

/* ------------------------------- Контакты ---------------------------------- */

function ContactsPage() {
  return (
    <PageShell path="/contacts">
      <Contact asH1 />
      <section className="relative border-b border-[color:var(--color-line)]">
        <div className="mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <div className="t-body">
            <div>
              <div className="t-eyebrow text-[color:var(--color-text-secondary)]">Напрямую</div>
              <ul className="mt-4 space-y-2">
                <li><a href={CONTACT.tel} className="text-[color:var(--color-text-primary)] transition hover:text-[color:var(--color-accent)]">{CONTACT.phone}</a></li>
                <li><a href={CONTACT.tgUrl} target="_blank" rel="noreferrer" className="text-[color:var(--color-text-primary)] transition hover:text-[color:var(--color-accent)]">Telegram: {CONTACT.tg}</a></li>
                <li><a href={`mailto:${CONTACT.email}`} className="text-[color:var(--color-text-primary)] transition hover:text-[color:var(--color-accent)]">{CONTACT.email}</a></li>
              </ul>
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
  Component: () => ReactElement;
  /* Страница собирается и живет на домене, но не индексируется и не попадает
     в sitemap: prerender.mjs ставит ей robots noindex,nofollow. Так сделан
     /constructor — ссылку отправляют клиенту напрямую. */
  noindex?: boolean;
};

export const ROUTES: RouteDef[] = [
  {
    path: "/",
    title: "БЕЗ ВОДЫ — отдел обучения по подписке",
    description:
      "Отдел обучения по подписке. Вместо найма: отдел по цене 1 сотрудника в месяц — от 180 000 ₽. Программы, тренинги и курсы в LMS под задачу клиента. Старт за 24 часа.",
    Component: HomePage,
  },
  {
    path: BE.general,
    title: "Экономика подписки на отдел обучения — БЕЗ ВОДЫ",
    description:
      "Как сравнить подписку, штат и отдельных подрядчиков на одинаковом объеме работ. Бюджет, сроки, результат и условия для согласования.",
    Component: BusinessEffectGeneralPage,
  },
  {
    path: BE.internal,
    title: "Тиражирование практик — БЕЗ ВОДЫ",
    description:
      "Превращаем практический опыт, методы и логику решений ведущих специалистов в прикладные рабочие материалы.",
    Component: InternalExpertsPage,
  },
  {
    path: BE.team,
    title: "Подписка на отдел обучения — БЕЗ ВОДЫ",
    description:
      "Проектная команда для отделов обучения и EdTech: разработка программ, реализация тренингов и передача готового продукта без увеличения штата.",
    Component: TeamSubscriptionPage,
  },
  {
    path: BE.external,
    title: "Привлечение внешних экспертов — БЕЗ ВОДЫ",
    description:
      "Знания и навыки, которыми не владеют специалисты внутри компании, можно получить без долгого поиска и обращений к консалтинговым агентствам.",
    Component: ExternalExpertsPage,
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
    description: "Отзывы клиентов о работе проектного бюро БЕЗ ВОДЫ.",
    Component: ReviewsPage,
  },
  {
    path: "/team",
    title: "Команда и сеть экспертов — БЕЗ ВОДЫ",
    description:
      "Команда разрабатывает методологию и реализует образовательные проекты. Результат работы — программы и материалы, принятые по акту.",
    Component: TeamPage,
  },
  {
    path: "/faq",
    title: "Частые вопросы — БЕЗ ВОДЫ",
    description:
      "Ответы на частые вопросы: старт без ТЗ, сроки, время экспертов, авторские права, NDA, White Label, совместимость с LMS.",
    Component: FaqPage,
  },
  {
    path: "/contacts",
    title: "Контакты — БЕЗ ВОДЫ",
    description:
      "Разбор задачи обучения за 30 минут: исходные материалы, результат и первый этап. Контакты руководителя проекта.",
    Component: ContactsPage,
  },
  /* Страница продукта «Карта экспертности» (06.08.2026): на нее ведут все
     упоминания карты экспертности на сайте. Индексируется — это витрина
     первого этапа с показанными артефактами. */
  {
    path: "/expertise-map",
    title: "Карта экспертности — первый шаг — БЕЗ ВОДЫ",
    description:
      "Самостоятельный законченный этап: карта знаний, карта процесса, матрица компетенций, архитектура базы знаний и дорожная карта — семь документов заказчика.",
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
  /* НЕ ПРИКРЕПЛЕН К САЙТУ (решение Виктории 05.08.2026): ссылки на
     /constructor нет ни в шапке, ни в подвале, ни в sitemap; noindex.
     Страница существует только чтобы отправлять ссылку клиенту. */
  /* Заголовок и описание — тоже слова Виктории: их видит клиент в превью
     ссылки, когда она присылает /constructor в мессенджере. */
  {
    path: "/constructor",
    title: "Подписка на услуги: конструктор — БЕЗ ВОДЫ",
    description:
      "Выберите задачи и отправьте расчет для согласования объема работ.",
    Component: ConstructorPage,
    noindex: true,
  },
];

/* Редиректы со старых якорей одностраничника на новые страницы (ТЗ, п.5) —
   чтобы не умерли разосланные ссылки. Якоря, оставшиеся на главной
   (#contact, #cases, #reviews, #when, #book), работают как раньше. */
export const HASH_REDIRECTS: Record<string, string> = {
  "#faq": "/faq/",
  "#approach": "/tasks/team-subscription/#process",
  "#firststage": "/tasks/team-subscription/#process",
  "#capital": "/#when",
};

/* Якоря бывших развернутых решений на /tasks (финальная структура 02.08):
   разосланные ссылки /tasks#practice и подобные ведут на продуктовые страницы. */
export const TASKS_HASH_REDIRECTS: Record<string, string> = {
  "#practice": BE_LINK.internal,
  "#capacity": BE_LINK.team,
  "#external": BE_LINK.external,
};
