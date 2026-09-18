/* ============================================================================
   pages-expertise.tsx — /expertise-map, страница продукта «Карта экспертности».

   Смысл (решение Виктории 06.08.2026): на карту экспертности ссылались из
   пяти мест, но объяснения продукта не было нигде. Здесь — что это,
   как проходит работа, что получает компания и как выглядят сами документы.

   Тексты — из коммерческого предложения «Система адаптации коммерческой
   команды» (слайды 04, 05, 07, 08) и с продуктовой страницы внутренних
   экспертов. Артефакты — синтетический демонстрационный пакет
   competency-map-learning-center-synthetic-v1 (версия 1.0 от 05.08.2026).

   ВАЖНО: пакет синтетический — данных реальной организации в нем нет.
   Дисклеймер на странице обязателен и стоит до первого документа: сами
   файлы помечены так же, и убирать это нельзя.
   ========================================================================== */
import {
  motion,
  PageShell, PageHead, SectionLabel, PaperCard, Scene, CtaBand,
  RevealHeading, NodeList, ArrowUpRight, ArrowRight,
  reveal,
} from "./core";


type Artifact = {
  code: string;
  slug: string;
  title: string;
  summary: string;
};

/* Состав пакета — по manifest.json демонстрационного комплекта. */
const ARTIFACTS: Artifact[] = [
  {
    code: "00",
    slug: "navigator",
    title: "Навигатор по пакету",
    summary: "Состав и порядок чтения 7 документов.",
  },
  {
    code: "01",
    slug: "knowledge-map",
    title: "Карта знаний",
    summary: "16 блоков знаний, 2 уровня изучения и связь с рабочими обязанностями.",
  },
  {
    code: "02",
    slug: "process-map",
    title: "Карта процесса и решений",
    summary: "Этапы P-00…P-08: решения, результаты и вопросы, требующие участия руководителя.",
  },
  {
    code: "03",
    slug: "competency-matrix",
    title: "Матрица компетенций",
    summary: "10 компетенций, шкала 1–4, индикаторы, доказательства и границы самостоятельности.",
  },
  {
    code: "04",
    slug: "formats",
    title: "Рекомендации по форматам",
    summary: "Формат передачи знаний для каждого блока — с обоснованием и критериями готовности.",
  },
  {
    code: "05",
    slug: "architecture",
    title: "Архитектура базы знаний и программы",
    summary: "Рубрики базы знаний, учебный маршрут, шаблоны и порядок обновления.",
  },
  {
    code: "06",
    slug: "roadmap",
    title: "Дорожная карта разработки",
    summary: "18 задач на 12 недель: порядок, ответственные, трудоемкость и точки проверки.",
  },
];

/* Работа с экспертами: краткое описание для страницы продукта. */
const HOW = [
  "Проводим интервью с экспертами компании",
  "Разбираем удачные, неудачные и спорные рабочие ситуации",
  "Определяем знания и навыки для решения рабочих задач",
  "Фиксируем логику решений и условия их применения",
];

/* Документы по итогам работы с экспертами. */
const RESULT = [
  "Карта знаний, разделенная на уровни погружения",
  "Карта процесса: решения сотрудника и вопросы для руководителя",
  "Матрица компетенций: что сотрудник обязан знать и где границы его самостоятельности",
  "Рекомендации по формату подачи каждого блока знаний с обоснованием",
  "Архитектура базы знаний и техническое задание для разработки материалов",
  "План разработки с оценкой трудоемкости",
];

function ArtifactCard({ item, index }: { item: Artifact; index: number }) {
  const pdf = `/pdf/expertise-map/${item.code}-${item.slug}.pdf`;
  const img = `/img/expertise-map/${item.code}-${item.slug}.webp`;
  return (
    <motion.div {...reveal(index)} className="h-full">
      <PaperCard className="flex h-full flex-col overflow-hidden p-0">
        <a
          href={pdf}
          target="_blank"
          rel="noreferrer"
          className="group block overflow-hidden border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-secondary)]"
        >
          <img
            src={img}
            alt={`Разворот документа «${item.title}»`}
            loading="lazy"
            width={1200}
            height={900}
            className="aspect-[4/3] w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
          />
        </a>
        <div className="flex flex-1 flex-col p-6">
          <div className="font-display t-label tabular-nums text-[color:var(--color-accent)]">
            {item.code}
          </div>
          <div className="mt-2 font-display t-body font-semibold">{item.title}</div>
          <p className="mt-2 t-body text-[color:var(--color-text-secondary)]">{item.summary}</p>
          <a
            href={pdf}
            target="_blank"
            rel="noreferrer"
            className="link-arrow group mt-auto pt-5 t-body"
          >
            Смотреть документ
            <ArrowUpRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </PaperCard>
    </motion.div>
  );
}

