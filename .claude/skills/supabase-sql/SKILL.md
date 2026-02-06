---
name: supabase-sql
description:
  Generate SQL/DDL scripts for Supabase tables with RLS policies based on project
  TypeScript types
argument-hint: [output-file]
allowed-tools:
  Read, Glob, Grep, Write, mcp__context7__resolve-library-id, mcp__context7__query-docs
---

# Generate Supabase SQL/DDL

Generate a SQL script for creating Supabase tables, indexes, and Row-Level Security (RLS)
policies. The output file path defaults to `supabase/migrations/001_initial_schema.sql`
unless specified via argument.

## Steps

1. **Read type definitions** at `src/types/payment.ts` to understand the data model
2. **Read `db.json`** to understand the current json-server schema and sample data
3. **Read existing services** to understand query patterns (filters, sorts, joins)
4. **Use Context7** to look up Supabase RLS documentation if needed
5. **Generate the SQL script**

## Schema Mapping

### TypeScript to PostgreSQL Type Mapping

| TypeScript               | PostgreSQL                                   |
| ------------------------ | -------------------------------------------- |
| `string` (id)            | `uuid DEFAULT gen_random_uuid() PRIMARY KEY` |
| `string`                 | `text`                                       |
| `number` (integer)       | `integer`                                    |
| `number` (decimal/money) | `numeric(10,2)`                              |
| `boolean`                | `boolean DEFAULT false`                      |
| `string` (date)          | `date`                                       |

### Table Naming Conventions

- Use snake_case for table and column names
- `RecurringPayment` -> `recurring_payments`
- `PaymentHistoryEntry` -> `payment_history`
- `recurringPaymentId` -> `recurring_payment_id`
- `paymentMonth` -> `payment_month`
- `paymentDay` -> `payment_day`
- `isPaid` -> `is_paid`

## Required SQL Sections

### 1. Table Creation

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE recurring_payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  -- ... all fields from RecurringPayment type
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE payment_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recurring_payment_id uuid REFERENCES recurring_payments(id) ON DELETE CASCADE NOT NULL,
  -- ... all fields from PaymentHistoryEntry type
  created_at timestamptz DEFAULT now()
);
```

**Important**: Add a `user_id` column to every table referencing `auth.users(id)` — this
is required for RLS.

### 2. Indexes

Create indexes for:

- Foreign keys (`recurring_payment_id` on `payment_history`)
- User ID on all tables (for RLS performance)
- Commonly queried fields (`date` on `payment_history`)

### 3. Row-Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE recurring_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own payments"
  ON recurring_payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON recurring_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payments"
  ON recurring_payments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payments"
  ON recurring_payments FOR DELETE
  USING (auth.uid() = user_id);
```

Repeat for `payment_history`.

### 4. Updated-at Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON recurring_payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 5. Optional: Seed Data (commented out)

Include commented-out INSERT statements based on `db.json` sample data, for
development/testing.

## Output

Write the complete SQL script to the specified output file (default:
`supabase/migrations/001_initial_schema.sql`). Include clear section comments so the
developer can review each part before uploading to the Supabase SQL editor.
