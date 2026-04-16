import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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

function Index() {
  const [unit, setUnit] = useState<Unit>("C");
  const [raw, setRaw] = useState("100");

  const results = useMemo(() => {
    const num = parseFloat(raw);
    if (isNaN(num)) return null;
    const c = toC(num, unit);
    return { C: c, F: (c * 9) / 5 + 32, K: c + 273.15 };
  }, [raw, unit]);

  const currentSymbol = UNITS.find((u) => u.key === unit)!.symbol;

  const setQuick = (c: number) => {
    setUnit("C");
    setRaw(String(c));
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
        <section className="glass-strong mb-4 rounded-3xl p-5">
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
        </section>

        {/* Result rows */}
        <section className="mb-4 space-y-2">
          {UNITS.filter((u) => u.key !== unit).map((u) => {
            const val = results ? fmt(results[u.key]) : "—";
            return (
              <div
                key={u.key}
                className="glass flex items-center justify-between rounded-2xl px-5 py-4"
              >
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-app-muted">
                    {u.label}
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
