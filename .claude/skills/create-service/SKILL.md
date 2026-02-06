---
name: create-service
description: Create a new service module with typed API functions and co-located test file
argument-hint: [service-name]
allowed-tools: Read, Glob, Grep, Write, Bash(npx tsc:*), Bash(npx vitest:*)
---

# Create Service Module

Create a new service at `src/services/$ARGUMENTS.ts` with a co-located test at `src/services/$ARGUMENTS.test.ts`.

## Service File Requirements

1. **Read existing services first**: Read `src/services/payment-service.ts` and `src/services/payment-history-service.ts` to understand the project's API patterns
2. **Import config**: Use `config.apiBaseUrl` from `src/config.ts` for the base URL
3. **Type imports**: Import types from `src/types/` — use `import type` for type-only imports
4. **Function pattern**:

```tsx
export async function getItems(): Promise<Item[]> {
  const response = await fetch(`${config.apiBaseUrl}/items`)
  if (!response.ok) {
    throw new Error('Failed to fetch items')
  }
  return response.json()
}
```

5. **CRUD operations**: Implement `get*`, `create*`, `update*`, `delete*` as needed
6. **Use PATCH** for updates (not PUT) — this matches json-server and Supabase patterns
7. **Pure logic services**: For calculation/utility services, follow `src/services/expense-calculation-service.ts` patterns — no API calls, just pure functions
8. **Error handling**: Throw descriptive Error messages on non-ok responses
9. **Code style**: No semicolons, single quotes, trailing commas, 90-char width

## Test File Requirements

1. **Mock pattern**: Use `vi.mock()` to mock dependencies (other services, fetch)
2. **Mock factories**: Create `createMock*()` functions for test data
3. **Test structure**:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./dependency-service')

const createMockItem = (overrides = {}): Item => ({
  id: '1',
  name: 'Test',
  ...overrides,
})

describe('functionName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does the thing', () => {
    // arrange, act, assert
  })
})
```

4. **Coverage**: Test success paths, error paths, and edge cases

## Steps

1. Read existing service files for reference patterns
2. Read `src/types/payment.ts` to understand existing type conventions
3. Create the service file
4. Create the test file
5. Run `npx tsc` to validate types
6. Run `npx vitest run src/services/$ARGUMENTS.test.ts` to validate tests pass
