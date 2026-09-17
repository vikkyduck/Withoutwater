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
import {
  BE, BE_LINK,
  BusinessEffectGeneralPage,
  InternalExpertsPage, InternalExpertsEffectPage,
  TeamSubscriptionPage, TeamSubscriptionEffectPage,
  ExternalExpertsPage, ExternalExpertsEffectPage,
} from "./pages-effect";

/* -------------------------------- Главная -------------------------------- */

function HomePage() {
  /* Порядок секций — по редакции Виктории 17.09.2026: обложка → когда
     подключается команда → отзывы → опыт и портфолио → команда и книга →
     границы → первый шаг и форма. Блока кейсов на главной больше нет. */
  return (
    <PageShell path="/">
      <Hero />
      <WhenNeeded />
      <ReviewsBlock bare />
      <Bricks />
      <TeamBlock />
      <NotFit />
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
        <PageHead compact kicker="Отзывы" title={<>Отзывы наших клиентов</>} />
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
    ["Тандем «Методолог + Эксперт»", "эксперт разъясняет контекст и логику решений, а методолог переводит эти знания в понятные материалы, благодаря чему информация от эксперта будет полноценно усваиваться сотрудниками"],
    ["Единый договор и прозрачный документооборот", "все взаиморасчеты и юридические обязательства бюро закрывает через один рамочный договор, что бережет время"],
    ["Защита данных (NDA)", "эксперты работают по соглашению о неразглашении, поэтому данные клиента не уйдут конкурентам и не появятся в открытом доступе"],
  ];
  return (
    <PageShell path="/team">
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-right-40 top-[20%]", tone: "rose", size: 520 }]} />
        <PageHead
          kicker="О нас"
          title={<>Команда и сеть экспертов</>}
          lead="Мы отвечаем за разработку методологии и реализацию образовательных проектов и отвечаем за результат: принятые по акту программы и материалы"
          actions={
            <a href="#contact" className="btn btn-invert group w-full sm:w-auto">
              <span>Оставить заявку на разбор задачи</span>
              <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          }
        />

        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <SectionLabel n="01">Наша команда</SectionLabel>

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

/* ------------------------------ Наш подход -------------------------------- */

function HowWeWorkPage() {
  /* Три тезиса — текст Виктории 17.09.2026. Прежние экраны схемы сроков,
     ритма и гарантий в редакции отсутствуют. */
  const rhythm: [string, string][] = [
    ["Персональный руководитель проекта: единая точка контакта", "PM управляет сроками, организует работу методистов и решает технические вопросы. Коммуникация ведется в удобном режиме и виде."],
    ["Еженедельная отчетность (WSR)", "краткая сводка: что выполнено, что находится в производстве, прогресс по задачам"],
    ["Перестройка рабочей группы под новые вводные", "если под изменившиеся вводные требуется другой опыт, состав рабочей группы меняется в течение 48 часов"],
  ];
  return (
    <PageShell path="/how-we-work">
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-left-40 top-[30%]", tone: "chrome", size: 520 }]} />
        <PageHead
          compact
          kicker="Наш подход"
          title={<>Один договор. Одна команда. Единый контур ответственности</>}
          lead="Взаимодействие с одним человеком по всем вопросам."
        />
        <div className="relative mx-auto max-w-7xl px-5 sec-pad-b md:px-8">
          <SectionLabel n="01">Подход БЕЗ ВОДЫ в управлении проектом</SectionLabel>
          <div className="mt-8 grid items-stretch gap-4 md:grid-cols-3">
            {rhythm.map(([t, d], i) => (
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
    title: "БЕЗ ВОДЫ — проектное бюро по обучению",
    description:
      "Проектное бюро по обучению: проектируем программы обучения с привлечением профильных специалистов.",
    Component: HomePage,
  },
  {
    path: BE.general,
    title: "Экономический эффект: ROI обучения — БЕЗ ВОДЫ",
    description:
      "Инвестиции в создание собственных нематериальных активов при одновременном сокращении затрат на внешних подрядчиков до 40%.",
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
    path: BE.internalEffect,
    title: "Экономический эффект: тиражирование практик — БЕЗ ВОДЫ",
    description:
      "Высвобождение до 30–40% рабочего времени ключевых сотрудников, сокращение срока адаптации новичков в 2–2,5 раза, снижение операционных ошибок и риска потери знаний.",
    Component: InternalExpertsEffectPage,
  },
  {
    path: BE.team,
    title: "Подписка на отдел обучения — БЕЗ ВОДЫ",
    description:
      "Проектная команда для отделов обучения и EdTech-компаний. Решение задач по разработке образовательных программ, реализации тренингов и передаче готового продукта в распоряжение клиента без увеличения постоянного штата",
    Component: TeamSubscriptionPage,
  },
  {
    path: BE.teamEffect,
    title: "Экономический эффект: подписка на отдел обучения — БЕЗ ВОДЫ",
    description:
      "Сравним: штатная команда vs подписка на отдел обучения — расчет совокупной стоимости штатной команды из трех специалистов в сравнении с подпиской от 180 000 ₽.",
    Component: TeamSubscriptionEffectPage,
  },
  {
    path: BE.external,
    title: "Привлечение внешних экспертов — БЕЗ ВОДЫ",
    description:
      "Знания и навыки, которыми не владеют специалисты внутри компании, можно получить без долгого поиска и обращений к консалтинговым агентствам.",
    Component: ExternalExpertsPage,
  },
  {
    path: BE.externalEffect,
    title: "Экономический эффект: привлечение внешних экспертов — БЕЗ ВОДЫ",
    description:
      "Сокращение сроков запуска, оптимизация бюджета и ФОТ, сохранение и защита знаний внутри компании.",
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
    title: "Отзывы наших клиентов — БЕЗ ВОДЫ",
    description: "Отзывы клиентов о работе проектного бюро БЕЗ ВОДЫ.",
    Component: ReviewsPage,
  },
  {
    path: "/team",
    title: "Команда и сеть экспертов — БЕЗ ВОДЫ",
    description:
      "Мы отвечаем за разработку методологии и реализацию образовательных проектов и отвечаем за результат: принятые по акту программы и материалы.",
    Component: TeamPage,
  },
  {
    path: "/how-we-work",
    title: "Наш подход — БЕЗ ВОДЫ",
    description:
      "Один договор. Одна команда. Единый контур ответственности. Подход БЕЗ ВОДЫ в управлении проектом.",
    Component: HowWeWorkPage,
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
      "Форма заявки, телефон, Telegram и почта. Ответим в течение 5 минут.",
    Component: ContactsPage,
  },
  /* Страница продукта «Карта экспертности» (06.08.2026): на нее ведут все
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
  /* НЕ ПРИКРЕПЛЕН К САЙТУ (решение Виктории 05.08.2026): ссылки на
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
  "#faq": "/faq/",
  "#approach": "/how-we-work/",
  "#firststage": "/how-we-work/",
  "#notfit": "/how-we-work/",
  "#capital": "/#when",
};

/* Якоря бывших развернутых решений на /tasks (финальная структура 02.08):
   разосланные ссылки /tasks#practice и подобные ведут на продуктовые страницы. */
export const TASKS_HASH_REDIRECTS: Record<string, string> = {
  "#practice": BE_LINK.internal,
  "#capacity": BE_LINK.team,
  "#external": BE_LINK.external,
};
