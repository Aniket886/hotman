<div align="center">

# 🌡️ Temperature Converter

### A beautifully crafted, mobile-first temperature converter PWA

Convert between **Celsius**, **Fahrenheit**, and **Kelvin** — instantly, elegantly, offline.

[![Live Demo](https://img.shields.io/badge/Live-Demo-10b981?style=for-the-badge)](https://hotman.lovable.app)
[![PWA](https://img.shields.io/badge/PWA-Installable-6366f1?style=for-the-badge)](https://hotman.lovable.app)
[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff6b6b?style=for-the-badge)](https://lovable.dev)

</div>

---

## ✨ Highlights

> A tiny app done **right** — fast, tactile, and full of personality.

- ⚡ **Real-time conversion** between °C, °F, and K as you type
- 🎨 **Dynamic vibe pills** — emoji + label react to the temperature (🧊 Frigid → 🔥 Scorching)
- 🌈 **Interactive spectrum bar** — drag the marker to scrub temperatures
- 📍 **Reference tick marks** at 0°, 21°, 37°, 100° for instant context
- 📋 **One-tap copy** — copy any converted value with its unit symbol
- ⚡ **Quick presets** — body temp, room temp, boiling, freezing, absolute zero
- 📱 **Installable PWA** — works offline, feels native on mobile
- 🪟 **Glass-morphism design** — frosted surfaces, subtle gradients, premium feel
- 🎯 **Mobile-first** with safe-area insets for notched devices

---

## 🎬 Preview

| Input + Vibe | Spectrum + Results |
|:---:|:---:|
| Type a value, watch the card tint shift to match the vibe | Drag the marker, see live conversions |

🔗 **Try it live:** [hotman.lovable.app](https://hotman.lovable.app)

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [TanStack Start](https://tanstack.com/start) v1 (React 19, SSR-ready) |
| **Build Tool** | [Vite](https://vitejs.dev) 7 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) v4 (native CSS theme) |
| **UI Primitives** | [shadcn/ui](https://ui.shadcn.com) + Radix |
| **Icons** | [lucide-react](https://lucide.dev) |
| **Routing** | TanStack Router (file-based) |
| **PWA** | Custom service worker + Web Manifest |
| **Deployment** | Cloudflare Workers (Edge) |
| **Language** | TypeScript (strict) |

---

## 🗂️ Project Structure

```
temperature-converter/
├── public/
│   ├── manifest.webmanifest    # PWA manifest
│   └── sw.js                   # Service worker (offline cache)
├── src/
│   ├── assets/
│   │   └── logo.png            # App logo
│   ├── components/
│   │   ├── InstallButton.tsx   # PWA install prompt
│   │   └── ui/                 # shadcn/ui primitives
│   ├── hooks/
│   │   └── use-mobile.tsx
│   ├── lib/
│   │   └── utils.ts            # cn() helper
│   ├── routes/
│   │   ├── __root.tsx          # Root layout + meta
│   │   └── index.tsx           # 🌡️ Main converter UI
│   ├── pwa-register.ts         # SW registration
│   ├── router.tsx              # Router config
│   └── styles.css              # Design tokens + keyframes
├── components.json             # shadcn config
├── vite.config.ts
├── wrangler.jsonc              # Cloudflare Workers config
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20 (or [Bun](https://bun.sh) ≥ 1.0)

### Install & Run

```bash
# Clone the repo
git clone <your-repo-url>
cd temperature-converter

# Install dependencies
bun install        # or: npm install

# Start the dev server
bun dev            # or: npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — the app hot-reloads as you edit.

### Build for Production

```bash
bun run build      # Builds to .output/
bun run preview    # Preview the production build locally
```

---

## 🎨 Design System

All visual decisions live in **`src/styles.css`** as semantic tokens:

```css
:root {
  --app-bg: oklch(...);
  --app-fg: oklch(...);
  --accent-1: oklch(...);
  --glass: ...;
  --glass-strong: ...;
  --glass-highlight: ...;
}
```

**Rules:**
- ❌ Never hardcode colors in components (`bg-white`, `text-black`)
- ✅ Always reference tokens (`bg-app-bg`, `text-app-fg`, `var(--accent-1)`)
- 🎭 Glass surfaces use `.glass` and `.glass-strong` utility classes
- ✨ Animations use CSS `@keyframes` — no animation libraries

### Vibe System

The temperature drives a "vibe" (emoji + label + tint color) that modulates the input card's background gradient and a centered pill. Buckets defined in `getVibe(c)` inside `src/routes/index.tsx`.

| Range (°C) | Vibe | Emoji |
|:---:|:---|:---:|
| ≤ −273 | Absolute Zero | ⚛️ |
| < −50 | Frigid | 🧊 |
| < 0 | Freezing | ❄️ |
| < 10 | Cold | 🥶 |
| < 18 | Chilly | 🌬️ |
| < 26 | Comfortable | 😊 |
| < 32 | Warm | ☀️ |
| < 40 | Hot | 🥵 |
| < 100 | Scorching | 🔥 |
| ≥ 100 | Boiling | 💨 |

---

## 📱 PWA Features

- 📥 **Installable** on iOS, Android, and desktop
- 📴 **Offline support** via service worker (`public/sw.js`)
- 🎨 **Themed status bar** for native feel
- 🔒 **Safe-area insets** respected on notched devices
- ⚡ **Instant load** after first visit

The `<InstallButton />` component surfaces the native install prompt when available.

---

## 🧮 Conversion Formulas

All conversions normalize through Celsius:

```ts
// To Celsius
F → C:  (F − 32) × 5/9
K → C:  K − 273.15

// From Celsius
C → F:  C × 9/5 + 32
C → K:  C + 273.15
```

---

## 🛣️ Roadmap

- [ ] 🕘 Recent conversions history (last 5 entries)
- [ ] 📤 Native share sheet for the current conversion
- [ ] 🌍 Multi-language support (i18n)
- [ ] 🎚️ Add Rankine and Réaumur scales
- [ ] 🌗 Light theme variant
- [ ] 🔔 Haptic feedback on supported devices

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repo
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Released under the **MIT License**. Free to use, modify, and distribute.

---

<div align="center">

### Crafted with ❤️ by [Aniket Tegginamath](https://github.com/Aniket886)

Built on [Lovable](https://lovable.dev) — *the fastest way to ship beautiful web apps.*

⭐ **If you like this project, give it a star!** ⭐

</div>
