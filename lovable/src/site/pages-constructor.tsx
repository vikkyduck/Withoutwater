/* ============================================================================
   pages-constructor.tsx — /constructor, страница-конструктор задач.

   ВАЖНО: страница НЕ прикреплена к сайту (решение Виктории 05.08.2026).
   Её нет ни в шапке, ни в подвале, ни в sitemap.xml; в мете noindex,nofollow.
   Живёт на том же домене и в той же дизайн-системе, чтобы ссылку можно было
   отправить клиенту напрямую.

   ⚠️ ТЕКСТ ВИКТОРИИ — СЛОВО В СЛОВО. Требование от 05.08.2026 после того,
   как я самовольно «причесал» её формулировки. Ничего не исправлять:
   ни «Состав работ и фиксируется», ни «процесса процесса», ни
   «Структурированная , пригодную», ни «SCORM пакет», ни «Github»,
   ни «бизнес кейсах», ни «100$». Это не опечатки для нас — это её текст.
   Никаких своих пояснений, вводок и приписок на странице тоже быть не должно.
   ========================================================================== */
import { useMemo, useRef, useState } from "react";
import {
  motion,
  PageShell, PaperCard, Scene,
  RevealHeading, NodeList, Check, Plus, Minus, SectionLabel, ArrowRight,
  reveal,
} from "./core";

/* Минимальный пакет: пока набрано меньше — кнопка «Отправить» не активна
   (требование Виктории 05.08.2026). */
const MIN_TOTAL = 180000;

type Unit = {
  id: string;
  title: string;
  price: number;
  /* Если цена не сумма, а доля (комиссия) — показываем эту строку,
     а в итог позиция не считается. */
  priceLabel?: string;
  what: string;
  list?: string[];
  note?: string;
  /* Позиция без количества: комиссия считается от бюджета, множить нечего
     (требование Виктории 09.08 — количество нужно у услуг и сотрудников). */
  fixed?: boolean;
  /* Ссылка на страницу продукта — выводится внутри карточки позиции
     (требование Виктории 06.08: ссылка должна жить в карточке продукта). */
  href?: string;
};

/* Таблица 1 — «Команда по подписке (конструктор задач)».
   Колонки: Единица результата · Цена · Что заказчик получает за месяц. */
const SUBSCRIPTION: Unit[] = [
  {
    id: "program",
    title: "Разработка и лидирование комплексной программы по обучению и развитию",
    price: 100000,
    what: "Одна программа в работе. Состав работ и фиксируется в начале каждого месяца.",
  },
  {
    id: "sessions",
    title: "Сессии и модерации",
    price: 100000,
    what: "16 часов работы с группой в месяц. Подготовка, разработка и согласования сценария и отчет после сессии включены. Часы на следующий месяц можно переносить. Не включены логистические расходы.",
  },
  {
    id: "trainings",
    title: "Проведение тренингов по материалам заказчика",
    price: 100000,
    what: "60 часов работы с группой в месяц по готовым программам обучения",
  },
  {
    id: "trainer",
    title: "Бизнес-тренер",
    price: 160000,
    what: "Тренер на полной занятости в контуре компании. Задачи формулируем в начале каждого месяца",
  },
  {
    id: "methodologist",
    title: "Методолог",
    price: 100000,
    what: "Методолог на полной занятости в контуре компании. Задачи формулируем в начале каждого месяца",
  },
  {
    id: "coordinator",
    title: "Координатор проектов",
    price: 100000,
    what: "Координация проектов команды обучения. Задачи формулируем в начале каждого месяца",
  },
  {
    id: "ai-automation",
    title: "Автоматизация процессов обучения с помощью ИИ (надстройка на сервисы заказчика)",
    price: 150000,
    what: "До 5 процессов в работе. Задачи формулируем в начале каждого месяца",
  },
  {
    id: "ai-support",
    title: "Поддержание существующих ИИ-агентов и настроенных процессов",
    price: 50000,
    what: "Аренда зарубежных серверов, подключение к последним моделям нейросетей, пополнение на 100$ в мес, донастройка работающих агентов в случае необходимости, обновление базы знаний, SLA = 60 минут, отчет о проделанной работе за месяц.",
  },
  {
    id: "maintenance",
    title: "Поддержание актуальности материалов по обучению",
    price: 40000,
    what: "Регулярная актуализация действующих программ и материалов: обновление контента под изменения в процессах и продуктах. Задачи формулируем в начале каждого месяца",
  },
  {
    id: "providers",
    title: "Аудит образовательных потребностей и разработка Индивидуальных планов развития (ИПР)",
    /* Цена не сумма, а доля: комиссия 25% от бюджета обучения. В итог
       конструктора позиция не считается — поэтому price 0 и своя строка. */
    price: 0,
    priceLabel: "25% от бюджета",
    fixed: true,
    what: "Анализируем рынок образовательных услуг, оцениваем программы сторонних провайдеров на соответствие вашим бизнес-задачам, проектируем архитектуру обучения и полностью организуем процесс интеграции этих решений в вашу компанию",
    /* Отдельным абзацем (решение Виктории 06.08): условие оплаты не должно
       теряться в конце описания услуги. */
    note: "Комиссия — 25% от стоимости обучения: из каждых 100 ₽ бюджета 75 ₽ идет провайдеру, 25 ₽ — «Без Воды».",
  },
  {
    id: "designer",
    title: "Дизайнер лендингов, презентаций и всего визуального ряда",
    price: 50000,
    what: "Оформление всех материалов, структурирование презентаций, лендингов, разработка дизайна. Задачи формулируем в начале каждого месяца",
  },
];

