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
          "Convert temperatures between Celsius, Fahrenheit, and Kelvin instantly with reference points for common temperatures.",
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
    <main className="min-h-screen bg-app-bg text-app-fg">
      <div className="mx-auto max-w-[480px] px-5 py-10">
        <header className="mb-8">
          <h1 className="font-mono text-xl font-medium tracking-tight">
            temp<span className="text-app-muted">.convert</span>
          </h1>
          <p className="mt-1 text-xs text-app-muted">
            Celsius · Fahrenheit · Kelvin
          </p>
        </header>

        <section className="mb-3">
          <span className="text-xs text-app-muted">Input unit</span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {UNITS.map((u) => {
              const active = u.key === unit;
              return (
                <button
                  key={u.key}
                  onClick={() => setUnit(u.key)}
                  className={[
                    "rounded-full border px-4 py-1.5 text-[13px] transition-colors",
                    active
                      ? "border-transparent bg-app-fg text-app-bg"
                      : "border-app-border-2 bg-transparent text-app-muted hover:text-app-fg",
                  ].join(" ")}
                >
                  {u.label} {u.symbol}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-6">
          <label htmlFor="temp-input" className="mb-1.5 block text-xs text-app-muted">
            Enter temperature in {currentSymbol}
          </label>
          <input
            id="temp-input"
            type="number"
            step="0.1"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="w-full rounded-md border border-app-border bg-app-surface px-3 py-2.5 font-mono text-lg font-medium text-app-fg outline-none transition-colors focus:border-app-fg"
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
                  "rounded-md p-3 text-center transition-colors",
                  active
                    ? "border border-app-border-2 bg-app-bg"
                    : "bg-app-surface",
                ].join(" ")}
              >
                <div className="mb-1 text-[11px] text-app-muted">
                  {u.label} {u.symbol}
                </div>
                <div className="font-mono text-xl font-medium text-app-fg">
                  {val}
                </div>
              </div>
            );
          })}
        </section>

        <div className="my-8 h-px bg-app-border" />

        <section>
          <div className="mb-3 text-xs text-app-muted">Reference points</div>
          <div>
            {REFERENCES.map((r, i) => (
              <div
                key={r.label}
                className={[
                  "flex items-center justify-between py-2 text-[13px]",
                  i < REFERENCES.length - 1 ? "border-b border-app-border" : "",
                ].join(" ")}
              >
                <span className="text-app-muted">{r.label}</span>
                <span className="flex gap-2.5 font-mono text-[12px] text-app-fg">
                  <span>{r.c} °C</span>
                  <span>{r.f} °F</span>
                  <span>{r.k} K</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-12 text-[11px] text-app-muted">
          Real-time conversion · client-side only
        </footer>
      </div>
    </main>
  );
}
