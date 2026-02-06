---
name: supabase-auth
description:
  Implement Supabase authentication — login/signup pages, auth state, protected routes,
  and auth-aware navbar
argument-hint: [feature]
model: opus
allowed-tools:
  Read, Glob, Grep, Write, Edit, Bash(npx tsc:*), Bash(npx vitest:*),
  mcp__context7__resolve-library-id, mcp__context7__query-docs
---

# Supabase Authentication

Implement Supabase authentication features for this project. The argument specifies which
feature to implement:

- `login-page` — Create the login/signup page
- `auth-context` — Create auth state management
- `protected-routes` — Add route guards for authenticated pages
- `navbar` — Make navbar auth-aware (show/hide links based on login status)
- `welcome-page` — Make welcome page auth-aware
- `logout` — Add logout functionality
- `all` — Implement everything in sequence

## Prerequisites

Before implementing, verify:

1. **Supabase client exists** at `src/lib/supabase.ts`
2. **Config has Supabase vars** in `src/config.ts` (`supabaseUrl`, `supabaseAnonKey`)
3. **@supabase/supabase-js is installed** — check `package.json`

If any prerequisite is missing, set it up first.

## Feature: auth-context

Create `src/contexts/auth-context.tsx`:

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}
```

Key requirements:

- Listen to `supabase.auth.onAuthStateChange()` in useEffect
- Clean up the subscription on unmount
- Provide loading state while checking initial session
- Wrap app in `<AuthProvider>` in `src/main.tsx`

## Feature: login-page

Create route at `src/routes/login.tsx` (path: `/login`):

- Single page handling both login and sign-up with a tab or toggle
- Use a path search param (`?mode=login` or `?mode=signup`) to control which form is shown
- Form fields: email, password (and confirm password for sign-up)
- Use `react-hook-form` + `zod` for validation, matching existing form patterns
- Use DaisyUI `card` for the form container, `tabs` for mode switching
- Show error messages from Supabase auth errors
- Redirect to `/dashboard` on successful auth
- If already logged in, redirect to `/dashboard`

## Feature: protected-routes

Dashboard and Payments pages require authentication:

- Check `user` from auth context
- If not logged in, redirect to `/login`
- Show a loading spinner while auth state is resolving
- Implement this as a wrapper component or in the route's `beforeLoad`

## Feature: navbar

Update `src/routes/__root.tsx` and `src/components/common/navbar.tsx`:

- **Logged in**: Show Dashboard, Payments links + user email + Logout button
- **Not logged in**: Show Login, Sign Up links (both point to `/login` with different
  `?mode` param)
- Navbar should consume auth context to determine state
- Logout button calls `signOut()` from auth context

## Feature: welcome-page

Update `src/routes/index.tsx`:

- **Logged in**: Show links to Dashboard and Payments (existing behavior)
- **Not logged in**: Replace Dashboard/Payments links with Login/Sign Up CTAs
- Adjust hero section messaging based on auth state

## Feature: logout

- Add logout handler via auth context's `signOut()`
- Clear any local state
- Redirect to `/` (welcome page)
- Show in navbar as a button (not a nav link)

## Code Style

- No semicolons, single quotes, trailing commas (es5), 90-char width
- DaisyUI 5 component classes + Tailwind CSS 4
- TypeScript strict mode
- Named exports (not default)

## Steps (for `all`)

1. Read existing files: `src/routes/__root.tsx`, `src/components/common/navbar.tsx`,
   `src/routes/index.tsx`, `src/main.tsx`, `src/config.ts`
2. Create/verify Supabase client at `src/lib/supabase.ts`
3. Create auth context at `src/contexts/auth-context.tsx`
4. Wrap app with `<AuthProvider>` in `src/main.tsx`
5. Create login page at `src/routes/login.tsx`
6. Update navbar to be auth-aware
7. Update welcome page to be auth-aware
8. Add route protection to dashboard and payments
9. Run `npx tsc` to validate types
10. Run `npm test` to verify existing tests still pass