/* Таблица 2 — «Продукты».
   Колонки: Единица результата · Цена · Что считается сданным. */
const PRODUCTS: Unit[] = [
  {
    id: "course",
    title: "Разработка с нуля онлайн-курса или дня тренинга, без проведения",
    price: 100000,
    what: "Материалы на один день тренинга: 8 часов очно или 4 часа онлайн.",
  },
  {
    id: "adaptation",
    title: "Адаптация материалов заказчика",
    price: 10000,
    what: "Правки или адаптация тренинга под контекст группы в материалах заказчика перед проведением обучения",
  },
  {
    id: "lms",
    title: "Сборка курса в LMS",
    price: 10000,
    what: "Готовый SCORM пакет",
  },
  {
    id: "map",
    title: "Карта экспертности",
    price: 60000,
    href: "/expertise-map",
    what: "Первый этап перед базой знаний и разработки обучения. Результат:",
    list: [
      "Карта знаний: минимум, который необходим человеку без необходимого опыта и логика принятия решений",
      "Карта рабочего процесса процесса с перечнем решений и точек обязательной эскалации",
      "Матрица компетенций: что нужно знать и уметь, где границы самостоятельности",
      "Рекомендации по формату обучения и развития для каждого блока знаний с обоснованием, почему именно так",
      "Архитектура базы знаний",
      "Техническое задание, по которому материалы можно разрабатывать",
      "Дорожная карта для следующего этапа разработки с оценкой трудоемкости",
    ],
  },
  {
    id: "knowledge-base",
    title: "База знаний компании  опыта сильных сотрудников",
    price: 310000,
    what: "Структурированная , пригодную для обучения сотрудников и для работы ИИ-агента.",
  },
  {
    id: "ai-mentor",
    title: "ИИ-наставник по базе знаний",
    price: 250000,
    what: "Агент отвечает сотрудникам по регламентам, стандартам и базе знаний компании, предлагает новые решения на основе базы знаний и добавленного контекста",
  },
  {
    id: "ai-agent",
    title: "ИИ-агент",
    price: 250000,
    what: "Состав работ:",
    list: [
      "архитектура",
      "настроенный ИИ-агент с готовыми сценариями работы",
      "шаблон заключения, согласованный с Заказчиком",
      "тестирование разработанного решения на идеях и бизнес кейсах, предоставленных Заказчиком до получения валидного результата",
      "методические материалы для команды Заказчика по использованию, интерпретации и прочтению заключения, возможные случаи, когда используемые нейросети могут давать невалидные результаты и необходима дополнительная валидация или донастройка",
    ],
    note: "Результаты работ представлены в виде документов в формате doc и кода на Github.",
  },
];

const money = (n: number) => n.toLocaleString("ru-RU").replace(/ /g, " ") + " ₽";

