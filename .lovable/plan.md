
Add a dynamic emoji + label reaction that appears in the input card based on the converted Celsius value, giving instant visual feedback as the user types.

**Where it goes**
Inside the input card (`src/routes/index.tsx`), just below the big number input — a small animated pill showing emoji + short descriptor (e.g. "🥵 Scorching"). Subtle scale/fade transition when the bucket changes so it feels alive.

**Temperature buckets (based on Celsius)**
- `< -50` → 🧊 Frigid (icy blue)
- `-50 to 0` → ❄️ Freezing (blue)
- `0 to 10` → 🥶 Cold (sky)
- `10 to 18` → 🌬️ Chilly / Windy (cyan)
- `18 to 26` → 😊 Comfortable (emerald)
- `26 to 32` → ☀️ Warm (amber)
- `32 to 40` → 🥵 Hot (orange)
- `> 40` → 🔥 Scorching (red)
- Special: `≥ 100` → 💨 Boiling (steam), `≤ -273` → ⚛️ Absolute Zero

**Interaction details**
- Pill uses glass styling consistent with the rest of the app
- Color tint changes per bucket (border + bg use the bucket's accent at low opacity)
- Emoji gets a gentle bounce/wiggle animation on bucket change (key-based remount triggers CSS animation)
- Hidden when input is empty/invalid

**Bonus polish**
- Add the same emoji as a tiny prefix on each result row's label so the vibe is consistent across units
- Keep everything CSS-only, no new deps

**Files to edit**
- `src/routes/index.tsx` — add `getVibe(c)` helper, render reaction pill below input, key-based animation
- `src/styles.css` — add a small `@keyframes` (wiggle/pop) utility class

That's the whole change — purely additive, no layout shifts, mobile-first preserved.
