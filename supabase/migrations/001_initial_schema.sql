-- ============================================================================
-- Recurring Payments Tracking App - Initial Schema Migration
-- ============================================================================
-- This migration creates the core tables for the recurring payments app
-- with Row-Level Security (RLS) policies to ensure users can only access
-- their own data.
--
-- INSTRUCTIONS:
-- 1. Open your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire file
-- 4. Run the migration
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================

-- Enable UUID extension for generating unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- Table: recurring_payments
-- Stores configuration for recurring payment subscriptions
CREATE TABLE recurring_payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Payment identification
  name text NOT NULL,
  location text NOT NULL,
  company text NOT NULL,
  website text NOT NULL,
  phone text NOT NULL,
  bank text NOT NULL,

  -- Payment schedule configuration
  periodicity integer NOT NULL CHECK (periodicity > 0),
  payment_month integer NOT NULL CHECK (payment_month >= 1 AND payment_month <= 12),
  payment_day integer NOT NULL CHECK (payment_day >= 1 AND payment_day <= 31),

  -- Cost
  cost numeric(10,2) NOT NULL CHECK (cost >= 0),

  -- Timestamps
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Table: payment_history
-- Stores individual payment instances (due dates and payment status)
CREATE TABLE payment_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recurring_payment_id uuid REFERENCES recurring_payments(id) ON DELETE CASCADE NOT NULL,

  -- Payment details
  date date NOT NULL,
  amount numeric(10,2) NOT NULL CHECK (amount >= 0),
  is_paid boolean DEFAULT false NOT NULL,

  -- Timestamp
  created_at timestamptz DEFAULT now() NOT NULL
);

-- ============================================================================
-- 3. INDEXES
-- ============================================================================

-- Index on user_id for both tables (improves RLS query performance)
CREATE INDEX idx_recurring_payments_user_id ON recurring_payments(user_id);
CREATE INDEX idx_payment_history_user_id ON payment_history(user_id);

-- Index on foreign key for efficient joins
CREATE INDEX idx_payment_history_recurring_payment_id ON payment_history(recurring_payment_id);

-- Index on date for sorting and filtering payment history
CREATE INDEX idx_payment_history_date ON payment_history(date DESC);

-- Index on is_paid for filtering unpaid/upcoming payments
CREATE INDEX idx_payment_history_is_paid ON payment_history(is_paid);

-- Composite index for common query pattern: filtering by recurring payment and sorting by date
CREATE INDEX idx_payment_history_recurring_date ON payment_history(recurring_payment_id, date DESC);

-- ============================================================================
-- 4. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE recurring_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Policies for recurring_payments table
-- Users can only view their own recurring payments
CREATE POLICY "Users can view own recurring payments"
  ON recurring_payments FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own recurring payments
CREATE POLICY "Users can insert own recurring payments"
  ON recurring_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own recurring payments
CREATE POLICY "Users can update own recurring payments"
  ON recurring_payments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own recurring payments
CREATE POLICY "Users can delete own recurring payments"
  ON recurring_payments FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for payment_history table
-- Users can only view their own payment history
CREATE POLICY "Users can view own payment history"
  ON payment_history FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own payment history entries
CREATE POLICY "Users can insert own payment history"
  ON payment_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own payment history entries
CREATE POLICY "Users can update own payment history"
  ON payment_history FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own payment history entries
CREATE POLICY "Users can delete own payment history"
  ON payment_history FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 5. TRIGGERS
-- ============================================================================

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call update_updated_at before any update on recurring_payments
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON recurring_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 6. OPTIONAL: SEED DATA FOR DEVELOPMENT/TESTING
-- ============================================================================
-- Uncomment the following section if you want to add sample data for testing.
-- IMPORTANT: Replace 'YOUR_USER_UUID_HERE' with an actual user UUID from your
-- auth.users table before running.

/*
-- Sample recurring payments
INSERT INTO recurring_payments (user_id, name, location, company, website, phone, periodicity, payment_month, payment_day, cost, bank)
VALUES
  ('YOUR_USER_UUID_HERE', 'Electricity', 'Main House', 'PowerCo', 'https://powerco.example.com', '555-0100', 1, 1, 15, 150.00, 'Chase Bank'),
  ('YOUR_USER_UUID_HERE', 'Internet', 'Main House', 'FastNet ISP', 'https://fastnet.example.com', '555-0200', 1, 1, 1, 79.99, 'Chase Bank'),
  ('YOUR_USER_UUID_HERE', 'Home Insurance', 'Main House', 'SecureHome Insurance', 'https://securehome.example.com', '555-0300', 12, 5, 1, 1200.00, 'Wells Fargo');

-- To add sample payment history, first get the IDs of the inserted recurring payments, then:
-- INSERT INTO payment_history (user_id, recurring_payment_id, date, amount, is_paid)
-- VALUES
--   ('YOUR_USER_UUID_HERE', '<recurring_payment_id_1>', '2025-12-15', 150.00, true),
--   ('YOUR_USER_UUID_HERE', '<recurring_payment_id_1>', '2026-01-15', 145.50, true),
--   ('YOUR_USER_UUID_HERE', '<recurring_payment_id_2>', '2025-12-01', 79.99, true),
--   ('YOUR_USER_UUID_HERE', '<recurring_payment_id_2>', '2026-01-01', 79.99, true),
--   ('YOUR_USER_UUID_HERE', '<recurring_payment_id_2>', '2026-02-01', 79.99, false),
--   ('YOUR_USER_UUID_HERE', '<recurring_payment_id_3>', '2025-05-01', 1200.00, false);
*/

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- After running this migration:
-- 1. Verify tables were created: Check the "Table Editor" in Supabase dashboard
-- 2. Verify RLS policies: Check the "Authentication" > "Policies" section
-- 3. Test with a logged-in user to ensure data isolation works correctly
-- ============================================================================
