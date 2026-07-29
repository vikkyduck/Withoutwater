/* ============================================================================
   core.tsx — ядро сайта на дизайн-системе 2.4 «Сухой остаток».
   Материалы системы: жидкое стекло (линза + перелив), графическая сцена из
   узлов, бумага и хром. Капли, сферы и волны удалены — брендбук запрещает
   воду прямо, даже «по теме названия».
   ========================================================================== */
import {
  useRef,
  useState,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
  type CSSProperties,
} from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
} from "motion/react";
import { ArrowUpRight, ArrowRight, Plus, Check, Waves, Sparkles, ExternalLink } from "lucide-react";

export { motion, AnimatePresence };
export { ArrowUpRight, ArrowRight, Plus, Check, Waves, Sparkles, ExternalLink };
export { useRef, useState, useEffect };
export type { ReactNode, CSSProperties };

const CALM_KEY = "bv-calm-motion";
const listeners = new Set<() => void>();
let calmState = false;

function readInitialCalm(): boolean {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(CALM_KEY);
  if (stored === "1") return true;
  if (stored === "0") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function emit() {
  listeners.forEach((l) => l());
}

function setCalm(v: boolean) {
  calmState = v;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CALM_KEY, v ? "1" : "0");
    document.documentElement.dataset.calm = v ? "true" : "false";
  }
  emit();
}

