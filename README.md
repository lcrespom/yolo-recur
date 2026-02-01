# React + Tailwind Template

A template web application built with a modern React stack, ready for building responsive,
themeable single-page applications.

## Tech Stack

- **TypeScript** — strict type-checked codebase
- **React 19** with **Vite** for builds and HMR
- **TanStack Router** — file-based, type-safe routing
- **Tailwind CSS 4** with **DaisyUI 5** — utility-first styling and component library
- **Lucide React** — icon library
- **Dark/Light theme** — auto-selected based on system preference
- **Vitest** + **React Testing Library** — unit and component testing
- **Prettier** (with Tailwind plugin) + **ESLint** — formatting and linting

The setup steps are described [here](setup-steps.md).

## Getting Started

### Install dependencies

```sh
npm install
```

### Run the dev server

```sh
npm run dev
```

### Build for production

```sh
npm run build
```

### Preview the production build

```sh
npm run preview
```

### Run tests

```sh
npm test
```

### Format and lint

```sh
npm run format
npm run lint
```

## Project Structure

The app includes a responsive navbar with dark/light theme toggle and two sample pages
routed via TanStack Router (`/page1`, `/page2`). Use this as a starting point and replace
the sample pages with your own.
