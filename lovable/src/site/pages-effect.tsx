/* ============================================================================
   pages-effect.tsx — раздел «Бизнес-эффект» (финальная структура от 02.08).
   Семь страниц: три продуктовые (/tasks/…), три подстраницы эффекта
   (/tasks/…/business-effect) и общая /business-effect.
   Тексты — СЛОВО В СЛОВО из документа «Раздел „Бизнес-эффект“ — финальные
   тексты четырех страниц» (02.08.2026); менять их здесь нельзя, правки —
   только через Викторию. Раскладка экранов по страницам — по документу
   «финальная структура сайта» той же даты.
   ========================================================================== */
import { Fragment } from "react";
import {
  motion,
  ArrowUpRight, ArrowRight, ArrowDown, Check,
  PageShell, PageHead, SectionLabel, PaperCard, GlassCard, Scene, NodeScene, CtaBand,
  RevealHeading, NodeBullet, NodeList, Stencil, CatMark, LineIcon,
  reveal, ctaHref, CTA_LABEL,
  type ReactNode,
} from "./core";
import { SITUATIONS } from "./data";

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

function CtaButton({ path }: { path: string }) {
  return (
    <a href={ctaHref(path)} className="btn btn-invert group w-full sm:w-auto">
      <span>{CTA_LABEL}</span>
      <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
    </a>
  );
}

/* Второе действие на угольной обложке — тихая ссылка, как в hero главной:
   стеклянная кнопка на малой площади вырождается в серую плашку и читается
   выключенной. Стрелка вниз оставлена: по ней видно, что это скачивание. */
function PdfButton({ file }: { file: string }) {
  return (
    <a
      href={file}
      download
      className="link-arrow group t-body text-[color:var(--color-text-inverse-2)] hover:text-[color:var(--color-text-inverse)] print:hidden"
    >
      Скачать эту страницу в PDF
      <ArrowDown data-arrow="down" className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
    </a>
  );
}

/* Ссылка «Бизнес-эффект и цифры» (продуктовая → подстраница) и
   «Как устроена работа» (подстраница → продуктовая) — формулировки из ТЗ. */
