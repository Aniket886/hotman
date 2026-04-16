
User wants a modern glassmorphism redesign of the temperature converter. Current design is minimal/flat. I'll transform it into a frosted-glass aesthetic.

**Design direction**
- Vibrant gradient background (animated soft blobs) so glass effect is visible
- Frosted glass panels: `backdrop-blur`, semi-transparent white/dark surfaces, subtle inner border highlight, soft shadows
- Glow accents on the active unit pill and active result card
- Keep JetBrains Mono for numbers; Inter for UI
- Light + dark mode both look great (default to dark since glass pops more on dark gradients)

**Changes**
1. `src/styles.css`
   - Switch default theme to dark glass palette
   - New tokens: `--glass-bg`, `--glass-border`, `--glass-highlight`, `--glow`, gradient stops
   - Add body background: layered radial gradients (purple/blue/pink blobs) + subtle noise
   - Add `.glass` utility-ish base via tokens

2. `src/routes/index.tsx`
   - Wrap main card in a frosted glass container
   - Pill buttons: glass with active state showing inner glow + gradient border
   - Input: translucent with backdrop blur, glowing focus ring
   - Result cards: each is its own glass tile; active card gets accent gradient border + glow
   - Reference table: glass panel with divider lines using border-white/10
   - Animated floating gradient blobs behind everything (absolute positioned divs, blurred)
   - Add subtle hover lift on cards

**Layout** stays the same (header, unit selector, input, 3 result tiles, reference list, footer) — only visual treatment changes. Mobile responsiveness preserved.

No new dependencies needed.
