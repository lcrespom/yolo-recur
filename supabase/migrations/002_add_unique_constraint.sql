-- ============================================================================
-- Add Unique Constraint to Prevent Duplicate Payment History Entries
-- ============================================================================
-- This migration adds a unique constraint to ensure that each recurring
-- payment can only have one payment history entry per date, preventing
-- duplicate entries from race conditions.
--
-- INSTRUCTIONS:
-- 1. First, clean up any existing duplicates (if any)
-- 2. Then run this migration in Supabase SQL Editor
-- ============================================================================

-- Step 1: Remove duplicate entries (keeping only the oldest one for each date)
-- This uses a CTE to identify duplicates and delete all but the first one
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY recurring_payment_id, date
           ORDER BY created_at ASC
         ) as row_num
  FROM payment_history
)
DELETE FROM payment_history
WHERE id IN (
  SELECT id FROM duplicates WHERE row_num > 1
);

-- Step 2: Add unique constraint to prevent future duplicates
ALTER TABLE payment_history
ADD CONSTRAINT payment_history_recurring_payment_date_unique
UNIQUE (recurring_payment_id, date);

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- After running this migration:
-- 1. Existing duplicates will be removed
-- 2. Future attempts to insert duplicate entries will fail gracefully
-- 3. The application code will handle the unique constraint violation
-- ============================================================================