function subscribeCalm(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useCalm(): [boolean, (v: boolean) => void] {
  // hydrate lazily on first client render
  const value = useSyncExternalStore(
    subscribeCalm,
    () => calmState,
    () => false,
  );
  useEffect(() => {
    const initial = readInitialCalm();
    if (initial !== calmState) setCalm(initial);
    else document.documentElement.dataset.calm = calmState ? "true" : "false";
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => {
      // only follow system if user hasn't explicitly opted
      if (window.localStorage.getItem(CALM_KEY) === null) setCalm(e.matches);
    };
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return [value, setCalm];
}


/* --------- Активный сценарий: карточки Hero ↔ табы секции Scenarios --------- */
/* Секция Scenarios регистрирует свой setActive здесь при монтировании.        */
/* Состояние остаётся локальным useState — это важно: с useSyncExternalStore    */
/* AnimatePresence(mode="wait") зависал (старый блок не размонтировался).        */

/* Микро-цели Яндекс Метрики. Имена целей (создать в интерфейсе Метрики как
   «JavaScript-событие»): scenario_selected, form_started, chip_toggled, lead_sent. */
export function ymGoal(goal: string, params?: Record<string, unknown>) {
  const w = window as unknown as { ym?: (...a: unknown[]) => void; YM_ID?: number };
  if (w.ym && w.YM_ID) w.ym(w.YM_ID, "reachGoal", goal, params);
}



/* ----------------------------- Логотип и метки --------------------------- */
/* Срез — фирменный приём: горизонтальный пропил, «лишнее отсечено».
   В логотипе он живёт на слове ВОДЫ. Один срез на макет — поэтому в
   заголовках страниц приём не повторяется. */

export function StencilLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex flex-col leading-none ${className}`}>
      <span className="font-display text-[1.6em] font-medium tracking-[-0.02em]">
        БЕЗ <span className="cut">ВОДЫ</span>
      </span>
      <span className="font-display text-[0.52em] font-medium tracking-[-0.01em] mt-1.5">
        withoutwater
      </span>
    </div>
  );
}

/* Надзаголовок секции: номер Unbounded, волосяная линия, капитель Golos. */
export function SectionLabel({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="t-eyebrow flex items-center gap-3 text-[color:var(--color-text-secondary)]">
      <span className="font-display text-[color:var(--color-accent)] tracking-normal">{n}</span>
      <span className="h-px w-10 bg-[color:var(--color-line)]" />
      <span>{children}</span>
    </div>
  );
}

/* ------------------------- Линза преломления ----------------------------- */
/* Один SVG-фильтр обслуживает элементы любого размера: карта смещения
   растягивается под элемент за счёт preserveAspectRatio="none". Разметка
   кладётся один раз в начало страницы (см. PageShell). */

const LENS_MAP =
  "data:image/svg+xml;utf8," +
  "<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' preserveAspectRatio='none'>" +
  "<defs>" +
  "<linearGradient id='x' x1='0' x2='1'>" +
  "<stop offset='0' stop-color='rgb(255,128,0)'/>" +
  "<stop offset='0.34' stop-color='rgb(128,128,0)'/>" +
  "<stop offset='0.66' stop-color='rgb(128,128,0)'/>" +
  "<stop offset='1' stop-color='rgb(0,128,0)'/>" +
  "</linearGradient>" +
  "<linearGradient id='y' x1='0' y1='0' x2='0' y2='1'>" +
  "<stop offset='0' stop-color='rgb(0,255,0)'/>" +
  "<stop offset='0.34' stop-color='rgb(0,128,0)'/>" +
  "<stop offset='0.66' stop-color='rgb(0,128,0)'/>" +
  "<stop offset='1' stop-color='rgb(0,0,0)'/>" +
  "</linearGradient>" +
  "</defs>" +
  "<rect width='100' height='100' fill='url(%23x)'/>" +
  "<rect width='100' height='100' fill='url(%23y)' style='mix-blend-mode:screen'/>" +
  "</svg>";

export function LensFilter() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <filter id="bv-lens" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
        <feImage preserveAspectRatio="none" result="map" href={LENS_MAP} />
        <feDisplacementMap in="SourceGraphic" in2="map" scale="38" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}

/* --------------------------- Движок курсора ------------------------------ */
/* Один обработчик на страницу: считает положение курсора внутри каждого
   видимого элемента и ставит переменные. Все состояния остаются в стилях.
   Не запускается при prefers-reduced-motion и на устройствах без мыши. */

export function GlassPointer() {
  const [calm] = useCalm();
  useEffect(() => {
    if (calm) return;
    if (!window.matchMedia?.("(pointer: fine)").matches) return;

    const SEL = ".lg, .btn-primary, .btn-secondary, .btn-glass, .btn-invert";
    const bound = new WeakSet<HTMLElement>();

    const bind = (el: HTMLElement) => {
      if (bound.has(el)) return;
      bound.add(el);
      let raf = 0;
      let px = 50;
      let py = 0;
      const isBtn = el.classList.contains("btn");

      const apply = () => {
        raf = 0;
        el.style.setProperty("--mx", px.toFixed(1) + "%");
        el.style.setProperty("--my", py.toFixed(1) + "%");
        /* угол световой полосы идёт за курсором — стекло ловит свет */
        el.style.setProperty("--sheen", (90 + (px - 50) * 1.1).toFixed(1) + "deg");
        const dx = px / 100 - 0.5;
        const dy = py / 100 - 0.5;
        el.style.setProperty("--tx", (-dy * 1.4).toFixed(2) + "deg");
        el.style.setProperty("--ty", (dx * 1.4).toFixed(2) + "deg");
      };

      el.addEventListener(
        "pointermove",
        (e) => {
          const r = el.getBoundingClientRect();
          if (!r.width) return;
          px = ((e.clientX - r.left) / r.width) * 100;
          py = ((e.clientY - r.top) / r.height) * 100;
          el.style.setProperty("--lg-glow", isBtn ? "0.52" : "0.62");
          if (!raf) raf = requestAnimationFrame(apply);
        },
        { passive: true },
      );
      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--lg-glow", isBtn ? "0" : "0.14");
        el.style.setProperty("--tx", "0deg");
        el.style.setProperty("--ty", "0deg");
      });
    };

    const scan = () => document.querySelectorAll<HTMLElement>(SEL).forEach(bind);
    scan();

    /* React дорисовывает карточки по мере появления в вьюпорте — следим
       за деревом, иначе часть стекла останется без перелива. */
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [calm]);
  return null;
}

/* --------------------- Графическая сцена: узлы и блобы -------------------- */
/* Стекло допустимо только там, где под ним есть что преломлять. Сцена —
   это подложка: сетка узлов (язык системных аналитиков) плюс мягкие пятна
   розового стекла и хрома. Никаких капель и сфер. */

/* Узлы — графическая сцена под стекло: одна локальная композиция, а не
   паттерн-обои. Живёт в правой части секции, гаснет к тексту. Круги
   остаются круглыми: viewBox без растяжения. */

const NODES: [number, number, number, boolean][] = [
  // x, y, r, акцентный
  [16, 30, 2.4, false],
  [42, 14, 3.0, true],
  [62, 40, 2.2, false],
  [30, 62, 2.6, false],
  [54, 84, 2.2, false],
  [82, 26, 2.4, false],
  [86, 66, 3.0, true],
  [70, 108, 2.2, false],
];
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 6], [6, 7], [4, 7], [0, 3], [1, 5],
];

export function NodeScene({
  className = "",
  opacity = 0.5,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      className={`pointer-events-none absolute right-[-4%] top-1/2 hidden h-[min(78%,560px)] -translate-y-1/2 md:block ${className}`}
      viewBox="0 0 100 120"
      fill="none"
      aria-hidden
      style={{
        opacity,
        WebkitMaskImage: "radial-gradient(70% 70% at 62% 50%, #000 30%, transparent 82%)",
        maskImage: "radial-gradient(70% 70% at 62% 50%, #000 30%, transparent 82%)",
      }}
    >
      {EDGES.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={NODES[a][0]}
          y1={NODES[a][1]}
          x2={NODES[b][0]}
          y2={NODES[b][1]}
          stroke="currentColor"
          strokeWidth="0.35"
          opacity="0.55"
        />
      ))}
      {NODES.map(([x, y, r, on], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={r * 0.5}
          fill={on ? "var(--color-accent)" : "currentColor"}
          opacity={on ? 0.85 : 0.6}
        />
      ))}
    </svg>
  );
}

/* Мягкое пятно материала под стеклом: розовое стекло или хром. */
export function Blob({
  className = "",
  tone = "rose",
  size = 420,
}: {
  className?: string;
  tone?: "rose" | "chrome";
  size?: number;
}) {
  return (
    <div
      aria-hidden
      className={`stage__blob stage__blob--${tone} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}


/* Сцена под стекло: сетка узлов плюс мягкие пятна материала. Стекло
   допустимо только там, где под ним есть что преломлять (брендбук, разд. 7). */
export function Scene({
  nodes = true,
  blobs = [],
  nodeClass = "text-[color:var(--color-steel)]",
}: {
  nodes?: boolean;
  blobs?: { className: string; tone?: "rose" | "chrome"; size?: number }[];
  nodeClass?: string;
}) {
  return (
    <div className="stage__bg" aria-hidden>
      {nodes && <NodeScene className={nodeClass} />}
      {blobs.map((b, i) => (
        <Blob key={i} className={b.className} tone={b.tone} size={b.size} />
      ))}
    </div>
  );
}

/* ------------------------------ GlassCard -------------------------------- */
/* Обёртка над материалом .lg. Стекло кладётся только на графическую сцену;
   на ровном фоне используется .card — бумажная поверхность. */

export function GlassCard({
  children,
  className = "",
  dark = false,
  ink = false,
  interactive = false,
  as: Tag = "div",
  style,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  ink?: boolean;
  interactive?: boolean;
  as?: any;
  style?: CSSProperties;
  [k: string]: any;
}) {
  const tone = dark ? "lg-dark" : ink ? "lg-ink" : "";
  return (
    <Tag
      className={`lg ${tone} ${interactive ? "lg-interactive" : ""} rounded-md ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Бумажная карточка — там, где под стеклом нечего преломлять. */
export function PaperCard({
  children,
  className = "",
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: any;
  [k: string]: any;
}) {
  return (
    <Tag className={`card ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/* Парадный разделитель с двумя узлами — не чаще одного на экран. */
export function NodeDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`node-divider ${className}`} aria-hidden>
      <i />
      <i />
    </div>
  );
}

export function RevealHeading({
  children,
  className = "",
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: any;
}) {
  const [calm] = useCalm();
  const MotionTag = motion[Tag as "h2"] as any;
  if (calm) {
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <MotionTag
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}


export function Field({
  label,
  name,
  placeholder,
  dark = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  dark?: boolean;
}) {
  /* id с префиксом: без него input name="contact" конфликтовал бы с
     id="contact" у секции формы, и label ссылался бы на секцию. */
  const id = `f-${name}`;
  return (
    <div>
      <label
        htmlFor={id}
        className={`t-label mb-2 block ${
          dark ? "text-background/60" : "text-[color:var(--color-text-secondary)]"
        }`}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        placeholder={placeholder}
        className={
          dark
            ? "min-h-11 w-full rounded-sm border border-[color:var(--color-line-dark)] bg-white/5 px-4 py-3 text-base text-[color:var(--color-text-inverse)] outline-none transition placeholder:text-[color:var(--color-text-inverse-2)]/50 focus:border-[color:var(--color-accent-glass)]"
            : "min-h-11 w-full rounded-sm border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-4 py-3 text-base text-[color:var(--color-text-primary)] outline-none transition placeholder:text-[color:var(--color-steel)] focus:border-[color:var(--color-accent)]"
        }
      />
    </div>
  );
}
/* --------------------------------- Page --------------------------------- */

export function CalmToggle() {
  const [calm, set] = useCalm();
  return (
    <button
      type="button"
      onClick={() => set(!calm)}
      aria-pressed={calm}
      aria-label={calm ? "Включить анимации" : "Уменьшить анимации"}
      title={calm ? "Включить анимации" : "Уменьшить анимации"}
      className="lg group fixed bottom-24 right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-pill text-[color:var(--color-text-secondary)] transition-colors duration-[160ms] hover:text-[color:var(--color-text-primary)] md:bottom-6 md:right-6"
      style={{ boxShadow: "0 8px 24px -12px rgba(4,6,9,0.15)" }}
    >
      {calm ? <Sparkles className="h-4 w-4" /> : <Waves className="h-4 w-4" />}
    </button>
  );
}


export function CookieBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (!window.localStorage.getItem("bv-cookie-ok")) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);
  if (!show) return null;
  return (
    <div
      className="lg lg-thick fixed inset-x-3 bottom-24 z-50 mx-auto flex max-w-lg items-center gap-3 rounded-pill py-2 pl-4 pr-2 md:bottom-6 md:left-1/2 md:right-auto md:-translate-x-1/2"
      style={{ boxShadow: "0 12px 40px -16px rgba(4,6,9,0.25)" }}
    >
      <p className="t-body-sm flex-1 text-[color:var(--color-text-secondary)]">
        Мы используем cookie и Яндекс Метрику ·{" "}
        <a href="/politics_pd" className="underline underline-offset-2 hover:text-[color:var(--color-text-primary)]">политика</a>
      </p>
      <button
        type="button"
        onClick={() => {
          try { window.localStorage.setItem("bv-cookie-ok", "1"); } catch {}
          setShow(false);
        }}
        className="btn btn-primary shrink-0 min-h-11 px-5 py-2 text-[13px]"
      >
        Ок
      </button>
    </div>
  );
}
/* ------------------------- Nav (меню по ТЗ v3) --------------------------- */
/* Четыре пункта обычными словами + одна кнопка действия. Кнопка везде одна:
   «Разбор задачи за 30 минут». */

export const NAV_LINKS: [string, string][] = [
  ["Задачи и решения", "/tasks"],
  ["Кейсы", "/cases"],
  ["О нас", "/team"],
  ["Как мы работаем", "/how-we-work"],
];

export const CTA_LABEL = "Разбор задачи за 30 минут";
export const CTA_NOTE = "30 минут онлайн: сверим задачу и определим следующий шаг";

/* Ссылка CTA: на главной — якорь формы, на остальных страницах — /contacts. */
export function ctaHref(path: string): string {
  return path === "/" ? "#contact" : "/contacts#form";
}

export function Nav({ path = "/" }: { path?: string }) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="lg lg-thick sticky top-0 z-50 rounded-none border-b border-[color:var(--color-line)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8 md:py-4">
        <a href="/" className="text-[color:var(--color-text-primary)] shrink-0" aria-label="БЕЗ ВОДЫ — на главную">
          <StencilLogo className="text-[13px] md:text-[14px]" />
        </a>
        <nav className="hidden items-center gap-0.5 text-[13px] font-medium tracking-[0.005em] md:flex">
          {NAV_LINKS.map(([label, href]) => {
            const active = path === href;
            return (
              <a
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`group relative rounded-sm px-3.5 py-2 text-[0.9375rem] transition-colors duration-[160ms] ${
                  active
                    ? "text-[color:var(--color-text-primary)]"
                    : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]"
                }`}
              >
                <span className="relative z-10">{label}</span>
                <span
                  aria-hidden
                  className={`absolute inset-x-3.5 -bottom-px h-px bg-[color:var(--color-accent)] transition-opacity duration-[160ms] ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                  }`}
                />
              </a>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={ctaHref(path)}
            className="btn btn-primary group hidden shrink-0 sm:inline-flex"
          >
            <span>{CTA_LABEL}</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <button
            type="button"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-[color:var(--color-line)] text-[color:var(--color-text-primary)] transition-colors hover:bg-[color:var(--color-bg-secondary)] md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 block h-px w-4 bg-current transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0.5"}`}
              />
              <span
                className={`absolute left-0 block h-px w-4 bg-current transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-2.5"}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Тонкая линия прогресса чтения — единственный акцент в шапке. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[-1px] z-[3] h-px origin-left bg-[color:var(--color-accent)]"
        style={{ transform: `scaleX(${progress})`, opacity: progress > 0.005 ? 1 : 0 }}
      />

      {open && (
        <nav className="relative z-[2] border-t border-[color:var(--color-line)] bg-[color:var(--color-bg-primary)] px-5 pb-6 pt-2 md:hidden">
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="flex min-h-11 items-center justify-between border-b border-[color:var(--color-line)] py-3.5 text-[15px] text-[color:var(--color-text-primary)]"
            >
              {label}
              <ArrowUpRight className="h-4 w-4 text-[color:var(--color-text-secondary)]" />
            </a>
          ))}
          <a
            href={ctaHref(path)}
            className="btn btn-primary mt-4 flex w-full"
          >
            {CTA_LABEL}
            <ArrowRight className="h-4 w-4" />
          </a>
        </nav>
      )}
    </header>
  );
}

/* -------------------------------- Footer --------------------------------- */

export function Footer() {
  const nav = [
    ["Задачи и решения", "/tasks"],
    ["Кейсы", "/cases"],
    ["Отзывы", "/reviews"],
    ["О нас", "/team"],
    ["Как мы работаем", "/how-we-work"],
    ["Частые вопросы", "/faq"],
    ["Контакты", "/contacts"],
    ["Бизнес-эффект от методологии", "/for-your-boss"],
  ];
  return (
    <footer className="border-t border-[color:var(--color-line)] bg-[color:var(--color-bg-secondary)]">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <StencilLogo className="text-[16px]" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
              Проектная команда методологов и продактов. Превращаем экспертный
              опыт в применимый продукт.
            </p>
          </div>
          <div>
            <div className="t-eyebrow text-[color:var(--color-text-secondary)]">
              Навигация
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
              {nav.map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-accent)]">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="t-eyebrow text-[color:var(--color-text-secondary)]">
              Связь
            </div>
            <a
              href="/contacts"
              className="mt-4 inline-flex items-center gap-2 font-display text-lg text-[color:var(--color-text-primary)] transition hover:text-[color:var(--color-accent)]"
            >
              Написать нам
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <div className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
              Ответ в рабочее время в течение 2 часов
            </div>
            <ul className="mt-4 space-y-1.5 text-sm">
              <li><a href="tel:+79645842225" className="text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-accent)]">+7 964 584 22 25</a></li>
              <li><a href="https://t.me/vikki_duck" target="_blank" rel="noreferrer" className="text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-accent)]">Telegram: @vikki_duck</a></li>
              <li><a href="mailto:vu@withoutwater.ru" className="text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-accent)]">vu@withoutwater.ru</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-[color:var(--color-line)] pt-6 text-xs text-[color:var(--color-text-secondary)]">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="/politics_pd" className="transition hover:text-[color:var(--color-accent)]">Политика конфиденциальности</a>
            <a href="/consent_pd" className="transition hover:text-[color:var(--color-accent)]">Согласие на обработку персональных данных</a>
            <a href="/pub_oferta" className="transition hover:text-[color:var(--color-accent)]">Публичная оферта</a>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} БЕЗ ВОДЫ · withoutwater · ИП Уткина Виктория Викторовна · ИНН 771586055972</div>
            <div>Методология · Продукт · Проектное управление</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------ PageShell -------------------------------- */
/* Общая обёртка каждой страницы: шапка, футер, калм-переключатель, cookie-бар,
   липкая мобильная CTA. */

export function PageShell({ path, children }: { path: string; children: ReactNode }) {
  const [calm] = useCalm();
  return (
    <MotionConfig reducedMotion={calm ? "always" : "user"}>
      {/* Линза кладётся один раз на страницу и обслуживает всё стекло */}
      <LensFilter />
      <GlassPointer />
      <div className="min-h-screen bg-[color:var(--color-bg-primary)] text-[color:var(--color-text-primary)]">
        <Nav path={path} />
        <main className="pb-20 md:pb-0">{children}</main>
        <Footer />

        <CalmToggle />
        <CookieBar />

        {/* Mobile sticky CTA */}
        <div className="lg lg-thick fixed inset-x-0 bottom-0 z-40 rounded-none border-t border-[color:var(--color-line)] px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 md:hidden">
          <a
            href={ctaHref(path)}
            className="btn btn-primary flex w-full"
          >
            {CTA_LABEL}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </MotionConfig>
  );
}

/* Заголовок-шапка внутренней страницы. */
export function PageHead({
  kicker,
  title,
  lead,
}: {
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <div className="relative mx-auto max-w-7xl px-5 pb-4 pt-12 md:px-8 md:pt-20">
      <div className="t-eyebrow flex items-center gap-3 text-[color:var(--color-text-secondary)]">
        <span className="h-px w-8 bg-[color:var(--color-line)]" />
        <span>{kicker}</span>
      </div>
      <RevealHeading as="h1" className="t-h1 mt-5 max-w-4xl">
        {title}
      </RevealHeading>
      {lead && (
        <p className="t-lead measure mt-6 text-[color:var(--color-text-secondary)]">
          {lead}
        </p>
      )}
    </div>
  );
}
