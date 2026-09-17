/* ============================================================================
   pages-effect.tsx — страницы услуг и экономического эффекта.
   Семь страниц: три услуги (/tasks/…), три подстраницы эффекта
   (/tasks/…/business-effect) и общая /business-effect.

   Тексты — СЛОВО В СЛОВО из редакции Виктории от 17.09.2026 (три гугл-дока
   «Все тексты сайта withoutwater.ru»). Менять их здесь нельзя — правки
   только через Викторию. Из типографики выровнено одно: « - » между словами
   набрано тире « — », как везде на сайте; слова не тронуты.

   Каждая страница заканчивается формой заявки (Contact): все кнопки
   «Оставить заявку…» в редакции помечены «скролл к форме».
   ========================================================================== */
import {
  motion,
  ArrowRight, ArrowDown,
  PageShell, PageHead, SectionLabel, PaperCard, Scene,
  RevealHeading, NodeBullet, NodeList,
  reveal,
  type ReactNode,
} from "./core";
import { ABONEMENTS, IPR_UNIT, CASES } from "./data";
import { CaseCard, Contact } from "./blocks";

/* ------------------------------ Адреса и PDF ------------------------------ */

export const BE = {
  general: "/business-effect",
  internal: "/tasks/internal-experts",
  internalEffect: "/tasks/internal-experts/business-effect",
  team: "/tasks/team-subscription",
  teamEffect: "/tasks/team-subscription/business-effect",
  external: "/tasks/external-experts",
  externalEffect: "/tasks/external-experts/business-effect",
};

const PDF = {
  general: "/pdf/bez-vody-business-effect.pdf",
  internal: "/pdf/bez-vody-internal-experts.pdf",
  team: "/pdf/bez-vody-team-subscription.pdf",
  external: "/pdf/bez-vody-external-experts.pdf",
};

/* --------------------------- Мелкие общие детали -------------------------- */

/* Главная кнопка страницы: всегда к форме внизу этой же страницы. */
function FormButton({ children }: { children: string }) {
  return (
    <a href="#contact" className="btn btn-invert group w-full sm:w-auto">
      <span>{children}</span>
      <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
    </a>
  );
}

