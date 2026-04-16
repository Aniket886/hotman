
Build a temperature converter web app based on your uploaded HTML design.

**Features**
- Input unit selector: Celsius, Fahrenheit, Kelvin (pill buttons)
- Numeric input with live conversion as you type
- Three result cards showing all three units side-by-side, with the active input unit highlighted
- Reference table of common temperatures (freezing point, body temp, boiling point, absolute zero, etc.) shown in all three units
- Clean, minimal layout with monospace numbers, matching the uploaded design

**Pages**
- Single page at `/` (replaces the placeholder index)

**Design**
- Minimal, typography-focused aesthetic from your HTML mock
- Monospace font for numbers (JetBrains Mono via Google Fonts)
- Light, neutral palette with subtle borders and rounded cards
- Responsive: results grid collapses gracefully on mobile

**Tech**
- TanStack Start route with React state for live conversion
- Tailwind tokens mapped to the CSS variables your mock used (background-secondary, border-tertiary, text-secondary, etc.) so the look matches
- No backend needed — pure client-side math
