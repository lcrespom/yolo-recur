# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Commands

```sh
npm run dev          # Start Vite dev server with HMR
npm run build        # Type-check (tsc -b) then Vite build
npm run lint         # ESLint (flat config, v9)
npm run format       # Prettier write
npm run format:check # Prettier check
npm test             # Vitest single run
npm run test:watch   # Vitest watch mode
npx vitest run src/components/Navbar.test.tsx  # Run a single test file
```

## Architecture

This is a React 19 + TypeScript template using Vite, TanStack Router, Tailwind CSS 4, and
DaisyUI 5.

### Routing (TanStack Router — file-based)

- Routes live in `src/routes/`. Adding a file there automatically creates a route.
- `src/routes/__root.tsx` is the root layout (renders `<Navbar>` and `<Outlet>`).
  Navigation links are defined here and passed to Navbar as props.
- `src/routeTree.gen.ts` is **auto-generated** — never edit it manually.

### Styling & Theming

- CSS entry point: `src/index.css` — imports Tailwind and configures DaisyUI with `light`
  (default) and `dark` (prefers-dark) themes.
- Theme is controlled via the `data-theme` attribute on `<html>`, managed by
  `src/components/ThemeToggle.tsx` which syncs with `prefers-color-scheme`.
- Use DaisyUI component classes (`btn`, `navbar`, `card`, etc.) and Tailwind utilities.
  Prettier auto-sorts Tailwind classes.

### Components

- Components go in `src/components/` with tests as sibling `.test.tsx` files.
- Navbar is generic — it receives `NavLink[]` props rather than hardcoding routes.

### Testing

- Vitest with jsdom environment. Globals enabled (`describe`, `it`, `expect` available
  without imports).
- `src/test/setup.ts` provides `@testing-library/jest-dom` matchers and a
  `window.matchMedia` mock.
- Components using TanStack Router need to be wrapped with a router context — see
  `renderWithRouter` helper in existing tests.

## Code Style

- Prettier: no semicolons, single quotes, no parens on single arrow params, trailing
  commas (es5), 90 char print width.
- TypeScript strict mode with `noUnusedLocals` and `noUnusedParameters` enabled.
