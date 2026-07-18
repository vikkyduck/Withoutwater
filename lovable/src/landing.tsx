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
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight, ArrowRight, Plus, Check, Waves, Sparkles, ExternalLink } from "lucide-react";
const bookCover = { url: "/img/book-cover.webp" };

/* ------------------------------ Calm motion ----------------------------- */
/* User + system preference to reduce animation intensity.                  */

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

function useCalm(): [boolean, (v: boolean) => void] {
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
function ymGoal(goal: string, params?: Record<string, unknown>) {
  const w = window as unknown as { ym?: (...a: unknown[]) => void; YM_ID?: number };
  if (w.ym && w.YM_ID) w.ym(w.YM_ID, "reachGoal", goal, params);
}



/* ----------------------------- Small helpers ----------------------------- */

function StencilLogo({ className = "" }: { className?: string }) {
  /* по референсу лого: белой линией «зачёркнуто» только слово ВОДЫ;
     «БЕЗ» и «withoutwater» — сплошные */
  return (
    <div className={`inline-flex flex-col leading-none ${className}`}>
      <span className="font-display text-[1.6em] font-extrabold tracking-tight">
        БЕЗ <span className="stencil">ВОДЫ</span>
      </span>
      <span className="font-display text-[0.55em] font-extrabold tracking-tight mt-1">
        withoutwater
      </span>
    </div>
  );
}

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
      <span className="font-display text-[color:var(--red)]">{n}</span>
      <span className="h-px w-10 bg-border" />
      <span>{children}</span>
    </div>
  );
}

/* --------------------------------- Nav ---------------------------------- */

function Nav() {
  const links = [
    ["Когда мы нужны", "#when"],
    ["Подход", "#approach"],
    ["Кейсы", "#cases"],
    ["Отзывы", "#reviews"],
    ["Книга", "#book"],
    ["FAQ", "#faq"],
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 md:px-6 md:py-4">
        <a href="#top" className="text-foreground shrink-0">
          <StencilLogo className="text-[13px] md:text-[14px]" />
        </a>
        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="group relative rounded-full px-4 py-2 text-foreground/65 transition hover:text-foreground"
            >
              <span className="relative z-10">{label}</span>
              <span className="absolute inset-0 -z-0 scale-95 rounded-full bg-secondary opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[color:var(--red)] px-4 py-2.5 text-xs font-semibold text-background shadow-sm shadow-[color:var(--red)]/20 transition hover:bg-foreground md:px-5 md:text-sm"
        >
          <span className="hidden sm:inline">Контакты</span>
          <span className="sm:hidden">Контакты</span>
          <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
        </a>
      </div>
    </header>
  );
}


/* ------------------------------- Spheres -------------------------------- */

function Sphere({
  size,
  className = "",
  delay = 0,
  duration = 8,
  variant = "red",
}: {
  size: number;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: "red" | "chrome";
}) {
  const gradId = `g-${variant}-${size}-${delay}`;
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`pointer-events-none absolute ${className}`}
      initial={{ y: 0 }}
      animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%" r="75%">
          {variant === "red" ? (
            /* палитра 2026-07: «красный» вариант сфер стал лавандовым —
               бордовый бережём только для CTA и маркеров */
            <>
              <stop offset="0%" stopColor="var(--lav-soft)" />
              <stop offset="35%" stopColor="var(--lav-light)" />
              <stop offset="75%" stopColor="var(--lav)" />
              <stop offset="100%" stopColor="var(--lav-deep)" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="oklch(0.98 0 0)" />
              <stop offset="45%" stopColor="oklch(0.75 0.005 260)" />
              <stop offset="85%" stopColor="oklch(0.35 0.01 260)" />
              <stop offset="100%" stopColor="oklch(0.15 0.01 260)" />
            </>
          )}
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#${gradId})`} />
      <ellipse cx="36" cy="30" rx="14" ry="8" fill="white" opacity="0.35" />
    </motion.svg>
  );
}

/* ------------------------------ GlassCard ------------------------------- */

