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
  RevealHeading, NodeList, Check,
  reveal,
} from "./core";

/* Минимальный пакет: пока набрано меньше — кнопка «Отправить» не активна
   (требование Виктории 05.08.2026). */
const MIN_TOTAL = 200000;

type Unit = {
  id: string;
  title: string;
  price: number;
  what: string;
  list?: string[];
  note?: string;
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

function UnitCard({
  unit,
  index,
  suffix,
  checked,
  onToggle,
}: {
  unit: Unit;
  index: number;
  suffix: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div {...reveal(index)} className="h-full">
      <PaperCard
        className={`h-full p-0 transition-colors ${
          checked ? "border-[color:var(--color-accent)]" : ""
        }`}
      >
        <label className="flex h-full cursor-pointer flex-col gap-4 p-6">
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
            <span className="min-w-0 flex-1 font-display t-body font-bold">{unit.title}</span>
            <span className="shrink-0 whitespace-nowrap font-display t-body font-medium tabular-nums text-[color:var(--color-accent)]">
              {money(unit.price)}
              {suffix}
            </span>
          </div>

          <div className="pl-9">
            <p className="t-body text-[color:var(--color-text-secondary)]">{unit.what}</p>
            {unit.list && (
              <div className="mt-4">
                <NodeList divided items={unit.list} />
              </div>
            )}
            {unit.note && (
              <p className="mt-4 t-body text-[color:var(--color-text-secondary)]">{unit.note}</p>
            )}
          </div>
        </label>
      </PaperCard>
    </motion.div>
  );
}

export function ConstructorPage() {
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setPicked((p) => ({ ...p, [id]: !p[id] }));

  const [contact, setContact] = useState("");
  const [pd, setPd] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const hpRef = useRef<HTMLInputElement>(null);

  const { monthly, once, count, chosen } = useMemo(() => {
    const sum = (list: Unit[]) =>
      list.reduce((acc, u) => (picked[u.id] ? acc + u.price : acc), 0);
    const picks = [...SUBSCRIPTION, ...PRODUCTS].filter((u) => picked[u.id]);
    return { monthly: sum(SUBSCRIPTION), once: sum(PRODUCTS), count: picks.length, chosen: picks };
  }, [picked]);

  const total = monthly + once;
  const enough = total >= MIN_TOTAL;
  const canSend = enough && contact.trim().length > 1 && pd && !sending;

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSend) return;
    setErr(null);
    setSending(true);
    try {
      const lines = chosen.map(
        (u) => `${u.title} — ${money(u.price)}${SUBSCRIPTION.includes(u) ? " / мес" : ""}`,
      );
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
    } finally {
      setSending(false);
    }
  };

  return (
    <PageShell path="/constructor">
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-right-40 top-[20%]", tone: "rose", size: 500 }]} />

        <div className="relative mx-auto max-w-7xl px-5 pt-14 md:px-8 md:pt-20">
          <RevealHeading as="h1" className="t-h1 max-w-4xl">
            Команда по подписке: конструктор
          </RevealHeading>
          <p className="measure mt-6 t-body text-[color:var(--color-text-primary)]">
            Выберите задачи и нажмите на кнопку «Отправить», когда соберете пакет
            услуг, мы напишем вам в течение рабочего дня.
          </p>
          <div className="mt-10 grid items-stretch gap-4 lg:grid-cols-2">
            {SUBSCRIPTION.map((u, i) => (
              <UnitCard
                key={u.id}
                unit={u}
                index={i}
                suffix=" / мес"
                checked={!!picked[u.id]}
                onToggle={() => toggle(u.id)}
              />
            ))}
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <RevealHeading className="t-h2 max-w-3xl">Продукты</RevealHeading>
          <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-2">
            {PRODUCTS.map((u, i) => (
              <UnitCard
                key={u.id}
                unit={u}
                index={i}
                suffix=""
                checked={!!picked[u.id]}
                onToggle={() => toggle(u.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Итог и отправка. На десктопе полоса липкая; на мобильном обычный блок
          в конце — внизу уже висят кнопка PageShell и cookie-бар. */}
      <div className="pointer-events-none px-3 pb-3 md:sticky md:bottom-0 md:z-40 md:px-6 md:pb-6">
        <div className="pointer-events-auto mx-auto max-w-3xl rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-bg-dark)] px-5 py-4 text-[color:var(--color-text-inverse)] shadow-[var(--shadow-soft)]">
          {sent ? (
            <p className="t-body">
              Заявка отправлена. Мы напишем вам в течение рабочего дня.
            </p>
          ) : (
            <form onSubmit={send} noValidate className="flex flex-col gap-3">
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                <span className="t-label text-[color:var(--color-text-inverse-2)]">
                  Выбрано: {count}
                </span>
                <span className="font-display t-body font-medium tabular-nums">
                  {money(monthly)} / мес
                </span>
                <span className="font-display t-body font-medium tabular-nums">
                  {money(once)} разово
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  ref={contactRef}
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Телефон, Telegram или почта"
                  autoComplete="off"
                  className="w-full rounded-sm border border-[color:var(--color-line-dark)] bg-white/5 px-4 py-3 text-base text-[color:var(--color-text-inverse)] outline-none transition placeholder:text-[color:var(--color-text-inverse-2)]/50 focus:border-[color:var(--color-accent-glass)] focus:bg-white/10"
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

              {!enough && (
                <p className="t-caption text-[color:var(--color-text-inverse-2)]">
                  Минимальный пакет — {money(MIN_TOTAL)}.
                </p>
              )}

              {err && (
                <p role="alert" className="t-caption text-[color:var(--color-accent-glass)]">{err}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </PageShell>
  );
}
