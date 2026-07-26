/* ============================================================================
   core.tsx — общее ядро многостраничника: калм-режим, метрика, стекло, сферы,
   навигация, футер, обёртка страницы. Примитивы перенесены 1:1 из сборки
   Lovable Виктории (Expert Compass v2), меню и футер — по ТЗ v3 от 26.07.
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
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight, ArrowRight, Plus, Check, Waves, Sparkles, ExternalLink } from "lucide-react";

export { motion, AnimatePresence, useMotionValue, useSpring, useTransform };
export { ArrowUpRight, ArrowRight, Plus, Check, Waves, Sparkles, ExternalLink };
export { useRef, useState, useEffect };
export type { ReactNode, CSSProperties };

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



/* ----------------------------- Small helpers ----------------------------- */

export function StencilLogo({ className = "" }: { className?: string }) {
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

export function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
      <span className="font-display text-[color:var(--red)]">{n}</span>
      <span className="h-px w-10 bg-border" />
      <span>{children}</span>
    </div>
  );
}

/* ------------------------------- Spheres -------------------------------- */

export function Sphere({
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

export function GlassCard({
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

export function LiquidOrb({ size = 380, className = "" }: { size?: number; className?: string }) {
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

export function LiquidDrop({
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

export function AmbientHalo({
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
        opacity: calm ? opacity * 0.4 : opacity * 0.65,
        animation: calm ? undefined : "breathe 9s ease-in-out infinite",
      }}
    />
  );
}

/* --------------------------- MeetingSpheres ---------------------------- */
/* «От встреч рождается новая вселенная», v3 — «залипательный» режим:
   — каждое касание двух шариков рождает третий, цвет = смесь родителей;
   — при рождении: белая вспышка + расходящееся кольцо + короткая «нить»
     между родителями (визуально видно момент слияния);
   — все шарики мягко притягиваются друг к другу (лёгкая гравитация) —
     встречи происходят часто и естественно;
   — популяция удерживается: старшие «дети» плавно растворяются, чтобы
     дать место новым; родители-«предки» вечны.
   Canvas, pointer-events: none; в калм-режиме не рендерится. */

type SphereRGB = [number, number, number];

export function MeetingSpheres({ className = "" }: { className?: string }) {
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

    const LAV: SphereRGB = [153, 146, 165];       // #9992A5
    const CHROME: SphereRGB = [167, 169, 174];    // хром/серебро
    const LAV_LIGHT: SphereRGB = [201, 196, 210]; // #C9C4D2
    const BERRY: SphereRGB = [137, 41, 63];       // #89293F — редкий бордовый предок

    type Orb = {
      id: number;
      r: number; x: number; y: number; vx: number; vy: number;
      homeX: number; homeY: number; ampX: number; ampY: number;
      freqX: number; freqY: number; phaseX: number; phaseY: number;
      born: number; opacity: number; color: SphereRGB;
      growT?: number; growTarget?: number; dying?: boolean; isParent?: boolean;
    };
    let orbSeq = 0;

    const zone = () => ({ x0: W * 0.62, x1: W * 0.94, y0: H * 0.08, y1: H * 0.88 });
    const makeOrb = (color: SphereRGB, r: number, cx?: number, cy?: number): Orb => {
      const z = zone();
      const x = cx ?? rand(z.x0 + r, z.x1 - r);
      const y = cy ?? rand(z.y0 + r, z.y1 - r);
      return {
        id: ++orbSeq,
        r, x, y, vx: 0, vy: 0,
        homeX: x, homeY: y,
        ampX: rand(W * 0.06, W * 0.14), ampY: rand(H * 0.12, H * 0.26),
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
    orbsInit.push(Object.assign(makeSpaced(LAV, rand(40, 50), orbsInit), { isParent: true }));
    orbsInit.push(Object.assign(makeSpaced(CHROME, rand(32, 42), orbsInit), { isParent: true }));
    orbsInit.push(Object.assign(makeSpaced(LAV_LIGHT, rand(22, 30), orbsInit), { isParent: true }));
    orbsInit.push(Object.assign(makeSpaced(BERRY, rand(18, 24), orbsInit), { isParent: true }));
    let orbs: Orb[] = orbsInit;
    const MAX_ORBS = 11;

    type Flash = { x: number; y: number; t0: number; color: SphereRGB; r: number };
    let flashes: Flash[] = [];
    type Link = { a: Orb; b: Orb; t0: number; color: SphereRGB };
    let links: Link[] = [];
    const lastPairBirth = new Map<string, number>(); // per-pair cooldown, чтоб не спамили

    const birth = (a: Orb, b: Orb, now: number) => {
      const nx = (a.x * b.r + b.x * a.r) / (a.r + b.r);
      const ny = (a.y * b.r + b.y * a.r) / (a.r + b.r);
      const color = mixRGB(a.color, b.color);
      const targetR = rand(14, 22);
      flashes.push({ x: nx, y: ny, t0: now, color, r: targetR });
      links.push({ a, b, t0: now, color });
      const nb = makeOrb(color, targetR, nx, ny);
      nb.growT = now;
      nb.growTarget = targetR;
      nb.r = 2;
      nb.vx = rand(-0.8, 0.8);
      nb.vy = rand(-0.8, 0.8);
      orbs.push(nb);
      // держим популяцию: всё сверх MAX_ORBS — старшие дети растворяются
      let excess = orbs.filter((o) => !o.dying).length - MAX_ORBS;
      // сначала гасим самых старых детей
      const kids = orbs.filter((o) => !o.isParent && !o.dying).sort((x, y) => x.born - y.born);
      for (const kid of kids) {
        if (excess <= 0) break;
        if (kid !== nb) { kid.dying = true; excess--; }
      }
    };

    const drawOrb = (o: Orb) => {
      if (o.opacity <= 0.01 || o.r <= 0.5) return;
      ctx.save();
      ctx.globalAlpha = o.opacity;
      // мягкое цветное свечение вокруг — «липкость»
      ctx.shadowColor = css(o.color, 0.55);
      ctx.shadowBlur = o.r * 1.4;
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
      ctx.shadowBlur = 0;
      ctx.globalAlpha = o.opacity * 0.45;
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

      // лёгкая взаимная гравитация — шарики сами тянутся друг к другу
      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          const a = orbs[i], b = orbs[j];
          if (a.dying || b.dying) continue;
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.001;
          if (d > a.r + b.r + 6 && d < 380) {
            const f = 0.010 * dt / (d * 0.6);
            a.vx += (dx / d) * f * b.r * 0.08;
            a.vy += (dy / d) * f * b.r * 0.08;
            b.vx -= (dx / d) * f * a.r * 0.08;
            b.vy -= (dy / d) * f * a.r * 0.08;
          }
        }
      }

      orbs.forEach((o) => {
        if (o.growT != null && o.growTarget != null) {
          const u = clamp01((now - o.growT) / 900);
          o.r = 2 + (o.growTarget - 2) * easeOut(u);
          if (u >= 1) { o.growT = undefined; }
        }
        const t = now - o.born;
        const tx = o.homeX + o.ampX * Math.sin(o.freqX * t + o.phaseX);
        const ty = o.homeY + o.ampY * Math.cos(o.freqY * t + o.phaseY);
        const k = 0.00028;
        o.vx += (tx - o.x) * k * dt;
        o.vy += (ty - o.y) * k * dt;
        if (o.x < z.x0 + o.r) o.vx += (z.x0 + o.r - o.x) * 0.0005 * dt;
        if (o.x > z.x1 - o.r) o.vx -= (o.x - (z.x1 - o.r)) * 0.0005 * dt;
        if (o.y < z.y0 + o.r) o.vy += (z.y0 + o.r - o.y) * 0.0005 * dt;
        if (o.y > z.y1 - o.r) o.vy -= (o.y - (z.y1 - o.r)) * 0.0005 * dt;
        const damp = Math.pow(0.94, dt / 16);
        o.vx *= damp; o.vy *= damp;
        // ограничение скорости — не разлетаются в стороны
        const sp = Math.hypot(o.vx, o.vy);
        const MAXV = 2.4;
        if (sp > MAXV) { o.vx = (o.vx / sp) * MAXV; o.vy = (o.vy / sp) * MAXV; }
        o.x += o.vx * (dt / 16);
        o.y += o.vy * (dt / 16);
        if (o.dying) {
          o.opacity = Math.max(0, o.opacity - 0.008 * (dt / 16));
        } else {
          o.opacity = Math.min(1, o.opacity + 0.02 * (dt / 16));
        }
      });
      orbs = orbs.filter((o) => !(o.dying && o.opacity <= 0));

      // столкновения: каждое касание = рождение (при наличии места + per-pair cooldown)
      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          const a = orbs[i], b = orbs[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const minD = a.r + b.r + 2;
          if (dist < minD) {
            const nx = dx / dist, ny = dy / dist;
            const overlap = minD - dist;
            const wa = b.r / (a.r + b.r), wb = a.r / (a.r + b.r);
            a.x -= nx * overlap * 0.5 * wa; a.y -= ny * overlap * 0.5 * wa;
            b.x += nx * overlap * 0.5 * wb; b.y += ny * overlap * 0.5 * wb;
            const key = a.id < b.id ? `${a.id}-${b.id}` : `${b.id}-${a.id}`;
            const lastB = lastPairBirth.get(key) ?? -Infinity;
            const growing = a.growT != null || b.growT != null;
            if (!growing && !a.dying && !b.dying
              && orbs.filter((o) => !o.dying).length < MAX_ORBS
              && now - lastB > 1400) {
              lastPairBirth.set(key, now);
              birth(a, b, now);
              // мягкий разлёт — эстетика «поцелуя», не отскока
              a.vx -= nx * 0.6; a.vy -= ny * 0.6;
              b.vx += nx * 0.6; b.vy += ny * 0.6;
            } else {
              // мягкий отскок в кулдаун
              const imp = overlap * 0.010 * dt;
              a.vx -= nx * imp * wa; a.vy -= ny * imp * wa;
              b.vx += nx * imp * wb; b.vy += ny * imp * wb;
            }
          }
        }
      }

      // «нить» между родителями в момент рождения
      links = links.filter((l) => {
        const u = (now - l.t0) / 520;
        if (u >= 1) return false;
        ctx.save();
        ctx.globalAlpha = (1 - u) * 0.7;
        ctx.strokeStyle = css(lighten(l.color, 0.6));
        ctx.lineWidth = 1.5 * (1 - u * 0.8);
        ctx.shadowColor = css(l.color, 0.8);
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(l.a.x, l.a.y);
        ctx.lineTo(l.b.x, l.b.y);
        ctx.stroke();
        ctx.restore();
        return true;
      });

      // вспышка + расходящееся кольцо
      flashes = flashes.filter((f) => {
        const u = (now - f.t0) / 900;
        if (u >= 1) return false;
        ctx.save();
        // мягкая заливка
        ctx.globalAlpha = (1 - u) * 0.9;
        const R = 20 + u * 90;
        const fg = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, R);
        fg.addColorStop(0, "rgba(255,255,255,0.95)");
        fg.addColorStop(0.4, css(lighten(f.color, 0.5), 0.5));
        fg.addColorStop(1, css(lighten(f.color, 0.5), 0));
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.arc(f.x, f.y, R, 0, Math.PI * 2);
        ctx.fill();
        // расходящееся кольцо
        ctx.globalAlpha = (1 - u) * 0.9;
        ctx.strokeStyle = css(lighten(f.color, 0.35));
        ctx.lineWidth = 1.4 * (1 - u);
        ctx.shadowColor = css(f.color, 0.8);
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r + u * 70, 0, Math.PI * 2);
        ctx.stroke();
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
    <div
      className={`pointer-events-none sticky top-0 z-0 -mb-[100vh] h-screen w-full ${className}`}
      aria-hidden
    >
      <canvas ref={ref} className="block h-full w-full" />
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
        className={`mb-2 block text-xs font-semibold uppercase tracking-widest ${
          dark ? "text-background/60" : "text-muted-foreground"
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
            ? "w-full rounded-xl border border-background/15 bg-background/5 px-4 py-3 text-base text-background outline-none backdrop-blur transition placeholder:text-background/35 focus:border-background/40 focus:bg-background/10"
            : "w-full border-b border-border bg-transparent py-3 text-base text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-[color:var(--red)]"
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
      className="group fixed bottom-20 right-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/75 text-foreground/70 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:text-foreground md:bottom-6 md:right-6"
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
      className="fixed inset-x-3 bottom-20 z-50 mx-auto flex max-w-lg items-center gap-3 rounded-full border border-border/60 bg-background/85 py-2 pl-4 pr-2 backdrop-blur-2xl md:bottom-6 md:left-1/2 md:right-auto md:-translate-x-1/2"
      style={{ boxShadow: "0 12px 40px -16px rgba(4,6,9,0.25)" }}
    >
      <p className="flex-1 text-[12px] leading-snug text-muted-foreground">
        Мы используем cookie и Яндекс Метрику ·{" "}
        <a href="/politics_pd" className="underline underline-offset-2 hover:text-foreground">политика</a>
      </p>
      <button
        type="button"
        onClick={() => {
          try { window.localStorage.setItem("bv-cookie-ok", "1"); } catch {}
          setShow(false);
        }}
        className="shrink-0 rounded-full bg-foreground px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-background transition hover:bg-[color:var(--red)]"
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
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/92 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8 md:py-4">
        <a href="/" className="text-foreground shrink-0" aria-label="БЕЗ ВОДЫ — на главную">
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
                className={`group relative rounded-full px-3.5 py-1.5 transition-colors duration-300 ${
                  active ? "text-foreground" : "text-foreground/60 hover:text-foreground"
                }`}
              >
                <span className="relative z-10">{label}</span>
                <span
                  className={`absolute inset-0 -z-0 rounded-full bg-secondary transition-all duration-300 ${
                    active ? "scale-100 opacity-100" : "scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                  }`}
                />
              </a>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={ctaHref(path)}
            className="group hidden shrink-0 items-center gap-2 rounded-full bg-[color:var(--red)] px-4 py-2 text-[12px] font-semibold tracking-wide text-background transition-all duration-300 hover:bg-foreground sm:inline-flex md:px-5 md:py-2.5 md:text-[13px]"
          >
            <span>{CTA_LABEL}</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <button
            type="button"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary md:hidden"
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
        className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-px origin-left bg-[color:var(--red)]"
        style={{ transform: `scaleX(${progress})`, opacity: progress > 0.005 ? 1 : 0 }}
      />

      {open && (
        <nav className="border-t border-border bg-background px-5 pb-6 pt-2 md:hidden">
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="flex items-center justify-between border-b border-border/60 py-3.5 text-[15px] font-medium text-foreground/80"
            >
              {label}
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
          <a
            href={ctaHref(path)}
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[color:var(--red)] px-5 py-3 text-[13px] font-semibold text-background"
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
    ["Аргументы для руководителя", "/for-your-boss"],
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
              {nav.map(([label, href]) => (
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
              href="/contacts"
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
              <li><a href="mailto:vu@withoutwater.ru" className="text-foreground/75 transition hover:text-[color:var(--red)]">vu@withoutwater.ru</a></li>
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

/* ------------------------------ PageShell -------------------------------- */
/* Общая обёртка каждой страницы: шапка, футер, калм-переключатель, cookie-бар,
   липкая мобильная CTA. */

export function PageShell({ path, children }: { path: string; children: ReactNode }) {
  const [calm] = useCalm();
  return (
    <MotionConfig reducedMotion={calm ? "always" : "user"}>
      <div className="min-h-screen bg-background text-foreground">
        <Nav path={path} />
        <main className="pb-20 md:pb-0">{children}</main>
        <Footer />

        <CalmToggle />
        <CookieBar />

        {/* Mobile sticky CTA */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-background/85 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur-2xl md:hidden">
          <a
            href={ctaHref(path)}
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[color:var(--red)] px-5 py-3.5 text-[13px] font-semibold tracking-wide text-background transition active:scale-[0.98]"
            style={{ boxShadow: "0 1px 0 0 rgba(255,255,255,0.15) inset, 0 10px 24px -10px color-mix(in oklab, var(--red) 55%, transparent)" }}
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
      <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        <span className="h-px w-8 bg-foreground/25" />
        <span>{kicker}</span>
      </div>
      <RevealHeading as="h1" className="mt-5 max-w-4xl font-display text-[30px] font-extrabold leading-[1.12] tracking-[-0.03em] sm:text-[40px] sm:leading-[1.08] md:text-[52px] md:leading-[1.05]">
        {title}
      </RevealHeading>
      {lead && (
        <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-muted-foreground md:text-lg">
          {lead}
        </p>
      )}
    </div>
  );
}
