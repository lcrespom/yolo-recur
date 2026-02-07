---
name: create-component
description:
  Scaffold a new React component with co-located test file, following project patterns
  (DaisyUI 5, Tailwind 4, TypeScript strict mode)
argument-hint: [directory/component-name]
allowed-tools: Read, Glob, Grep, Write, Bash(npx tsc:*), Bash(npx vitest:*)
---

# Create React Component

Create a new React component at `src/components/$ARGUMENTS.tsx` with a co-located test
file at `src/components/$ARGUMENTS.test.tsx`.

The argument should be in the format `directory/component-name` (e.g.,
`dashboard/expenses-chart` or `common/alert-banner`).

## Component File Requirements

1. **File naming**: Use kebab-case for file names (e.g., `my-component.tsx`)
2. **Component naming**: Use PascalCase for the component function (e.g., `MyComponent`)
3. **Export**: Use named exports, not default exports
4. **Props type**: Define a TypeScript type for props, placed above the component
5. **Styling**: Use DaisyUI 5 component classes (`btn`, `card`, `alert`, etc.) and
   Tailwind CSS 4 utilities
6. **No semicolons**, single quotes, trailing commas (es5) per Prettier config
7. **Print width**: 90 characters max

### IMPORTANT: basic code style practies

- Avoid duplication in component rendering logic. If you find yourself repeating patterns,
  consider creating a new reusable component or utility function. For example, if you find
  yourself writing similar form input fields across multiple components, create a
  `FormInput` component that can be reused with different props.
- If a component rendering logic is too complex, consider breaking it down into smaller
  subcomponents. For example, if you have a `PaymentForm` component that has a complex
  layout and multiple sections, you could break it down into `PaymentFormHeader`,
  `PaymentFormBody`, and `PaymentFormFooter` subcomponents to improve readability and
  maintainability.
- In general, consider abstracting repeated patterns into reusable code to keep code DRY
  and maintainable. This also makes it easier to apply consistent styling and behavior
  across your application.

### Component Pattern

Follow the existing component patterns found in the project. Read at least one existing
component in the same directory for reference before writing code.

Key patterns:

- Props type extend HTML attributes when wrapping native elements
- Use `react-hook-form` + `@hookform/resolvers/zod` + `zod` for form components
- Use `lucide-react` for icons
- State pattern: `useState` + `useCallback` + `useEffect` for data fetching
- Format currency using `config.currencySymbol` from `src/config.ts`

## Test File Requirements

1. **Framework**: Vitest with `@testing-library/react`
2. **Globals**: `describe`, `it`, `expect`, `vi` are available globally (no imports needed
   for these from vitest, but import them from 'vitest' for clarity in this project's
   style)
3. **Router context**: Components using TanStack Router links/navigation must be wrapped
   with `renderWithRouter` helper — check existing tests for the pattern
4. **Mocking**: Use `vi.mock()` for service dependencies
5. **Mock factories**: Create `createMock*()` helpers for test data
6. **Test coverage**: Test rendering, user interactions, edge cases, and error states

## Steps

1. Read existing components in the target directory for reference patterns
2. Read `src/types/payment.ts` if the component uses payment data
3. Create the component file
4. Create the test file
5. Run `npx tsc -b` to validate types compile
6. Run `npx vitest run src/components/$ARGUMENTS.test.tsx` to validate tests pass
