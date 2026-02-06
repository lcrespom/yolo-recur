---
name: review-code
description: Review code for quality, conventions, performance, accessibility, and security against project standards
argument-hint: [file-or-directory]
allowed-tools: Read, Glob, Grep, Bash(npx tsc:*), Bash(npm run lint), Bash(npm run format:check)
---

# Code Review

Perform a thorough code review of `$ARGUMENTS` (a file path or directory). If no argument is provided, review recent changes or the full `src/` directory.

## Review Checklist

### 1. Project Conventions
- [ ] **No semicolons**, single quotes, trailing commas (es5), 90-char print width
- [ ] **Named exports** (not default exports)
- [ ] **kebab-case file names**, PascalCase component names
- [ ] **TypeScript strict mode**: no `any`, no unused variables/parameters
- [ ] **Import types** with `import type` syntax
- [ ] **No `@ts-ignore` or `@ts-expect-error`** without clear justification

### 2. React Patterns
- [ ] **Proper hook dependencies**: all deps in useEffect/useCallback/useMemo arrays
- [ ] **No unnecessary re-renders**: expensive computations memoized
- [ ] **State management**: useState for simple state, useCallback for stable references
- [ ] **Data fetching pattern**: uses the project's useState + useCallback + useEffect pattern
- [ ] **Error and loading states** handled in data-fetching components
- [ ] **No inline function definitions** in JSX that cause re-renders (use useCallback)

### 3. Styling & UI
- [ ] **DaisyUI 5 component classes** used correctly (btn, card, alert, etc.)
- [ ] **Tailwind CSS 4** utility classes — no inline styles or CSS modules
- [ ] **Responsive design**: mobile-first approach, uses responsive breakpoints (sm:, md:, lg:)
- [ ] **Dark/light theme**: uses DaisyUI semantic colors (base-100, primary, error), not raw colors
- [ ] **Currency formatting**: uses `config.currencySymbol`

### 4. TypeScript Quality
- [ ] **Interfaces defined for props** — placed above the component
- [ ] **No type assertions** (`as`) unless necessary
- [ ] **Proper error typing**: `catch (err)` with `err instanceof Error` check
- [ ] **Enum/union types** for finite options (like periodicity)

### 5. Service Layer
- [ ] **Consistent error handling**: throw Error with descriptive messages
- [ ] **Config-based URLs**: uses `config.apiBaseUrl`, not hardcoded URLs
- [ ] **PATCH for updates** (not PUT)
- [ ] **Type-safe returns**: proper return types on all functions

### 6. Testing
- [ ] **Test file exists** for every component and service
- [ ] **Tests are meaningful**: test behavior, not implementation
- [ ] **Mocks are clean**: `vi.clearAllMocks()` in `beforeEach`
- [ ] **Edge cases covered**: empty arrays, null values, errors, loading states

### 7. Accessibility
- [ ] **Semantic HTML**: buttons for actions, links for navigation, proper heading hierarchy
- [ ] **Labels on form fields**: either via `<label>` wrapping or `htmlFor`
- [ ] **ARIA attributes** where needed (modals, dynamic content)
- [ ] **Keyboard navigation**: interactive elements focusable and operable

### 8. Security
- [ ] **No XSS vectors**: no `dangerouslySetInnerHTML`
- [ ] **No secrets in code**: env vars used for configuration
- [ ] **Input validation**: Zod schemas validate user input before submission

### 9. Performance
- [ ] **No N+1 queries**: batch data fetching where possible
- [ ] **Lazy loading**: large components could use React.lazy
- [ ] **No unnecessary fetches**: data loaded once and passed down, not re-fetched in children

## Output Format

Provide findings organized by severity:

### Critical (must fix)
Issues that break functionality, security, or type safety.

### Warning (should fix)
Issues that affect maintainability, performance, or conventions.

### Suggestion (nice to have)
Improvements that would enhance code quality or developer experience.

For each finding, include:
- File and line reference
- What the issue is
- How to fix it (with code snippet if helpful)