function EffectLink({ href, dark = false }: { href: string; dark?: boolean }) {
  return (
    <a
      href={href}
      className={`link-arrow group t-body ${dark ? "text-[color:var(--color-text-inverse-2)] hover:text-[color:var(--color-text-inverse)]" : ""}`}
    >
      Бизнес-эффект и цифры
      <ArrowUpRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

function HowLink({ href, dark = false }: { href: string; dark?: boolean }) {
  /* Ярлык «Как решаем эту задачу»: прежний «Как устроена работа» почти
     дублировал пункт меню «Как мы работаем», но вёл в другое место */
  return (
    <a
      href={href}
      className={`link-arrow group t-body ${dark ? "text-[color:var(--color-text-inverse-2)] hover:text-[color:var(--color-text-inverse)]" : ""}`}
    >
      Как решаем эту задачу
      <ArrowUpRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

/* Выход из тупика: на продуктовой странице и странице эффекта в тексте было
   всего 4 ссылки — форма и своя же подстраница. Ни назад в хаб, ни к двум
   другим ситуациям: человек, которому эта ситуация не подошла, уходил с сайта.
   Названия ситуаций берутся из data.tsx — те же, что на главной и в хабе. */
function OtherSituations({ current }: { current: string }) {
  /* На страницах эффекта current приходит с суффиксом /business-effect —
     без среза фильтр не находил родителя, и «Другие ситуации» показывали
     все три, включая текущую (поймано вторым раундом разбора). */
  const base = current.replace(/\/business-effect$/, "");
  const others = SITUATIONS.filter((s) => s.href !== base);
  return (
    <div className="relative border-t border-[color:var(--color-line)]">
      <div className="mx-auto max-w-7xl px-5 sec-pad md:px-8">
        <div className="t-eyebrow text-[color:var(--color-text-secondary)]">Другие ситуации</div>
        <div className="mt-6 grid items-stretch gap-4 sm:grid-cols-2">
          {others.map((s, i) => (
            <motion.a
              key={s.id}
              href={s.href}
              {...reveal(i)}
              className="card-link group h-full"
            >
              <PaperCard className="flex h-full items-start justify-between gap-4 p-6">
                <span className="font-display t-body font-semibold">{s.situation}</span>
                <ArrowRight
                  data-arrow
                  className="mt-1 h-4 w-4 shrink-0 text-[color:var(--color-text-secondary)] transition-colors duration-300 group-hover:text-[color:var(--color-accent)]"
                />
              </PaperCard>
            </motion.a>
          ))}
        </div>
        <a href="/tasks" className="link-arrow group mt-6 t-body">
          Все задачи и решения
          <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}

/* Плитки цифр примера — на тёмной сцене, значения Unbounded */
function MetricTiles({ items }: { items: [string, string][] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map(([value, label], i) => (
        <motion.div key={label} {...reveal(i)} className="surface-dark notch rounded-md px-5 py-6">
          <div className="font-display t-number tabular-nums tracking-[-0.02em] text-[color:var(--color-text-inverse)] hyphens-none [overflow-wrap:anywhere]">
            {value}
          </div>
          <p className="mt-3 t-body text-[color:var(--color-text-inverse-2)]">{label}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* Карточки «Заголовок. Текст» — общий приём для экранов «Что меняется…» */
function TitledCards({
  items,
  cols = "sm:grid-cols-3",
}: {
  items: [string, string][];
  cols?: string;
}) {
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

/* --------------------- Таблица «Сколько стоит внутри» --------------------- */
/* Одна и та же таблица живёт на /business-effect (экран 5) и на подстранице
   подписки (экран 4) — различаются только строки вокруг неё. */

const STAFF_ROWS: [string, string][] = [
  ["Методолог", "120 000 — 150 000 ₽"],
  ["Руководитель проекта", "180 000 — 250 000 ₽"],
  ["Дизайнер и сборщик курсов в системе обучения", "90 000 — 120 000 ₽"],
];
const STAFF_TOTAL: [string, string] = ["Итого фонд оплаты труда", "390 000 — 520 000 ₽"];
const STAFF_NOTE =
  "Сноска: указан только фонд оплаты труда — без страховых взносов, подбора, рабочих мест и обучения. Источник: выборка вакансий hh.ru, Москва, 2 августа 2026 года. Реальные затраты компании выше указанных.";

function StaffCostTable({
  ourLine,
  afterLine,
  extraLine,
}: {
  /* «Работа с нами: …» или «Подписка: …» */
  ourLine: string;
  afterLine: string;
  extraLine?: string;
}) {
  return (
    <div className="mt-8 max-w-3xl">
      <div className="overflow-hidden rounded-sm border border-[color:var(--color-line-dark)]">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 border-b border-[color:var(--color-line-dark)] bg-white/[0.04] px-5 py-3">
          <span className="t-eyebrow text-[color:var(--color-text-inverse-2)]">Роль в штате</span>
          <span className="t-eyebrow text-[color:var(--color-text-inverse-2)]">В месяц, гросс</span>
        </div>
        {STAFF_ROWS.map(([role, cost]) => (
          <div
            key={role}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 border-b border-[color:var(--color-line-dark)] px-5 py-3.5"
          >
            <span className="t-body text-[color:var(--color-text-inverse)]">{role}</span>
            <span className="t-body tabular-nums whitespace-nowrap text-[color:var(--color-text-inverse-2)]">{cost}</span>
          </div>
        ))}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 bg-white/[0.04] px-5 py-3.5">
          <span className="t-body font-semibold text-[color:var(--color-text-inverse)]">{STAFF_TOTAL[0]}</span>
          <span className="font-display t-body font-semibold tabular-nums whitespace-nowrap text-[color:var(--color-text-inverse)]">{STAFF_TOTAL[1]}</span>
        </div>
      </div>

      <div className="tint-ink mt-6 rounded-md border-l-2 border-[color:var(--color-accent)] p-6">
        <p className="font-display t-body font-semibold text-[color:var(--color-text-inverse)]">{ourLine}</p>
        <p className="mt-2 t-body text-[color:var(--color-text-inverse-3,var(--color-text-inverse-2))]">{afterLine}</p>
      </div>

      <p className="mt-5 t-caption text-[color:var(--color-text-inverse-2)]">{STAFF_NOTE}</p>
      {extraLine && (
        <p className="mt-3 t-body text-[color:var(--color-text-inverse-2)]">{extraLine}</p>
      )}
    </div>
  );
}

/* ==========================================================================
   СТРАНИЦА 1 · /business-effect — общий бизнес-эффект, десять экранов
   ========================================================================== */

export function BusinessEffectGeneralPage() {
  const principles: [string, string][] = [
    ["Актив, а не услуга", "Права на созданные материалы остаются у заказчика: программы, сценарии, тренажеры, базы знаний, исходные файлы. Это не доступ к платформе, от которого нельзя отказаться."],
    ["Вы не привязаны к нам", "Права на материалы у вас, документация передана — программу можно запускать без нашего участия. Так работает программа для Global Broker League. Заказчики продлевают сотрудничество не потому, что не могут уйти, а потому что появляются новые задачи."],
    ["Одна точка ответственности", "Один договор вместо набора договоров с исполнителями. Привлечение профильных экспертов, их замена и координация — наша зона. Мы бесплатно меняем состав команды внутри проекта, если понимаем, что для результата требуется иное видение или подход. Закрывающие документы — на одно юридическое лицо."],
    ["Договоренность о результате, а не о часах", "Стоимость и критерии приемки фиксируются до начала работ. Оплата привязана к объему работ, а не к календарю. Численность вашей функции не растет: команда собирается под задачу и расходится по ее завершении."],
    ["Видно, во что инвестируются деньги", "У каждого заказчика личный кабинет: что заказано, что в работе, что принято, каков остаток по пакетам. Движение показано в единицах результата, а не в часах. При изменении состава работ остаток пересчитывается сразу."],
  ];

  const guarantees: [string, string][] = [
    ["Результат этапа и критерии приемки фиксируем до начала работ", "Бизнес-показателей, на которые влияет не только обучение: продажи, текучесть, выручка. Мы отвечаем за качество и применимость материалов"],
    ["Точное попадание в задачу: мы бесплатно меняем состав команды внутри проекта, если понимаем, что для результата требуется иное видение или подход", "Результата без участия носителей опыта: если эксперты не выделяют время на интервью, нам нужно будет передоговориться о сроках"],
    ["Соблюдение согласованных сроков по задачам, зависящим только от нас", "При паузе или форс-мажоре с вашей стороны сроки пересматриваем вместе"],
    ["Доработку материалов до соответствия согласованным критериям", "При изменении образа результата пересматриваем сроки и критерии приемки"],
  ];

  const startRows: [string, string][] = [
    ["5 минут", "Отвечаем на заявку"],
    ["30 минут", "Разбираем с вами задачу онлайн"],
    ["24 часа", "Старт проекта"],
    ["60 минут", "Описание опыта и подтвержденные кейсы практиков, которые будут работать над задачей в рамках проекта"],
  ];

  const startFrom: { title: string; step: string; href: string }[] = [
    { title: "Результаты держатся на нескольких людях", step: "Первый шаг: карта экспертности, 7–14 дней", href: BE.internalEffect },
    { title: "Задач больше, чем рук", step: "Первый шаг: разбор объема и плана на квартал", href: BE.teamEffect },
    { title: "Нужной практики внутри нет", step: "Первый шаг: описание опыта и подтвержденные кейсы практиков, которые будут работать над задачей в рамках проекта — за 60 минут, бесплатно", href: BE.externalEffect },
  ];

  return (
    <PageShell path={BE.general}>
      {/* Экран 1. Обещание */}
      <section className="stage border-b border-[color:var(--color-line)]">
        <PageHead
          kicker="Бизнес-эффект"
          title={<>Бизнес-эффект от сотрудничества с&nbsp;нами</>}
          lead="Результат в компании создают люди. Мы переводим их опыт в инструменты, таким образом, у команды появляется больше инструментов для достижения результата."
          guide="Ниже — эффект по трём сценариям; дальше выберите свой и посмотрите цифры."
          actions={
            <>
              <CtaButton path={BE.general} />
              <PdfButton file={PDF.general} />
            </>
          }
        />

        {/* Экраны 2 и 3 склеены (решение 03.08): заголовок экрана 2 после
            снятия карточек-дублей висел одиноко на тёмной полосе. Теперь он —
            заголовок секции принципов, а «5 принципов…» — её вводка. Оба
            текста из документа, дословно. */}
        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <SectionLabel n="01">Три ситуации, один механизм</SectionLabel>
          <RevealHeading className="t-h2 mt-6 max-w-3xl">
            Откуда бы ни пришли знание и опыт, оно остается у компании
          </RevealHeading>
          <p className="mt-5 max-w-3xl font-display t-body font-semibold">
            5 принципов, одинаковых для всех наших работ
          </p>
          <div className="mt-10 grid items-stretch gap-4 sm:grid-cols-2">
            {principles.slice(0, 4).map(([t, d], i) => (
              <motion.div key={t} {...reveal(i)} className="h-full">
                <PaperCard className="h-full p-6 md:p-7">
                  <div className="flex items-center gap-3">
                    <Stencil n={i + 1} active className="t-body" />
                    <span className="h-px w-6 bg-[color:var(--color-line)]" />
                  </div>
                  <div className="mt-4 font-display t-body font-semibold">{t}</div>
                  <p className="mt-2.5 t-body text-[color:var(--color-text-secondary)]">{d}</p>
                </PaperCard>
              </motion.div>
            ))}
            {/* Пятый принцип — с макетом личного кабинета (данные скрыты) */}
            <motion.div {...reveal(4)} className="h-full sm:col-span-2">
              <PaperCard className="h-full p-6 md:p-7">
                <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                  <div>
                    <div className="flex items-center gap-3">
                      <Stencil n={5} active className="t-body" />
                      <span className="h-px w-6 bg-[color:var(--color-line)]" />
                    </div>
                    <div className="mt-4 font-display t-body font-semibold">{principles[4][0]}</div>
                    <p className="mt-2.5 t-body text-[color:var(--color-text-secondary)]">{principles[4][1]}</p>
                  </div>
                  {/* Экран личного кабинета (скриншот, чувствительные данные размыты) */}
                  <div className="overflow-hidden rounded-md border border-[color:var(--color-line)] shadow-[var(--shadow-soft)]">
                    <img
                      src="/img/lk/lk-finance.webp"
                      alt="Личный кабинет заказчика: счета, оплаты и остатки по проектам"
                      loading="lazy"
                      decoding="async"
                      width={1800}
                      height={923}
                      className="block h-auto w-full"
                    />
                  </div>
                </div>
              </PaperCard>
            </motion.div>
          </div>
        </div>

        {/* Экран 4. Что происходит после проекта */}
        <div className="relative border-t border-[color:var(--color-line)]">
          <div className="mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <SectionLabel n="03">Что происходит после проекта</SectionLabel>
            <RevealHeading className="t-h2 mt-6 max-w-3xl">
              Программа устаревает быстрее, чем кажется
            </RevealHeading>
            <p className="mt-5 max-w-3xl t-body text-[color:var(--color-text-primary)]">
              Меняются продукты, регламенты и состав команд — и материалы, которые
              год назад работали, начинают учить не тому. Устаревшая программа
              хуже, чем ее отсутствие: сотрудники доверяют ей и действуют по ней.
            </p>
            <div className="mt-8 grid max-w-4xl gap-4 sm:grid-cols-2">
              <PaperCard className="p-6">
                <div className="font-display t-body font-semibold">Поддержание актуальности</div>
                <p className="mt-2.5 t-body text-[color:var(--color-text-secondary)]">
                  регулярный пересмотр материалов под изменения в компании
                </p>
              </PaperCard>
              <PaperCard className="p-6">
                <div className="font-display t-body font-semibold">Расширение готовой программы</div>
                <p className="mt-2.5 t-body text-[color:var(--color-text-secondary)]">
                  на новые команды, регионы и роли — по прайсу разработки
                </p>
              </PaperCard>
            </div>
            <p className="mt-6 max-w-3xl t-body text-[color:var(--color-text-secondary)]">
              Обе работы идут без повторного погружения: контекст компании у нас уже есть.
            </p>
          </div>
        </div>

        {/* Экран 5. Сколько стоит та же мощность внутри */}
        <div className="sec-dark grain relative border-t border-[color:var(--color-line-dark)]">
          <Scene blobs={[{ className: "-right-40 top-10", tone: "chrome", size: 480 }]} />
          <div className="relative z-10 mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <SectionLabel n="04">Сколько стоит та же мощность внутри</SectionLabel>
            <RevealHeading className="t-h2 mt-6 max-w-3xl text-[color:var(--color-text-inverse)]">
              Производство обучения — это не один человек
            </RevealHeading>
            <p className="mt-5 max-w-3xl t-body text-[color:var(--color-text-inverse-2)]">
              Чтобы регулярно выпускать программы, нужны минимум трое: методолог,
              руководитель проекта и специалист, который собирает курс и оформляет
              его в системе обучения. Внутри компании это ежемесячные оклады
              независимо от того, сколько программ нужно реализовать.
            </p>
            {/* Полная таблица окладов живёт в одном месте — на странице
                эффекта подписки, где принимается решение о цене (решение
                Виктории 03.08: «посмотри, где будет лучше»). Здесь — суть
                и ссылка на полный расчёт. */}
            <div className="tint-ink mt-8 max-w-3xl rounded-md border-l-2 border-[color:var(--color-accent)] p-6">
              <p className="font-display t-body font-semibold text-[color:var(--color-text-inverse)]">
                Работа с нами: от 180 000 ₽ в месяц.
              </p>
              <p className="mt-2 t-body text-[color:var(--color-text-inverse-3,var(--color-text-inverse-2))]">
                Объем работ в обоих случаях зависит от задач: у нас он
                фиксируется в договоре через образ результата, а не через
                часовые ставки.
              </p>
            </div>
            <a
              href={BE.teamEffect}
              className="link-arrow group mt-6 t-body text-[color:var(--color-text-inverse-2)] hover:text-[color:var(--color-text-inverse)]"
            >
              Полное сравнение с фондом оплаты труда
              <ArrowUpRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Экран 6. Безопасность ваших данных */}
        <div className="relative border-t border-[color:var(--color-line)]">
          <div className="mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <SectionLabel n="05">Безопасность ваших данных</SectionLabel>
            <RevealHeading className="t-h2 mt-6 max-w-3xl">
              Материалы компании не уходят в открытые сервисы ИИ
            </RevealHeading>
            <div className="mt-8 grid items-start gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-14">
              <NodeList
                divided
                items={[
                  "Названия компании, персональные данные и сведения, по которым можно опознать бизнес, удаляются до начала обработки",
                  "В открытые сервисы искусственного интеллекта передаются только обезличенные данные",
                  "Работаем в рамках вашей политики безопасности, включая ограничения на такие инструменты: по требованию заказчика ведем проект без них",
                ]}
              />
              {/* Экран «Безопасность и данные» личного кабинета (данные размыты) */}
              <div className="overflow-hidden rounded-md border border-[color:var(--color-line)] shadow-[var(--shadow-soft)]">
                <img
                  src="/img/lk/lk-security.webp"
                  alt="Личный кабинет заказчика: раздел безопасности — сессии, доступы, выгрузка данных"
                  loading="lazy"
                  decoding="async"
                  width={1444}
                  height={1424}
                  className="block h-auto w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Экран 7. Гарантии */}
        <div className="relative border-t border-[color:var(--color-line)]">
          <div className="mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <SectionLabel n="06">Гарантии</SectionLabel>
            <div className="mt-8 grid gap-x-4 gap-y-3 md:grid-cols-2">
              <div className="t-eyebrow px-1 text-[color:var(--color-text-secondary)]">Что гарантируем</div>
              <div className="t-eyebrow hidden px-1 text-[color:var(--color-text-secondary)] md:block">Чего не гарантируем</div>
              {guarantees.map(([yes, no], i) => (
                <Fragment key={yes}>
                  <motion.div {...reveal(i)}>
                    <PaperCard className="h-full p-5">
                      <div className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 flex-none text-[color:var(--color-accent)]" />
                        <p className="t-body text-[color:var(--color-text-primary)]">{yes}</p>
                      </div>
                    </PaperCard>
                  </motion.div>
                  <motion.div {...reveal(i)} className="rounded-md border border-dashed border-[color:var(--color-line)] p-5">
                    <div className="mb-1 t-eyebrow text-[color:var(--color-text-secondary)] md:hidden">Чего не гарантируем</div>
                    <p className="t-body text-[color:var(--color-text-secondary)]">{no}</p>
                  </motion.div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Экран 8. Как быстро начинается работа */}
        <div className="relative border-t border-[color:var(--color-line)]">
          <div className="mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <SectionLabel n="07">Как быстро начинается работа</SectionLabel>
            <div className="mt-8 max-w-3xl overflow-hidden rounded-sm border border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
              {startRows.map(([term, what], i) => (
                <motion.div
                  key={term}
                  {...reveal(i)}
                  className={`flex items-baseline gap-4 px-5 py-3.5 ${i > 0 ? "border-t border-[color:var(--color-line)]" : ""}`}
                >
                  <span className="stencil flex-none t-small tracking-[0.2em] text-[color:var(--color-accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="w-32 flex-none font-display t-body font-semibold tracking-tight sm:w-40">{term}</span>
                  <span className="t-body text-[color:var(--color-text-secondary)]">{what}</span>
                </motion.div>
              ))}
            </div>
            <p className="mt-6 max-w-3xl t-body text-[color:var(--color-text-primary)]">
              Готовить презентацию и техническое задание не нужно: принимаем вводные в любом виде.
            </p>
          </div>
        </div>

        {/* Экран 9. С какой стороны начать */}
        <div className="sec-dark grain relative border-t border-[color:var(--color-line-dark)]">
          <Scene blobs={[{ className: "-left-40 bottom-0", tone: "rose", size: 460 }]} />
          <div className="relative z-10 mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <SectionLabel n="08">С какой стороны начать</SectionLabel>
            <RevealHeading className="t-h2 mt-6 max-w-3xl text-[color:var(--color-text-inverse)]">
              Три ситуации
            </RevealHeading>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {startFrom.map((it, i) => (
                <motion.a
                  key={it.href}
                  href={it.href}
                  {...reveal(i)}
                  className="card-link surface-dark group flex h-full flex-col rounded-md p-6 md:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Stencil n={i + 1} active className="t-body" />
                    <span
                      aria-hidden
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-pill border border-[color:var(--color-line-dark)] text-[color:var(--color-text-inverse)]"
                    >
                      <ArrowRight data-arrow className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-3 font-display t-body font-semibold text-[color:var(--color-text-inverse)]">
                    {it.title}
                  </div>
                  <p className="mt-auto pt-4 t-body text-[color:var(--color-text-inverse-2)]">{it.step}</p>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Экран 10. Следующий шаг */}
      <CtaBand
        path={BE.general}
        title={<>Посчитаем на ваших цифрах</>}
        note="30 минут онлайн: разбираем задачу, смотрим, какой опыт есть внутри, и оцениваем объем первого этапа."
        secondary={
          <a
            href={PDF.general}
            download
            className="link-arrow group t-eyebrow text-[color:var(--color-text-inverse-2)] hover:text-[color:var(--color-text-inverse)] print:hidden"
          >
            Скачать эту страницу в PDF
            <ArrowDown data-arrow="down" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>
        }
      />
    </PageShell>
  );
}

/* ==========================================================================
   /tasks/internal-experts — продуктовая: внутренние эксперты
   ========================================================================== */

export function InternalExpertsPage() {
  const path = BE.internal;
  const pathSteps = [
    "Практика, которая ведет к результату",
    "Логика принятия решений",
    "Рабочая система",
    "Применение командой",
    "Масштабирование результата",
  ];
  const formats = [
    "короткие видеоуроки и авторские разборы ваших экспертов — там, где важна логика рассуждения",
    "схемы, памятки, алгоритмы и деревья решений — там, где нужен быстрый ответ в моменте",
    "калькуляторы типовых расчетов с согласованными вводными и контрольными примерами",
    "сценарии разговоров и карточки для клиентских ролей",
    "библиотека реальных кейсов: прибыльных, убыточных, спорных",
    "тренажеры рабочих диалогов",
    "ИИ-ассистент, отвечающий на вопросы по базе знаний",
    "тесты и аттестационные кейсы с защитой решения перед экспертом",
  ];
  const usefulWhen: [string, string][] = [
    ["Компания быстро растет", "Нужно ускорить достижение целей компании, из-за чего растет нагрузка на ключевых специалистов"],
    ["Есть эксперты, которые создают ключевой результат", "Важно сделать их подход доступным для команды"],
    ["Запускается новое направление", "Нужно быстро сформировать новую практику внутри компании"],
    ["Внутренние команды перегружены", "Нужно усилить бизнес без расширения постоянного штата"],
  ];

  return (
    <PageShell path={path}>
      {/* Экран 1. Обещание */}
      <section className="stage border-b border-[color:var(--color-line)]">
        <PageHead
          kicker="Опыт ключевых сотрудников — в работу всей команды"
          title={<>Как опыт ключевых сотрудников становится рабочим инструментом команды</>}
          lead="В каждой организации есть люди, которые нашли работающие решения. Мы переводим их способ работы в инструменты, которыми пользуется вся команда."
          guide="Сначала — как устроено решение, затем — бизнес-эффект и первый шаг."
          note="Мы привлекаем всех необходимых профильных экспертов для реализации проекта."
          actions={
            <>
              <CtaButton path={path} />
              <EffectLink href={BE.internalEffect} dark />
            </>
          }
        />

        {/* Экран 2. Лучшие практики уже есть внутри */}
        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <SectionLabel n="01">Опора</SectionLabel>
          <RevealHeading className="t-h2 mt-6 max-w-3xl">
            Лучшие практики уже есть внутри вашей компании
          </RevealHeading>
          <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-14">
            <div>
              <p className="t-body text-[color:var(--color-text-primary)]">Сильные сотрудники знают:</p>
              <div className="mt-4">
                <NodeList
                  divided
                  items={[
                    "какие решения действительно работают",
                    "какие факторы влияют на результат",
                    "где возникают риски",
                    "как действовать в нестандартных ситуациях",
                  ]}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <p className="t-body text-[color:var(--color-text-primary)]">
                Это является конкурентным преимуществом компании. Задача —
                сделать так, чтобы этим опытом могла пользоваться вся команда,
                а не только его носители.
              </p>
              <p className="t-body text-[color:var(--color-text-primary)]">
                «Без Воды» превращает практику ключевых специалистов в рабочие
                инструменты бизнеса: стандарты принятия решений, алгоритмы работы,
                базы знаний, программы адаптации, тренажеры, цифровые инструменты.
              </p>
            </div>
          </div>
        </div>

        {/* Экран 4. Как выглядит путь */}
        <div className="sec-dark grain relative border-t border-[color:var(--color-line-dark)]">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <NodeScene className="text-[color:var(--color-text-inverse-2)]" opacity={0.28} />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <SectionLabel n="02">Как выглядит путь</SectionLabel>
            <div className="mt-10 grid gap-3 md:grid-cols-5">
              {pathSteps.map((step, i) => (
                <motion.div key={step} {...reveal(i)} className="relative">
                  <div className="surface-dark flex h-full flex-col rounded-md p-5">
                    <Stencil n={i + 1} active className="t-small" />
                    <div className="mt-3 font-display t-body font-semibold text-[color:var(--color-text-inverse)]">
                      {step}
                    </div>
                  </div>
                  {i < pathSteps.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 text-[color:var(--color-accent-glass)] md:block"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Экран 6. Форматы после структурирования */}
        <div className="relative border-t border-[color:var(--color-line)]">
          <div className="mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <SectionLabel n="03">Форматы</SectionLabel>
            <RevealHeading className="t-h2 mt-6 max-w-3xl">
              Какие форматы возможны после структурирования
            </RevealHeading>
            <p className="mt-5 max-w-3xl t-body text-[color:var(--color-text-primary)]">
              Один и тот же блок знаний можно упаковать по-разному — выбор зависит
              от задачи, которую решает сотрудник:
            </p>
            <div className="mt-8 grid max-w-5xl gap-x-10 md:grid-cols-2">
              <NodeList divided items={formats.slice(0, 4)} />
              <NodeList divided accentFirst={false} className="max-md:border-t-0" items={formats.slice(4)} />
            </div>
          </div>
        </div>

        {/* Экран 8. Когда такой подход полезен */}
        <div className="sec-dark grain relative border-t border-[color:var(--color-line-dark)]">
          <Scene blobs={[{ className: "-right-40 top-10", tone: "rose", size: 460 }]} />
          <div className="relative z-10 mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <SectionLabel n="04">Когда такой подход полезен</SectionLabel>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {usefulWhen.map(([t, d], i) => (
                <motion.div key={t} {...reveal(i)} className="surface-dark notch rounded-md p-6">
                  <div className="flex items-center gap-3">
                    <Stencil n={i + 1} active className="t-body" />
                    <span className="h-px w-6 bg-[color:var(--color-line-dark)]" />
                    <LineIcon
                      name={(["metric", "team", "insight", "process"] as const)[i]}
                      className="h-5 w-5 text-[color:var(--color-accent-glass)]"
                    />
                  </div>
                  <div className="mt-4 font-display t-body font-semibold text-[color:var(--color-text-inverse)]">{t}</div>
                  <p className="mt-2.5 t-body text-[color:var(--color-text-inverse-2)]">{d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Экран 10. Проверить нас в деле */}
        <div className="relative border-t border-[color:var(--color-line)]">
          <div className="mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <SectionLabel n="05">Проверить нас в деле</SectionLabel>
            <RevealHeading className="t-h2 mt-6 max-w-3xl">
              Структурируем опыт ваших сотрудников за 7–14 дней
            </RevealHeading>
            <p className="mt-5 max-w-3xl t-body text-[color:var(--color-text-primary)]">
              Компания получает структурированную карту знаний и дальше свободна
              в выборе: продолжать с нами, силами внутренней команды или с другим
              подрядчиком. Все материалы остаются в вашей собственности.
            </p>
            <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <div className="t-eyebrow text-[color:var(--color-text-secondary)]">Как работаем</div>
                <div className="mt-4">
                  <NodeList
                    divided
                    items={[
                      "Проводим интервью и рабочие сессии с носителями экспертности",
                      "Разбираем реальные результаты: те, что сработали, и те, что не сработали, спорные и несостоявшиеся",
                      "Выявляем минимум знаний, умений и навыков для получения нужного результата",
                      "Извлекаем факты и логику принятия решений, которая способствует результату",
                    ]}
                  />
                </div>
              </div>
              <div>
                <div className="t-eyebrow text-[color:var(--color-text-secondary)]">В результате у вас</div>
                <div className="mt-4">
                  <NodeList
                    divided
                    items={[
                      "Карта знаний, разделенная на уровни погружения",
                      "Карта процесса с перечнем решений и точек обязательной эскалации",
                      "Матрица компетенций: что сотрудник обязан знать и где границы его самостоятельности",
                      "Рекомендации по формату подачи каждого блока знаний с обоснованием",
                      "Архитектура базы знаний и техническое задание для разработки материалов",
                      "Дорожная карта дальнейшей работы с оценкой трудоемкости",
                    ]}
                  />
                </div>
              </div>
            </div>
            {/* Цена снята 06.08 (единая цифра — от 180 000 ₽ за подписку);
                вместо неё — вход на страницу продукта с артефактами. */}
            <PaperCard className="mt-10 max-w-3xl border-l-[3px] border-l-[color:var(--color-accent)] p-6">
              <p className="font-display t-body font-semibold">
                Срок первого этапа: 7–14 дней
              </p>
              <a href="/expertise-map" className="link-arrow group mt-3 t-body">
                Что входит в карту экспертности
                <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </PaperCard>
          </div>
        </div>
      </section>

      {/* Экран 9. Следующий шаг */}
      <CtaBand
        path={path}
        title={<>Разберем вашу задачу за 30 минут</>}
        note="Определим, какую экспертизу стоит масштабировать, какой результат нужен бизнесу и подходит ли первый этап под вашу ситуацию. Без подготовки презентации и технического задания."
        secondary={null}
      />
      <OtherSituations current={BE.internal} />
    </PageShell>
  );
}

/* ==========================================================================
   /tasks/internal-experts/business-effect — эффект: внутренние эксперты
   ========================================================================== */

export function InternalExpertsEffectPage() {
  const path = BE.internalEffect;
  const changes: [string, string][] = [
    ["Опыт ключевых сотрудников работает на всю команду", "Опытные сотрудники продолжают создавать новое, а их подходы становятся инструментами для остальных."],
    ["Новые сотрудники быстрее выходят на нужный уровень", "Они получают не только инструкции, но и понимание логики решений."],
    ["Компания сохраняет и масштабирует собственные практики", "То, что создавалось годами внутри бизнеса, становится доступным команде."],
  ];
  const lowerRisks: [string, string][] = [
    ["Результат фиксируется до начала работы", "До старта определяем, что создаем, какой результат считается готовым и как проходит приемка."],
    ["Один партнер отвечает за весь процесс", "«Без Воды» берет на себя организацию проекта, работу с экспертами, методологическую структуру и сборку результата."],
    ["Компания сохраняет контроль", "Первый этап — самостоятельный результат. Решение о продолжении вы принимаете после того, как понимаете объем задачи, ценность экспертизы и необходимый формат решения."],
  ];

  return (
    <PageShell path={path}>
      <section className="stage border-b border-[color:var(--color-line)]">
        <PageHead
          kicker="Бизнес-эффект · Внутренние эксперты"
          title={<>Что меняется для бизнеса</>}
          guide="Цифры и эффекты решения; дальше — первый шаг и разбор задачи."
          actions={
            <>
              <CtaButton path={path} />
              <PdfButton file={PDF.internal} />
              <HowLink href={BE.internal} dark />
            </>
          }
        />

        {/* Экран 3. Что меняется для бизнеса */}
        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <TitledCards items={changes} />
        </div>

        {/* Экран 5. Пример: федеральная ювелирная сеть */}
        <div className="sec-dark grain relative border-t border-[color:var(--color-line-dark)]">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <NodeScene className="text-[color:var(--color-text-inverse-2)]" opacity={0.3} />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <SectionLabel n="01">Пример</SectionLabel>
            <RevealHeading className="t-h2 mt-6 max-w-3xl text-[color:var(--color-text-inverse)]">
              Федеральная ювелирная сеть
            </RevealHeading>
            <p className="mt-4 t-body text-[color:var(--color-text-inverse-2)]">
              Масштаб: более 230 магазинов, более 70 городов, собственное производство, более 30 000 SKU.
            </p>
            <p className="mt-2 t-body text-[color:var(--color-text-inverse)]">
              Система адаптации новых сотрудников на основе практик, которые уже применяют в компании
            </p>

            <div className="mt-8">
              <MetricTiles
                items={[
                  ["1", "месяц до выхода на KPI"],
                  ["в 6 раз", "ускорение адаптации"],
                  [">230", "магазинов"],
                ]}
              />
            </div>

            <div className="mt-10 grid max-w-5xl gap-6 md:grid-cols-2 md:gap-10">
              <p className="t-body text-[color:var(--color-text-inverse-2)]">
                Новые продавцы проходили базовое недельное обучение и сразу
                отправлялись в торговые залы. Из-за нехватки практических навыков
                работы со сложным продуктом они выходили на целевые показатели
                только к 6–8 месяцу. Сотрудники не хотели долго ждать высоких
                бонусов, выгорали и уходили к конкурентам, а компания запускала
                бесконечный цикл найма и переобучения.
              </p>
              <p className="t-body text-[color:var(--color-text-inverse-2)]">
                Вместе с командой «Без Воды» компания пересобрала систему
                наставничества, сделав ставку на выявление и масштабирование
                подходов сотрудников с устойчивыми результатами. К новичкам
                прикрепили продавцов с устойчивыми результатами, которые на
                практике передавали свои алгоритмы работы с клиентами. Срок адаптации сократился до одного
                месяца: новые продавцы стали выходить на уровень продаж опытных
                специалистов за 30 дней.
              </p>
            </div>

            <div className="mt-10 grid max-w-5xl gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <div className="t-eyebrow text-[color:var(--color-text-inverse-2)]">Что сделано</div>
                <div className="mt-4">
                  <NodeList
                    divided
                    items={[
                      "Собраны и описаны экспертные знания и приемы продаж опытных сотрудников розничной сети",
                      "Базовое теоретическое обучение заменено на прикладную систему наставничества в торговых залах",
                      "Внедрены единые стандарты презентации сложного продукта: геммология, материаловедение, кастомное производство",
                      "Разработана масштабируемая методология передачи опыта, адаптированная под федеральную сеть",
                    ]}
                  />
                </div>
              </div>
              <div>
                <div className="t-eyebrow text-[color:var(--color-text-inverse-2)]">Что изменилось у клиента</div>
                <div className="mt-4">
                  <NodeList
                    divided
                    items={[
                      "Срок адаптации новых сотрудников сократился с 6–8 месяцев до 1 месяца",
                      "Стажеры выходят на плановые показатели конверсии и среднего чека наравне с ведущими специалистами через 30 дней",
                      "Снижена текучесть на этапе испытательного срока, минимизированы потери от цикличного переобучения",
                    ]}
                  />
                </div>
              </div>
            </div>

            <a href="/cases" className="link-arrow group mt-8 t-body text-[color:var(--color-text-inverse-2)] hover:text-[color:var(--color-text-inverse)]">
              Все кейсы
              <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Экран 7. Почему такой подход снижает риски */}
        <div className="relative border-t border-[color:var(--color-line)]">
          <div className="mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <SectionLabel n="02">Риски</SectionLabel>
            <RevealHeading className="t-h2 mt-6 max-w-3xl">
              Почему такой подход снижает риски
            </RevealHeading>
            <div className="mt-8">
              <TitledCards items={lowerRisks} />
            </div>
            {/* Первый шаг с ценой — на пути с главной эта строка иначе не
                встречается ни разу (формулировка дословно из /business-effect,
                экран 9; размещение согласовано 03.08) */}
            <PaperCard className="mt-10 max-w-3xl border-l-[3px] border-l-[color:var(--color-accent)] p-6">
              <p className="font-display t-body font-semibold">
                Первый шаг: карта экспертности, 7–14 дней
              </p>
              <a href="/expertise-map" className="link-arrow group mt-3 t-body">
                Что входит в карту экспертности
                <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <span className="mt-2 block">
                <HowLink href={BE.internal} />
              </span>
            </PaperCard>
          </div>
        </div>
      </section>

      <CtaBand path={path} secondary={null} />
      <OtherSituations current={BE.internalEffect} />
    </PageShell>
  );
}

/* ==========================================================================
   /tasks/team-subscription — продуктовая: команда по подписке
   ========================================================================== */

export function TeamSubscriptionPage() {
  const path = BE.team;
  /* Перечень работ подписки — текст Виктории от 04.08.2026, дословно.
     Заменил прежние шесть «единиц результата»: новый список их поглощает
     и раскрывает сроки. Разбивка на «заголовок / описание» — только
     оформление, формулировки не менялись. */
  /* Третий элемент строки — ссылка на страницу продукта, если она есть.
     Ставится ВНУТРИ карточки: висящая ссылка над перечнем не читалась
     (замечание Виктории 06.08). */
  const packs: { title: string; items: [string, string, string?][] }[] = [
    {
      title: "Управление проектом или продуктом",
      items: [
        ["Разработка и ведение комплексной программы в течение месяца", "архитектура программы, работа с вашими экспертами, управление разработкой и реализацией"],
        ["Регулярное обучение по вашей программе — закрывается ежемесячно", "40 часов в месяц по согласованному расписанию, материалы — с вас. Каждый учебный день фиксируется в акте"],
        ["Фасилитация рабочих сессий и модераций — закрывается ежемесячно", "16 часов сессий в месяц, очно или онлайн. Подготовка сессии и итоговые материалы включены в стоимость"],
        ["Операционное сопровождение обучения ежемесячно", "расписание, организация активностей и коммуникация с участниками, сбор обратной связи, отчетность по результатам"],
        /* Без цены: комиссия живёт только в конструкторе, на публичных
           страницах цен по этой позиции не показываем (решение 06.08). */
        ["Аудит образовательных потребностей и разработка Индивидуальных планов развития (ИПР)", "Анализируем рынок образовательных услуг, оцениваем программы сторонних провайдеров на соответствие вашим бизнес-задачам, проектируем архитектуру обучения и полностью организуем процесс интеграции этих решений в вашу компанию"],
      ],
    },
    {
      title: "Разработка учебных продуктов",
      items: [
        ["Онлайн-курс или сценарий тренинга — срок 10 дней", "передаем полный комплект материалов: паспорт проекта, сценарий, раздаточные материалы, презентация, программа, лонгриды и т. д."],
        ["Адаптация ваших материалов — оплата за единицу, срок 2 дня", "правки в готовые материалы под новую аудиторию или формат"],
        ["Сборка курса в LMS за 2 дня", "готовый материал оформлен и опубликован в вашей системе"],
      ],
    },
    {
      /* Было «Переводим опыт в актив компании» — та же конструкция
         «опыт → актив», от которой отказались 04.08. Формулировка
         Виктории от 05.08. */
      title: "Инструменты работы — для всей команды",
      items: [
        ["Карта экспертности за 10 дней", "карта знаний компании, матрица компетенций и дорожная карта: чей опыт масштабируем, во что он превращается и в каком порядке", "/expertise-map"],
        ["База знаний для всей команды за 20 дней", "все необходимые знания, практические рекомендации собраны в структуру, которой пользуется вся команда"],
        ["Цифровой наставник по базе знаний за 10 дней", "подскажет, сформулирует, структурирует, предложит — поддержит вашу команду круглосуточно"],
        ["Цифровой двойник эксперта за 10 дней", "работает по методу конкретного специалиста вашей компании"],
      ],
    },
    {
      title: "ИИ-автоматизация и сопровождение",
      items: [
        ["Автоматизация процессов обучения «под ключ»", "надстройка на ваши действующие сервисы, без замены системы"],
        ["«Цифровой тренер»", "платформа для тренеров и фасилитаторов: инструменты вовлечения онлайн и офлайн аудитории в едином пространстве на тренингах и сессиях"],
        ["Поддержание внедренных агентов и процессов", "настроенные процессы продолжают работать: обновления, исправления, изменения под новые задачи"],
      ],
    },
  ];

  return (
    <PageShell path={path}>
      {/* Экран 1. Обещание */}
      <section className="stage border-b border-[color:var(--color-line)]">
        <PageHead
          kicker="Реализация большого объёма обучения без потери качества"
          title={<>План обучения выполняется, а&nbsp;штат не растет</>}
          lead="Полная команда производства обучения — методолог, руководитель проекта, сборка — работает на согласованный объем за фиксированную сумму в месяц."
          guide="Ниже — состав подписки и цена; дальше — бизнес-эффект решения."
          note="Мы привлекаем всех необходимых профильных экспертов для реализации проекта."
          actions={
            <>
              <CtaButton path={path} />
              <EffectLink href={BE.teamEffect} dark />
            </>
          }
        />

        {/* Экран 3. Что входит в подписку. Якорь #units — на него ведёт
            «перечень» из плашки с ценой на первом экране главной. */}
        <div id="units" className="relative mx-auto max-w-7xl px-5 sec-pad scroll-mt-28 md:px-8">
          <SectionLabel n="01">Что входит в подписку</SectionLabel>
          <RevealHeading className="t-h2 mt-6 max-w-3xl">
            Подписка на наши услуги от 180 000 ₽ в месяц. Пакет услуг и объем задач выбираете вы.
          </RevealHeading>
          <p className="mt-5 max-w-3xl t-body text-[color:var(--color-text-primary)]">
            Все работы выполняет команда «Без Воды» на своей стороне и своими средствами.
          </p>

          {/* Три готовых набора — по разбору 04.08: без якоря «состав
              выбираете вы» читалось как «цена договорная». Составы
              продиктованы Викторией. */}
          <div className="mt-8 grid items-stretch gap-4 md:grid-cols-3">
            {[
              ["Пакет 1", "Разработка и лидирование комплексной программы + координатор проекта"],
              ["Пакет 2", "Сборка 5 LMS-курсов и разработка онлайн-курса от 10 модулей"],
              ["Пакет 3", "2 дня модерации сессий и 5 дней ведения тренингов — 40 часов"],
            ].map(([label, desc], i) => (
              <motion.div key={label} {...reveal(i)} className="h-full">
                <PaperCard className="h-full border-l-[3px] border-l-[color:var(--color-accent)] p-6">
                  <div className="t-label text-[color:var(--color-text-secondary)]">{label}</div>
                  <p className="mt-2 t-body text-[color:var(--color-text-primary)]">{desc}</p>
                </PaperCard>
              </motion.div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl t-body text-[color:var(--color-text-secondary)]">
            Так выглядит месяц за 180 000 ₽. Набор собирается под вашу задачу
            из позиций ниже.
          </p>

          {packs.map((pack) => (
            <div key={pack.title} className="mt-12">
              <div className="t-eyebrow text-[color:var(--color-accent)]">{pack.title}</div>
              <div className="mt-5 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pack.items.map(([t, d, href], i) => (
                  <motion.div key={t} {...reveal(i)} className="h-full">
                    <PaperCard className="flex h-full flex-col p-6">
                      <div className="flex items-center gap-3">
                        <Stencil n={i + 1} active className="t-body" />
                        <span className="h-px w-6 bg-[color:var(--color-line)]" />
                      </div>
                      <div className="mt-4 font-display t-body font-semibold">{t}</div>
                      <p className="mt-2.5 t-body text-[color:var(--color-text-secondary)]">{d}</p>
                      {href && (
                        <a href={href} className="link-arrow group mt-auto pt-4 t-body">
                          Смотреть, что входит
                          <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </a>
                      )}
                    </PaperCard>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {/* Что «под капотом» — как устроена работа команды и юр. рамка */}
          <div className="mt-12">
            <div className="t-eyebrow text-[color:var(--color-accent)]">Что «под капотом»</div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <PaperCard className="h-full p-6">
                <p className="t-body text-[color:var(--color-text-primary)]">
                  Под каждую задачу мы выделяем необходимые ресурсы: методологию,
                  разработку и управление проектом.
                </p>
                <p className="mt-4 t-body text-[color:var(--color-text-secondary)]">
                  Работаем своим инструментом, по своему графику внутри
                  согласованных сроков. Доступ к внутренним системам запрашиваем
                  только при технической необходимости для реализации проекта.
                </p>
              </PaperCard>
              <PaperCard className="h-full p-6">
                <p className="t-body text-[color:var(--color-text-primary)]">
                  Мы ответственны за результат, поэтому, если возникают сложности с
                  исполнителями или доступами к инструментам, мы сами решаем этот
                  вопрос, и на сроках это не отражается.
                </p>
                <p className="mt-4 t-body text-[color:var(--color-text-secondary)]">
                  Работаем по договору возмездного оказания услуг с ИП Уткина В. В.
                </p>
              </PaperCard>
            </div>
          </div>

          <p className="mt-10 max-w-3xl t-body text-[color:var(--color-text-secondary)]">
            Логистика очных выездов — за счет заказчика.
          </p>

          {/* Личный кабинет. Было: два скриншота без единого слова о том, что
              это и зачем (замечание Виктории 06.08). Теперь — отдельный
              подраздел с объяснением, а экраны идут как иллюстрация к нему. */}
          <div className="mt-12">
            <div className="t-eyebrow text-[color:var(--color-accent)]">Личный кабинет</div>
            <RevealHeading className="t-h2 mt-5 max-w-3xl">
              Прозрачность данных по вашим пакетам
            </RevealHeading>
            {/* Обе фразы уже есть на сайте: первая — из этого же блока,
                вторая — принцип 05 на /business-effect. Своего не добавлять. */}
            <p className="mt-5 max-w-3xl t-body text-[color:var(--color-text-primary)]">
              Состав месяца фиксируется заранее и виден в личном кабинете: что
              заказано, что в работе, что принято, каков остаток по пакетам.
              Движение показано в единицах результата, а не в часах. При изменении
              состава работ остаток пересчитывается сразу.
            </p>
            <div className="mt-8 grid items-start gap-4 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
              <figure className="m-0">
                <div className="overflow-hidden rounded-md border border-[color:var(--color-line)] shadow-[var(--shadow-soft)]">
                  <img
                    src="/img/lk/lk-invoice.webp"
                    alt="Личный кабинет заказчика: затраты по счёту помесячно"
                    loading="lazy"
                    decoding="async"
                    width={1800}
                    height={636}
                    className="block h-auto w-full"
                  />
                </div>
                <figcaption className="mt-3 t-caption text-[color:var(--color-text-secondary)]">
                  Затраты по счёту помесячно
                </figcaption>
              </figure>
              <figure className="m-0">
                <div className="overflow-hidden rounded-md border border-[color:var(--color-line)] shadow-[var(--shadow-soft)]">
                  <img
                    src="/img/lk/lk-messages.webp"
                    alt="Личный кабинет заказчика: переписка по счетам"
                    loading="lazy"
                    decoding="async"
                    width={1800}
                    height={1464}
                    className="block h-auto w-full"
                  />
                </div>
                <figcaption className="mt-3 t-caption text-[color:var(--color-text-secondary)]">
                  Переписка по счетам
                </figcaption>
              </figure>
            </div>
            <p className="mt-4 t-caption text-[color:var(--color-text-secondary)]">
              Данные на экранах размыты.
            </p>
          </div>
        </div>

        {/* Экран 6. Первый шаг */}
        <div className="relative border-t border-[color:var(--color-line)]">
          <div className="mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <SectionLabel n="02">Первый шаг</SectionLabel>
            <RevealHeading className="t-h2 mt-6 max-w-3xl">
              Разбор объема и план на квартал
            </RevealHeading>
            <p className="mt-5 max-w-3xl t-body text-[color:var(--color-text-primary)]">
              30 минут онлайн: смотрим ваш план обучения, считаем объем в единицах
              результата и собираем состав первого месяца. Бесплатно, без
              презентации и технического задания.
            </p>
          </div>
        </div>
      </section>

      {/* Экран 7. Следующий шаг */}
      <CtaBand path={path} secondary={null} />
      <OtherSituations current={BE.team} />
    </PageShell>
  );
}

/* ==========================================================================
   /tasks/team-subscription/business-effect — эффект: команда по подписке
   ========================================================================== */

export function TeamSubscriptionEffectPage() {
  const path = BE.teamEffect;
  const changes: [string, string][] = [
    ["Задачи перестают ждать людей", "Команда назначается в течение 24 часов после согласования — без подбора, адаптации и открытия ставок."],
    ["Расход становится предсказуемым", "Сумма и состав объема фиксируются в договоре через образ результата. Оплата привязана к объему работ, а не к календарю."],
    ["Пики перестают быть проблемой", "Объем можно менять от месяца к месяцу: команда масштабируется под задачи, а не наоборот."],
  ];
  const yearRules: [string, string][] = [
    ["Состав работ можно менять", "единицы взаимозаменяемы по согласованию, остаток пересчитывается в кабинете сразу"],
    ["Годовая оплата возможна", "состав работ уточняется по ходу, картина расходов остается прозрачной"],
    ["По завершении крупных работ возможно сделать подписку на поддержание актуальности", "материалы не устаревают, контакт с командой сохраняется"],
  ];

  return (
    <PageShell path={path}>
      <section className="stage border-b border-[color:var(--color-line)]">
        <PageHead
          kicker="Бизнес-эффект · Подписка на наши услуги"
          title={<>Что меняется для бизнеса</>}
          guide="Цифры и эффекты подписки; дальше — как устроена работа."
          actions={
            <>
              <CtaButton path={path} />
              <PdfButton file={PDF.team} />
              <HowLink href={BE.team} dark />
            </>
          }
        />

        {/* Экран 2. Что меняется для бизнеса */}
        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <TitledCards items={changes} />
        </div>

        {/* Экран 4. Сколько стоит та же мощность внутри */}
        <div className="sec-dark grain relative border-t border-[color:var(--color-line-dark)]">
          <Scene blobs={[{ className: "-right-40 top-10", tone: "chrome", size: 480 }]} />
          <div className="relative z-10 mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <SectionLabel n="01">Сколько стоит та же мощность внутри</SectionLabel>
            <StaffCostTable
              ourLine="Подписка: от 180 000 ₽ в месяц."
              afterLine="Мы сравниваем стоимость доступа к команде такого состава. Объем фиксируется в договоре через образ результата, а не через часовые ставки."
              extraLine="Если задачи ровные и постоянные, их дешевле вести внутри. Подписка нужна там, где нагрузка неравномерная или объем превышает возможности команды."
            />
          </div>
        </div>

        {/* Экран 5. Как это устроено в течение года */}
        <div className="relative border-t border-[color:var(--color-line)]">
          <div className="mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <SectionLabel n="02">Как это устроено в течение года</SectionLabel>
            <div className="mt-8">
              <TitledCards items={yearRules} />
            </div>
            {/* Первый шаг — дословно из /business-effect, экран 9 */}
            <PaperCard className="mt-10 max-w-3xl border-l-[3px] border-l-[color:var(--color-accent)] p-6">
              <p className="font-display t-body font-semibold">
                Первый шаг: разбор объема и плана на квартал
              </p>
              <span className="mt-2 block">
                <HowLink href={BE.team} />
              </span>
            </PaperCard>
          </div>
        </div>
      </section>

      <CtaBand path={path} secondary={null} />
      <OtherSituations current={BE.teamEffect} />
    </PageShell>
  );
}

/* ==========================================================================
   /tasks/external-experts — продуктовая: внешние эксперты
   ========================================================================== */

export function ExternalExpertsPage() {
  const path = BE.external;
  const steps = [
    "Обсуждаем с вами задачу и договариваемся, какой именно опыт нужен и по каким признакам мы поймем, что человек им обладает",
    "За 60 минут — описание опыта и подтвержденные кейсы практиков, которые будут работать над задачей в рамках проекта. Бесплатно",
    "Вы знакомитесь с практиком. Мы бесплатно меняем состав команды внутри проекта, если понимаем, что для результата требуется иное видение или подход",
    "Эксперт работает в вашем контексте вместе с нашим методологом",
    "Его логика решений фиксируется в ваших материалах: программе, стандарте, базе знаний",
  ];
  const priorities = [
    "За 60 минут у вас в почте — описание опыта и подтвержденные кейсы практиков, которые будут работать над задачей в рамках проекта",
    "Мы бесплатно меняем состав команды внутри проекта, если понимаем, что для результата требуется иное видение или подход",
    "Права на созданные материалы остаются у вас",
  ];

  return (
    <PageShell path={path}>
      {/* Экран 1. Обещание */}
      <section className="stage border-b border-[color:var(--color-line)]">
        <PageHead
          kicker="Ускорение запуска новых направлений в бизнесе"
          title={<>Практика, которой внутри нет — без&nbsp;долгого поиска и консалтинга</>}
          lead="Привлекаем профильных практиков, переводим их опыт в материалы компании — и этот опыт остается у вас по окончании проекта."
          guide="Ниже — путь и сроки; дальше — бизнес-эффект и разбор задачи."
          note="Мы привлекаем всех необходимых профильных экспертов для реализации проекта."
          actions={
            <>
              <CtaButton path={path} />
              <EffectLink href={BE.externalEffect} dark />
            </>
          }
        />

        {/* Экран 3. Как выглядит путь */}
        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <SectionLabel n="01">Как выглядит путь</SectionLabel>
          <ol className="mt-8 max-w-3xl">
            {steps.map((step, i) => (
              <motion.li
                key={step}
                {...reveal(i)}
                className={`flex items-start gap-5 py-5 ${i > 0 ? "border-t border-[color:var(--color-line)]" : ""}`}
              >
                <Stencil n={i + 1} active className="mt-0.5 t-body" />
                <span className="t-body text-[color:var(--color-text-primary)]">{step}</span>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Экран 5. Первый шаг */}
        <div className="sec-dark grain relative border-t border-[color:var(--color-line-dark)]">
          <Scene blobs={[{ className: "-left-40 top-0", tone: "rose", size: 460 }]} />
          <div className="relative z-10 mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <SectionLabel n="02">Первый шаг</SectionLabel>
            <RevealHeading className="t-h2 mt-6 max-w-3xl text-[color:var(--color-text-inverse)]">
              Описание опыта и подтвержденные кейсы практиков, которые будут
              работать над задачей в рамках проекта. За 60 минут, бесплатно
            </RevealHeading>
            <p className="mt-5 max-w-3xl t-body text-[color:var(--color-text-inverse-2)]">
              Вы описываете задачу, мы присылаем описание опыта и подтвержденные
              кейсы практиков, которые будут работать над задачей в рамках проекта.
            </p>
          </div>
        </div>

        {/* Экран 6. Приоритеты */}
        <div className="relative border-t border-[color:var(--color-line)]">
          <div className="mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <SectionLabel n="03">Приоритеты</SectionLabel>
            <RevealHeading className="t-h2 mt-6 max-w-3xl">
              Скорость решения вашей задачи и ваш комфорт — наши приоритеты
            </RevealHeading>
            <div className="mt-8 max-w-3xl">
              <NodeList divided items={priorities} />
            </div>
          </div>
        </div>
      </section>

      {/* Экран 7. Следующий шаг */}
      <CtaBand
        path={path}
        note="30 минут онлайн: разбираем задачу и определяем, какого именно практика искать."
        secondary={null}
      />
      <OtherSituations current={BE.external} />
    </PageShell>
  );
}

/* ==========================================================================
   /tasks/external-experts/business-effect — эффект: внешние эксперты
   ========================================================================== */

export function ExternalExpertsEffectPage() {
  const path = BE.externalEffect;
  const changes = [
    "Компания начинает работать по методам, которые уже подтвердили свою эффективность на рынке",
    "Опыт эксперта остается в материалах компании и продолжает работать после окончания проекта",
    "Вы платите не за присутствие эксперта, а за то, что его способ работы становится вашим",
  ];
  const doneSteps = [
    "Определили признаки нужного опыта: практик, который сам принимал решения о подрядчиках в компании такого типа, и определили формат передачи опыта — 7 часовых вебинаров",
    "За 72 часа мы нашли и согласовали с клиентом эксперта под задачу",
    "Перед взаимодействием эксперта с клиентом мы структурировали его ответы так, чтобы каждый час вебинара был концентратом применимого опыта",
    "Эксперт разобрал принципы работы с подрядчиками на обезличенном материале: основания для сравнения, участники решения, типичные причины отказа. Конфиденциальные данные конкретных компаний не использовались",
    "Подготовленные материалы вебинаров переданы компании, благодаря чему сотрудники, не участвовавшие в вебинаре, получили к ним доступ",
  ];

  return (
    <PageShell path={path}>
      <section className="stage border-b border-[color:var(--color-line)]">
        <PageHead
          kicker="Бизнес-эффект · Внешние эксперты"
          title={<>Что меняется для вас</>}
          guide="Цифры и эффекты решения; дальше — как мы привлекаем практиков."
          actions={
            <>
              <CtaButton path={path} />
              <PdfButton file={PDF.external} />
              <HowLink href={BE.external} dark />
            </>
          }
        />

        {/* Экран 2. Что меняется для вас */}
        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <div className="grid items-stretch gap-4 sm:grid-cols-3">
            {changes.map((t, i) => (
              <motion.div key={t} {...reveal(i)} className="h-full">
                <PaperCard className="flex h-full items-start gap-3 p-6">
                  <NodeBullet active className="mt-[0.55em]" />
                  <p className="t-body text-[color:var(--color-text-primary)]">{t}</p>
                </PaperCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Экран 4. Пример: B2B-компания */}
        <div className="sec-dark grain relative border-t border-[color:var(--color-line-dark)]">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <NodeScene className="text-[color:var(--color-text-inverse-2)]" opacity={0.3} />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-5 sec-pad md:px-8">
            <SectionLabel n="01">Пример</SectionLabel>
            <RevealHeading className="t-h2 mt-6 max-w-3xl text-[color:var(--color-text-inverse)]">
              B2B-компания
            </RevealHeading>
            <p className="mt-4 t-body text-[color:var(--color-text-inverse-2)]">
              Разбор логики закупки на стороне клиента с практиком из этой среды
            </p>

            <div className="mt-8">
              <MetricTiles
                items={[
                  ["7 часов", "итоговый материал для команд заказчика"],
                  ["16%", "снижение оттока после перестройки предложения"],
                  ["72 часа", "от запроса до подобранного эксперта"],
                ]}
              />
            </div>

            <div className="mt-10 max-w-3xl">
              <div className="t-eyebrow text-[color:var(--color-text-inverse-2)]">Задача</div>
              <p className="mt-3 t-body text-[color:var(--color-text-inverse-2)]">
                Компания продавала корпоративным клиентам свои услуги и не
                понимала, по каким правилам те выбирают подрядчика: с кем
                сравнивают, на что смотрят в первую очередь, кто участвует в
                решении. Опросы клиентов не давали необходимой конкретики. Внутри
                компании такого опыта не было: вся команда знала процесс со
                стороны продавца.
              </p>
            </div>

            <div className="mt-10 max-w-3xl">
              <div className="t-eyebrow text-[color:var(--color-text-inverse-2)]">Что было сделано</div>
              <div className="mt-4">
                <NodeList divided items={doneSteps} />
              </div>
            </div>

            <div className="tint-ink mt-10 max-w-3xl rounded-md border-l-2 border-[color:var(--color-accent)] p-6 md:p-7">
              <div className="t-eyebrow text-[color:var(--color-accent-text)]">Что изменилось</div>
              <p className="mt-3 t-body text-[color:var(--color-text-inverse)]">
                Команды перестроили предложение под клиента. В результате отток
                клиентской базы снизился на 16% — по данным заказчика.
              </p>
              <p className="mt-3 t-caption text-[color:var(--color-text-inverse-2)]">
                Источник данных: внутренняя отчетность заказчика.
              </p>
            </div>

            <a href="/cases" className="link-arrow group mt-8 t-body text-[color:var(--color-text-inverse-2)] hover:text-[color:var(--color-text-inverse)]">
              Все кейсы
              <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            {/* Первый шаг — дословно из /business-effect, экран 9 */}
            <div className="tint-ink mt-10 max-w-3xl rounded-md border-l-2 border-[color:var(--color-accent)] p-6">
              <p className="font-display t-body font-semibold text-[color:var(--color-text-inverse)]">
                Первый шаг: описание опыта и подтвержденные кейсы практиков, которые будут работать над задачей в рамках проекта — за 60 минут, бесплатно
              </p>
              <span className="mt-2 block">
                <HowLink href={BE.external} dark />
              </span>
            </div>
          </div>
        </div>
      </section>

      <CtaBand path={path} secondary={null} />
      <OtherSituations current={BE.externalEffect} />
    </PageShell>
  );
}
