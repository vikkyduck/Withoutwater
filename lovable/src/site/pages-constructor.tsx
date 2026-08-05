/* ============================================================================
   pages-constructor.tsx — /constructor, страница-конструктор задач.

   ВАЖНО: страница НЕ прикреплена к сайту (решение Виктории 05.08.2026).
   Её нет ни в шапке, ни в подвале, ни в sitemap.xml; в мете стоит
   noindex,nofollow. Живёт на том же домене и в той же дизайн-системе,
   чтобы ссылку можно было отправить клиенту напрямую.

   Цены и формулировки — из таблицы Виктории от 05.08.2026, дословно.
   Исправлены только опечатки (перечислены в комментариях у позиций).
   ========================================================================== */
import { useMemo, useState } from "react";
import {
  motion,
  PageShell, PageHead, SectionLabel, PaperCard, Scene,
  RevealHeading, NodeList, Check,
  reveal, ctaHref, CTA_LABEL,
} from "./core";

type Unit = {
  id: string;
  title: string;
  price: number;
  what: string;
  list?: string[];
  note?: string;
};

/* Ежемесячные единицы результата. «Состав работ и фиксируется» → «Состав
   работ фиксируется»; во втором пункте снят дубль «мониторинг, мониторинг». */
const SUBSCRIPTION: Unit[] = [
  {
    id: "program",
    title: "Разработка и лидирование комплексной программы по обучению и развитию",
    price: 100000,
    what: "Одна программа в работе. Состав работ фиксируется в начале каждого месяца.",
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
    /* Переписано Викторией 05.08: вместо «мониторинга токенов» — состав
       расходов и SLA 60 минут вместо прежних 2 рабочих часов. */
    what: "Аренда зарубежных серверов, подключение к последним моделям нейросетей, пополнение на 100 $ в мес, донастройка работающих агентов в случае необходимости, обновление базы знаний, SLA = 60 минут, отчет о проделанной работе за месяц.",
  },
  {
    id: "designer",
    title: "Дизайнер лендингов, презентаций и всего визуального ряда",
    price: 50000,
    what: "Оформление всех материалов, структурирование презентаций, лендингов, разработка дизайна. Задачи формулируем в начале каждого месяца",
  },
];

/* Разовые продукты. Правки опечаток: «Карта рабочего процесса процесса» →
   «Карта рабочего процесса»; «Структурированная , пригодную» →
   «Структурированная, пригодная»; SCORM пакет → SCORM-пакет; Github → GitHub.
   «База знаний … опыта сильных сотрудников» → «на опыте ключевых
   сотрудников»: «сильные» — запрещённая лексика по решению Виктории
   от 04.08, вчера вычищена с девяти страниц. */
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
    what: "Готовый SCORM-пакет",
  },
  {
    id: "map",
    title: "Карта экспертности",
    price: 60000,
    what: "Первый этап перед базой знаний и разработки обучения. Результат:",
    list: [
      "Карта знаний: минимум, который необходим человеку без необходимого опыта, и логика принятия решений",
      "Карта рабочего процесса с перечнем решений и точек обязательной эскалации",
      "Матрица компетенций: что нужно знать и уметь, где границы самостоятельности",
      "Рекомендации по формату обучения и развития для каждого блока знаний с обоснованием, почему именно так",
      "Архитектура базы знаний",
      "Техническое задание, по которому материалы можно разрабатывать",
      "Дорожная карта для следующего этапа разработки с оценкой трудоемкости",
    ],
  },
  {
    id: "knowledge-base",
    title: "База знаний компании на опыте ключевых сотрудников",
    price: 310000,
    what: "Структурированная, пригодная для обучения сотрудников и для работы ИИ-агента.",
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
      "тестирование разработанного решения на идеях и бизнес-кейсах, предоставленных Заказчиком, до получения валидного результата",
      "методические материалы для команды Заказчика по использованию, интерпретации и прочтению заключения, возможные случаи, когда используемые нейросети могут давать невалидные результаты и необходима дополнительная валидация или донастройка",
    ],
    note: "Результаты работ представлены в виде документов в формате doc и кода на GitHub.",
  },
];

const money = (n: number) => n.toLocaleString("ru-RU").replace(/ /g, " ") + " ₽";

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

  const { monthly, once, count } = useMemo(() => {
    const sum = (list: Unit[]) =>
      list.reduce((acc, u) => (picked[u.id] ? acc + u.price : acc), 0);
    const picks = [...SUBSCRIPTION, ...PRODUCTS].filter((u) => picked[u.id]).length;
    return { monthly: sum(SUBSCRIPTION), once: sum(PRODUCTS), count: picks };
  }, [picked]);

  return (
    <PageShell path="/constructor">
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-right-40 top-[20%]", tone: "rose", size: 500 }]} />
        <PageHead
          kicker="Конструктор"
          title={<>Команда по подписке: конструктор задач</>}
          lead="Отметьте нужные позиции — внизу соберётся сумма: ежемесячная за команду и разовая за продукты."
        />

        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <SectionLabel n="01">Команда по подписке</SectionLabel>
          <RevealHeading className="t-h2 mt-6 max-w-3xl">
            Что заказчик получает за месяц
          </RevealHeading>
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
          <SectionLabel n="02">Продукты</SectionLabel>
          <RevealHeading className="t-h2 mt-6 max-w-3xl">
            Что считается сданным
          </RevealHeading>
          <div className="mt-10 grid items-stretch gap-4 lg:grid-cols-2">
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

          <p className="mt-10 max-w-3xl t-body text-[color:var(--color-text-secondary)]">
            Состав месяца фиксируется заранее. Логистика очных выездов — за счет
            заказчика. Работаем по договору возмездного оказания услуг с ИП Уткина В. В.
          </p>
        </div>
      </section>

      {/* Итог. На десктопе — липкая полоса внизу. На мобильном липкой быть
          не может: там уже висят плавающая кнопка PageShell и cookie-бар,
          получалось три слоя друг на друге — поэтому итог становится
          обычным блоком в конце страницы. */}
      <div className="pointer-events-none px-3 pb-3 md:sticky md:bottom-0 md:z-40 md:px-6 md:pb-6">
        <div className="pointer-events-auto mx-auto flex max-w-3xl flex-col gap-3 rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-bg-dark)] px-5 py-4 text-[color:var(--color-text-inverse)] shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between">
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
          <a href={ctaHref("/constructor")} className="btn btn-invert shrink-0">
            <span>{CTA_LABEL}</span>
          </a>
        </div>
      </div>
    </PageShell>
  );
}