function GlassCard({
  children,
  className = "",
  dark = false,
  as: Tag = "div",
  intensity = 1,
  style,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  as?: any;
  intensity?: number;
  style?: CSSProperties;
  [k: string]: any;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState(false);
  const [calm] = useCalm();


  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 14, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 120, damping: 14, mass: 0.4 });
  const transform = useTransform(
    [srx, sry],
    ([x, y]) => `perspective(1200px) rotateX(${x}deg) rotateY(${y}deg)`
  );

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (calm) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    const nx = px / r.width - 0.5;
    const ny = py / r.height - 0.5;
    el.style.setProperty("--mx", `${px}px`);
    el.style.setProperty("--my", `${py}px`);
    el.style.setProperty("--edge-angle", `${180 + nx * 60}deg`);
    const dist = Math.min(1, Math.hypot(nx, ny) * 2);
    el.style.setProperty("--refract-scale", `${1.04 + dist * 0.03}`);
    ry.set(nx * 6 * intensity);
    rx.set(-ny * 6 * intensity);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    const el = ref.current;
    if (el) el.style.setProperty("--refract-scale", "1.04");
    setHover(false);
  };

  return (
    <motion.div
      ref={ref as any}
      onMouseMove={calm ? undefined : onMove}
      onMouseEnter={calm ? undefined : () => setHover(true)}
      onMouseLeave={calm ? undefined : onLeave}
      style={{
        transform: calm ? undefined : transform,
        transformStyle: "preserve-3d",
        ["--spec-opacity" as any]: calm ? 0.25 : hover ? 0.95 : 0.35,
        ...style,
      }}
      className={`${dark ? "glass glass-dark" : "glass"} relative rounded-2xl ${className}`}
      {...rest}
    >
      {!calm && (
        <span
          className="glass-refract"
          aria-hidden
          style={{ transform: "scale(var(--refract-scale, 1.04))" }}
        />
      )}
      <span className="glass-edge" aria-hidden />
      <span className="glass-specular" aria-hidden />
      <div className="relative" style={{ transform: calm ? undefined : "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
}


/* ------------------------------ LiquidOrb ------------------------------ */

function LiquidOrb({ size = 380, className = "" }: { size?: number; className?: string }) {
  const [calm] = useCalm();
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 80, damping: 15 });
  const sy = useSpring(y, { stiffness: 80, damping: 15 });
  const rotY = useTransform(sx, [-1, 1], [-18, 18]);
  const rotX = useTransform(sy, [-1, 1], [12, -12]);
  const transform = useTransform(
    [rotX, rotY],
    ([rx, ry]) => `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`
  );

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    x.set((e.clientX - cx) / (window.innerWidth / 2));
    y.set((e.clientY - cy) / (window.innerHeight / 2));
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (calm) return null;


  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`pointer-events-auto absolute ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.div
        style={{ transform, transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        {/* halo */}
        <div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--lav) 60%, transparent), transparent 60%)",
            transform: "translateZ(-40px) scale(1.15)",
          }}
        />
        {/* glass sphere */}
        <div
          className="absolute inset-0 overflow-hidden rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, oklch(0.98 0 0 / 0.85), oklch(0.75 0.02 260 / 0.35) 40%, oklch(0.2 0.02 260 / 0.55) 75%, oklch(0.08 0.02 260 / 0.85))",
            boxShadow:
              "inset 0 10px 40px oklch(1 0 0 / 0.35), inset 0 -30px 60px oklch(0 0 0 / 0.55), 0 40px 80px -20px oklch(0 0 0 / 0.45)",
            backdropFilter: "blur(6px)",
          }}
        >
          {/* liquid blobs inside */}
          <div
            className="absolute h-[70%] w-[70%] rounded-full blur-2xl"
            style={{
              left: "10%",
              top: "15%",
              background:
                "radial-gradient(circle, var(--lav-light), var(--lav) 55%, transparent 75%)",
              animation: "liquid-morph 9s ease-in-out infinite",
              mixBlendMode: "screen",
            }}
          />
          <div
            className="absolute h-[55%] w-[55%] rounded-full blur-2xl"
            style={{
              right: "5%",
              bottom: "10%",
              background:
                "radial-gradient(circle, oklch(0.85 0.02 260 / 0.9), transparent 70%)",
              animation: "liquid-morph 12s ease-in-out infinite reverse",
              mixBlendMode: "screen",
            }}
          />
          <div
            className="absolute h-[40%] w-[40%] rounded-full blur-xl"
            style={{
              right: "20%",
              top: "20%",
              background:
                "radial-gradient(circle, var(--lav-deep), transparent 70%)",
              animation: "liquid-morph 7s ease-in-out infinite",
              mixBlendMode: "multiply",
            }}
          />
          {/* rotating spectral ring */}
          <div
            className="absolute inset-2 rounded-full opacity-70"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, color-mix(in oklab, white 70%, transparent), transparent 40%, color-mix(in oklab, var(--lav) 65%, transparent), transparent 80%)",
              mask: "radial-gradient(circle, transparent 62%, black 63%, black 78%, transparent 80%)",
              WebkitMask:
                "radial-gradient(circle, transparent 62%, black 63%, black 78%, transparent 80%)",
              animation: "liquid-spin 14s linear infinite",
            }}
          />
          {/* top-left specular highlight */}
          <div
            className="absolute h-[45%] w-[55%] rounded-full blur-2xl"
            style={{
              left: "8%",
              top: "6%",
              background:
                "radial-gradient(ellipse at 30% 30%, oklch(1 0 0 / 0.9), transparent 65%)",
            }}
          />
          {/* thin rim light */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              boxShadow:
                "inset 0 0 0 1px oklch(1 0 0 / 0.35), inset 0 0 30px oklch(1 0 0 / 0.15)",
            }}
          />
        </div>
        {/* floating small glass drop */}
        <motion.div
          className="absolute h-16 w-16 rounded-full"
          style={{
            right: "-6%",
            top: "10%",
            background:
              "radial-gradient(circle at 30% 30%, oklch(1 0 0 / 0.95), oklch(0.75 0.02 260 / 0.4) 50%, oklch(0.15 0.02 260 / 0.6))",
            boxShadow:
              "inset 0 2px 6px oklch(1 0 0 / 0.6), 0 10px 20px oklch(0 0 0 / 0.35)",
            transform: "translateZ(60px)",
          }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}


/* ---------------------- Ambient glass drops / halos --------------------- */

function LiquidDrop({
  size = 120,
  className = "",
  tone = "red",
  delay = 0,
  duration = 10,
}: {
  size?: number;
  className?: string;
  tone?: "red" | "chrome" | "warm";
  delay?: number;
  duration?: number;
}) {
  const [calm] = useCalm();
  if (calm) return null;
  /* палитра 2026-07: red/warm капли стали лавандовыми (бордовый — только CTA) */
  const bg =
    tone === "red"
      ? "radial-gradient(circle at 32% 28%, oklch(1 0 0 / 0.9), var(--lav-light) 40%, var(--lav) 70%, var(--lav-deep))"
      : tone === "warm"
      ? "radial-gradient(circle at 32% 28%, oklch(1 0 0 / 0.95), var(--lav-soft) 45%, var(--lav) 80%)"
      : "radial-gradient(circle at 32% 28%, oklch(1 0 0 / 0.95), oklch(0.78 0.01 260 / 0.5) 45%, oklch(0.18 0.02 260 / 0.7))";
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: bg,
        boxShadow:
          "inset 0 2px 8px oklch(1 0 0 / 0.55), inset 0 -12px 24px oklch(0 0 0 / 0.35), 0 20px 40px -10px oklch(0 0 0 / 0.35)",
        filter: "blur(0.3px)",
        animation: `${Math.round(delay * 10) % 2 === 0 ? "drift-slow" : "drift-wide"} ${duration}s ease-in-out ${delay}s infinite`,
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    />
  );
}

function AmbientHalo({
  className = "",
  color = "var(--red)",
  size = 480,
  opacity = 0.14,
}: {
  className?: string;
  color?: string;
  size?: number;
  opacity?: number;
}) {
  const [calm] = useCalm();
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}, transparent 65%)`,
        opacity: calm ? opacity * 0.6 : opacity,
        animation: calm ? undefined : "breathe 9s ease-in-out infinite",
      }}
    />
  );
}

/* --------------------------- MeetingSpheres ---------------------------- */
/* «От встреч рождается новая вселенная», v2 по фидбеку заказчицы:
   — рождение происходит ОТ КАСАНИЯ: шарики физически не проходят друг сквозь
     друга — каждый контакт либо рождает третий, либо мягко отталкивает
     (пересечений «вхолостую» не бывает);
   — цвет новорождённого — СМЕСЬ цветов двух столкнувшихся; стартовые родители
     разных тонов палитры (лаванда + хром), так что дети — новые оттенки
     внутри той же гаммы;
   — плановые встречи: первая через ~9–14 с, дальше раз в 40–70 с шарики сами
     тянутся друг к другу; случайные касания тоже рождают (с кулдауном);
   — живёт не больше 6 шариков: старший новорождённый тихо растворяется.
   Canvas, pointer-events: none; в калм-режиме не рендерится. */

type SphereRGB = [number, number, number];

