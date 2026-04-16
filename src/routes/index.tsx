import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Github } from "lucide-react";
import { InstallButton } from "@/components/InstallButton";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Temperature Converter — Celsius, Fahrenheit, Kelvin" },
      {
        name: "description",
        content:
          "A professional mobile-first temperature converter. Convert Celsius, Fahrenheit, and Kelvin instantly.",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#1a1d29" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    ],
  }),
});

type Unit = "C" | "F" | "K";

const UNITS: { key: Unit; label: string; symbol: string }[] = [
  { key: "C", label: "Celsius", symbol: "°C" },
  { key: "F", label: "Fahrenheit", symbol: "°F" },
  { key: "K", label: "Kelvin", symbol: "K" },
];

const REFERENCES = [
  { label: "Water boils", c: 100 },
  { label: "Body temperature", c: 37 },
  { label: "Room temperature", c: 21 },
  { label: "Water freezes", c: 0 },
  { label: "Absolute zero", c: -273.15 },
];

const toC = (val: number, unit: Unit) => {
  if (unit === "C") return val;
  if (unit === "F") return ((val - 32) * 5) / 9;
  return val - 273.15;
};

const fmt = (n: number) => {
  if (Math.abs(n) >= 1000) return n.toFixed(1);
  return n.toFixed(2);
};

type Vibe = {
  id: string;
  emoji: string;
  label: string;
  tint: string; // "r g b"
};

const getVibe = (c: number): Vibe => {
  if (c <= -273) return { id: "absolute", emoji: "⚛️", label: "Absolute Zero", tint: "168 85 247" };
  if (c < -50) return { id: "frigid", emoji: "🧊", label: "Frigid", tint: "186 230 253" };
  if (c < 0) return { id: "freezing", emoji: "❄️", label: "Freezing", tint: "96 165 250" };
  if (c < 10) return { id: "cold", emoji: "🥶", label: "Cold", tint: "56 189 248" };
  if (c < 18) return { id: "chilly", emoji: "🌬️", label: "Chilly", tint: "34 211 238" };
  if (c < 26) return { id: "comfy", emoji: "😊", label: "Comfortable", tint: "52 211 153" };
  if (c < 32) return { id: "warm", emoji: "☀️", label: "Warm", tint: "251 191 36" };
  if (c < 40) return { id: "hot", emoji: "🥵", label: "Hot", tint: "251 146 60" };
  if (c < 100) return { id: "scorching", emoji: "🔥", label: "Scorching", tint: "248 113 113" };
  return { id: "boiling", emoji: "💨", label: "Boiling", tint: "244 114 182" };
};

