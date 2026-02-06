---
name: test-suite
description: Run tests for a specific file or area, or create missing tests following project patterns
argument-hint: [file-or-area]
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash(npx vitest:*), Bash(npm test:*), Bash(npm test)
---

# Test Suite Management

Run or create tests. The argument can be:
- A specific file path: `src/components/payments/payment-history` (runs/creates tests for that file)
- An area: `services`, `components`, `dashboard` (runs all tests in that area)
- `coverage` — run with coverage analysis
- `all` or omitted — run the full test suite

## Running Tests

### Single file
```bash
npx vitest run src/components/$ARGUMENTS.test.tsx
```

### Area
```bash
npx vitest run src/$ARGUMENTS/
```

### Full suite
```bash
npm test
```

### Coverage analysis
```bash
npx vitest run --coverage
```

## Creating Missing Tests

If a test file does not exist for the specified file, create one following project patterns.

### Steps to Create Tests

1. **Read the source file** to understand what needs testing
2. **Read an existing test file in the same directory** for pattern reference
3. **Create the test file** co-located with the source (e.g., `foo.tsx` -> `foo.test.tsx`)

### Component Test Pattern

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentName } from './component-name'

// Mock services
vi.mock('../../services/some-service')

// Mock factory
const createMockData = (overrides = {}) => ({
  id: '1',
  name: 'Test',
  ...overrides,
})

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    render(<ComponentName data={createMockData()} />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(<ComponentName onAction={onAction} />)
    await user.click(screen.getByRole('button'))
    expect(onAction).toHaveBeenCalled()
  })
})
```

### Router-Dependent Component Test Pattern

For components using TanStack Router links/navigation, wrap with router context:

```tsx
import { createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router'

function renderWithRouter(component: React.ReactNode) {
  const rootRoute = createRootRoute({ component: () => component })
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  return render(<RouterProvider router={router} />)
}
```

### Service Test Pattern

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./dependency-service')

describe('functionName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns expected result', async () => {
    // arrange
    vi.mocked(dependency.getData).mockResolvedValue(mockData)
    // act
    const result = await functionName()
    // assert
    expect(result).toEqual(expected)
  })
})
```

### Key Testing Conventions

- **Globals**: `describe`, `it`, `expect`, `vi`, `beforeEach` available globally (import from 'vitest' for consistency)
- **DOM matchers**: `toBeInTheDocument()`, `toHaveTextContent()`, etc. from `@testing-library/jest-dom`
- **User events**: Use `userEvent.setup()` over `fireEvent` for realistic interactions
- **Async**: Use `await` with `userEvent` and `findBy*` queries
- **Mocks**: Always `vi.clearAllMocks()` in `beforeEach`
