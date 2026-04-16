import { useEffect, useState } from "react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallButton() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [iosHint, setIosHint] = useState(false);
  const [showIosSheet, setShowIosSheet] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already installed / running standalone
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) {
      setInstalled(true);
      return;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    // iOS doesn't fire beforeinstallprompt — show manual hint
    const ua = window.navigator.userAgent;
    const isIos = /iPad|iPhone|iPod/.test(ua) && !/CriOS|FxiOS/.test(ua);
    if (isIos) setIosHint(true);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;
  if (!deferred && !iosHint) return null;

  const handleClick = async () => {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setDeferred(null);
      return;
    }
    if (iosHint) setShowIosSheet(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="glass flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[13px] font-semibold text-app-fg transition-all duration-200 active:scale-[0.98]"
        style={{
          boxShadow:
            "0 4px 16px -8px color-mix(in oklab, var(--accent-1) 50%, transparent), inset 0 1px 0 0 var(--glass-highlight)",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
        Install app
      </button>

      {showIosSheet && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-6 backdrop-blur-sm"
          onClick={() => setShowIosSheet(false)}
        >
          <div
            className="glass-strong w-full max-w-[420px] rounded-3xl p-5 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 text-[15px] font-semibold text-app-fg">
              Install on iOS
            </div>
            <p className="text-[13px] text-app-muted">
              Tap the <span className="font-semibold text-app-fg">Share</span> button in
              Safari, then choose{" "}
              <span className="font-semibold text-app-fg">Add to Home Screen</span>.
            </p>
            <button
              onClick={() => setShowIosSheet(false)}
              className="mt-4 w-full rounded-xl py-2.5 text-[13px] font-semibold text-white"
              style={{ background: "var(--accent-1)" }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
