import { useEffect, useMemo, useState } from "react";
import { Apple, Smartphone, Monitor, Download, X } from "lucide-react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Platform = "ios" | "android" | "desktop";

export function InstallButton() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [openSheet, setOpenSheet] = useState<Platform | null>(null);
  const [detected, setDetected] = useState<Platform>("desktop");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) {
      setInstalled(true);
      return;
    }

    const ua = window.navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) setDetected("ios");
    else if (/Android/.test(ua)) setDetected("android");
    else setDetected("desktop");

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
      setOpenSheet(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const firePrompt = async () => {
    if (!deferred) return false;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferred(null);
    return true;
  };

  const handlePillClick = async (p: Platform) => {
    // For Android/Desktop, if we have a native prompt available, fire it directly.
    if ((p === "android" || p === "desktop") && deferred) {
      const fired = await firePrompt();
      if (fired) return;
    }
    setOpenSheet(p);
  };

  const pills = useMemo(
    () =>
      [
        { key: "ios" as const, label: "iOS", Icon: Apple },
        { key: "android" as const, label: "Android", Icon: Smartphone },
        { key: "desktop" as const, label: "Desktop", Icon: Monitor },
      ],
    [],
  );

  if (installed) return null;

  return (
    <>
      <div className="w-full">
        <div className="mb-2 flex items-center gap-1.5 px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-app-muted">
          <Download size={11} aria-hidden="true" />
          Install app
        </div>

        <div className="grid grid-cols-3 gap-2">
          {pills.map(({ key, label, Icon }) => {
            const isRecommended = key === detected;
            return (
              <button
                key={key}
                onClick={() => handlePillClick(key)}
                className="glass relative flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-[12px] font-semibold text-app-fg transition-all duration-200 active:scale-[0.97]"
                style={
                  isRecommended
                    ? {
                        borderColor:
                          "color-mix(in oklab, var(--accent-1) 55%, transparent)",
                        boxShadow:
                          "0 4px 18px -8px color-mix(in oklab, var(--accent-1) 60%, transparent), inset 0 1px 0 0 var(--glass-highlight)",
                      }
                    : {
                        boxShadow: "inset 0 1px 0 0 var(--glass-highlight)",
                      }
                }
                aria-label={`Install on ${label}`}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
                {isRecommended && (
                  <span
                    className="absolute -top-1.5 right-1.5 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white"
                    style={{ background: "var(--accent-1)" }}
                  >
                    For you
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {openSheet && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-6 backdrop-blur-sm"
          onClick={() => setOpenSheet(null)}
        >
          <div
            className="glass-strong relative w-full max-w-[420px] rounded-3xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenSheet(null)}
              className="absolute right-3 top-3 rounded-full p-1.5 text-app-muted transition-colors hover:text-app-fg"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <InstallSheetContent
              platform={openSheet}
              hasDeferred={!!deferred}
              onInstall={firePrompt}
            />
          </div>
        </div>
      )}
    </>
  );
}

function InstallSheetContent({
  platform,
  hasDeferred,
  onInstall,
}: {
  platform: Platform;
  hasDeferred: boolean;
  onInstall: () => Promise<boolean>;
}) {
  const meta = {
    ios: { Icon: Apple, title: "Install on iOS" },
    android: { Icon: Smartphone, title: "Install on Android" },
    desktop: { Icon: Monitor, title: "Install on Desktop" },
  }[platform];

  const Icon = meta.Icon;

  const steps: { text: React.ReactNode }[] =
    platform === "ios"
      ? [
          {
            text: (
              <>
                Open this page in <strong className="text-app-fg">Safari</strong>{" "}
                (not Chrome or Firefox).
              </>
            ),
          },
          {
            text: (
              <>
                Tap the <strong className="text-app-fg">Share</strong> button (square
                with an arrow pointing up) at the bottom of the screen.
              </>
            ),
          },
          {
            text: (
              <>
                Scroll and tap{" "}
                <strong className="text-app-fg">Add to Home Screen</strong>.
              </>
            ),
          },
          {
            text: (
              <>
                Tap <strong className="text-app-fg">Add</strong> in the top right.
              </>
            ),
          },
        ]
      : platform === "android"
        ? [
            {
              text: (
                <>
                  Open this page in <strong className="text-app-fg">Chrome</strong>{" "}
                  or <strong className="text-app-fg">Edge</strong>.
                </>
              ),
            },
            {
              text: (
                <>
                  Tap the <strong className="text-app-fg">⋮ menu</strong> in the top
                  right corner.
                </>
              ),
            },
            {
              text: (
                <>
                  Choose{" "}
                  <strong className="text-app-fg">Install app</strong> or{" "}
                  <strong className="text-app-fg">Add to Home Screen</strong>.
                </>
              ),
            },
            {
              text: (
                <>
                  Confirm by tapping <strong className="text-app-fg">Install</strong>.
                </>
              ),
            },
          ]
        : [
            {
              text: (
                <>
                  Use <strong className="text-app-fg">Chrome</strong>,{" "}
                  <strong className="text-app-fg">Edge</strong>, or{" "}
                  <strong className="text-app-fg">Brave</strong>.
                </>
              ),
            },
            {
              text: (
                <>
                  Click the <strong className="text-app-fg">install icon</strong> on
                  the right side of the address bar (a small monitor with a down
                  arrow).
                </>
              ),
            },
            {
              text: (
                <>
                  Or open the <strong className="text-app-fg">⋮ menu</strong> →{" "}
                  <strong className="text-app-fg">Install Temperature Converter</strong>.
                </>
              ),
            },
            {
              text: (
                <>
                  Click <strong className="text-app-fg">Install</strong> in the
                  confirmation dialog.
                </>
              ),
            },
          ];

  const canInstallNative = hasDeferred && platform !== "ios";

  return (
    <div className="text-left">
      <div className="mb-3 flex items-center gap-2">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{
            background: "color-mix(in oklab, var(--accent-1) 18%, transparent)",
            color: "var(--accent-1)",
          }}
        >
          <Icon size={18} aria-hidden="true" />
        </span>
        <div className="text-[15px] font-semibold text-app-fg">{meta.title}</div>
      </div>

      <ol className="space-y-2.5">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 text-[13px] leading-relaxed text-app-muted">
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums"
              style={{
                background:
                  "color-mix(in oklab, var(--accent-1) 16%, transparent)",
                color: "var(--accent-1)",
              }}
            >
              {i + 1}
            </span>
            <span>{s.text}</span>
          </li>
        ))}
      </ol>

      {canInstallNative && (
        <button
          onClick={async () => {
            await onInstall();
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-white transition-transform active:scale-[0.98]"
          style={{ background: "var(--accent-1)" }}
        >
          <Download size={14} aria-hidden="true" />
          Install now
        </button>
      )}

      {platform === "ios" && (
        <p className="mt-4 rounded-xl px-3 py-2 text-[11px] leading-relaxed text-app-muted"
          style={{
            background: "color-mix(in oklab, var(--accent-1) 8%, transparent)",
          }}
        >
          iOS only allows installation from Safari. Installed apps run fullscreen
          with their own home-screen icon.
        </p>
      )}
    </div>
  );
}