/* Сколько одинаковых единиц можно набрать в одной позиции. Потолок нужен,
   чтобы случайный зажатый «+» не увёл смету в миллиарды. */
const MAX_QTY = 20;

/* Шаг количества: появляется только у выбранной позиции. Стоит вне <label>
   карточки — иначе клик по «+» снимал бы галочку. */
function QtyStepper({
  qty,
  unitTitle,
  onQty,
}: {
  qty: number;
  unitTitle: string;
  onQty: (n: number) => void;
}) {
  const btn =
    "flex h-8 w-8 items-center justify-center rounded-sm text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-30";
  return (
    <div className="flex items-center gap-3">
      <span className="t-label text-[color:var(--color-text-secondary)]">Количество</span>
      <div className="flex items-center rounded-pill border border-[color:var(--color-line)] p-1">
        <button
          type="button"
          onClick={() => onQty(qty - 1)}
          disabled={qty <= 1}
          aria-label={`Убавить количество: ${unitTitle}`}
          className={btn}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span
          aria-live="polite"
          className="min-w-8 text-center font-display t-body font-semibold tabular-nums"
        >
          {qty}
        </span>
        <button
          type="button"
          onClick={() => onQty(qty + 1)}
          disabled={qty >= MAX_QTY}
          aria-label={`Прибавить количество: ${unitTitle}`}
          className={btn}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function UnitCard({
  unit,
  index,
  suffix,
  qty,
  onToggle,
  onQty,
}: {
  unit: Unit;
  index: number;
  suffix: string;
  qty: number;
  onToggle: () => void;
  onQty: (n: number) => void;
}) {
  const checked = qty > 0;
  /* Количество есть у всех позиций, кроме комиссионной. */
  const countable = checked && !unit.fixed;
  /* Длинные списки («Карта экспертности», «ИИ-агент») ломали сетку: карточка
     была вдвое выше соседней. Прячем состав под раскрытие — карточки ровные,
     содержимое доступно по клику. */
  const [open, setOpen] = useState(false);
  const listId = `unit-${unit.id}-list`;

  return (
    <motion.div {...reveal(index)} className="h-full">
      <PaperCard
        className={`h-full p-0 transition-colors ${
          checked ? "border-[color:var(--color-accent)]" : ""
        }`}
      >
        <div className="flex h-full flex-col">
          <label className="flex cursor-pointer flex-col gap-3 p-6">
            {/* Заголовочная зона: чекбокс, название и цена на одной линии. */}
            <div className="flex items-start gap-4">

              <span
                aria-hidden
                className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-sm border transition-colors ${
                  checked
                    ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-[color:var(--color-bg-primary)]"
                    : "border-[color:var(--color-line)]"
                }`}
              >
                {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={onToggle}
              />
              <span className="min-w-0 flex-1 font-display t-body font-semibold">{unit.title}</span>
              {/* Цена — второй голос: та же величина, нейтральный серый.
                  От двух единиц наверху стоит сумма позиции, под ней — из чего
                  она сложилась. */}
              <span className="shrink-0 whitespace-nowrap text-right">
                <span
                  className={`block font-display t-body tabular-nums ${
                    qty > 1
                      ? "font-semibold text-[color:var(--color-accent)]"
                      : "text-[color:var(--color-text-secondary)]"
                  }`}
                >
                  {unit.priceLabel ?? `${money(unit.price * Math.max(qty, 1))}${suffix}`}
                </span>
                {qty > 1 && (
                  <span className="mt-1 block t-caption tabular-nums text-[color:var(--color-text-secondary)]">
                    {money(unit.price)}{suffix} × {qty}
                  </span>
                )}
              </span>
            </div>

            <div className="pl-9">
              <p className="t-body text-[color:var(--color-text-secondary)]">{unit.what}</p>
              {!unit.list && unit.note && (
                <p className="mt-4 t-body text-[color:var(--color-text-secondary)]">{unit.note}</p>
              )}
              {!unit.list && unit.href && (
                <a
                  href={unit.href}
                  onClick={(e) => e.stopPropagation()}
                  className="link-arrow group mt-4 t-body"
                >
                  Смотреть, что входит
                  <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              )}
            </div>
          </label>

          {(unit.list || countable) && (
            <div className="mt-auto flex flex-col gap-4 px-6 pb-6 pl-[3.75rem]">
              {countable && (
                <QtyStepper qty={qty} unitTitle={unit.title} onQty={onQty} />
              )}
              {unit.list && (
                <div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <button
                      type="button"
                      onClick={() => setOpen((v) => !v)}
                      aria-expanded={open}
                      aria-controls={listId}
                      className="t-body font-semibold text-[color:var(--color-accent)] underline underline-offset-4 decoration-[color:var(--color-line)] transition-colors hover:decoration-[color:var(--color-accent)]"
                    >
                      {open ? "Свернуть" : `Состав — ${unit.list.length}`}
                    </button>
                    {unit.href && (
                      <a href={unit.href} className="link-arrow group t-body">
                        Смотреть, что входит
                        <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    )}
                  </div>
                  {open && (
                    <div id={listId} className="mt-4">
                      <NodeList divided items={unit.list} />
                      {unit.note && (
                        <p className="mt-4 t-body text-[color:var(--color-text-secondary)]">{unit.note}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </PaperCard>
    </motion.div>
  );
}

export function ConstructorPage() {
  /* Ключ — позиция, значение — количество. Позиции нет в объекте, пока её не
     выбрали: так «Выбрано» и чипы считаются по одному источнику. */
  const [picked, setPicked] = useState<Record<string, number>>({});
  const toggle = (id: string) =>
    setPicked((p) => {
      const next = { ...p };
      if (next[id]) delete next[id];
      else next[id] = 1;
      return next;
    });
  const setQty = (id: string, n: number) =>
    setPicked((p) => ({ ...p, [id]: Math.max(1, Math.min(MAX_QTY, n)) }));

  const [contact, setContact] = useState("");
  const [pd, setPd] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  /* На мобильном полоса тоже липкая, но свёрнутая: строка итога + разворот. */
  const [barOpen, setBarOpen] = useState(false);
  const contactRef = useRef<HTMLInputElement>(null);
  const hpRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const { monthly, once, count, chosen } = useMemo(() => {
    const sum = (list: Unit[]) =>
      list.reduce((acc, u) => acc + u.price * (picked[u.id] ?? 0), 0);
    const picks = [...SUBSCRIPTION, ...PRODUCTS].filter((u) => picked[u.id]);
    return { monthly: sum(SUBSCRIPTION), once: sum(PRODUCTS), count: picks.length, chosen: picks };
  }, [picked]);

  const total = monthly + once;
  const enough = total >= MIN_TOTAL;
  const canSend = enough && contact.trim().length > 1 && pd && !sending;

  /* Кнопка не должна молчать: одна причина за раз, в порядке проверки. */
  const blocker = !enough
    ? `Минимальный пакет — ${money(MIN_TOTAL)}. Добрано ${money(total)}.`
    : contact.trim().length <= 1
      ? "Укажите телефон, Telegram или почту."
      : !pd
        ? "Отметьте согласие на обработку персональных данных."
        : null;

  /* Строки для заявки: количество и сумма позиции, чтобы в письме было видно
     не только «Методолог», но и сколько их. */
  const summaryLines = () =>
    chosen.map((u) => {
      const q = picked[u.id] ?? 1;
      const per = SUBSCRIPTION.includes(u) ? " / мес" : "";
      const price = u.priceLabel ?? `${money(u.price * q)}${per}`;
      return `${u.title}${q > 1 ? ` × ${q}` : ""} — ${price}`;
    });

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSend) return;
    setErr(null);
    setSending(true);
    try {
      const lines = summaryLines();
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "",
          contact: contact.trim(),
          company: "",
          comment: [
            "Заявка из конструктора.",
            ...lines,
            `Итого: ${money(monthly)} / мес + ${money(once)} разово.`,
          ].join("\n"),
          consent_pd: true,
          consent_pd_version: "1.0-2026-07-14",
          consent_ads: false,
          website: hpRef.current?.value || "",
          page: "/constructor",
        }),
      });
      if (!r.ok) throw new Error(String(r.status));
      setSent(true);
    } catch {
      setErr("Заявка не отправилась. Попробуйте ещё раз или напишите в Telegram: @vikky_duck.");
      window.setTimeout(() => errRef.current?.focus(), 0);
    } finally {
      setSending(false);
    }
  };

  const sentLines = useMemo(() => summaryLines(), [chosen]);

  return (
    <PageShell path="/constructor">
      {/* Отступ снизу увеличен: липкая полоса не перекрывает последние карточки. */}
      <section className="stage border-b border-[color:var(--color-line)] pb-28 md:pb-32">
        <Scene blobs={[{ className: "-right-40 top-[20%]", tone: "rose", size: 500 }]} />

        <div className="relative mx-auto max-w-7xl px-5 pt-14 md:px-8 md:pt-20">
          <RevealHeading as="h1" className="t-h1 max-w-4xl">
            Команда по подписке: конструктор
          </RevealHeading>
          <p className="measure mt-6 t-body text-[color:var(--color-text-primary)]">
            Выберите задачи и нажмите на кнопку «Отправить», когда соберете пакет
            услуг, мы напишем вам в течение 5 минут.
          </p>
          {/* Общее условие работы — то же, что в шапках страниц решений. */}
          <p className="measure mt-5 border-l-2 border-[color:var(--color-accent)] pl-4 t-body text-[color:var(--color-text-secondary)]">
            Все услуги и продукты подразумевают подбор исполнителей с нашей стороны.
          </p>

          <fieldset className="mt-14 border-0 p-0">
            <legend className="sr-only">Команда по подписке — оплата в месяц</legend>
            <SectionLabel n="01">Команда по подписке · в месяц</SectionLabel>
            <RevealHeading className="t-h2 mt-6 max-w-3xl">Команда по подписке</RevealHeading>
            <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-2">
              {SUBSCRIPTION.map((u, i) => (
                <UnitCard
                  key={u.id}
                  unit={u}
                  index={i}
                  suffix=" / мес"
                  qty={picked[u.id] ?? 0}
                  onToggle={() => toggle(u.id)}
                  onQty={(n) => setQty(u.id, n)}
                />
              ))}
            </div>
          </fieldset>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <fieldset className="border-0 p-0">
            <legend className="sr-only">Продукты — оплата разово</legend>
            <SectionLabel n="02">Продукты · разово</SectionLabel>
            <RevealHeading className="t-h2 mt-6 max-w-3xl">Продукты</RevealHeading>
            <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-2">
              {PRODUCTS.map((u, i) => (
                <UnitCard
                  key={u.id}
                  unit={u}
                  index={i}
                  suffix=""
                  qty={picked[u.id] ?? 0}
                  onToggle={() => toggle(u.id)}
                  onQty={(n) => setQty(u.id, n)}
                />
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      {/* Итог и отправка. Липкая полоса и на мобильном: свёрнутая строка с
          суммой, разворот — полный чек и форма. */}
      <div className="pointer-events-none sticky bottom-0 z-40 px-3 pb-4 md:px-6 md:pb-6">
        <div className="pointer-events-auto mx-auto max-h-[70vh] max-w-3xl overflow-y-auto rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-bg-dark)] px-5 py-4 text-[color:var(--color-text-inverse)] shadow-[var(--shadow-soft)]">

          {sent ? (
            <div>
              <p className="t-body">
                Заявка отправлена. Мы напишем вам в течение 5 минут.
              </p>
              {sentLines.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {sentLines.map((l) => (
                    <li key={l} className="t-caption text-[color:var(--color-text-inverse-2)]">
                      {l}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <form onSubmit={send} noValidate className="flex flex-col gap-3">
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                <span aria-live="polite" className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                  {count === 0 ? (
                    /* Пустое состояние — одна строка, без счётчика (приёмка, п. 4). */
                    <span className="t-body text-[color:var(--color-text-inverse-2)]">
                      Выберите позиции · минимальный пакет {money(MIN_TOTAL)}
                    </span>
                  ) : (
                    <>
                      <span className="t-label text-[color:var(--color-text-inverse-2)]">
                        Выбрано: {count}
                      </span>
                      {monthly > 0 && (
                        <span className="font-display t-body tabular-nums text-[color:var(--color-text-inverse-2)]">
                          {money(monthly)} / мес
                        </span>
                      )}
                      {once > 0 && (
                        <span className="font-display t-body tabular-nums text-[color:var(--color-text-inverse-2)]">
                          {money(once)} разово
                        </span>
                      )}
                      <span className="font-display t-body font-semibold tabular-nums text-[color:var(--color-accent)]">
                        Итого: {money(total)}
                      </span>
                    </>
                  )}
                </span>

                <div className="ml-auto flex items-center gap-4">
                  {count > 0 && (
                    <button
                      type="button"
                      onClick={() => setPicked({})}
                      className="t-caption text-[color:var(--color-text-inverse-2)] underline underline-offset-2"
                    >
                      Очистить
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setBarOpen((v) => !v)}
                    aria-expanded={barOpen}
                    aria-controls="constructor-bar-body"
                    className="t-caption text-[color:var(--color-text-inverse-2)] underline underline-offset-2 md:hidden"
                  >
                    {barOpen ? "Свернуть" : "Развернуть"}
                  </button>
                </div>
              </div>

              <div
                id="constructor-bar-body"
                className={`${barOpen ? "flex" : "hidden"} flex-col gap-3 md:flex ${count === 0 ? "hidden md:hidden" : ""}`}
              >
                {count > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {chosen.map((u) => (
                      <li key={u.id}>
                        <button
                          type="button"
                          onClick={() => toggle(u.id)}
                          aria-label={`Убрать: ${u.title}`}
                          className="flex max-w-[18rem] items-center gap-2 rounded-pill border border-[color:var(--color-line-dark)] px-3 py-1.5 text-left t-caption text-[color:var(--color-text-inverse-2)] transition-colors hover:border-[color:var(--color-accent-glass)] hover:text-[color:var(--color-text-inverse)]"
                        >
                          <span className="truncate">{u.title}</span>
                          {(picked[u.id] ?? 1) > 1 && (
                            <span className="flex-none font-display tabular-nums text-[color:var(--color-accent)]">
                              × {picked[u.id]}
                            </span>
                          )}
                          {/* Крестик — другой знак, иначе рядом с «× 2» читается
                              как второй множитель. */}
                          <span aria-hidden className="flex-none">✕</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {enough ? (
                  <>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        ref={contactRef}
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Телефон, Telegram или почта"
                        aria-label="Телефон, Telegram или почта"
                        autoComplete="off"
                        className="w-full rounded-sm border border-[color:var(--color-line-dark)] bg-white/5 px-4 py-3 t-body text-[color:var(--color-text-inverse)] outline-none transition placeholder:text-[color:var(--color-text-inverse-2)]/50 focus:border-[color:var(--color-accent-glass)] focus:bg-white/10"
                      />
                      <button
                        type="submit"
                        disabled={!canSend}
                        className="btn btn-invert shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span>{sending ? "Отправляем…" : "Отправить"}</span>
                      </button>
                    </div>

                    <p className="hidden" aria-hidden="true">
                      <label>
                        Не заполняйте это поле
                        <input ref={hpRef} type="text" tabIndex={-1} autoComplete="off" />
                      </label>
                    </p>

                    <label className="flex cursor-pointer items-start gap-3 t-caption text-[color:var(--color-text-inverse-2)]">
                      <input
                        type="checkbox"
                        checked={pd}
                        onChange={(e) => setPd(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-accent)]"
                      />
                      <span>
                        Согласен(а) на обработку персональных данных —{" "}
                        <a href="/consent_pd" target="_blank" rel="noreferrer" className="underline underline-offset-2">условия</a>{" "}
                        и{" "}
                        <a href="/politics_pd" target="_blank" rel="noreferrer" className="underline underline-offset-2">политика</a>
                      </span>
                    </label>

                    {blocker && (
                      <p className="t-caption text-[color:var(--color-text-inverse-2)]">{blocker}</p>
                    )}
                  </>
                ) : count > 0 ? (
                  <p className="t-caption text-[color:var(--color-text-inverse-2)]">
                    {blocker}
                  </p>
                ) : null}

                {err && (
                  <p
                    ref={errRef}
                    tabIndex={-1}
                    role="alert"
                    className="t-caption text-[color:var(--color-accent-glass)] outline-none"
                  >
                    {err}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </PageShell>
  );
}
