import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Temperature Converter — Celsius, Fahrenheit, Kelvin" },
      {
        name: "description",
        content:
          "Convert temperatures between Celsius, Fahrenheit, and Kelvin instantly with a modern glassmorphism interface.",
      },
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
  { label: "Water boils", c: 100, f: 212, k: 373.15 },
  { label: "Body temp", c: 37, f: 98.6, k: 310.15 },
  { label: "Water freezes", c: 0, f: 32, k: 273.15 },
  { label: "Absolute zero", c: -273.15, f: -459.67, k: 0 },
];

const toC = (val: number, unit: Unit) => {
  if (unit === "C") return val;
  if (unit === "F") return ((val - 32) * 5) / 9;
  return val - 273.15;
};

const fmt = (n: number) => n.toFixed(2);

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

  return (
    <main className="relative min-h-screen overflow-hidden bg-app-bg text-app-fg">
      {/* Ambient gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="animate-blob absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full opacity-50 blur-3xl"
          style={{ background: "var(--accent-1)" }}
        />
        <div
          className="animate-blob absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--accent-2)", animationDelay: "-6s" }}
        />
        <div
          className="animate-blob absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--accent-3)", animationDelay: "-12s" }}
        />
      </div>

      <div className="relative mx-auto max-w-[520px] px-5 py-10 sm:py-16">
        <header className="mb-8 text-center">
          <h1 className="font-mono text-2xl font-semibold tracking-tight">
            temp<span className="text-app-muted">.convert</span>
          </h1>
          <p className="mt-1.5 text-xs text-app-muted">
            Celsius · Fahrenheit · Kelvin
          </p>
        </header>

        <div className="glass-strong rounded-3xl p-6 sm:p-7">
          <section className="mb-5">
            <span className="text-[11px] uppercase tracking-wider text-app-muted">
              Input unit
            </span>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {UNITS.map((u) => {
                const active = u.key === unit;
                return (
                  <button
                    key={u.key}
                    onClick={() => setUnit(u.key)}
                    className={[
                      "relative rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300",
                      active
                        ? "text-app-fg shadow-[0_0_24px_-4px_var(--accent-1)]"
                        : "glass text-app-muted hover:text-app-fg hover:-translate-y-0.5",
                    ].join(" ")}
                    style={
                      active
                        ? {
                            background:
                              "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
                            border: "1px solid var(--glass-highlight)",
                          }
                        : undefined
                    }
                  >
                    {u.label} {u.symbol}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mb-6">
            <label
              htmlFor="temp-input"
              className="mb-2 block text-[11px] uppercase tracking-wider text-app-muted"
            >
              Enter temperature in {currentSymbol}
            </label>
            <input
              id="temp-input"
              type="number"
              step="0.1"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              className="glass w-full rounded-2xl px-4 py-3.5 font-mono text-2xl font-semibold text-app-fg outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent-2)_40%,transparent),0_0_40px_-8px_var(--accent-2)]"
            />
          </section>

          <section className="grid grid-cols-3 gap-2.5">
            {UNITS.map((u) => {
              const active = u.key === unit;
              const val = results ? fmt(results[u.key]) : "—";
              return (
                <div
                  key={u.key}
                  className={[
                    "glass relative overflow-hidden rounded-2xl p-3.5 text-center transition-all duration-300 hover:-translate-y-0.5",
                    active ? "shadow-[0_0_30px_-8px_var(--accent-1)]" : "",
                  ].join(" ")}
                  style={
                    active
                      ? {
                          background:
                            "linear-gradient(135deg, color-mix(in oklab, var(--accent-1) 22%, transparent), color-mix(in oklab, var(--accent-2) 18%, transparent))",
                          borderColor: "var(--glass-highlight)",
                        }
                      : undefined
                  }
                >
                  <div className="mb-1 text-[10px] uppercase tracking-wider text-app-muted">
                    {u.label} {u.symbol}
                  </div>
                  <div className="font-mono text-xl font-semibold text-app-fg">
                    {val}
                  </div>
                </div>
              );
            })}
          </section>
        </div>

        <section className="glass mt-6 rounded-3xl p-6">
          <div className="mb-3 text-[11px] uppercase tracking-wider text-app-muted">
            Reference points
          </div>
          <div>
            {REFERENCES.map((r, i) => (
              <div
                key={r.label}
                className={[
                  "flex items-center justify-between py-2.5 text-[13px]",
                  i < REFERENCES.length - 1
                    ? "border-b border-white/10"
                    : "",
                ].join(" ")}
              >
                <span className="text-app-muted">{r.label}</span>
                <span className="flex gap-2.5 font-mono text-[12px] text-app-fg">
                  <span>{r.c} °C</span>
                  <span className="text-app-muted">·</span>
                  <span>{r.f} °F</span>
                  <span className="text-app-muted">·</span>
                  <span>{r.k} K</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-10 text-center text-[11px] text-app-muted">
          Real-time conversion · client-side only
        </footer>
      </div>
    </main>
  );
}