function MeetingSpheres({ className = "" }: { className?: string }) {
  const [calm] = useCalm();
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (calm) return;
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const parent = cv.parentElement;
    if (!parent) return;

    let W = 0;
    let H = 0;
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      const r = parent.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cv.width = Math.round(W * DPR);
      cv.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const mixRGB = (a: SphereRGB, b: SphereRGB): SphereRGB => [
      Math.round((a[0] + b[0]) / 2),
      Math.round((a[1] + b[1]) / 2),
      Math.round((a[2] + b[2]) / 2),
    ];
    const lighten = (c: SphereRGB, t: number): SphereRGB => [
      Math.round(c[0] + (255 - c[0]) * t),
      Math.round(c[1] + (255 - c[1]) * t),
      Math.round(c[2] + (255 - c[2]) * t),
    ];
    const darken = (c: SphereRGB, t: number): SphereRGB => [
      Math.round(c[0] * (1 - t)),
      Math.round(c[1] * (1 - t)),
      Math.round(c[2] * (1 - t)),
    ];
    const css = (c: SphereRGB, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

    const LAV: SphereRGB = [153, 146, 165];      // лаванда сайта #9992A5
    const CHROME: SphereRGB = [167, 169, 174];   // хром/серебро
    const LAV_LIGHT: SphereRGB = [201, 196, 210]; // светлая лаванда #C9C4D2

    type Orb = {
      id: number;
      r: number; x: number; y: number; vx: number; vy: number;
      homeX: number; homeY: number; ampX: number; ampY: number;
      freqX: number; freqY: number; phaseX: number; phaseY: number;
      born: number; opacity: number; color: SphereRGB;
      growT?: number; growTarget?: number; dying?: boolean; isParent?: boolean;
    };
    let orbSeq = 0;

    const zone = () => ({ x0: W * 0.44, x1: W * 0.78, y0: H * 0.12, y1: H * 0.86 });
    const makeOrb = (color: SphereRGB, r: number, cx?: number, cy?: number): Orb => {
      const z = zone();
      const x = cx ?? rand(z.x0 + r, z.x1 - r);
      const y = cy ?? rand(z.y0 + r, z.y1 - r);
      return {
        id: ++orbSeq,
        r, x, y, vx: 0, vy: 0,
        homeX: x, homeY: y,
        ampX: rand(W * 0.05, W * 0.13), ampY: rand(H * 0.1, H * 0.24),
        freqX: rand(0.00014, 0.00024) * (Math.random() < 0.5 ? 1 : -1),
        freqY: rand(0.00012, 0.0002) * (Math.random() < 0.5 ? 1 : -1),
        phaseX: rand(0, Math.PI * 2), phaseY: rand(0, Math.PI * 2),
        born: performance.now(), opacity: 0, color,
      };
    };

    const makeSpaced = (color: SphereRGB, r: number, others: Orb[]): Orb => {
      for (let tries = 0; tries < 24; tries++) {
        const o = makeOrb(color, r);
        if (others.every((p) => Math.hypot(p.x - o.x, p.y - o.y) > p.r + o.r + 50)) return o;
      }
      return makeOrb(color, r);
    };
    const orbsInit: Orb[] = [];
    orbsInit.push(Object.assign(makeSpaced(LAV, rand(38, 48), orbsInit), { isParent: true }));
    orbsInit.push(Object.assign(makeSpaced(CHROME, rand(30, 40), orbsInit), { isParent: true }));
    orbsInit.push(Object.assign(makeSpaced(LAV_LIGHT, rand(20, 26), orbsInit), { isParent: true }));
    let orbs: Orb[] = orbsInit;
    const MAX_ORBS = 6;
    type Flash = { x: number; y: number; t0: number; color: SphereRGB };
    let flashes: Flash[] = [];
    const touching = new Set<string>();
    let birthCooldownUntil = 0;
    // плановая встреча: пара мягко тянется друг к другу до касания
    let steer: [Orb, Orb] | null = null;
    let steerSince = 0;
    let nextMeetAt = performance.now() + rand(4000, 7000);

    const birth = (a: Orb, b: Orb, now: number) => {
      const nx = (a.x * b.r + b.x * a.r) / (a.r + b.r);
      const ny = (a.y * b.r + b.y * a.r) / (a.r + b.r);
      const color = mixRGB(a.color, b.color);
      flashes.push({ x: nx, y: ny, t0: now, color });
      const nb = makeOrb(color, rand(16, 24), nx, ny);
      nb.growT = now;
      nb.growTarget = nb.r;
      nb.r = 2;
      nb.vx = rand(-0.6, 0.6);
      nb.vy = rand(-0.6, 0.6);
      orbs.push(nb);
      // держим популяцию: всё сверх MAX_ORBS — старшие дети растворяются
      let excess = orbs.filter((o) => !o.dying).length - MAX_ORBS;
      for (const kid of orbs) {
        if (excess <= 0) break;
        if (!kid.isParent && !kid.dying) { kid.dying = true; excess--; }
      }
      birthCooldownUntil = now + rand(25000, 40000);
    };

    const drawOrb = (o: Orb) => {
      if (o.opacity <= 0.01 || o.r <= 0.5) return;
      ctx.save();
      ctx.globalAlpha = o.opacity;
      const g = ctx.createRadialGradient(
        o.x - o.r * 0.32, o.y - o.r * 0.34, o.r * 0.05, o.x, o.y, o.r
      );
      g.addColorStop(0, css(lighten(o.color, 0.78)));
      g.addColorStop(0.34, css(lighten(o.color, 0.3)));
      g.addColorStop(0.74, css(o.color));
      g.addColorStop(1, css(darken(o.color, 0.42)));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = o.opacity * 0.4;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.ellipse(o.x - o.r * 0.32, o.y - o.r * 0.36, o.r * 0.32, o.r * 0.18, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    let last = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const dt = Math.min(40, now - last);
      last = now;
      ctx.clearRect(0, 0, W, H);
      const z = zone();

      // плановая встреча: выбираем ближайшую пару и тянем друг к другу
      if (!steer && now >= nextMeetAt && orbs.length >= 2 && W > 480) {
        let pick: [Orb, Orb] | null = null;
        let bd = Infinity;
        for (let i = 0; i < orbs.length; i++)
          for (let j = i + 1; j < orbs.length; j++) {
            if (orbs[i].dying || orbs[j].dying) continue;
            const d = Math.hypot(orbs[i].x - orbs[j].x, orbs[i].y - orbs[j].y);
            if (d < bd) { bd = d; pick = [orbs[i], orbs[j]]; }
          }
        steer = pick;
        steerSince = now;
      }
      // страховка: если сведение зависло — пересобрать план
      if (steer && now - steerSince > 10000) {
        steer = null;
        nextMeetAt = now + 1500;
      }

      orbs.forEach((o) => {
        // рост новорождённого
        if (o.growT != null && o.growTarget != null) {
          const u = clamp01((now - o.growT) / 900);
          o.r = 2 + (o.growTarget - 2) * easeOut(u);
          if (u >= 1) { o.growT = undefined; }
        }
        // блуждающая «домашняя» точка + пружина к ней;
        // в плановую встречу цель пары — их общая середина (пружина сама сводит)
        const t = now - o.born;
        let tx = o.homeX + o.ampX * Math.sin(o.freqX * t + o.phaseX);
        let ty = o.homeY + o.ampY * Math.cos(o.freqY * t + o.phaseY);
        let k = 0.00035;
        if (steer && (o === steer[0] || o === steer[1])) {
          const other = o === steer[0] ? steer[1] : steer[0];
          tx = (o.x + other.x) / 2;
          ty = (o.y + other.y) / 2;
          k = 0.0013;
        }
        o.vx += (tx - o.x) * k * dt;
        o.vy += (ty - o.y) * k * dt;
        // мягкие границы зоны
        if (o.x < z.x0 + o.r) o.vx += (z.x0 + o.r - o.x) * 0.0004 * dt;
        if (o.x > z.x1 - o.r) o.vx -= (o.x - (z.x1 - o.r)) * 0.0004 * dt;
        if (o.y < z.y0 + o.r) o.vy += (z.y0 + o.r - o.y) * 0.0004 * dt;
        if (o.y > z.y1 - o.r) o.vy -= (o.y - (z.y1 - o.r)) * 0.0004 * dt;
        const damp = Math.pow(0.92, dt / 16);
        o.vx *= damp; o.vy *= damp;
        o.x += o.vx * (dt / 16);
        o.y += o.vy * (dt / 16);
        if (o.dying) {
          o.opacity = Math.max(0, o.opacity - 0.012 * (dt / 16));
        } else {
          o.opacity = Math.min(1, o.opacity + 0.02 * (dt / 16));
        }
      });
      orbs = orbs.filter((o) => !(o.dying && o.opacity <= 0));

      // столкновения: касание = рождение (или мягкий отскок в кулдаун)
      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          const a = orbs[i], b = orbs[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const minD = a.r + b.r + 4;
          const key = a.id + "-" + b.id;
          if (dist < minD) {
            // позиционное разведение + мягкий импульс (сквозь не проходят)
            const nx = dx / dist, ny = dy / dist;
            const overlap = minD - dist;
            const wa = b.r / (a.r + b.r), wb = a.r / (a.r + b.r);
            a.x -= nx * overlap * 0.5 * wa; a.y -= ny * overlap * 0.5 * wa;
            b.x += nx * overlap * 0.5 * wb; b.y += ny * overlap * 0.5 * wb;
            const imp = overlap * 0.012 * dt;
            a.vx -= nx * imp * wa; a.vy -= ny * imp * wa;
            b.vx += nx * imp * wb; b.vy += ny * imp * wb;
            const firstTouch = !touching.has(key);
            touching.add(key);
            {
              const growing = a.growT != null || b.growT != null;
              const planned = steer && ((steer[0] === a && steer[1] === b) || (steer[0] === b && steer[1] === a));
              const chanceAllowed = firstTouch && now >= birthCooldownUntil && orbs.length < MAX_ORBS;
              if (!growing && !a.dying && !b.dying && (planned || chanceAllowed)) {
                birth(a, b, now);
                if (planned) {
                  steer = null;
                  nextMeetAt = now + rand(35000, 60000);
                  // разлёт: дома́ разводим вдоль нормали, дрейф стартует из своей точки
                  const D = (a.r + b.r) * 1.6;
                  const home = (o: Orb, sgn: number) => {
                    o.born = now;
                    const px = o.x + sgn * nx * D * 0.5;
                    const py = o.y + sgn * ny * D * 0.5;
                    o.homeX = px - o.ampX * Math.sin(o.phaseX);
                    o.homeY = py - o.ampY * Math.cos(o.phaseY);
                  };
                  home(a, -1);
                  home(b, 1);
                  a.vx -= nx * 1.1; a.vy -= ny * 1.1;
                  b.vx += nx * 1.1; b.vy += ny * 1.1;
                }
              }
            }
          } else {
            touching.delete(key);
          }
        }
      }

      // вспышки рождения
      flashes = flashes.filter((f) => {
        const u = (now - f.t0) / 500;
        if (u >= 1) return false;
        ctx.save();
        ctx.globalAlpha = (1 - u) * 0.85;
        const fg = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 64);
        fg.addColorStop(0, "rgba(255,255,255,0.95)");
        fg.addColorStop(0.4, css(lighten(f.color, 0.5), 0.5));
        fg.addColorStop(1, css(lighten(f.color, 0.5), 0));
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 64, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      orbs.forEach(drawOrb);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [calm]);

  if (calm) return null;
  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}


function RevealHeading({
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
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className={className}
    >

      {children}
    </MotionTag>
  );
}



function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div className="grid-lines absolute inset-0 opacity-60" />
      <AmbientHalo className="-right-40 -top-20" color="var(--lav)" size={680} opacity={0.3} />
      <AmbientHalo className="-left-40 bottom-0" color="oklch(0.85 0.02 260)" size={560} opacity={0.14} />
      <div className="pointer-events-none absolute inset-x-0 top-24 mx-auto h-px max-w-7xl bg-border" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-border/60" />
      <LiquidOrb size={440} className="right-[-80px] top-8 hidden md:block" />
      <MeetingSpheres className="hidden md:block" />

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-12 md:px-6 md:pb-24 md:pt-24">
        <RevealHeading as="h1" className="max-w-5xl font-display text-[clamp(1.6rem,6vw,2.2rem)] font-extrabold leading-[1.08] tracking-tight sm:text-4xl md:text-6xl md:leading-[1.05]">
          Сохраняем{" "}
          <span className="relative inline-block">
            <span className="relative z-10">опыт ключевых сотрудников</span>
            <span className="absolute inset-x-0 bottom-1 -z-0 h-4 bg-[color:var(--red)]/25" />
          </span>{" "}
          и усиливаем команду внешними экспертами без расширения штата
        </RevealHeading>

        <p className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground">
          Переводим подходы сильных экспертов в алгоритмы, стандарты и материалы,
          которыми может пользоваться вся команда
        </p>

        <div className="mt-8 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--red)]">
            Почему с нами удобно
          </div>
          <ul className="mt-4 flex flex-col gap-3">
            {[
              "Можно прийти без готового ТЗ: принимаем вводные в любом виде и собираем из них архитектуру решения и план работ",
              "В течение 24 часов после согласования назначаем команду и проводим стартовую встречу",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/85 md:text-base">
                <Check className="mt-0.5 h-4 w-4 flex-none text-[color:var(--red)]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:mt-10">
          <div>
            <a
              href="#contact"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[color:var(--red)] px-6 py-3.5 text-sm font-semibold text-background shadow-lg shadow-[color:var(--red)]/20 transition hover:bg-foreground sm:w-auto sm:px-7 sm:py-4 sm:text-base"
            >
              Назначить разбор
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 sm:h-5 sm:w-5" />
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:text-sm">
            <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[color:var(--red)]" />30 минут онлайн. Сверимся по задаче и определим следующий шаг</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Stats (цифры) ------------------------------ */

function Stats() {
  const items = [
    ["260+", "практиков с подтверждённым опытом в профессиональной сети команды"],
    ["460+", "разработанных продуктов в портфеле команды"],
    ["30+", "компаний-клиентов"],
  ];
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Наш опыт в цифрах
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {items.map(([n, d]) => (
            <div key={n} className="border-t-2 border-[color:var(--red)]/60 pt-4">
              <div className="font-display text-4xl font-extrabold tabular-nums md:text-5xl">{n}</div>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------- Flow (схема взаимодействия) ---------------------- */

function Flow() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary/30">
      <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Схема взаимодействия
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            ["2 рабочих часа", "отвечаем на заявку"],
            ["30 минут", "проводим первичный разбор"],
          ].map(([t, d], i) => (
            <div key={t} className="flex items-start gap-4 rounded-2xl border border-border bg-background/70 p-5 md:p-6">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[color:var(--red)]/50 bg-[color:var(--red)]/10 font-display text-sm font-bold text-[color:var(--red)]">
                {i + 1}
              </span>
              <div>
                <div className="font-display text-lg font-extrabold">{t}</div>
                <div className="mt-1 text-sm text-muted-foreground">{d}</div>
              </div>
            </div>
          ))}
        </div>
        {/* развилка */}
        <div className="mx-auto mt-4 h-6 w-px bg-border md:mt-6" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background/70 p-5 md:p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Для методологического проекта
            </div>
            <div className="mt-3 font-display text-lg font-extrabold">24 часа</div>
            <div className="mt-1 text-sm text-muted-foreground">назначаем команду и проводим стартовую встречу</div>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 p-5 md:p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Если нужен внешний эксперт
            </div>
            <div className="mt-3 font-display text-lg font-extrabold">72 часа</div>
            <div className="mt-1 text-sm text-muted-foreground">представляем первые релевантные профили</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------- Capital / Approach / FirstStage (по финальному списку) -------- */

function Capital() {
  const items = [
    "сотрудники принимают решения по единым принципам",
    "практика сильных руководителей передаётся другим командам",
    "новые сотрудники быстрее осваивают рабочий подход",
    "руководители меньше времени тратят на повторение одних и тех же объяснений",
  ];
  return (
    <section id="capital" className="relative overflow-hidden border-b border-border bg-[color:var(--lav-soft)]/45">
      <AmbientHalo className="-right-40 top-10" color="var(--lav)" size={520} opacity={0.2} />
      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-24">
        <SectionLabel n="03">Интеллектуальный капитал</SectionLabel>
        <RevealHeading className="mt-6 max-w-4xl font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
          С нами экспертный опыт становится интеллектуальным капиталом компании
        </RevealHeading>
        <ul className="mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {items.map((t) => (
            <li key={t} className="flex items-start gap-3 rounded-2xl border border-border bg-background/70 p-5 text-sm leading-relaxed text-foreground/85 md:text-[15px]">
              <Check className="mt-0.5 h-4 w-4 flex-none text-[color:var(--red)]" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Approach() {
  const pillars = [
    {
      t: "Доступ к нужной практике",
      d: "В профессиональной сети команды — более 260 руководителей и отраслевых специалистов. Подключаем к проекту практиков, которые уже решали сопоставимые задачи",
    },
    {
      t: "Перевод опыта в рабочие инструменты",
      d: "Методологи превращают решения экспертов в алгоритмы, стандарты, кейсы и материалы, адаптированные под задачи и язык вашей компании.",
    },
    {
      t: "Один договор вместо отдельных договоров с практиками",
      d: "Подключаем практиков, оформляем договорённости, координируем их работу и переводим опыт в согласованный результат. Вы работаете с одной проектной командой и одним договором.",
    },
  ];
  return (
    <section id="approach" className="relative overflow-hidden border-b border-border bg-foreground text-background">
      <AmbientHalo className="-right-40 top-0" color="var(--red-glow)" size={620} opacity={0.28} />
      <div className="pointer-events-none absolute inset-0">
        <Sphere size={180} className="right-10 top-10 hidden md:block" delay={0.2} duration={9} variant="red" />
        <Sphere size={80} className="right-[220px] top-[160px] hidden md:block" delay={0.9} duration={7} variant="chrome" />
        <LiquidDrop size={64} className="left-[8%] top-[220px] hidden md:block" tone="chrome" delay={0.4} duration={11} />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-24">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-background/50">
          Наш подход
        </div>
        <RevealHeading className="mt-6 max-w-4xl font-display text-2xl font-extrabold leading-tight sm:text-3xl md:text-5xl">
          Почему нам доверяют работу с экспертным опытом
        </RevealHeading>
        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {pillars.map((p, i) => (
            <motion.div
              key={p.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="border-t border-background/15 pt-6"
            >
              <div className="font-display text-lg font-bold text-background md:text-xl">{p.t}</div>
              <p className="mt-3 text-sm leading-relaxed text-background/65 md:text-[15px]">{p.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FirstStage() {
  const bullets = [
    "Один договор. Одна команда. Одна точка ответственности",
    "До старта согласуем объем работ, этапы, сроки и критерии приемки",
    "Профильных экспертов подключаем под конкретную задачу",
    "Если результат этапа не соответствует критериям, согласованным до старта, дорабатываем его без дополнительной оплаты",
  ];
  return (
    <section id="firststage" className="relative overflow-hidden border-b border-border">
      <LiquidDrop size={56} className="right-[6%] top-[120px] hidden md:block" tone="red" delay={0.5} duration={11} />
      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-24">
        <SectionLabel n="05">Как начинаем</SectionLabel>
        <RevealHeading className="mt-6 max-w-4xl font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
          Сначала — отдельный этап с самостоятельным результатом
        </RevealHeading>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Вы получаете модель решения и дорожную карту. После этого можете
          продолжить проект с нами или использовать результат самостоятельно.
        </p>
        <ul className="mt-10 max-w-3xl divide-y divide-border border-y border-border">
          {bullets.map((t) => (
            <li key={t} className="flex items-start gap-4 py-4 text-[15px] leading-relaxed text-foreground/85">
              <Check className="mt-1 h-4 w-4 flex-none text-[color:var(--red)]" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------- Book ---------------------------------- */

function BookSection() {
  return (
    <section id="book" className="relative overflow-hidden border-b border-border bg-[color:var(--lav-soft)]/45">
      <AmbientHalo className="-right-40 top-0" color="var(--lav)" size={560} opacity={0.2} />
      <AmbientHalo className="-left-40 bottom-0" color="oklch(0.85 0.02 260)" size={480} opacity={0.12} />
      <LiquidDrop size={72} className="left-[6%] top-[120px] hidden md:block" tone="red" delay={0.4} duration={12} />
      <LiquidDrop size={44} className="right-[8%] bottom-[100px] hidden md:block" tone="chrome" delay={1.0} duration={10} />

      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-24">
        <SectionLabel n="08">Методология издана</SectionLabel>
        <div className="mt-14">
          <GlassCard className="overflow-hidden p-0">
            <div className="grid items-stretch gap-0 md:grid-cols-[360px_1fr]">
              {/* Cover */}
              <div className="relative flex items-center justify-center bg-[color:var(--lav)]/10 p-8 md:p-10">
                <motion.div
                  initial={{ opacity: 0, y: 20, rotateY: -8 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                  className="relative w-full max-w-[260px] md:max-w-[300px]"
                  style={{ perspective: 1000 }}
                >
                  <div
                    className="relative aspect-[3/4] w-full overflow-hidden rounded-r-lg rounded-l-md shadow-2xl"
                    style={{
                      boxShadow:
                        "20px 30px 60px -20px rgba(0,0,0,0.4), inset 12px 0 24px rgba(0,0,0,0.15)",
                    }}
                  >
                    <img
                      src={bookCover.url}
                      alt="Обложка книги «Эксперт под ключ»"
                      loading="lazy"
                      decoding="async"
                      width={1200}
                      height={1600}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* soft glow behind cover */}
                  <div
                    className="pointer-events-none absolute -inset-6 -z-10 rounded-full blur-3xl"
                    style={{
                      background:
                        "radial-gradient(circle, color-mix(in oklab, var(--red) 45%, transparent), transparent 65%)",
                      opacity: 0.6,
                    }}
                  />
                </motion.div>
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                  className="font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl"
                >
                  Книга «Эксперт под ключ»
                </motion.h2>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  Как мы извлекаем знания экспертов-практиков и собираем из них
                  образовательные продукты с измеримым результатом — методология
                  команды, изданная книгой. Литрес, 2025.
                </p>
                <a
                  href="https://www.litres.ru/book/viktoriya-utkina/ekspert-pod-kluch-kak-izvlech-i-upakovat-znaniya-dlya-biz-72669850/"
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-8 inline-flex w-max items-center gap-2 text-lg font-semibold text-[color:var(--red)] underline underline-offset-4 transition hover:text-foreground"
                >
                  Читать на Литрес
                  <ExternalLink className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <div className="mt-10 flex flex-wrap gap-3">
                  {["Продуктовая методология", "Извлечение знаний", "Измеримый результат"].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Cases ---------------------------------- */

const CASES = [
  {
    category: "Запуски продуктов",
    scenario: 0, // Абонентское сопровождение: годовая программа, 3 перезапуска
    title: "Курс «10 сфер жизни»",
    nda: true,
    client: "Предприниматель-блогер, 1 млн+ подписчиков",
    role: "Методолог-продюсер",
    timing: "3 недели на сборку",
    done: [
      "архитектура годовой программы и путь студента",
      "механики удержания без найма кураторов",
      "подбор экспертов по нишам: 8 источников, чек-лист, кастдевы",
      "сборка модулей",
    ],
    metrics: [
      ["1000+", "участников"],
      ["80%", "CSI"],
      ["76%", "доходимость до финала"],
      ["3", "перезапуска"],
    ],
    source: "Статистика платформы и опросы потоков; перезапуски — фактические циклы продаж.",
  },
  {
    category: "Запуски продуктов",
    scenario: 1, // Продукт под задачу: запуск конкретного курса под запрос
    title: "Экокурс с нулевым бюджетом на маркетинг",
    nda: true,
    client: "Блогер-эксперт",
    role: "Методолог-продюсер",
    timing: "6-недельный курс",
    done: [
      "отстрел неработающей гипотезы до вложений — сэкономили 6 месяцев",
      "проверка новой темы опросом в канале",
      "архитектура и продуктовые обещания",
      "прогрев 14 дней и сопровождение до результата",
    ],
    metrics: [
      ["18/25", "продаж из заявок"],
      ["0 ₽", "на маркетинг"],
      ["100%", "доходимость"],
      ["5+3", "начали зарабатывать за полгода"],
    ],
    source: "Продажи и заявки — из CRM; доходимость — по финальной защите.",
  },
  {
    category: "Корпоративное обучение",
    scenario: 1, // Продукт под задачу: конкретная ДПО-программа (MVP)
    title: "Цифровой Брокер",
    client: "Global Broker League",
    link: "https://globalbrokerleague.com/",
    role: "Методология + запуск ДПО-программы",
    timing: "MVP под международных брокеров",
    done: [
      "продуктовый офер и методология ДПО-программы",
      "4 модуля, 270 академических часов",
      "интеграция с GetCourse и ДПО-рамкой",
      "диплом по итогам обучения",
    ],
    metrics: [
      ["4", "модуля"],
      ["270", "ак. часов"],
      ["1", "MVP ДПО-программы"],
      ["∞", "масштабирование"],
    ],
    source: "Проектный запуск и переданная документация.",
  },
  {
    category: "Корпоративное обучение",
    scenario: 2, // Практикум для L&D: передача подхода внутренним тренерам
    title: "Продуктовый подход в корпоративном обучении",
    client: "Корпоративный заказчик",
    role: "Разработка и проведение тренинга",
    timing: "7 модулей, онлайн, 3 часа каждый",
    done: [
      "7 модулей по продуктовому подходу для бизнес-тренеров",
      "практические задания и обратная связь",
      "сопровождение до измеримого результата",
    ],
    metrics: [
      ["86%", "сдали хотя бы одно ДЗ"],
      ["75%", "средняя посещаемость"],
      ["4.7", "средняя оценка курса"],
      ["↑", "показатели Engagement Survey"],
    ],
    source: "Внутренняя отчётность заказчика и опросы участников.",
  },
];

function CaseCard({ item, index }: { item: (typeof CASES)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <GlassCard className="group flex h-full flex-col gap-5 p-6 transition-transform duration-300 hover:-translate-y-1 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--red)]">
              {item.category}
            </div>
          </div>
          {item.nda && (
            <span className="shrink-0 rounded-full border border-border/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              NDA
            </span>
          )}
        </div>

        <div>
          <h3 className="font-display text-2xl font-bold leading-tight">
            {item.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-medium text-foreground/80 transition hover:text-[color:var(--red)]"
              >
                {item.client}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span className="font-medium text-foreground/80">{item.client}</span>
            )}
            <span className="hidden text-border sm:inline">·</span>
            <span>{item.role}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
          {item.metrics.map(([value, label]) => (
            <div
              key={label}
              className="flex min-w-0 flex-col items-center rounded-xl border border-border/60 bg-secondary/40 px-2 py-3 text-center backdrop-blur-sm transition group-hover:border-[color:var(--red)]/20 group-hover:bg-secondary/70"
            >
              <div className="w-full font-display font-extrabold leading-[1.05] tracking-tight text-[color:var(--red)] text-[clamp(0.95rem,2.2vw,1.35rem)] [overflow-wrap:anywhere] hyphens-none">
                {value}
              </div>
              <div className="mt-1 text-[9px] font-medium uppercase leading-tight tracking-wider text-muted-foreground sm:text-[10px] [overflow-wrap:anywhere]">
                {label}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Что сделано
          </div>
          <ul className="space-y-1.5 text-sm leading-relaxed text-foreground/80">
            {item.done.map((d) => (
              <li key={d} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[color:var(--red)]" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-4 text-xs italic leading-relaxed text-muted-foreground/80">
          {item.source}
        </div>
      </GlassCard>
    </motion.div>
  );
}

function Cases() {
  return (
    <section id="cases" className="relative overflow-hidden border-b border-border">
      <AmbientHalo className="-right-40 top-10" color="oklch(0.72 0.008 260)" size={600} opacity={0.14} />
      <AmbientHalo className="-left-40 bottom-10" color="oklch(0.82 0.02 260)" size={520} opacity={0.12} />
      <LiquidDrop size={76} className="left-[5%] top-[120px] hidden md:block" tone="chrome" delay={0.4} duration={13} />
      <LiquidDrop size={44} className="right-[8%] top-[260px] hidden md:block" tone="red" delay={1.0} duration={10} />
      <LiquidDrop size={32} className="right-[22%] bottom-[90px] hidden md:block" tone="warm" delay={1.5} duration={9} />

      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-24">
        <SectionLabel n="04">Результаты клиентов</SectionLabel>
        <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <RevealHeading className="max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            Кейсы с конкретными метриками
          </RevealHeading>
          <p className="max-w-md text-muted-foreground">
            Реальные проекты: от запуска B2C-курсов до корпоративных программ и MVP ДПО.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {CASES.map((item, i) => (
            <CaseCard key={item.title} item={item} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}

/* ------------------- TrustStrip + WhenNeeded (блоки 2–3) ------------------ */
/* Блок 2: полоса логотипов сразу под hero, без заголовка. Девять основных —
   статично, остальные — бегущей строкой (при калм-режиме строка статична). */

function TrustStrip() {
  const main = ["РОЛЬФ", "Avito", "Kaspersky", "Ozon", "Castorama", "Норникель", "МТС", "Danone", "Газпромбанк"];
  const rest = ["McDonald's", "Toyota", "Home Credit Bank", "InBev"];
  const [calm] = useCalm();
  const ticker = [...rest, ...rest, ...rest];
  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary/30">
      <div className="relative mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap justify-center gap-3">
          {main.map((name) => (
            <span
              key={name}
              className="inline-flex items-center rounded-full border border-border/70 bg-background/60 px-4 py-2 text-sm font-semibold text-foreground/80 backdrop-blur-sm"
            >
              {name}
            </span>
          ))}
        </div>
        <div className="relative mt-4 overflow-hidden" aria-hidden={calm ? undefined : true}>
          <div
            className="flex w-max gap-3 whitespace-nowrap"
            style={calm ? undefined : { animation: "trust-ticker 26s linear infinite" }}
          >
            {[...ticker, ...ticker].map((name, i) => (
              <span
                key={name + i}
                className="inline-flex items-center rounded-full border border-border/50 px-4 py-1.5 text-xs font-semibold text-muted-foreground"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Блок 3: четыре ситуации, в которых подход даёт максимальный эффект. */

function WhenNeeded() {
  const items = [
    {
      t: "Знания распределены между несколькими сильными экспертами, внутренними материалами и сложившимися практиками. Их нужно быстро собрать в единый продукт",
      d: "С нами опыт экспертов становится активом вашей компании. Опытом можно пользоваться независимо от занятости его носителей, а подразделения работают по единым принципам",
    },
    {
      t: "Пиковые нагрузки на L&D-отдел",
      d: "Усиливаем вашу команду, когда инициатив стало кратно больше. Подключаем методологическую команду к параллельным проектам и берём на себя согласованный объём разработки",
    },
    {
      t: "Бизнес входит в новые ниши — нужны подходы, которых пока нет внутри",
      d: "Подключаем к проекту практика с релевантным опытом и переводим его решения в алгоритмы и кейсы, адаптированные под контекст компании. Результат: команда быстрее получает рабочий подход и не тратит время на самостоятельный поиск решений",
    },
  ];
  return (
    <section id="when" className="relative overflow-hidden border-b border-border">
      <AmbientHalo className="-left-40 top-10" color="var(--lav)" size={520} opacity={0.18} />
      <LiquidDrop size={56} className="right-[5%] top-[140px] hidden md:block" tone="red" delay={0.6} duration={11} />
      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-24">
        <SectionLabel n="02">Когда к нам обращаются</SectionLabel>
        <RevealHeading className="mt-6 max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
          Когда нужна команда «Без Воды»
        </RevealHeading>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          3 ситуации, в которых наш подход дает максимальный эффект
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <GlassCard className="h-full p-6 md:p-8">
                <div className="font-display text-sm font-bold tabular-nums text-[color:var(--red)]">
                  0{i + 1}
                </div>
                <h3 className="mt-3 font-display text-base font-extrabold leading-snug md:text-lg">
                  {c.t}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                  {c.d}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ------------------------------- Reviews -------------------------------- */

const REVIEWS = [
  {
    text: "Мне было сложно доносить сложные и глубокие мысли. Для меня как эксперта это понятные термины, но участникам обучения было непонятно. И я кайфанул, когда Вика из сложной мысли делала её понятной и превращала в простую инструкцию для достижения результата. Вика с полуслова понимает, что хочу сказать, она в каждую тему погружается на 100%, помогает вопросами \"вытащить суть\" и находит очень понятные метафоры для участников. Я кайфанул!",
    name: "Александр Быков",
    role: "Владелец компании «Бизнес-Партнер» с опытом построения отделов продаж более 12 лет",
  },
  {
    text: "У меня были идеи и смыслы, которые хочется донести до аудитории на 6-часовом обучении. Мы проработали их с Викой — получился полноценный обучающий материал с балансом теории и практики каждой идеи. Самое ценное — в логическом структурировании информации и подборе упражнений: мы простроили связку идея — практика. Очень приятная лёгкая коммуникация, вовлечённость и небезразличие, докрутка и правки до офигенного результата. Много \"посредственного\" докрутили до \"классного\"",
    name: "Ринат Алиев",
    role: "Сооснователь образовательного сервиса Educate Online, экс-директор по продажам Red Bull Россия",
  },
  {
    text: "Задача была быстро выгрузить смыслы для выступления на Мастер-группе по теме продаж на маркетплейсах и работе с Китаем — вышла последовательная презентация по делу и с юмором. Быстро и без лишних вопросов",
    name: "Дмитрий Ковпак",
    role: "Акселератор для продавцов маркетплейсов, масштабирует бизнесы WB и Ozon x2–x5",
  },
];

function Reviews() {
  return (
    <section id="reviews" className="relative overflow-hidden border-b border-border bg-[color:var(--lav-soft)]/45">
      <AmbientHalo className="-left-40 top-10" color="var(--lav)" size={560} opacity={0.22} />
      <AmbientHalo className="-right-40 bottom-10" color="oklch(0.85 0.02 260)" size={480} opacity={0.12} />
      <LiquidDrop size={70} className="right-[6%] top-[140px] hidden md:block" tone="red" delay={0.4} duration={12} />
      <LiquidDrop size={42} className="left-[5%] bottom-[110px] hidden md:block" tone="chrome" delay={1.0} duration={10} />
      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-24">
        <SectionLabel n="05">Отзывы</SectionLabel>
        <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <RevealHeading className="max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            Что говорят клиенты
          </RevealHeading>
          <p className="max-w-md text-muted-foreground">
            О работе методологов «Без Воды» — дословно.
          </p>
        </div>
        <div className="mt-14 grid items-start gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <GlassCard className="flex h-full flex-col gap-5 p-6 md:p-7">
                <span className="font-display text-4xl leading-none text-[color:var(--red)]">«</span>
                <blockquote className="text-sm leading-relaxed text-foreground/85">
                  {r.text}
                </blockquote>
                <div className="mt-auto border-t border-border/70 pt-4">
                  <div className="font-display text-base font-bold leading-tight">{r.name}</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.role}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------- NotFit («Когда нужен другой подрядчик») + FAQ ------------- */

function NotFit() {
  const items = [
    "если требуется подбор сотрудника в штат или аутстаффинг",
    "если нужно внедрение или техническая поддержка LMS",
    "если требуется внедрение организационных изменений за пределами образовательного проекта",
    "если нужна организация и логистика мероприятия",
  ];
  return (
    <section id="notfit" className="relative overflow-hidden border-b border-border bg-secondary/40">
      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-24">
        <SectionLabel n="09">Границы</SectionLabel>
        <RevealHeading className="mt-6 max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
          Когда нужен другой подрядчик
        </RevealHeading>
        <ul className="mt-10 max-w-3xl divide-y divide-border border-y border-border">
          {items.map((t) => (
            <li key={t} className="flex items-start gap-4 py-4 text-[15px] leading-relaxed text-foreground/85">
              <span className="mt-1 flex-none font-display text-sm font-bold text-[color:var(--red)]">—</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const FAQ_ITEMS = [
  {
    q: "Что происходит в первые 24 часа?",
    a: "После согласования проекта назначаем команду, проводим стартовую встречу и фиксируем план первого этапа.",
  },
  {
    q: "У меня нет готового ТЗ.",
    a: "Достаточно описать желаемое изменение, срок и то, что уже есть: материалы, идеи или доступ к внутренним экспертам. Рамку первого этапа формируем сами",
  },
  {
    q: "Как быстро вы представите внешних экспертов?",
    a: "Сначала фиксируем, какой опыт нужен и какие вопросы специалист должен закрыть. Первые релевантные профили представляем в течение 72 часов после согласования требований.",
  },
  {
    q: "Что потребуется от команды клиента?",
    a: "Один владелец задачи со стороны компании, доступ к носителям практики, существующие материалы и обратная связь по контрольным точкам.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative overflow-hidden border-b border-border">
      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-24">
        <SectionLabel n="10">FAQ</SectionLabel>
        <RevealHeading className="mt-6 max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
          Частые вопросы
        </RevealHeading>
        <div className="mt-10 max-w-3xl divide-y divide-border border-y border-border">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <button
                key={item.q}
                onClick={() => setOpen(isOpen ? null : i)}
                className={`group flex w-full items-start gap-5 px-2 py-5 text-left transition hover:bg-background/70 ${isOpen ? "bg-background/60" : ""}`}
              >
                <span className={`mt-1 font-display text-sm font-bold tabular-nums transition ${isOpen ? "text-[color:var(--red)]" : "text-muted-foreground group-hover:text-foreground"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <div className={`font-display text-lg font-bold transition ${isOpen ? "text-foreground" : "text-foreground/85 group-hover:text-foreground"}`}>
                    {item.q}
                  </div>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                        className="mt-2 overflow-hidden text-sm leading-relaxed text-muted-foreground md:text-[15px]"
                      >
                        {item.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }} className="mt-1">
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Contact ------------------------------- */

function Contact() {
  const [sent, setSent] = useState(false);
  const [sentName, setSentName] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pd, setPd] = useState(false);
  const [ads, setAds] = useState(false);

  const formStarted = useRef(false);
  const onFormFocus = () => {
    if (formStarted.current) return;
    formStarted.current = true;
    ymGoal("form_started");
  };

  useEffect(() => {
    try {
      if (/utm_|yclid|gclid/.test(window.location.search)) {
        window.sessionStorage.setItem("bv-src", window.location.search);
      }
    } catch {}
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    const f = e.currentTarget;
    const data = new FormData(f);
    const name = String(data.get("name") || "").trim();
    const company = String(data.get("company") || "").trim();
    const contact = String(data.get("contact") || "").trim();
    const about = String(data.get("about") || "").trim();
    const hp = String(data.get("website") || "");
    if (!name || !contact) {
      setErr("Заполните имя и контакт — иначе нам некуда ответить.");
      return;
    }
    if (!pd) {
      setErr("Чтобы отправить заявку, отметьте согласие на обработку персональных данных.");
      return;
    }
    setSending(true);
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          company,
          comment: about,
          consent_pd: true,
          consent_pd_version: "1.0-2026-07-14",
          consent_ads: ads,
          website: hp,
          page: (() => {
            let srcQ = window.location.search;
            try {
              if (!/utm_|yclid|gclid/.test(srcQ)) {
                srcQ = window.sessionStorage.getItem("bv-src") || srcQ;
              }
            } catch {}
            return (window.location.pathname || "/") + srcQ;
          })(),
        }),
      });
      if (!r.ok) throw new Error(String(r.status));
      setSentName(name);
      setSent(true);
      ymGoal("lead_sent");
    } catch {
      setErr("Заявка не отправилась. Попробуйте ещё раз или напишите в Telegram: @vikki_duck.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-foreground text-background">
      <AmbientHalo className="-left-40 top-0" color="var(--red)" size={560} opacity={0.28} />
      <AmbientHalo className="right-1/4 top-1/3" color="var(--red-glow)" size={360} opacity={0.22} />
      <LiquidDrop size={96} className="right-[8%] top-[140px] hidden md:block" tone="red" delay={0.3} duration={13} />
      <LiquidDrop size={58} className="right-[28%] bottom-[120px] hidden md:block" tone="chrome" delay={1.1} duration={11} />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-4 py-14 md:px-6 md:py-24 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-background/50">
            11 — Контакты
          </div>
          <RevealHeading as="h2" className="mt-6 font-display text-3xl font-extrabold leading-[1.05] sm:text-4xl md:text-6xl">
            С чего начинается наше сотрудничество
          </RevealHeading>
          <p className="mt-8 max-w-md text-lg text-background/70">
            Расскажите, что должно измениться в работе компании и к какому
            сроку. Готовить презентацию и подробное ТЗ не нужно.
          </p>
          <p className="mt-4 max-w-md text-base text-background/60">
            30 минут онлайн: сверим задачу, доступные источники опыта и
            возможный результат первого этапа.
          </p>

          <div className="mt-12">
            <StencilLogo className="text-[18px] text-background" />
          </div>
        </div>

        <GlassCard dark className="p-8 md:p-10">
        <form
          onSubmit={onSubmit}
          onFocusCapture={onFormFocus}
          onPointerDownCapture={onFormFocus}
          className="text-background"
        >

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-[420px] flex-col items-start justify-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-background/20 bg-background/10 text-background backdrop-blur">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-3xl font-bold text-background">
                  {sentName ? `Спасибо, ${sentName}!` : "Заявка отправлена"}
                </h3>
                <p className="mt-3 text-background/70">
                  Заявка отправлена. Ответим в течение двух рабочих часов.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-8 text-sm font-semibold text-background/80 underline-offset-4 hover:text-background hover:underline"
                >
                  Отправить ещё одну заявку
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-5"
              >
                <Field label="Ваше имя" name="name" placeholder="Ирина" dark />
                <Field label="Компания и роль" name="company" placeholder="Avito, HRD / L&D" dark />
                <Field label="Email / Telegram / телефон" name="contact" placeholder="name@company.ru" dark />
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-background/60">
                    Запрос на разбор <span className="text-background/40 normal-case tracking-normal">(не обязательно)</span>
                  </label>
                  <textarea
                    rows={3}
                    name="about"
                    placeholder="Не обязательно"
                    className="w-full resize-none rounded-xl border border-background/15 bg-background/5 px-4 py-3 text-base text-background outline-none backdrop-blur transition placeholder:text-background/35 focus:border-background/40 focus:bg-background/10"
                  />
                </div>
                <p className="hidden" aria-hidden="true">
                  <label>
                    Не заполняйте это поле
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-background/60">
                  <input
                    type="checkbox"
                    checked={pd}
                    onChange={(e) => setPd(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--red)]"
                  />
                  <span>
                    Нажимая кнопку, вы соглашаетесь на обработку персональных данных —{" "}
                    <a href="/consent_pd" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-background">условия</a>{" "}
                    и{" "}
                    <a href="/politics_pd" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-background">политика конфиденциальности</a>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-background/60">
                  <input
                    type="checkbox"
                    checked={ads}
                    onChange={(e) => setAds(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--red)]"
                  />
                  <span>Хочу получать новости и предложения «Без Воды» (необязательно)</span>
                </label>
                {err && (
                  <p className="rounded-xl border border-[color:var(--red)]/40 bg-[color:var(--red)]/15 px-4 py-3 text-sm text-background/90">
                    {err}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="group relative mt-4 inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-background/25 bg-background/10 px-7 py-4 text-base font-semibold text-background backdrop-blur-xl transition hover:border-background/50 hover:bg-background/20 disabled:cursor-default disabled:opacity-60"
                >
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 to-transparent opacity-60" />
                  <span className="relative">{sending ? "Отправляем…" : "Назначить разбор"}</span>
                  <ArrowUpRight className="relative h-5 w-5 transition group-hover:rotate-45" />
                </button>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-background/50">Ответим в течение двух рабочих часов.</p>
                  <a
                    href="https://t.me/vikki_duck"
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm font-semibold text-background/80 transition hover:text-background"
                  >
                    Спросить в Telegram
                    <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
        </GlassCard>

      </div>
    </section>
  );
}

function Field({
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
  return (
    <div>
      <label
        htmlFor={name}
        className={`mb-2 block text-xs font-semibold uppercase tracking-widest ${
          dark ? "text-background/60" : "text-muted-foreground"
        }`}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        className={
          dark
            ? "w-full rounded-xl border border-background/15 bg-background/5 px-4 py-3 text-base text-background outline-none backdrop-blur transition placeholder:text-background/35 focus:border-background/40 focus:bg-background/10"
            : "w-full border-b border-border bg-transparent py-3 text-base text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-[color:var(--red)]"
        }
      />
    </div>
  );
}

/* --------------------------------- Footer -------------------------------- */

function Footer() {
  const links = [
    ["Когда мы нужны", "#when"],
    ["Подход", "#approach"],
    ["Кейсы", "#cases"],
    ["Отзывы", "#reviews"],
    ["Книга", "#book"],
    ["FAQ", "#faq"],
    ["Контакты", "#contact"],
  ];
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <StencilLogo className="text-[16px]" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Проектная команда методологов и продактов. Превращаем экспертный
              опыт в применимый продукт.
            </p>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Навигация
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
              {links.map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="text-foreground/75 transition hover:text-[color:var(--red)]">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Связь
            </div>
            <a
              href="#contact"
              className="mt-4 inline-flex items-center gap-2 font-display text-lg font-bold text-foreground transition hover:text-[color:var(--red)]"
            >
              Написать нам
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <div className="mt-2 text-sm text-muted-foreground">
              Ответ в рабочее время в течение 2 часов
            </div>
            <ul className="mt-4 space-y-1.5 text-sm">
              <li><a href="tel:+79645842225" className="text-foreground/75 transition hover:text-[color:var(--red)]">+7 964 584 22 25</a></li>
              <li><a href="https://t.me/vikki_duck" target="_blank" rel="noreferrer" className="text-foreground/75 transition hover:text-[color:var(--red)]">Telegram: @vikki_duck</a></li>
              <li><a href="mailto:vikavika.utkina@yandex.ru" className="text-foreground/75 transition hover:text-[color:var(--red)]">vikavika.utkina@yandex.ru</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="/politics_pd" className="transition hover:text-[color:var(--red)]">Политика конфиденциальности</a>
            <a href="/consent_pd" className="transition hover:text-[color:var(--red)]">Согласие на обработку персональных данных</a>
            <a href="/pub_oferta" className="transition hover:text-[color:var(--red)]">Публичная оферта</a>
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

/* --------------------------------- Page --------------------------------- */

function CalmToggle() {
  const [calm, set] = useCalm();
  return (
    <button
      type="button"
      onClick={() => set(!calm)}
      aria-pressed={calm}
      aria-label={calm ? "Включить анимации" : "Уменьшить анимации"}
      title={calm ? "Включить анимации" : "Уменьшить анимации"}
      className="group fixed bottom-20 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-2 text-xs font-semibold text-foreground/80 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:text-foreground md:bottom-6 md:right-6"
    >
      {calm ? <Sparkles className="h-4 w-4" /> : <Waves className="h-4 w-4" />}
      <span className="hidden sm:inline">
        {calm ? "Анимации" : "Тише анимации"}
      </span>
    </button>
  );
}


function CookieBar() {
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
    <div className="fixed inset-x-3 bottom-16 z-50 mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-border/70 bg-background/90 px-4 py-3 shadow-xl shadow-black/10 backdrop-blur-xl md:bottom-4">
      <p className="flex-1 text-xs leading-relaxed text-muted-foreground">
        Мы используем cookie и Яндекс Метрику. Подробнее — в{" "}
        <a href="/politics_pd" className="underline underline-offset-2 hover:text-foreground">политике конфиденциальности</a>.
      </p>
      <button
        type="button"
        onClick={() => {
          try { window.localStorage.setItem("bv-cookie-ok", "1"); } catch {}
          setShow(false);
        }}
        className="shrink-0 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition hover:bg-[color:var(--red)]"
      >
        Понятно
      </button>
    </div>
  );
}

export default function Landing() {
  const [calm] = useCalm();
  return (
    <MotionConfig reducedMotion={calm ? "always" : "user"}>
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <main className="pb-20 md:pb-0">
          <Hero />
          <Stats />
          <Flow />
          <TrustStrip />
          <WhenNeeded />
          <Capital />
          <Approach />
          <FirstStage />
          <Cases />
          <Reviews />
          <BookSection />
          <NotFit />
          <FAQ />
          <Contact />
        </main>
        <Footer />

        <CalmToggle />
        <CookieBar />

        {/* Mobile sticky CTA */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/85 px-4 py-3 backdrop-blur-xl md:hidden">
          <a
            href="#contact"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--red)] px-5 py-3 text-sm font-semibold text-background shadow-lg shadow-[color:var(--red)]/25 transition active:scale-[0.98]"
          >
            Назначить разбор
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </MotionConfig>
  );
}

