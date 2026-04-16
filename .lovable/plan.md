
Replace the single `InstallButton` with three platform-specific install pills (iOS, Android, Desktop) above the footer. Each opens a bottom sheet with platform-tailored instructions. Use the existing `beforeinstallprompt` flow for Android/Desktop where available, and manual "Add to Home Screen" instructions for iOS.

**Where**
- `src/components/InstallButton.tsx` — rewrite to render a 3-pill row + per-platform instruction sheets.
- Used in `src/routes/index.tsx` (already placed above footer — no change needed there).

**Pills**
Three glass pills in a horizontal row (grid-cols-3, gap-2). Each shows a platform icon + label:
- 🍎 iOS (Apple icon)
- 🤖 Android (smartphone icon)
- 💻 Desktop (monitor icon)

Tap → opens bottom sheet with that platform's instructions. The user's *detected* platform pill gets a subtle accent glow + "Recommended" micro-label so they know which one applies to them.

**Detection logic**
- iOS: `/iPad|iPhone|iPod/.test(ua)`
- Android: `/Android/.test(ua)`
- Desktop: neither
- If `beforeinstallprompt` was captured AND user taps Android or Desktop pill → fire native prompt directly (skip sheet).
- If already installed (standalone display-mode) → hide the whole section.

**Sheet content (per platform)**

*iOS (Safari)*
1. Tap the Share button (square + arrow up) at the bottom
2. Scroll and tap "Add to Home Screen"
3. Tap "Add" in the top right
Note: Must be opened in Safari, not Chrome/Firefox on iOS.

*Android (Chrome/Edge)*
- If `deferred` available: "Install now" button → fires native prompt
- Else manual: Tap ⋮ menu → "Install app" / "Add to Home Screen"

*Desktop (Chrome/Edge/Brave)*
- If `deferred` available: "Install now" button → fires native prompt
- Else manual: Click the install icon in the address bar, or ⋮ menu → "Install Temperature Converter"

**Visual style**
- Reuse existing `glass` / `glass-strong` classes
- Active/recommended pill: `var(--accent-1)` border + soft glow (matches existing accent treatment)
- Sheet: same bottom-sheet pattern already used for iOS hint (rounded-3xl, glass-strong, click-outside to close)
- Each instruction step in a numbered list with mono-style numerals in accent color

**Section header**
Small label above the pills: "Install app" with a download icon, matching the "Quick presets" / uppercase tracking style used elsewhere.

**No new deps** — all icons already available via `lucide-react` (Apple, Smartphone, Monitor, Download, X).

**Files to edit**
- `src/components/InstallButton.tsx` — full rewrite (component name & export stay the same so `index.tsx` import is untouched)