function Index() {
  const [unit, setUnit] = useState<Unit>("C");
  const [raw, setRaw] = useState("100");

  const results = useMemo(() => {
    const num = parseFloat(raw);
    if (isNaN(num)) return null;
    const c = toC(num, unit);
    return { C: c, F: (c * 9) / 5 + 32, K: c + 273.15 };
  }, [raw, unit]);

  const vibe = results ? getVibe(results.C) : null;

  const currentSymbol = UNITS.find((u) => u.key === unit)!.symbol;

  const setQuick = (c: number) => {
    setUnit("C");
    setRaw(String(c));
  };

  // Spectrum drag
  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const SPEC_MIN = -50;
  const SPEC_MAX = 110;

  const fromC = (c: number, u: Unit) => {
    if (u === "C") return c;
    if (u === "F") return (c * 9) / 5 + 32;
    return c + 273.15;
  };

  const updateFromPointer = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const c = SPEC_MIN + ratio * (SPEC_MAX - SPEC_MIN);
    setRaw(fromC(c, unit).toFixed(1));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    updateFromPointer(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromPointer(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <main className="min-h-screen bg-app-bg text-app-fg">
      <div className="mx-auto flex min-h-screen max-w-[440px] flex-col px-4 safe-top safe-bottom">
        {/* Sticky app header */}
        <header className="sticky top-0 z-10 -mx-4 mb-2 flex items-center justify-between bg-app-bg/85 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white/5">
              <img
                src={logo}
                alt="Temperature Converter logo"
                width={40}
                height={40}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-[15px] font-semibold leading-tight tracking-tight">
                Temperature
              </h1>
              <p className="text-[11px] leading-tight text-app-muted">Converter</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Live
          </span>
        </header>

        {/* Unit segmented control */}
        <section className="mb-4">
          <div className="glass flex gap-1 rounded-2xl p-1">
            {UNITS.map((u) => {
              const active = u.key === unit;
              return (
                <button
                  key={u.key}
                  onClick={() => setUnit(u.key)}
                  className={[
                    "flex-1 rounded-xl py-2.5 text-[13px] font-semibold transition-all duration-200 active:scale-[0.97]",
                    active
                      ? "text-white shadow-lg"
                      : "text-app-muted hover:text-app-fg",
                  ].join(" ")}
                  style={
                    active
                      ? {
                          background: "var(--accent-1)",
                          boxShadow:
                            "0 4px 16px -4px color-mix(in oklab, var(--accent-1) 60%, transparent), inset 0 1px 0 0 var(--glass-highlight)",
                        }
                      : undefined
                  }
                >
                  {u.symbol}
                </button>
              );
            })}
          </div>
        </section>

        {/* Input card */}
        <section
          className="glass-strong relative mb-4 overflow-hidden rounded-3xl p-5 transition-[background,box-shadow] duration-700 ease-out"
          style={
            vibe
              ? {
                  background: `radial-gradient(120% 80% at 0% 0%, rgb(${vibe.tint} / 0.18) 0%, transparent 55%), radial-gradient(120% 80% at 100% 100%, rgb(${vibe.tint} / 0.10) 0%, transparent 60%), var(--glass-strong)`,
                  boxShadow: `0 8px 32px -16px rgb(${vibe.tint} / 0.45), inset 0 1px 0 0 var(--glass-highlight)`,
                }
              : undefined
          }
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-app-muted">
              Enter value
            </span>
            <span className="text-[11px] font-medium text-app-subtle">
              {UNITS.find((u) => u.key === unit)!.label}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <input
              id="temp-input"
              type="number"
              inputMode="decimal"
              step="0.1"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              className="w-full bg-transparent font-mono text-5xl font-bold tracking-tight text-app-fg outline-none placeholder:text-app-subtle [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="0"
            />
            <span className="font-mono text-2xl font-semibold text-app-muted">
              {currentSymbol}
            </span>
          </div>

          {vibe && (
            <div className="mt-4 flex justify-center">
              <div
                key={vibe.id}
                className="animate-vibe-pop inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold backdrop-blur-md"
                style={{
                  borderColor: `rgb(${vibe.tint} / 0.35)`,
                  background: `rgb(${vibe.tint} / 0.12)`,
                  color: `rgb(${vibe.tint})`,
                  boxShadow: `0 4px 16px -8px rgb(${vibe.tint} / 0.5), inset 0 1px 0 0 var(--glass-highlight)`,
                }}
              >
                <span className="text-base leading-none">{vibe.emoji}</span>
                <span className="tracking-wide">{vibe.label}</span>
              </div>
            </div>
          )}
        </section>

        {/* Temperature spectrum */}
        {results && (() => {
          const MIN = -50;
          const MAX = 110;
          const RANGE = MAX - MIN;
          const pct = (c: number) => ((c - MIN) / RANGE) * 100;
          const TICKS = [
            { c: 0, label: "0°" },
            { c: 21, label: "21°" },
            { c: 37, label: "37°" },
            { c: 100, label: "100°" },
          ];
          return (
            <section className="glass mb-4 rounded-2xl px-4 py-3.5">
              <div className="mb-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-app-muted">
                <span>−50°</span>
                <span>Spectrum</span>
                <span>110°</span>
              </div>
              <div
                className="relative cursor-pointer touch-none select-none py-3"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                role="slider"
                aria-label="Temperature spectrum"
                aria-valuemin={SPEC_MIN}
                aria-valuemax={SPEC_MAX}
                aria-valuenow={Math.round(results.C)}
              >
                <div
                  ref={trackRef}
                  className="relative h-2.5 w-full overflow-visible rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgb(186 230 253) 0%, rgb(96 165 250) 12%, rgb(56 189 248) 22%, rgb(34 211 238) 32%, rgb(52 211 153) 45%, rgb(251 191 36) 58%, rgb(251 146 60) 70%, rgb(248 113 113) 85%, rgb(244 114 182) 100%)",
                    boxShadow: "inset 0 1px 2px 0 rgba(0,0,0,0.4)",
                  }}
                >
                  {TICKS.map((t) => (
                    <div
                      key={t.c}
                      className="pointer-events-none absolute top-0 h-full"
                      style={{ left: `${pct(t.c)}%` }}
                    >
                      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/70" />
                      <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] font-medium text-app-muted">
                        {t.label}
                      </div>
                    </div>
                  ))}
                  <div
                    className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg transition-[background] duration-300 ease-out"
                    style={{
                      left: `${Math.max(0, Math.min(100, pct(results.C)))}%`,
                      background: vibe ? `rgb(${vibe.tint})` : "white",
                      boxShadow: vibe
                        ? `0 0 0 3px rgb(${vibe.tint} / 0.25), 0 2px 8px -2px rgb(${vibe.tint} / 0.6)`
                        : undefined,
                    }}
                  />
                </div>
              </div>
              <div className="mt-2 text-center font-mono text-[11px] text-app-muted">
                {fmt(results.C)} °C
              </div>
            </section>
          );
        })()}
        <section className="mb-4 space-y-2">
          {UNITS.filter((u) => u.key !== unit).map((u) => {
            const val = results ? fmt(results[u.key]) : "—";
            return (
              <div
                key={u.key}
                className="glass flex items-center justify-between rounded-2xl px-5 py-4"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-app-muted">
                    {vibe && <span className="text-sm leading-none">{vibe.emoji}</span>}
                    <span>{u.label}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-app-subtle">{u.symbol}</div>
                </div>
                <div className="font-mono text-2xl font-semibold tracking-tight text-app-fg">
                  {val}
                </div>
              </div>
            );
          })}
        </section>

        {/* Reference quick-tap */}
        <section className="glass mb-4 rounded-3xl p-5">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-wider text-app-muted">
            Quick presets
          </div>
          <div className="-mx-1">
            {REFERENCES.map((r, i) => (
              <button
                key={r.label}
                onClick={() => setQuick(r.c)}
                className={[
                  "flex w-full items-center justify-between rounded-lg px-1 py-3 text-left text-[13px] transition-colors active:bg-white/5",
                  i < REFERENCES.length - 1 ? "border-b border-white/5" : "",
                ].join(" ")}
              >
                <span className="text-app-fg">{r.label}</span>
                <span className="font-mono text-[12px] text-app-muted">
                  {r.c} °C
                </span>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-4">
          <InstallButton />
        </div>

        <footer className="mt-auto pt-4 text-center text-[11px] text-app-subtle">
          <div>Tap a preset to convert instantly</div>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            <span>Developer</span>
            <a
              href="https://github.com/Aniket886"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold underline-offset-4 hover:underline animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
              style={{ color: "var(--accent-1)" }}
            >
              <Github size={12} strokeWidth={2.2} />
              Aniket Tegginamath
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
