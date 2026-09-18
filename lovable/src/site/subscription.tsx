import type { ReactNode } from "react";
import { PageShell, PageHead, SectionLabel, ArrowRight } from "./core";
import { Contact, FaqAccordion } from "./blocks";
import { CASES, IPR_UNIT, TEAM } from "./data";

export function Section({ id, label, title, intro, children }: { id?: string; label: string; title: string; intro?: string; children: ReactNode }) {
  return <section id={id} className="proposal-section"><div className="proposal-wrap">
    <SectionLabel>{label}</SectionLabel><h2 className="t-h2 proposal-heading">{title}</h2>
    {intro && <p className="proposal-intro">{intro}</p>}{children}
  </div></section>;
}
function Cards({ items }: { items: [string, string][] }) {
  return <div className="proposal-grid">{items.map(([title, body], i) => <article className="proposal-card" key={title}>
    <span className="proposal-number">{String(i + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p>
  </article>)}</div>;
}
function Link({ href, children }: { href: string; children: ReactNode }) {
  return <a className="proposal-link" href={href}>{children}<ArrowRight aria-hidden size={18} /></a>;
}
function Head({ label, title, lead }: { label: string; title: string; lead: string }) {
  return <section className="stage border-b border-[color:var(--color-line)]"><PageHead compact kicker={label} title={<>{title}</>} lead={lead}
    actions={<div className="flex flex-wrap gap-6 items-center"><a className="btn btn-invert" href="#contact">Обсудить задачу <ArrowRight aria-hidden size={18}/></a><Link href="/tasks/team-subscription/#terms">Условия подписки</Link></div>} /></section>;
}

function Details({ title, children }: { title: string; children: ReactNode }) {
  return <details className="proposal-details"><summary><span>{title}</span><ArrowRight aria-hidden data-chevron size={18}/></summary><div>{children}</div></details>;
}

export function SubscriptionOverview({ compact = false }: { compact?: boolean }) {
  return <Section id="subscription" label="Пример состава подписки" title="Учебный модуль за месяц">
    <div className="proposal-offer"><div><p className="proposal-price">180 000 ₽</p><p>Модуль до 60 минут для LMS: сценарий, оформление, сборка и проверка на пилоте.</p></div>
      <ul className="proposal-checks"><li>Материалы и задания на основе опыта компании</li><li>Исходники и инструкция по обновлению</li><li>Руководитель проекта и еженедельный статус</li></ul></div>
    <p className="proposal-note">Один из вариантов подписки. Состав месяца определяется задачами компании.</p>
    {!compact && <Details title="Объем, участие компании и отдельные расходы"><ul className="proposal-detail-list"><li>До 2 интервью с экспертом по 60 минут; рабочий пример и до 10 проверочных заданий.</li><li>Оформление и сборка для согласованной LMS, 1 пилот, до 2 раундов консолидированных правок.</li><li>Компания предоставляет материалы, эксперта, согласующего, доступ к LMS и пилотную группу.</li><li>Срок — месяц при соблюдении дат передачи вводных и обратной связи.</li><li>Лицензия LMS, внешние курсы и производство видео оплачиваются отдельно.</li></ul></Details>}
    <div className="proposal-actions"><Link href={compact ? "/tasks/team-subscription/#subscription" : "/contacts/"}>{compact ? "Состав и условия" : "Обсудить состав подписки"}</Link></div>
  </Section>;
}

export function MonthExamples() {
  return <Section id="examples" label="Другие задачи" title="Разработка, проведение и сопровождение">
    <div id="services" className="proposal-grid">{[
      ["Адаптация сотрудников", "Маршрут обучения, памятки наставника и задания для проверки самостоятельной работы.", "/tasks/internal-experts/", "Работа с опытом компании"],
      ["Тренинги и рабочие сессии", "Программа, проведение и материалы для применения в работе.", "/tasks/external-experts/", "Подключение экспертов"],
      ["Программы для EdTech", "Архитектура, сценарии и задания для запуска или обновления продукта.", "/cases/digital-broker/", "Пример проекта"],
    ].map(([t,d,h,l])=><article className="proposal-card" key={t}><h3>{t}</h3><p>{d}</p><Link href={h}>{l}</Link></article>)}</div>
    <Details title="Базы знаний и цифровые наставники"><p>Карта экспертности, база знаний, цифровой наставник и обновление учебных материалов.</p><Link href="/expertise-map/">Пример карты экспертности</Link></Details><Details title="Индивидуальные планы развития"><p>{IPR_UNIT.what}</p></Details>
  </Section>;
}

export function MonthPlan() {
  return <Section id="month-plan" label="Пример разработки" title="Как создается модуль">
    <span id="process" className="proposal-anchor" />
    <ol className="proposal-steps">{[
      ["Задача", "Аудитория, исходные материалы, смета и критерии приемки."],
      ["Сценарий", "Содержание, рабочие примеры и задания. Эксперт проверяет точность."],
      ["Сборка", "Оформление и техническая проверка модуля в LMS."],
      ["Пилот", "Проверка на участниках, согласованные правки и передача исходников."],
    ].map(([t,d],i)=><li key={t}><span className="proposal-number">0{i+1}</span><div><h3>{t}</h3><p>{d}</p></div></li>)}</ol>
    <Details title="Ответственность и сроки"><p>Руководитель проекта ведет план, команду и согласования. Эксперт компании проверяет содержание, согласующий собирает обратную связь, пилотная группа проверяет модуль.</p><p>Срок зависит от готовности материалов, участия эксперта и согласований. Изменения объема, срока и стоимости согласуются до дополнительных работ.</p></Details>
  </Section>;
}

export function CompactTeam() {
  return <Section id="team" label="Команда" title="Методология, редактура и проведение">
    <div className="proposal-team">{TEAM.slice(0,3).map(p=><div key={p.slug}><h3>{p.name}</h3><p>{p.slug === "utkina" ? "Методолог-продюсер" : p.slug === "zhdanova" ? "Редактор и методолог" : "Бизнес-тренер и методолог"}</p></div>)}</div>
    <div className="proposal-actions"><Link href="/team/">Опыт и состав команды</Link><Link href="/tasks/team-subscription/#month-plan">Порядок работы</Link></div>
  </Section>;
}

export function SelectedCases({ home = false }: { home?: boolean }) {
  return <Section id="cases" label="Практика" title="Результаты проектов">
    <div className="proposal-grid proposal-grid-two">{["jewelry-retail","digital-broker"].map(slug=>{
      const c=CASES.find(x=>x.slug===slug)!;
      return <article className="proposal-card" key={slug}><h3>{c.title}</h3><p className="proposal-case-result">{c.changed}</p><p className="proposal-evidence">{slug === "jewelry-retail" ? "Более 230 магазинов. Данные проекта." : "4 модуля · 270 академических часов. Проектная документация."}</p><Link href={`/cases/${slug}/`}>Разбор проекта</Link></article>;
    })}</div>
    {home && <figure className="proposal-quote"><blockquote>«Ребята быстро включаются, задают правильные вопросы, не перегружают лишним и помогают превратить даже не до конца сформулированный запрос в рабочее решение».</blockquote><figcaption>Алиса Пирогова · руководитель отдела проектов, IT-компания 10 000+ сотрудников</figcaption><Link href="/reviews/#pirogova">Полный отзыв</Link></figure>}
    <div className="proposal-actions"><Link href="/cases/">Все кейсы</Link></div>
  </Section>;
}

function SubscriptionTerms() {
  return <Section id="terms" label="Условия" title="До начала работ">
    {[
      ["Стоимость и оплата", "Подписка — от 180 000 ₽ в месяц. Объем, этапы и сроки оплаты фиксируются в договоре. Оплата — по актам. Внешние курсы и согласованные выездные расходы оплачиваются отдельно."],
      ["Старт и состав команды", "Старт — в течение 24 часов после согласования плана и получения вводных. Перестройка группы — в течение 48 часов. Изменение объема и срока согласуется отдельно."],
      ["Пилот и приемка", "Критерии готовности и порядок проверки фиксируются до разработки. Для учебной программы согласуются пилотная группа и задача проверки. Приемка — после проверки и согласованных доработок."],
      ["Замена задач, перенос и пауза", "Приоритеты следующего месяца определяют состав плана. Перерасчет, перенос остатка, минимальный период и условия паузы закрепляются в приложении до старта. При завершении передаются выполненные материалы и сверяются расчеты."],
      ["Права и конфиденциальность", "Права на созданные результаты переходят после акта и полной оплаты этапа. Сторонние материалы и ранее созданные инструменты оговариваются отдельно. NDA — до передачи конфиденциальных данных."],
    ].map(([t,d])=><Details key={t} title={t}><p>{d}</p></Details>)}
    <div className="proposal-actions"><Link href="/pub_oferta/">Условия оказания услуг</Link><Link href="/faq/">Все вопросы и ответы</Link></div>
  </Section>;
}

export function TeamSubscriptionPage() {
  return <PageShell path="/tasks/team-subscription"><Head label="Для HR, T&D и EdTech" title="Отдел обучения по подписке" lead="Вместо найма: отдел по цене 1 сотрудника в месяц. Программы, тренинги и курсы в LMS под задачу клиента"/>
    <nav className="proposal-anchor-nav" aria-label="На странице подписки"><a href="#subscription">Пример за 180 000 ₽</a><a href="#month-plan">Разработка модуля</a><a href="#examples">Другие задачи</a><a href="#terms">Условия</a></nav>
    <SubscriptionOverview/><MonthPlan/><MonthExamples/><SelectedCases/><SubscriptionTerms/><Contact/>
  </PageShell>;
}

export function InternalExpertsPage() {
  return <PageShell path="/tasks/internal-experts"><Head label="Задача: сохранить и передать опыт" title="Практики сильных сотрудников — в работе всей команды" lead="Извлекаем логику решений экспертов компании и превращаем ее в программы обучения, рабочие стандарты и инструменты для сотрудников."/>
    <Section label="Когда подключаемся" title="Когда знания есть, а передавать их трудно"><Cards items={[["Длительная адаптация новичков", "Каждому объясняют работу заново, а единых материалов и критериев самостоятельности нет."],["Эксперты перегружены", "Одни и те же вопросы отвлекают специалистов от основных задач."],["Растет компания", "Нужно перенести работающие методы на новые команды, филиалы и направления."]]}/></Section>
    <Section label="Что передаем" title="Материалы для реальных рабочих ситуаций"><Cards items={[["Понять", "Учебные модули, видеоразборы и кейсы с объяснением логики эксперта."],["Применить", "Памятки, алгоритмы, деревья решений и база знаний для работы."],["Проверить", "Практические задания, тренажеры и критерии оценки самостоятельного действия."]]}/></Section>
    <Section id="effect" label="Как оценить пользу" title="Согласуем, какое изменение нужно увидеть"><Cards items={[["Адаптация", "Время до самостоятельной работы и выполнения согласованного стандарта."],["Нагрузка эксперта", "Какие повторяющиеся вопросы сотрудник теперь решает с помощью материалов."],["Качество работы", "Ошибки и повторные доработки в выбранных рабочих ситуациях до и после обучения."]]}/><p className="proposal-note">Показатели и способ измерения выбираем под задачу. Результаты отдельных кейсов не являются гарантией тех же показателей в другом проекте.</p><Link href="/cases/jewelry-retail/">Пример: адаптация сотрудников розничной сети</Link></Section>
    <Section label="Первый этап при необходимости" title="Карта экспертности"><p className="proposal-intro">Если опыт еще не описан, начинаем с карты знаний, процесса и компетенций. Ориентир — 7–14 календарных дней; срок фиксируется после разбора. При готовых материалах можно начать с разработки.</p><Link href="/expertise-map/">7 документов — посмотреть пример результата</Link><div className="proposal-callout"><h3>Как включить задачу в работу</h3><p>Можно согласовать отдельный этап или включить его в план подписки. Карта экспертности не является обязательной покупкой для каждой задачи.</p><Link href="/tasks/team-subscription/">Как устроена подписка</Link></div></Section><Contact/>
  </PageShell>;
}

export function ExternalExpertsPage() {
  return <PageShell path="/tasks/external-experts"><Head label="Задача: получить недостающий опыт" title="Профильный эксперт для разработки обучения" lead="Подключаем специалиста с нужным отраслевым опытом. На его примерах строятся программа и практические задания."/>
    <Section label="Порядок работы" title="От запроса к применению опыта"><Cards items={[["Определяем нужный опыт", "На разборе уточняем задачу, контекст и признаки подходящего практика. Согласуем срок подбора."],["Знакомим с подходом", "Показываем опыт специалиста и согласуем его участие в проекте."],["Готовим решение", "Эксперт разбирает рабочие ситуации. Методолог готовит задания и материалы."]]}/></Section>
    <Section id="effect" label="Что получает заказчик" title="Опыт остается в программе и рабочих материалах"><Cards items={[["Нужная компетенция", "Практический опыт для конкретной задачи без открытия постоянной штатной роли."],["Управление проектом", "Один договор и руководитель проекта, который координирует работу специалистов."],["Повторное использование", "Материалы, которые команда может использовать после завершения проекта. Права и разрешенные способы использования фиксируем заранее."]]}/><Link href="/cases/b2b-procurement/">Пример: логика закупки глазами клиента</Link></Section>
    <Section label="Формат сотрудничества" title="Экспертная часть или полный цикл"><Cards items={[["В компании есть методолог", "Согласуем экспертную часть проекта и взаимодействие практика с командой заказчика."],["Нужен готовый продукт", "Разработка программы, материалы, проведение и проверка результата."]]}/><Link href="/tasks/team-subscription/">Включить задачу в подписку</Link></Section><Contact/>
  </PageShell>;
}

export function BusinessEffectGeneralPage() {
  return <PageShell path="/business-effect"><Head label="Для согласования бюджета" title="Как оценить экономику подписки" lead="Сравнивайте варианты на одинаковом объеме работ: что нужно выпустить, к какому сроку и какие ресурсы уже есть внутри компании."/>
    <Section label="Основа расчета" title="Сначала результат, затем бюджет"><Cards items={[["Опишите объем", "Программы, модули, сессии и материалы с понятными требованиями к готовности."],["Оцените свои ресурсы", "Какие работы команда выполнит сама, а где нужны разработка, методология или редкая экспертиза."],["Сравните варианты", "Смета подписки, найм под этот объем и отдельные подрядчики. Учитывайте координацию, сроки и расходы на инструменты."]]}/></Section>
    <Section label="Сопоставимые условия" title="Что включить в сравнение"><div className="proposal-table-wrap"><table className="proposal-table"><thead><tr><th>Критерий</th><th>Внутренняя команда</th><th>Подписка БЕЗ ВОДЫ</th></tr></thead><tbody>{[
      ["Объем", "Доступная загрузка сотрудников с учетом текущих задач", "Согласованный перечень результатов на месяц"],
      ["Стоимость", "Расходы на нужные роли, подбор, инструменты и управление", "Смета от 180 000 ₽ в месяц; дополнительные расходы согласуются отдельно"],
      ["Компетенции", "Текущий состав команды и возможный найм", "Состав специалистов под согласованную задачу"],
      ["Управление", "Внутренний руководитель координирует исполнителей", "Руководитель проекта БЕЗ ВОДЫ ведет работу; заказчик согласует решения"],
      ["После выпуска", "Обновление своими силами", "Исходники передаются; дальнейшее сопровождение — по отдельному согласованию"],
    ].map(row=><tr key={row[0]}>{row.map((x,i)=>i===0?<th scope="row" key={i}>{x}</th>:<td key={i}>{x}</td>)}</tr>)}</tbody></table></div><p className="proposal-note">В смете фиксируется объем работ. Полная занятость каждого специалиста в стоимость подписки не входит.</p></Section>
    <Section label="Выбор модели" title="Когда подписка уместна"><Cards items={[["Меняется нагрузка", "Запуск, сезонная адаптация или временный рост числа запросов требуют дополнительных ресурсов."],["Не хватает компетенции", "Нужны методолог, разработка или профильный эксперт для определенного результата."],["Нагрузка стабильна", "При постоянном предсказуемом объеме сравните долгосрочные расходы на штат и подрядчиков. Подписка может закрывать только отдельные задачи."]]}/></Section>
    <Section label="Пакет для руководителя" title="Что зафиксировать в предложении"><ol className="proposal-list"><li>Задача и результат, который принимает бизнес.</li><li>Состав месячного пакета и смета.</li><li>Сроки, участие команды заказчика и руководитель проекта.</li><li>Пилот, критерии приемки и порядок оплаты.</li><li>Права на материалы, работа с данными и завершение сотрудничества.</li></ol><div className="proposal-actions"><a href="/pdf/bez-vody-business-effect.pdf" download className="proposal-link">Скачать обоснование в PDF <ArrowRight aria-hidden size={18}/></a><Link href="/tasks/team-subscription/#terms">Условия подписки</Link></div></Section><SelectedCases/><Contact/>
  </PageShell>;
}
