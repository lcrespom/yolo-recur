import type { PaymentHistoryEntry, PaymentHistoryEntryInput } from '../types/payment'
import { supabase } from '../lib/supabase'

/**
 * Database row type for payment_history table (snake_case)
 */
type PaymentHistoryRow = {
  id: string
  user_id: string
  recurring_payment_id: string
  date: string
  amount: number
  is_paid: boolean
  created_at: string
}

/**
 * Convert database row to TypeScript type (snake_case -> camelCase)
 */
function mapRowToEntry(row: PaymentHistoryRow): PaymentHistoryEntry {
  return {
    id: row.id,
    userId: row.user_id,
    recurringPaymentId: row.recurring_payment_id,
    date: row.date,
    amount: row.amount,
    isPaid: row.is_paid,
  }
}

/**
 * Convert TypeScript input to database format (camelCase -> snake_case)
 */
function mapEntryToRow(
  input: PaymentHistoryEntryInput,
  userId: string
): Omit<PaymentHistoryRow, 'id' | 'created_at'> {
  return {
    user_id: userId,
    recurring_payment_id: input.recurringPaymentId,
    date: input.date,
    amount: input.amount,
    is_paid: input.isPaid,
  }
}

/**
 * Get the current authenticated user ID
 */
async function getCurrentUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('User not authenticated')
  }

  return user.id
}

/**
 * Fetch payment history for a specific recurring payment
 */
export async function getPaymentHistory(
  recurringPaymentId: string
): Promise<PaymentHistoryEntry[]> {
  const { data, error } = await supabase
    .from('payment_history')
    .select('*')
    .eq('recurring_payment_id', recurringPaymentId)
    .order('date', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch payment history: ${error.message}`)
  }

  return (data as PaymentHistoryRow[]).map(mapRowToEntry)
}

/**
 * Fetch all payment history entries for the current user
 */
export async function getAllPaymentHistory(): Promise<PaymentHistoryEntry[]> {
  const { data, error } = await supabase
    .from('payment_history')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch all payment history: ${error.message}`)
  }

  return (data as PaymentHistoryRow[]).map(mapRowToEntry)
}

/**
 * Create a new payment history entry
 */
export async function createPaymentHistoryEntry(
  input: PaymentHistoryEntryInput
): Promise<PaymentHistoryEntry> {
  const userId = await getCurrentUserId()
  const row = mapEntryToRow(input, userId)

  const { data, error } = await supabase
    .from('payment_history')
    .insert([row])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create payment history entry: ${error.message}`)
  }

  return mapRowToEntry(data as PaymentHistoryRow)
}

/**
 * Update an existing payment history entry
 */
export async function updatePaymentHistoryEntry(
  id: string,
  input: Partial<PaymentHistoryEntryInput>
): Promise<PaymentHistoryEntry> {
  const userId = await getCurrentUserId()

  // Build the update object with only provided fields
  const updates: Partial<Omit<PaymentHistoryRow, 'id' | 'created_at'>> = {}

  if (input.recurringPaymentId !== undefined)
    updates.recurring_payment_id = input.recurringPaymentId
  if (input.date !== undefined) updates.date = input.date
  if (input.amount !== undefined) updates.amount = input.amount
  if (input.isPaid !== undefined) updates.is_paid = input.isPaid

  const { data, error } = await supabase
    .from('payment_history')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update payment history entry: ${error.message}`)
  }

  return mapRowToEntry(data as PaymentHistoryRow)
}

/**
 * Delete a payment history entry
 */
export async function deletePaymentHistoryEntry(id: string): Promise<void> {
  const userId = await getCurrentUserId()

  const { error } = await supabase
    .from('payment_history')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to delete payment history entry: ${error.message}`)
  }
}
