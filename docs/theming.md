# Theming & UI System

## Goals
- Prevent hydration mismatches
- Provide accessible dark/light/system modes
- Allow future extension (contrast, compact mode, accent color)

## Mechanism
1. Inline script in `app/layout.tsx` sets initial `data-theme` / root class before React hydration.
2. `ThemeContext` (or successor) manages runtime changes & persistence via `localStorage`.
3. Tailwind uses `class` strategy (`dark` class on `<html>` or `<body>`).

## Files of Interest
- `app/globals.css` – Tailwind base + CSS variables
- `tailwind.config.ts` – Theme extensions
- `components/ThemeToggle` – User-facing toggle
- Planned: `components/AnimatedThemeToggler` (framer-motion)

## Avoiding Hydration Issues
- Never conditionally render theme-marked DOM before mount—guard with a `mounted` flag.
- Keep initial inline script logic minimal & side-effect free beyond class assignment.

## Adding a New Theme Variant
1. Add CSS vars (if needed) under `:root` and `.dark` in `globals.css`.
2. Extend Tailwind tokens in `tailwind.config.ts` (e.g., `colors` map).
3. Update toggle component to include new option.

## Accent Colors Strategy (Future)
Store selected accent in `localStorage` and add a `[data-accent="blue"]` attribute to `<body>`; theme CSS variables cascade accordingly.

## Animation Plan
`AnimatedThemeToggler` will:
- Use `framer-motion` to cross-fade or scale icons
- Respect reduced motion: `prefers-reduced-motion` media query or a user preference flag

Pseudo-outline:
```tsx
<motion.button whileTap={{ scale: 0.9 }} onClick={cycleTheme}>
  <AnimatePresence mode="wait">
    <motion.span key={theme} initial={{ opacity: 0, rotate: -10 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 10 }}>
      {theme === 'dark' ? <MoonIcon/> : <SunIcon/>}
    </motion.span>
  </AnimatePresence>
</motion.button>
```

## Testing Checklist
- Toggle works immediately after first load (no layout shift)
- Persisted preference survives reload
- System mode matches OS change (optional future listener)
- Dark mode colors have sufficient contrast (WCAG AA+)

---
Version: v1 initial theming documentation