/* Вторая ссылка на обложке — тихая, как в hero главной. */
function QuietLink({ href, children, download = false }: { href: string; children: string; download?: boolean }) {
  return (
    <a
      href={href}
      {...(download ? { download: true } : {})}
      className="link-arrow group t-body text-[color:var(--color-text-inverse-2)] hover:text-[color:var(--color-text-inverse)] print:hidden"
    >
      {children}
      {download ? (
        <ArrowDown data-arrow="down" className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
      ) : (
        <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </a>
  );
}

/* Карточки «Заголовок. Текст» */
function TitledCards({ items, cols = "sm:grid-cols-3" }: { items: [string, string][]; cols?: string }) {
  return (
    <div className={`grid items-stretch gap-4 ${cols}`}>
      {items.map(([t, d], i) => (
        <motion.div key={t} {...reveal(i)} className="h-full">
          <PaperCard className="h-full p-6">
            <div className="font-display t-body font-semibold">{t}</div>
            <p className="mt-2.5 t-body text-[color:var(--color-text-secondary)]">{d}</p>
          </PaperCard>
        </motion.div>
      ))}
    </div>
  );
}

/* Список «Заголовок: текст» одной колонкой с узловыми маркерами. */
function TitledList({ items }: { items: [string, string?][] }) {
  return (
    <ul className="max-w-3xl divide-y divide-border border-y border-[color:var(--color-line)]">
      {items.map(([t, d]) => (
        <li key={t} className="flex items-start gap-4 py-4">
          <NodeBullet className="mt-[0.55em]" />
          <p className="t-body text-[color:var(--color-text-secondary)]">
            {d ? (
              <>
                <span className="font-semibold text-[color:var(--color-text-primary)]">{t}:</span> {d}
              </>
            ) : (
              <span className="font-semibold text-[color:var(--color-text-primary)]">{t}</span>
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}

/* Нумерованные шаги 01…05 */
function Steps({ items }: { items: ReactNode[] }) {
  return (
    <ol className="max-w-3xl divide-y divide-border border-y border-[color:var(--color-line)]">
      {items.map((t, i) => (
        <li key={i} className="flex items-baseline gap-5 py-4">
          <span className="font-display t-label tabular-nums text-[color:var(--color-accent)]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="measure t-body text-[color:var(--color-text-primary)]">{t}</div>
        </li>
      ))}
    </ol>
  );
}

/* Таблица в три колонки — сравнение моделей и расчет стоимости. */
function Table3({ head, rows, total }: { head: [string, string, string]; rows: [string, string, string][]; total?: [string, string, string] }) {
  const cell = "px-4 py-3 t-body";
  return (
    <div className="overflow-x-auto rounded-sm border border-[color:var(--color-line)]">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="bg-[color:var(--color-surface)]">
            {head.map((h) => (
              <th key={h} className={`${cell} t-eyebrow text-[color:var(--color-text-secondary)]`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b, c]) => (
            <tr key={a} className="border-t border-[color:var(--color-line)]">
              <td className={`${cell} font-semibold text-[color:var(--color-text-primary)]`}>{a}</td>
              <td className={`${cell} text-[color:var(--color-text-secondary)]`}>{b}</td>
              <td className={`${cell} text-[color:var(--color-text-primary)]`}>{c}</td>
            </tr>
          ))}
          {total && (
            <tr className="border-t border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
              {total.map((v, i) => (
                <td key={i} className={`${cell} font-display font-semibold text-[color:var(--color-text-primary)]`}>{v}</td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* «Проблема / Эффект» — пункты экономического эффекта внутренних экспертов */
function ProblemEffect({ items }: { items: { title: string; problem: string; effect: string }[] }) {
  return (
    <div className="grid items-stretch gap-4 md:grid-cols-2">
      {items.map((it, i) => (
        <motion.div key={it.title} {...reveal(i)} className="h-full">
          <PaperCard className="h-full p-6">
            <div className="font-display t-body font-semibold">{it.title}</div>
            <p className="mt-3 t-body text-[color:var(--color-text-secondary)]">
              <span className="font-semibold text-[color:var(--color-text-primary)]">Проблема:</span> {it.problem}
            </p>
            <p className="mt-2 t-body text-[color:var(--color-text-secondary)]">
              <span className="font-semibold text-[color:var(--color-text-primary)]">Эффект:</span> {it.effect}
            </p>
          </PaperCard>
        </motion.div>
      ))}
    </div>
  );
}

/* Метка секции всегда с текстом: пустая «01 ———» рядом с полными метками
   на той же странице читалась как сбой (ревизия 17.09.2026). Где своего
   слова у секции нет — стоит колонтитул страницы. */
const Section = ({ n, label, title, children }: { n: string; label: string; title?: string; children: ReactNode }) => (
  <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
    <SectionLabel n={n}>{label}</SectionLabel>
    {title && <RevealHeading className="t-h2 mt-6 max-w-3xl">{title}</RevealHeading>}
    <div className="mt-8">{children}</div>
  </div>
);

const caseBy = (slug: string) => CASES.find((c) => c.slug === slug)!;

/* ==========================================================================
   /tasks/internal-experts — Распространение подходов (внутренние эксперты)
   ========================================================================== */

export function InternalExpertsPage() {
  const when: [string, string][] = [
    ["Зависимость от «незаменимых» сотрудников (риск Bus Factor)", "критические процессы и знания находятся в ведении 1–2 специалистов, чей уход остановит работу всего направления"],
    ["Когда достижение плановых показателей производительности у новичков занимает слишком много времени (Ramp-up time)", "линейный персонал медленно осваивает стандарты из-за отсутствия системного обучения и материалов"],
    ["Перегрузка наставников и руководителей", "ведущие специалисты тратят до 30–40% рабочего времени на повторные консультации коллег, вместо выполнения своих непосредственных задач"],
    ["Расширение бизнеса или открытие новых филиалов", "требуется быстро растиражировать выработанные стандарты работы по десяткам новых рабочих мест без потери качества"],
  ];
  const know = [
    "какие алгоритмы дают практический результат",
    "по каким признакам определять скрытые риски и сбои в работе",
    "как действовать в нестандартных и кризисных ситуациях",
    "где проходят границы допустимых решений, после которых необходима эскалация",
  ];
  const assets = [
    "стандарты и алгоритмы принятия решений",
    "структурированные базы знаний",
    "интерактивные тренажеры",
    "ИИ-ассистенты",
  ];
  const stages: [string, string][] = [
    ["Методы, которые обеспечивают нужный результат", "разбор и анализ принятых решений на примерах реальных задач эксперта (успешных, убыточных и спорных кейсов)"],
    ["Логика принятия решений эксперта и принципы работы", "фиксация неявных правил, критериев оценки и точек обязательной эскалации."],
    ["Переработка опыта в регламенты и учебные программы", "создание инструкций, тренажеров и систем оценки для использования всеми сотрудниками"],
    ["Тест программ и процессов в реальных условиях", "проверка применимости материалов на группе выбранных сотрудников"],
    ["Автономное применение", "тиражирование практики внутри компании без постоянного участия эксперта-носителя"],
  ];
  const formats: [string, string][] = [
    ["Для понимания логики", "видеоразбор реальных рабочих ситуаций с комментариями эксперта"],
    ["Нужна подсказка в процессе работы", "схемы, чеклисты, пошаговые алгоритмы и деревья решений"],
    ["Для точности расчетов", "калькуляторы типовых операций с заданными формулами и контрольными примерами"],
    ["Для коммуникаций", "сценарии-скрипты, сценарии диалогов и карточки ролевых моделей"],
    ["Для отработки навыков", "тренажеры типовых рабочих ситуаций и библиотека разобранных примеров из практики"],
    ["Для оперативного доступа", "ИИ-ассистент с ответами по корпоративной базе знаний"],
    ["Для контроля квалификации", "практические проверочные задания и критерии аттестации"],
  ];

  return (
    <PageShell path={BE.internal}>
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-right-40 top-[20%]", tone: "rose", size: 520 }]} />
        <PageHead
          kicker="Распространение подходов"
          title={<>Перевод неявного опыта ключевых сотрудников в системные инструменты компании</>}
          lead="Превращаем практический опыт, методы и логику решений ведущих специалистов в прикладные рабочие материалы. В результате новые и линейные сотрудники быстрее выходят на целевые показатели, а ключевые эксперты освобождаются от рутинного наставничества."
          actions={
            <>
              <FormButton>Оставить заявку на разбор задачи</FormButton>
              <QuietLink href={BE.internalEffect}>Экономический эффект БЕЗ ВОДЫ</QuietLink>
            </>
          }
        />

        <Section n="01" label="Распространение подходов" title="Когда актуально масштабирование практик">
          <TitledList items={when} />
        </Section>
      </section>

      <section className="relative border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
        <Section n="02" label="Распространение подходов" title="Систематизация опыта: от носителя знаний в процессы всей компании">
          <p className="max-w-3xl t-body text-[color:var(--color-text-secondary)]">
            В каждой организации критически важные результаты зависят от знаний и умений нескольких ключевых специалистов. Они знают:
          </p>
          <div className="mt-6 max-w-3xl">
            <NodeList divided items={know} />
          </div>
          <p className="mt-8 max-w-3xl t-body text-[color:var(--color-text-secondary)]">
            Если эти знания остаются неформализованными, компания оказывается зависимой от конкретных лиц. Наша задача — перевести багаж знаний ваших экспертов в отчуждаемые рабочие активы:
          </p>
          <div className="mt-6 max-w-3xl">
            <NodeList divided items={assets} />
          </div>
        </Section>
      </section>

      {/* «Пример с ИИ агентом» — кейс УрбанТех, как и стоит в редакции */}
      <section className="relative border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
        <Section n="03" label="Пример с ИИ агентом">
          <div className="max-w-3xl">
            <CaseCard item={caseBy("urbantech")} index={0} teaser />
          </div>
        </Section>
      </section>

      <section className="relative border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
        <Section n="04" label="Распространение подходов" title="Этапы формализации опыта">
          <Steps
            items={stages.map(([t, d]) => (
              <>
                <span className="font-semibold">{t}:</span> {d}
              </>
            ))}
          />
        </Section>
      </section>

      <section className="relative border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
        <Section n="05" label="Распространение подходов" title="Форматы итоговых образовательных программ и рабочих артефактов">
          <p className="max-w-3xl t-body text-[color:var(--color-text-secondary)]">
            Состав материалов подбирается под тип и контекст задачи
          </p>
          <div className="mt-6">
            <TitledList items={formats} />
          </div>
        </Section>
      </section>

      <section className="stage sec-dark grain relative border-b border-[color:var(--color-line-dark)]">
        <Scene blobs={[{ className: "-left-40 bottom-0", tone: "rose", size: 480 }]} />
        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <SectionLabel n="06">Первый этап</SectionLabel>
          <RevealHeading className="t-h2 mt-6 max-w-3xl text-[color:var(--color-text-inverse)]">
            Первый этап: карта экспертности (7–14 календарных дней)
          </RevealHeading>
          <p className="mt-6 max-w-3xl t-body text-[color:var(--color-text-inverse-2)]">
            Перед тем, как приступить к активной разработке программ и материалов, мы фиксируем структуру знаний. По итогам этапа у вас будет готовая карта компетенций, и далее решение за вами: разрабатывать материалы нашими силами «Без Воды», передать задачу вашему внутреннему отделу T&D или стороннему подрядчику. Все наработки остаются в вашей собственности.
          </p>
          {/* Кнопка «Оставить заявку» здесь снята: форма — следующий экран,
              и её кнопка стояла бы в ста пикселях ниже (ревизия 17.09). */}
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <QuietLink href="/expertise-map">Подробнее о составе Карты экспертности</QuietLink>
            <QuietLink href={BE.internalEffect}>Экономический эффект</QuietLink>
          </div>
        </div>
      </section>

      <Contact />
    </PageShell>
  );
}

/* ==========================================================================
   /tasks/internal-experts/business-effect — эксперты внутри компании
   ========================================================================== */

export function InternalExpertsEffectPage() {
  const effects = [
    {
      title: "Высвобождение до 30–40% рабочего времени ваших ключевых сотрудников",
      problem: "Ведущие инженеры, руководители и топ-сейлы тратят часы на повторяющиеся консультации, разбор чужих ошибок и ручное обучение новичков.",
      effect: "Ответы на типовые вопросы находятся в базе знаний, с интерактивными тренажерами. Эксперты возвращаются к своим непосредственным задачам, приносящим прямую прибыль компании.",
    },
    {
      title: "Сокращение срока адаптации новых сотрудников (Ramp-up time) в 2–2,5 раза",
      problem: "Линейные сотрудники долго осваивают специфику работы методом проб и ошибок, отдаляя выход на плановые KPI.",
      effect: "Новички с первых дней получают проверенные алгоритмы принятия решений и разбирают реальные случаи из практики компании, достигая нужных показателей значительно быстрее.",
    },
    {
      title: "Снижение операционных ошибок и брака на местах",
      problem: "При отсутствии стандартов сотрудники действуют на основе субъективных догадок, что приводит к срыву сроков, потере клиентов и необходимости переделывать работу заново.",
      effect: "Фиксация логики действий ведущих сотрудников и точек обязательной эскалации снижает процент брака и риск принятия некорректных решений.",
    },
    {
      title: "Ликвидация риска потери знаний («Bus Factor = 1»)",
      problem: "Авторская методика и понимание процессов находятся «в головах» конкретных специалистов. В случае их ухода компания теряет интеллектуальный капитал и несет прямые финансовые убытки.",
      effect: "Знания переходят из категории личного опыта в категорию отчуждаемого нематериального актива компании (IP), доступного всей команде независимо от смены кадров.",
    },
  ];
  const risks: [string, string][] = [
    ["Прозрачные критерии приема до старта работ", "Состав артефактов (алгоритмы, тренажеры, база знаний) и требования к ним фиксируются в договоре до начала реализации."],
    ["Единая точка контроля и ответственности", "Проектное бюро «Без Воды» берет на себя всю методологическую часть, работу с экспертами вашей компании и подготовку учебных форматов по одному рамочному договору"],
    ["Поэтапный контроль инвестиций: Карта экспертности (7–14 дней)", "Первый шаг — разработка Карты экспертности, которая является самостоятельным законченным продуктом. Вы получаете систематизированную карту знаний, матрицу компетенций и дерево решений"],
  ];

  return (
    <PageShell path={BE.internalEffect}>
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-left-40 top-[20%]", tone: "chrome", size: 520 }]} />
        <PageHead
          kicker="Эксперты внутри компании"
          title={<>Экономический и операционный эффект</>}
          actions={
            <>
              <FormButton>Оставить заявку на разбор задачи</FormButton>
              <QuietLink href={PDF.internal} download>Скачать расчет экономического эффекта БЕЗ ВОДЫ в PDF</QuietLink>
              <QuietLink href={BE.internal}>Как мы передаем опыт ключевых сотрудников</QuietLink>
            </>
          }
        />
        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <ProblemEffect items={effects} />
        </div>
      </section>

      <section className="relative border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
        <Section n="01" label="Эксперты внутри компании" title="Сравнение операционных моделей">
          <Table3
            head={["Параметр", "Опыт хранится в головах сотрудников", "Опыт оцифрован и передан в систему"]}
            rows={[
              ["Обучение новичков", "Ручное, нерегулярное, зависит от занятости наставника", "Автономное: по интерактивным трекам и стандарту оценки"],
              ["Стоимость масштабирования", "Линейно растет нагрузка на экспертов и руководителей", "Единоразовая инвестиция в разработку с бесплатным тиражированием"],
              ["Зависимость от ключевых кадров", "Высокая: уход сотрудника создает критический сбой", "Минимальная: алгоритмы и логика зафиксированы в стандартах компании"],
              ["Контроль качества", "Субъективный: «на усмотрение руководителя»", "Объективный: по чек-листам и матрице компетенций"],
            ]}
          />
        </Section>
      </section>

      <section className="relative border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
        <Section n="02" label="Эксперты внутри компании" title="Снижение управленческих и финансовых рисков проекта">
          <TitledCards items={risks} />
        </Section>
      </section>

      <Contact />
    </PageShell>
  );
}

/* ==========================================================================
   /tasks/team-subscription — Подписка на отдел обучения
   ========================================================================== */

/* Состав подписки — четыре группы. Абонементы и ИПР общие с конструктором
   (data.tsx). Пункт без описания — одной строкой. */
type Unit = [string, string?, string?]; // заголовок, описание, ссылка
const SUB_GROUPS: { title: string; items: Unit[] }[] = [
  {
    title: "Управление проектом или продуктом",
    items: [
      ["Разработка и ведение комплексной программы", "архитектура программы, работа с экспертами, управление разработкой продукта и реализацией проекта"],
      ["Регулярное обучение по вашей программе", "ежемесячно мы проводим для вас 40 часов обучения по согласованному расписанию, по вашим материалам"],
      ["16 часов модераций и фасилитаций рабочих совещаний, управление процессом очно или онлайн. Подготовка сессии и итоговые материалы включены в стоимость"],
      ["Операционное сопровождение обучения ежемесячно", "расписание, организация отдельных мероприятий и взаимодействие с участниками, сбор обратной связи, отчетность по результатам."],
      [IPR_UNIT.title, IPR_UNIT.what],
      [ABONEMENTS.methodologist.title, ABONEMENTS.methodologist.what],
      [ABONEMENTS.trainer.title, ABONEMENTS.trainer.what],
      [ABONEMENTS.coordinator.title, ABONEMENTS.coordinator.what],
    ],
  },
  {
    title: "Разработка учебных продуктов",
    items: [
      ["Онлайн-курс или сценарий тренинга — срок 10 дней", "мы передаем вам полный комплект материалов: паспорт проекта, сценарий, раздаточные материалы, презентация, программа, дополнительные материалы для самостоятельного чтения и т. д."],
      ["Адаптация ваших материалов — оплата за единицу, срок 2 дня", "внесение правок в готовые материалы под новую аудиторию или формат (онлайн или офлайн, обновления и другие изменения)"],
      ["Подготовка курса в LMS за 2 дня", "готовый материал оформлен и опубликован в вашей системе"],
      ["Подписка на поддержание актуальности разработанных нами материалов на платформе, благодаря чему они не устаревают"],
    ],
  },
  {
    title: "Инструменты работы — для всей команды",
    items: [
      ["Карта экспертности за 10 дней", "карта знаний компании, матрица компетенций и дорожная карта: чей опыт требует распространения, во что он превращается и в каком порядке", "/expertise-map"],
      ["База знаний для всей команды за 20 дней", "все необходимые знания, практические рекомендации собраны в структуру (библиотеку), которой пользуется вся команда."],
      ["Цифровой наставник по базе знаний за 10 дней", "подскажет, сформулирует, структурирует, предложит — поддержит вашу команду круглосуточно."],
    ],
  },
  {
    title: "ИИ-автоматизация и сопровождение",
    items: [
      ["Автоматизация процессов обучения «под ключ»", "надстройка на ваши действующие сервисы, без замены системы"],
      ["«Цифровой тренер»", "платформа для тренеров и фасилитаторов: инструменты вовлечения онлайн и офлайн аудитории на тренингах и сессиях"],
      ["Поддержание внедренных агентов и процессов", "настроенные процессы продолжают работать: обновления, исправления, изменения под новые задачи"],
    ],
  },
];

export function TeamSubscriptionPage() {
  const corp: [string, string[]][] = [
    ["Разделение стратегии и «фабрики контента»", [
      "Внутренние HR-бизнес-партнеры и лидеры обучения должны заниматься стратегией: работать с талантами, планировать преемственность, анализировать запросы клиентов и предугадывать дальнейшие шаги. Но в реальности они тонут в рутине: верстают курсы, пишут сценарии для видео и администрируют LMS.",
      "Мы берем на себя производительную часть работы, высвобождая время штатной команды для своих основных обязанностей.",
    ]],
    ["Эластичность ресурсов с учетом неравномерной нагрузки.", [
      "Потребность в разработке новых программ обучения в корпорациях всегда идет волнами: внедрение новой ERP-системы, сезонный массовый найм, запуск нового продукта.",
      "Нанимать под такой всплеск опытных методологов и разработчиков в штат — это долго (3–4 месяца на рекрутинг) и дорого (раздувание ФОТ).",
      "Мы даем возможность быстро подключить готовую команду на полгода, закрыть пик задач и остановить работы, когда они больше не нужны.",
    ]],
    ["Преодоление внутренней бюрократии и скорости найма", [
      "Чтобы открыть новую ставку Senior-методолога, нужно защитить бюджет, пройти согласования, провести поиск и онбординг. На это уходит 3–4 месяца.",
      "Подписка на наши услуги оформляется как сервисный контракт (B2B-услуга, OpEx), бюджет на который часто уже запланирован или согласуется быстрее, чем расширение штатного расписания. Мы стартуем через 24 часа.",
    ]],
  ];
  const edtech: [string, string[]][] = [
    ["Пропускная мощность отдела (Устранение узкого горлышка)", [
      "Roadmap продуктовой команды, как правило, расписан на год вперед. Внезапно появляется тренд (например, внедрение ИИ), и курс нужно выпустить в оборот через месяц, иначе преимущество будет у конкурентов. Внутренние продюсеры перегружены текущими проектами. Наша команда подключается как параллельный конвейер, который позволяет выпустить продукт в срок, не ломая текущий план разработки.",
    ]],
    ["Управление экономикой продукта (Unit-экономика)", [
      "Наем людей в штат повышает постоянные издержки бизнеса. Покупая команду по подписке, CPO переводит затраты на разработку в переменную часть (Cost of Goods Sold)",
    ]],
    ["Профессиональная расшифровка знаний спикеров", [
      "Успешный EdTech строится на звездных авторах (это, как правило, топ-менеджеры бигтеха, серийные предприниматели, Senior-разработчики). Эти люди не умеют преподавать и у них нет времени писать сценарии уроков.",
      "Senior-методологи привлекаются именно как «экстракторы» — чтобы получить от такого профессионала необходимые знания, или перенять know-how всего на нескольких интервью и гарантированно довести курс до запуска, не допустить срыва.",
    ]],
  ];
  const principle: [string, string][] = [
    ["Оплата за единицы продукта", "оплачиваются готовые продукты-артефакты (готовый модуль курса, разработанный тренажер, регламент, проведенная сессия), не привязываясь к количеству часов."],
    ["Старт за 24–48 часов", "подключение нашей проектной команды (ведущий методолог, проджект-менеджер, сборщик курсов), без необходимости проходить весь цикл подбора и адаптации."],
    ["Гибкое перераспределение задач", "объем и фокус работ можно менять от месяца к месяцу согласно актуальным приоритетам, от создания сложного курса до аудита ключевых процессов."],
  ];
  const comfort = [
    "Под каждую задачу мы выделяем необходимые ресурсы: методологию, разработку и управление проектом.",
    "Работаем своими методами, по своему графику в рамках согласованных сроков. Доступ к внутренним системам запрашиваем только при технической необходимости для реализации проекта.",
    "Мы ответственны за результат, поэтому, если возникают сложности с исполнителями или доступами к инструментам, мы сами решаем этот вопрос, и на сроках и качестве это не отражается.",
  ];

  const Audience = ({ title, items }: { title: string; items: [string, string[]][] }) => (
    <div>
      <div className="t-eyebrow text-[color:var(--color-text-secondary)]">{title}</div>
      <div className="mt-4 grid items-stretch gap-4 md:grid-cols-3">
        {items.map(([t, paras], i) => (
          <motion.div key={t} {...reveal(i)} className="h-full">
            <PaperCard className="h-full p-6">
              <div className="font-display t-body font-semibold">{t}</div>
              {paras.map((p) => (
                <p key={p} className="mt-2.5 t-body text-[color:var(--color-text-secondary)]">{p}</p>
              ))}
            </PaperCard>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <PageShell path={BE.team}>
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-right-40 top-[20%]", tone: "rose", size: 520 }]} />
        <PageHead
          kicker="Подписка"
          title={<>Подписка на отдел обучения</>}
          lead="Проектная команда для отделов обучения и EdTech-компаний. Решаем задачи по разработке образовательных программ, реализации тренингов и передаче готового продукта в распоряжение клиента без увеличения вашего постоянного штата."
          actions={
            <>
              <FormButton>Оставить заявку на расчет подписки</FormButton>
              <QuietLink href={BE.teamEffect}>Экономический эффект</QuietLink>
            </>
          }
        />

        <Section n="01" label="Подписка" title="Какие задачи решает подписка">
          <div className="space-y-12">
            <Audience title="Для корпоративных клиентов (HR и T&D)" items={corp} />
            <Audience title="Для образовательных компаний и онлайн-университетов / EdTech (CPO, Продюсер, Руководитель направления)" items={edtech} />
            <div>
              <div className="t-eyebrow text-[color:var(--color-text-secondary)]">Экспресс-тестирование новых бизнес-идей и направлений, а также MVP (Product Discovery)</div>
              <p className="mt-4 max-w-3xl t-body text-[color:var(--color-text-secondary)]">
                Чтобы проверить спрос на новую тему или профессию, создавать полноценный 6-месячный курс со своей штатной командой слишком долго и рискованно. Наша команда за 24 часа собирает группу для производства MVP-продукта (интенсив, микрокурс, серию воркшопов, интерактивный тренажер или марафон) и через 2–3 недели вы можете испытать новую разработку. EdTech тестирует конверсию, собирает обратную связь от первой когорты и принимает решение о запуске нового курса или программы без заморозки внутренних ресурсов.
              </p>
            </div>
          </div>
        </Section>
      </section>

      <section className="relative border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
        <Section n="02" label="Подписка" title="Принцип работы: результат вместо человеко-часов">
          <TitledCards items={principle} />
        </Section>
      </section>

      <section className="relative border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
        <div id="units" className="relative mx-auto max-w-7xl px-5 sec-pad scroll-mt-28 md:px-8">
          <SectionLabel n="03">Что входит в подписку</SectionLabel>
          <RevealHeading className="t-h2 mt-6 max-w-3xl">
            Подписка от 180 000 ₽ в месяц. Пакет услуг и объем задач выбираете вы
          </RevealHeading>

          <div className="mt-8 space-y-12">
            {SUB_GROUPS.map((g) => (
              <div key={g.title}>
                <div className="t-eyebrow text-[color:var(--color-text-secondary)]">{g.title}</div>
                <ul className="mt-4 max-w-3xl divide-y divide-border border-y border-[color:var(--color-line)]">
                  {g.items.map(([t, d, href], i) => (
                    <li key={t} className="flex items-baseline gap-4 py-4">
                      <span className="font-display t-label tabular-nums text-[color:var(--color-accent)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <div className="font-display t-body font-semibold">{t}</div>
                        {d && <p className="mt-1.5 t-body text-[color:var(--color-text-secondary)]">{d}</p>}
                        {href && (
                          <a href={href} className="link-arrow group mt-2 t-body">
                            Смотреть, что входит
                            <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stage sec-dark grain relative border-b border-[color:var(--color-line-dark)]">
        <Scene blobs={[{ className: "-left-40 top-0", tone: "chrome", size: 420 }]} />
        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <SectionLabel n="04">Ваше удобство в нашей экипировке</SectionLabel>
          <div className="mt-8 grid items-stretch gap-4 md:grid-cols-3">
            {comfort.map((t, i) => (
              <motion.div key={t} {...reveal(i)} className="surface-dark notch h-full rounded-md p-6">
                <p className="t-body text-[color:var(--color-text-inverse)]">{t}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="stage sec-dark grain relative border-b border-[color:var(--color-line-dark)]">
        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <SectionLabel n="05">Личный кабинет</SectionLabel>
          <div className="max-w-3xl">
            <RevealHeading className="t-h2 mt-6 text-[color:var(--color-text-inverse)]">
              Прозрачность данных по вашим пакетам
            </RevealHeading>
            <p className="mt-6 t-body text-[color:var(--color-text-inverse-2)]">
              Состав и план работ на месяц фиксируется заранее и виден в личном кабинете: что заказано, что в работе, что принято, каков остаток средств по каждому пакету. Движение показано в единицах результата, а не в часах. При изменении состава работ остаток сразу же пересчитывается.
            </p>
          </div>
        </div>
      </section>

      <Contact />
    </PageShell>
  );
}

/* ==========================================================================
   /tasks/team-subscription/business-effect — подписка на отдел обучения
   ========================================================================== */

export function TeamSubscriptionEffectPage() {
  const manage: [string, string][] = [
    ["Взаимозаменяемость единиц результата", "Внутри оплаченного пакета вы можете перераспределять задачи"],
    ["Прозрачность в личном кабинете", "Контроль ведется по статусам выполнения артефактов, а не по отчетам о трудозатратах"],
    ["Опция поддержания актуальности", "После завершения крупных релизов ваша подписка переводится в режим поддержки на минимальный объем, чтобы материалы своевременно обновлялись, а наша команда оставалась в рабочем контексте вашей компании"],
  ];
  return (
    <PageShell path={BE.teamEffect}>
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-left-40 top-[20%]", tone: "chrome", size: 520 }]} />
        <PageHead
          kicker="Подписка на отдел обучения"
          title={<>Экономический эффект</>}
          actions={
            <>
              <FormButton>Оставить заявку на расчет объема</FormButton>
              <QuietLink href={PDF.team} download>Скачать расчет экономического эффекта БЕЗ ВОДЫ в PDF</QuietLink>
              <QuietLink href={BE.team}>Состав услуг</QuietLink>
            </>
          }
        />

        <Section n="01" label="Подписка на отдел обучения" title="Сравним: штатная команда vs Подписка «Без Воды»">
          <p className="max-w-3xl t-body text-[color:var(--color-text-secondary)]">
            Для полноценного цикла разработки программы обучения компании требуется как минимум 3 специалиста. Расчет совокупной стоимости штатной команды в сравнении с подпиской БЕЗ ВОДЫ
          </p>
          <div className="mt-8">
            <Table3
              head={["Статья расходов", "Штатная команда (3 роли)", "Подписка БЕЗ ВОДЫ"]}
              rows={[
                ["Методолог / Старший методист", "120 000 – 150 000 ₽ / мес. (gross)", "Включен в состав рабочей группы"],
                ["Руководитель проекта (PM)", "180 000 – 250 000 ₽ / мес. (gross)", "Включен в состав рабочей группы"],
                ["Сборщик курсов / LMS-верстальщик", "90 000 – 120 000 ₽ / мес. (gross)", "Включен в состав рабочей группы"],
                ["Прямой ФОТ в месяц", "390 000 – 520 000 ₽", "от 180 000 ₽"],
                ["Налоги и страховые взносы (~30%)", "+ 117 000 – 156 000 ₽ / мес.", "0 ₽ (включено в счет)"],
                ["Затраты на рекрутинг (агентство/HR)", "от 350 000 ₽ (разово за команду)", "0 ₽"],
                ["Оснащение, ПО, онбординг", "от 150 000 ₽ (разово) + лицензии", "0 ₽ (работаем на своих софтах)"],
                ["Итого реальные затраты (1-й мес.)", "от 1 000 000+ ₽", "от 180 000 ₽"],
              ]}
              total={["Ежемесячные затраты далее", "от 507 000 – 676 000 ₽ / мес.", "Фиксированный пакет по договору (от 180 000)"]}
            />
          </div>
          <p className="mt-5 max-w-3xl t-caption text-[color:var(--color-text-secondary)]">
            Справочно: расчет фонда оплаты труда основан на медианных зарплатных предложениях (hh.ru, Москва, выборка на август 2026 года).
          </p>
        </Section>
      </section>

      <section className="relative border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
        <Section n="02" label="Подписка на отдел обучения" title="Границы экономической целесообразности">
          <div className="grid items-stretch gap-4 md:grid-cols-2">
            <PaperCard className="h-full p-6">
              <div className="font-display t-body font-semibold">Когда подписка выгодна:</div>
              <div className="mt-4">
                <NodeList
                  items={[
                    "Нагрузка на разработку распределена неравномерно (сезонные запуски, открытие филиалов, запуск новых направлений)",
                    "Требуется закрыть внеплановые или срочные задачи по обучению, пока штатные сотрудники ведут регулярные процессы",
                    "Нужен одноразовый доступ к редкой экспертизе высокого уровня (знания специалистов по сложным техническим темам, проектирование ИИ-агентов)",
                  ]}
                />
              </div>
            </PaperCard>
            <PaperCard className="h-full p-6">
              <div className="font-display t-body font-semibold">Когда выгоднее развивать штат:</div>
              <div className="mt-4">
                <NodeList
                  items={[
                    "Если объем задач по обучению однотипен, полностью стабилизирован и предсказуем на 2–3 года вперед, в этом случае дешевле выстраивать внутреннюю операционную команду.",
                  ]}
                />
              </div>
            </PaperCard>
          </div>
        </Section>
      </section>

      <section className="relative border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
        <Section n="03" label="Подписка на отдел обучения" title="Вы управляете подпиской">
          <TitledCards items={manage} />
          <p className="mt-8 t-body text-[color:var(--color-text-secondary)]">
            Работаем по договору возмездного оказания услуг с ИП Уткина В. В.
          </p>
        </Section>
      </section>

      <Contact />
    </PageShell>
  );
}

/* ==========================================================================
   /tasks/external-experts — Практики, опробованные в реальных условиях
   ========================================================================== */

export function ExternalExpertsPage() {
  const steps = [
    "За 30 минут мы с вами обсуждаем задачу и договариваемся, какой именно опыт здесь необходим и по каким признакам мы поймем, что результат достигнут",
    "В течение 60 минут после обсуждения задачи мы присылаем вам описание опыта и подтвержденные кейсы практиков, которые будут работать над задачей в рамках проекта.",
    "Вы знакомитесь с практиком, и мы вместе согласуем состав команды под задачу",
    "Согласованный эксперт работает с вашей задачей. Меняем состав команды, если понимаем, что для нужного результата требуется иное видение или подход",
    "Мы фиксируем логику решений эксперта и переносим в обучающие материалы для ваших сотрудников: программу, стандарты оценки, базу знаний, и передаем вам.",
  ];
  return (
    <PageShell path={BE.external}>
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-right-40 top-[20%]", tone: "rose", size: 520 }]} />
        <PageHead
          kicker="Внешние эксперты"
          title={<>Практики, опробованные в реальных условиях</>}
          lead="Знания и навыки, которыми не владеют специалисты внутри компании, вы сможете получить без долгого поиска и обращений к консалтинговым агентствам."
          actions={
            <>
              <FormButton>Оставить заявку на разбор задачи</FormButton>
              <QuietLink href={BE.externalEffect}>Экономический эффект</QuietLink>
            </>
          }
        />
        <Section n="01" label="Внешние эксперты" title="Скорость решения вашей задачи и ваш комфорт — наши приоритеты">
          <Steps items={steps} />
        </Section>
      </section>

      <Contact />
    </PageShell>
  );
}

/* ==========================================================================
   /tasks/external-experts/business-effect — приглашенные эксперты
   ========================================================================== */

export function ExternalExpertsEffectPage() {
  const groups: [string, [string, string][]][] = [
    ["Сокращение сроков запуска (Time-to-Market)", [
      ["Старт проекта за 1–2 дня вместо 1–2 месяцев", "подключение проверенного эксперта под конкретную задачу без необходимости запускать стандартный цикл поиска"],
      ["Быстрый выход на операционные показатели", "запуск нового направления в бизнесе по готовым алгоритмам и без потерь времени на проверку неработающих гипотез"],
    ]],
    ["Оптимизация бюджета (OpEx) и ФОТ", [
      ["Экономия на постоянных расходах", "не нужно открывать высокооплачиваемую штатную ставку C-level или позицию узкого профиля под временную задачу"],
      ["Снижение затрат на консалтинг", "оплата идет непосредственно на решение прикладной задачи и разработку методологии, нет наценки агентств и посредников"],
    ]],
    ["Сохранение и защита знаний внутри компании", [
      ["Нет зависимости от внешних, приглашенных исполнителей", "методология и логика решений эксперта документируются и передаются в собственность компании (регламенты, база знаний, обучающие модули)"],
      ["Готовая система тиражирования", "возможность масштабировать процесс и самостоятельно обучать или адаптировать новых сотрудников, соблюдая созданные стандарты без повторного привлечения внешних консультантов"],
    ]],
  ];
  return (
    <PageShell path={BE.externalEffect}>
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-left-40 top-[20%]", tone: "chrome", size: 520 }]} />
        <PageHead
          kicker="Приглашенные эксперты"
          title={<>Экономический эффект</>}
          actions={
            <>
              <FormButton>Оставить заявку на разбор задачи</FormButton>
              <QuietLink href={PDF.external} download>Скачать расчет экономического эффекта БЕЗ ВОДЫ в PDF</QuietLink>
              <QuietLink href={BE.external}>Как мы привлекаем практиков</QuietLink>
            </>
          }
        />
      </section>

      {groups.map(([t, items], i) => (
        <section key={t} className="relative border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
          <Section n={String(i + 1).padStart(2, "0")} label="Приглашенные эксперты" title={t}>
            <TitledList items={items} />
          </Section>
        </section>
      ))}

      {/* «Пример / КЕЙС» — кейс B2B-компании, как и прежде на этой странице */}
      <section className="relative border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
        <Section n="04" label="Пример">
          <div className="max-w-3xl">
            <CaseCard item={caseBy("b2b-procurement")} index={0} teaser />
          </div>
          <a href="/cases" className="link-arrow group mt-8 t-body">
            Все кейсы
            <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </Section>
      </section>

      <Contact />
    </PageShell>
  );
}

/* ==========================================================================
   /business-effect — Экономический эффект: ROI обучения
   ========================================================================== */

export function BusinessEffectGeneralPage() {
  const groups: [string, [string, string?][]][] = [
    ["Капитализация знаний (IP & Rights): превращаем затраты в активы баланса", [
      ["+100% прав", "полное отчуждение исключительных прав и исходных кодов (IP) переходит без скрытых лицензий, SaaS-подписок и роялти"],
      ["Экономия > 2 млн руб./год", "нулевые платежи за сопровождение после сдачи проекта. Отсутствие технологической привязки позволяет менять LMS-платформу без потери контента"],
      ["Срок амортизации актива ≤ 18 месяцев за счет снижения стоимости владения обучением"],
    ]],
    ["Оптимизация бюджета T&D и операционная гибкость", [
      ["−100% ФОТ на проектную команду", "экономия от 1,5 млн рублей на старте: не нужно нанимать в штат методологов, продюсеров и бизнес-тренеров под разовые задачи"],
      ["Фиксация бюджета ±5%", "оплата только за готовые артефакты (программа, тренажер, регламент). Никаких счетов за «отработанные часы», созвоны или внутренние согласования"],
      ["Прозрачный CapEx вместо OpEx", "вы получаете материальный актив сразу, а не распределенные расходы по году"],
    ]],
    ["Сокращение сроков запуска программ (Time-to-Delivery)", [
      ["Старт через 24–48 часов", "подключение рабочей группы без RFI/RFP, тендеров и онбординга, который обычно занимает 1–3 месяца"],
      ["Высвобождение ресурса ≈ 3 FTE", "сотрудники тратят 0% времени на написание текстов и координацию фрилансеров. До 40% их рабочего времени, уходившего на повторяющиеся запросы, перенаправляется на стратегические KPI отдела."],
      ["Скорость производства ×2,5", "параллельная работа нескольких экспертов над разными модулями сокращает общий цикл разработки программы среднего объема (например, из 10 модулей) с 3 месяцев до 4–6 недель"],
      ["Мгновенный перерасчет", "баланс трудозатрат и объем работ корректируются за 1 рабочий день без перезапуска договора и бюрократических пауз"],
    ]],
  ];
  const why = [
    "100% фокус на T&D и EdTech. Работаем исключительно в сфере корпоративного обучения. Извлекаем «скрытый» практический опыт узкопрофильных C-level экспертов и инженеров, превращая их подходы в понятные сотрудникам алгоритмы",
    "Экономия до 80% времени топ-менеджмента: они тратят ≤ 3 часов на проверку фактов вместо дней подготовки текстов",
    "Коэффициент переиспользования учебных материалов > 70%: созданные материалы интегрируются в базу знаний и используются HR-бизнес-партнерами без привлечения внешних подрядчиков",
    "Сокращение административных расходов L&D-отдела на ~15–20% за счет отказа от ведения десятка договоров с фрилансерами",
    "Экономия от 50 часов руководства: клиент проверяет готовые смыслы за 30–40 минут вместо того, чтобы писать учебные материалы с нуля",
    "13+ лет — средний опыт экспертов. Никакого этапа обучения за ваш счет: команда сразу решает задачу",
    "Снижение рисков внедрения до 0%: проект считается завершенным только после того, как пилотная группа решит реальную задачу по новому стандарту",
  ];
  const timeline: [string, string][] = [
    ["5 минут", "Отвечаем на заявку"],
    ["30 минут", "Обсуждаем вашу задачу"],
    ["24 часа", "Включаемся в работу"],
  ];

  return (
    <PageShell path={BE.general}>
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-right-40 top-[20%]", tone: "rose", size: 520 }]} />
        <PageHead
          kicker="Экономический эффект от наших услуг"
          title={<>Экономический эффект: ROI обучения</>}
          chips={[
            ["до 40%", "Инвестиции в создание собственных нематериальных активов при одновременном сокращении затрат на внешних подрядчиков до 40%"],
            ["на 25–30%", "Выход сотрудников на плановые показатели эффективности (TTV) быстрее на 25–30% за счет готовых алгоритмов работы"],
          ]}
          actions={
            <>
              <FormButton>Оставить заявку на разбор задачи</FormButton>
              <QuietLink href={PDF.general} download>Скачать расчет экономического эффекта БЕЗ ВОДЫ в PDF</QuietLink>
            </>
          }
        />
      </section>

      {groups.map(([t, items], i) => (
        <section key={t} className="relative border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
          <Section n={String(i + 1).padStart(2, "0")} label="Экономический эффект" title={t}>
            <TitledList items={items} />
          </Section>
        </section>
      ))}

      <section className="stage sec-dark grain relative border-b border-[color:var(--color-line-dark)]">
        <Scene blobs={[{ className: "-left-40 top-0", tone: "chrome", size: 420 }]} />
        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <SectionLabel n="04">Почему мы / специализация</SectionLabel>
          <p className="mt-6 max-w-3xl t-body text-[color:var(--color-text-inverse)]">
            Мы не консалтинг широкого профиля и не кадровое агентство. Наша специальность — промышленная разработка учебного дизайна и проектное управление знаниями для корпоративных университетов и EdTech-компаний.
          </p>
          <ul className="mt-8 max-w-3xl divide-y divide-[color:var(--color-line-dark)] border-y border-[color:var(--color-line-dark)]">
            {why.map((t) => (
              <li key={t} className="flex items-start gap-4 py-4 t-body text-[color:var(--color-text-inverse-2)]">
                <NodeBullet className="mt-[0.55em]" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)]">
        <Section n="05" label="Экономический эффект">
          <div className="grid gap-4 sm:grid-cols-3">
            {timeline.map(([t, d], i) => (
              <motion.div key={t} {...reveal(i)} className="h-full">
                <PaperCard className="h-full p-6">
                  <div className="font-display t-h2 tabular-nums tracking-[-0.02em]">{t}</div>
                  <p className="mt-2 t-body text-[color:var(--color-text-secondary)]">{d}</p>
                </PaperCard>
              </motion.div>
            ))}
          </div>
        </Section>
      </section>

      <Contact />
    </PageShell>
  );
}
