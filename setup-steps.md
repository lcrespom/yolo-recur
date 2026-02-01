# React TailWindCSS Template - Project Setup Steps

This document describes all the steps followed to scaffold a web application from scratch.

## Prerequisites

- Node.js (v20 or later recommended)
- npm

## 1. Scaffold the Vite + React + TypeScript project

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

## 2. Install Tailwind CSS v4 with the Vite plugin

```bash
npm install tailwindcss@latest @tailwindcss/vite@latest
```

## 3. Install DaisyUI and Lucide icons

```bash
npm install daisyui@latest lucide-react
```

## 4. Install TanStack Router and its Vite plugin

```bash
npm install @tanstack/react-router @tanstack/router-plugin
```

## 5. Install testing dependencies

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

## 6. Install Prettier and the TailWind Prettier plugin

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

## 7. Configure Vite (`vite.config.ts`)

Update `vite.config.ts` to include all plugins and Vitest configuration:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    tailwindcss(),
    react(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
```

**Key points:**

- `@tanstack/router-plugin` must come **before** `@vitejs/plugin-react`
- Import `defineConfig` from `vitest/config` (not `vite`) to support the `test` property
- `autoCodeSplitting: true` enables automatic code splitting per route

## 8. Configure Tailwind CSS and DaisyUI (`src/index.css`)

Replace the contents of `src/index.css` with:

```css
@import 'tailwindcss';
@plugin 'daisyui' {
  themes:
    light --default,
    dark --prefersdark;
}
```

This sets `light` as the default theme, and `dark` is automatically applied when the
user's system prefers dark mode.

## 9. Update TypeScript configuration (`tsconfig.app.json`)

Add `vitest/globals` and `@testing-library/jest-dom` to the `types` array:

```json
{
  "compilerOptions": {
    "types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"]
  }
}
```

## 10. Create the test setup file (`src/test/setup.ts`)

```ts
import '@testing-library/jest-dom/vitest'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
```

The `matchMedia` mock is required because jsdom does not implement it.

## 11. Add npm scripts to `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

## 12. Configure Prettier (`.prettierrc`)

```json
{
  "semi": false,
  "singleQuote": true,
  "useTabs": false,
  "arrowParens": "avoid",
  "trailingComma": "es5",
  "printWidth": 90,
  "plugins": ["prettier-plugin-tailwindcss"],
  "overrides": [
    {
      "files": "*.md",
      "options": {
        "printWidth": 90,
        "proseWrap": "always"
      }
    }
  ]
}
```

## 13. Set up file-based routing

Create the following route files under `src/routes/`:

- `__root.tsx` - Root layout with the Navbar and `<Outlet />`
- `index.tsx` - Home page at `/`
- `page1.tsx` - Page 1 at `/page1`
- `page2.tsx` - Page 2 at `/page2`

Generate the route tree:

```bash
npx @tanstack/router-cli generate
```

This creates `src/routeTree.gen.ts` which is auto-generated and should not be manually
edited.

## 14. Set up the router in `src/main.tsx`

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import './index.css'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
```

## 15. Build and run

```bash
# Development server
npm run dev

# Production build
npm run build

# Run tests
npm test

# Format code
npm run format
```

## Project structure

```
my-app/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── .prettierrc
├── public/
│   └── vite.svg
├── src/
│   ├── main.tsx
│   ├── index.css
│   ├── routeTree.gen.ts       (auto-generated)
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── Navbar.test.tsx
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   ├── page1.tsx
│   │   └── page2.tsx
│   └── test/
│       └── setup.ts
└── setup-steps.md
```
