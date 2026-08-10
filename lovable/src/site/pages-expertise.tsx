/* ============================================================================
   pages-expertise.tsx — /expertise-map, страница продукта «Карта экспертности».

   Смысл (решение Виктории 06.08.2026): на карту экспертности ссылались из
   пяти мест, но объяснения продукта не было нигде. Здесь — что это,
   как проходит работа, что получает компания и как выглядят сами документы.

   Тексты — из коммерческого предложения «Система адаптации коммерческой
   команды» (слайды 04, 05, 07, 08) и с продуктовой страницы внутренних
   экспертов. Артефакты — синтетический демонстрационный пакет
   competency-map-learning-center-synthetic-v1 (версия 1.0 от 05.08.2026).

   ВАЖНО: пакет синтетический — данных реальной организации в нём нет.
   Дисклеймер на странице обязателен и стоит до первого документа: сами
   файлы помечены так же, и убирать это нельзя.
   ========================================================================== */
import {
  motion,
  PageShell, PageHead, SectionLabel, PaperCard, Scene, CtaBand,
  RevealHeading, NodeList, ArrowUpRight, ArrowRight,
  reveal,
} from "./core";
import { EXPERTS_NOTE } from "./data";

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
    summary: "Состав, логика, связи и порядок чтения семи документов.",
  },
  {
    code: "01",
    slug: "knowledge-map",
    title: "Карта знаний",
    summary: "16 блоков знаний, два уровня погружения и трассировка к обязанностям.",
  },
  {
    code: "02",
    slug: "process-map",
    title: "Карта процесса и решений",
    summary: "Процесс P-00…P-08, гейты, решения, выходы и обязательная эскалация.",
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
    summary: "Таксономия, учебный маршрут, шаблоны материалов, роли и жизненный цикл.",
  },
  {
    code: "06",
    slug: "roadmap",
    title: "Дорожная карта разработки",
    summary: "18 инициатив на 12 недель: приоритеты, зависимости, владельцы, трудоемкость и гейты.",
  },
];

/* «Как работаем» — с продуктовой страницы внутренних экспертов, дословно. */
const HOW = [
  "Проводим интервью и рабочие сессии с носителями экспертности",
  "Разбираем реальные результаты: те, что сработали, и те, что не сработали, спорные и несостоявшиеся",
  "Выявляем минимум знаний, умений и навыков для получения нужного результата",
  "Извлекаем факты и логику принятия решений, которая способствует результату",
];

/* «В результате у вас» — оттуда же. */
const RESULT = [
  "Карта знаний, разделенная на уровни погружения",
  "Карта процесса с перечнем решений и точек обязательной эскалации",
  "Матрица компетенций: что сотрудник обязан знать и где границы его самостоятельности",
  "Рекомендации по формату подачи каждого блока знаний с обоснованием",
  "Архитектура базы знаний и техническое задание для разработки материалов",
  "Дорожная карта дальнейшей работы с оценкой трудоемкости",
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
          title={<>Первый шаг: карта экспертности</>}
          lead="Самостоятельный законченный этап. Компания получает структурированную карту знаний и дальше свободна в выборе: продолжать с нами, силами внутренней команды или с другим подрядчиком. Все материалы остаются в вашей собственности."
          guide="Ниже — как проходит работа, что получаете на выходе и как выглядят сами документы."
          note={EXPERTS_NOTE}
          chips={[
            ["7–14 дней", "срок первого этапа"],
            ["Без ТЗ", "приходите с задачей — рамку соберём вместе"],
          ]}
        />

        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <SectionLabel n="01">Как работаем</SectionLabel>
          <RevealHeading className="t-h2 mt-6 max-w-3xl">
            Что происходит на первом этапе
          </RevealHeading>
          <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <NodeList divided items={HOW} />
            </div>
            <div>
              <div className="t-eyebrow text-[color:var(--color-text-secondary)]">В результате у вас</div>
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
          <SectionLabel n="02">Артефакты</SectionLabel>
          <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <RevealHeading className="t-h2 max-w-3xl">
              Как выглядит результат
            </RevealHeading>
            <p className="max-w-md t-body text-[color:var(--color-text-secondary)]">
              Семь связанных документов: от карты знаний до плана разработки материалов.
            </p>
          </div>

          {/* Дисклеймер до первого документа: пакет синтетический */}
          <PaperCard className="mt-8 max-w-3xl border-l-[3px] border-l-[color:var(--color-accent)] p-6">
            <div className="t-label text-[color:var(--color-text-secondary)]">Синтетический пример</div>
            <p className="mt-2 t-body text-[color:var(--color-text-primary)]">
              Пакет разработан для демонстрации методики и не содержит данных
              конкретной организации: организация, люди, процессы и количественные
              пороги вымышлены. В вашем проекте состав документов тот же, а
              содержание — ваше.
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

      {/* Что дальше — сценарии продолжения из КП */}
      <section className="relative border-b border-[color:var(--color-line)]">
        <div className="relative mx-auto max-w-7xl px-5 sec-pad md:px-8">
          <SectionLabel n="03">После первого этапа</SectionLabel>
          <RevealHeading className="t-h2 mt-6 max-w-3xl">
            Что можно сделать дальше
          </RevealHeading>
          <p className="mt-5 max-w-3xl t-body text-[color:var(--color-text-secondary)]">
            Состав и стоимость продолжения фиксируются по итогам первого этапа,
            когда объем знаний известен. Один и тот же блок знаний упаковывается
            по-разному — выбор зависит от задачи, которую решает сотрудник.
          </p>
          <div className="mt-8 max-w-3xl">
            <NodeList
              divided
              items={[
                "короткие видеоуроки и авторские разборы ваших экспертов — там, где важна логика рассуждения",
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