export function ExpertiseMapPage() {
  return (
    <PageShell path="/expertise-map">
      <section className="stage border-b border-[color:var(--color-line)]">
        <Scene blobs={[{ className: "-right-40 top-[18%]", tone: "rose", size: 520 }]} />
        <PageHead
          kicker="Карта экспертности"
          title={<>Карта экспертности</>}
          lead="7 документов для разработки обучения: знания экспертов, рабочие процессы, компетенции и план выпуска материалов."
          chips={[
            ["7–14 дней", "срок первого этапа"],
            ["Без ТЗ", "достаточно описания задачи"],
          ]}
        />

        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <SectionLabel n="01">Как работаем</SectionLabel>
          <RevealHeading className="t-h2 mt-6 max-w-3xl">
            Интервью и разбор рабочих ситуаций
          </RevealHeading>
          <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <NodeList divided items={HOW} />
            </div>
            <div>
              <div className="t-eyebrow text-[color:var(--color-text-secondary)]">Результат</div>
              <div className="mt-4">
                <NodeList divided items={RESULT} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Артефакты — ядро страницы: продукт видно, а не только описан */}
      <section className="relative border-b border-[color:var(--color-line)]">
        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <SectionLabel n="02">Документы</SectionLabel>
          <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <RevealHeading className="t-h2 max-w-3xl">
              Как выглядит результат
            </RevealHeading>
            <p className="max-w-md t-body text-[color:var(--color-text-secondary)]">
              7 связанных документов: от карты знаний до плана разработки материалов.
            </p>
          </div>

          {/* Дисклеймер до первого документа: пакет синтетический */}
          <PaperCard className="mt-8 max-w-3xl border-l-[3px] border-l-[color:var(--color-accent)] p-6">
            <div className="t-label text-[color:var(--color-text-secondary)]">Демонстрационный пример</div>
            <p className="mt-2 t-body text-[color:var(--color-text-primary)]">
              Компания, люди, процессы и численные показатели в примере вымышлены.
              В клиентском проекте документы составляются по материалам и интервью компании.
            </p>
          </PaperCard>

          <div className="mt-10 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ARTIFACTS.map((a, i) => (
              <ArtifactCard key={a.code} item={a} index={i} />
            ))}
          </div>

          <a
            href="/pdf/expertise-map/00-navigator.pdf"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary group mt-10"
          >
            <span>Начать с навигатора по пакету</span>
            <ArrowRight data-arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </section>

      {/* Разработка материалов по карте экспертности. */}
      <section className="relative border-b border-[color:var(--color-line)]">
        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <SectionLabel n="03">После первого этапа</SectionLabel>
          <RevealHeading className="t-h2 mt-6 max-w-3xl">
            Как продолжить работу
          </RevealHeading>
          <p className="mt-5 max-w-3xl t-body text-[color:var(--color-text-secondary)]">
            Состав и стоимость разработки определяются после изучения материалов.
            Права на материалы передаются в порядке, установленном договором.
          </p>
          <div className="mt-8 max-w-3xl">
            <NodeList
              divided
              items={[
                "короткие видеоуроки и авторские разборы экспертов компании — там, где важна логика рассуждения",
                "схемы, памятки, алгоритмы и деревья решений — там, где нужен быстрый ответ в моменте",
                "калькуляторы типовых расчетов с согласованными вводными и контрольными примерами",
                "библиотека реальных кейсов: прибыльных, убыточных, спорных",
                "тренажеры рабочих диалогов",
                "ИИ-ассистент, отвечающий на вопросы по базе знаний",
                "тесты и аттестационные кейсы с защитой решения перед экспертом",
              ]}
            />
          </div>
        </div>
      </section>

      <CtaBand path="/expertise-map" />
    </PageShell>
  );
}
