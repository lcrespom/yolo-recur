---
name: supabase-migrate
description:
  Migrate a json-server service module to use Supabase client API while preserving the
  same public interface
argument-hint: [service-file-name]
model: opus
allowed-tools:
  Read, Glob, Grep, Write, Edit, Bash(npx tsc:*), Bash(npx vitest:*),
  mcp__context7__resolve-library-id, mcp__context7__query-docs
---

# Migrate Service to Supabase

Migrate the service at `src/services/$ARGUMENTS.ts` from json-server `fetch()` calls to
Supabase client API calls, preserving the same exported function signatures.

## Pre-Migration Checklist

1. **Read the existing service file** to understand all exported functions and their
   signatures
2. **Read `src/config.ts`** to check for Supabase configuration (URL and anon key)
3. **Read `src/types/payment.ts`** for type definitions used by the service
4. **Check if Supabase client is already set up** — look for `src/lib/supabase.ts` or
   similar

## Supabase Client Setup

If no Supabase client exists yet, create `src/lib/supabase.ts`:

```tsx
import { createClient } from '@supabase/supabase-js'
import { config } from '../config'

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey)
```

Ensure `src/config.ts` exposes:

```tsx
supabaseUrl: import.meta.env.VITE_SUPABASE_URL || ''
supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
```

## Migration Pattern

### Before (json-server fetch):

```tsx
export async function getItems(): Promise<Item[]> {
  const response = await fetch(`${config.apiBaseUrl}/items`)
  if (!response.ok) throw new Error('Failed to fetch items')
  return response.json()
}
```

### After (Supabase):

```tsx
export async function getItems(): Promise<Item[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch items: ${error.message}`)
  return data
}
```

### CRUD Mapping

| json-server              | Supabase                                                                 |
| ------------------------ | ------------------------------------------------------------------------ |
| `GET /items`             | `supabase.from('items').select('*')`                                     |
| `GET /items/:id`         | `supabase.from('items').select('*').eq('id', id).single()`               |
| `POST /items`            | `supabase.from('items').insert(data).select().single()`                  |
| `PATCH /items/:id`       | `supabase.from('items').update(data).eq('id', id).select().single()`     |
| `DELETE /items/:id`      | `supabase.from('items').delete().eq('id', id)`                           |
| `GET /items?field=value` | `supabase.from('items').select('*').eq('field', value)`                  |
| `GET /items?_sort=-date` | `supabase.from('items').select('*').order('date', { ascending: false })` |

## Table Name Mapping

Convert json-server collection names to Supabase snake_case table names:

- `recurringPayments` -> `recurring_payments`
- `paymentHistory` -> `payment_history`

Similarly, convert camelCase field names to snake_case column names:

- `recurringPaymentId` -> `recurring_payment_id`
- `paymentMonth` -> `payment_month`
- `paymentDay` -> `payment_day`
- `isPaid` -> `is_paid`

Create helper functions `toSnakeCase()` and `toCamelCase()` or a mapper if many fields
need conversion between the API and TypeScript interfaces.

## Important Notes

- **Preserve the exact same function signatures** — all calling code should work without
  changes
- **Use the Context7 MCP tools** to look up current Supabase JS client documentation if
  unsure about query syntax
- **RLS is active** — queries will be scoped to the authenticated user automatically.
  Ensure the user is logged in before making service calls
- **IDs**: Supabase uses UUID by default. The existing `id: string` type is compatible
- **Error handling**: Map Supabase `error` objects to thrown Error instances to match the
  existing pattern

## Steps

1. Read the existing service file and its test file
2. Check/create Supabase client setup (`src/lib/supabase.ts`)
3. Check/update `src/config.ts` for Supabase env vars
4. Rewrite each function to use Supabase client, preserving signatures
5. Update the test file to mock Supabase client instead of fetch
6. Run `npx tsc` to validate types
7. Run tests to verify behavior is preserved
