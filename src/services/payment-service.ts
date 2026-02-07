import type { RecurringPayment, RecurringPaymentInput } from '../types/payment'
import { supabase } from '../lib/supabase'

/**
 * Database row type for recurring_payments table (snake_case)
 */
type RecurringPaymentRow = {
  id: string
  user_id: string
  name: string
  location: string
  company: string
  website: string
  phone: string
  periodicity: number
  payment_month: number
  payment_day: number
  cost: number
  bank: string
  created_at: string
  updated_at: string
}

/**
 * Convert database row to TypeScript type (snake_case -> camelCase)
 */
function mapRowToPayment(row: RecurringPaymentRow): RecurringPayment {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    location: row.location,
    company: row.company,
    website: row.website,
    phone: row.phone,
    periodicity: row.periodicity,
    paymentMonth: row.payment_month,
    paymentDay: row.payment_day,
    cost: row.cost,
    bank: row.bank,
  }
}

/**
 * Convert TypeScript input to database format (camelCase -> snake_case)
 */
function mapPaymentToRow(
  input: RecurringPaymentInput,
  userId: string
): Omit<RecurringPaymentRow, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId,
    name: input.name,
    location: input.location,
    company: input.company,
    website: input.website,
    phone: input.phone,
    periodicity: input.periodicity,
    payment_month: input.paymentMonth,
    payment_day: input.paymentDay,
    cost: input.cost,
    bank: input.bank,
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
 * Fetch all recurring payments for the current user
 */
export async function getRecurringPayments(): Promise<RecurringPayment[]> {
  const { data, error } = await supabase
    .from('recurring_payments')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch recurring payments: ${error.message}`)
  }

  return (data as RecurringPaymentRow[]).map(mapRowToPayment)
}

/**
 * Fetch a single recurring payment by ID
 */
export async function getRecurringPayment(id: string): Promise<RecurringPayment> {
  const { data, error } = await supabase
    .from('recurring_payments')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Failed to fetch recurring payment: ${error.message}`)
  }

  return mapRowToPayment(data as RecurringPaymentRow)
}

/**
 * Create a new recurring payment
 */
export async function createRecurringPayment(
  input: RecurringPaymentInput
): Promise<RecurringPayment> {
  const userId = await getCurrentUserId()
  const row = mapPaymentToRow(input, userId)

  const { data, error } = await supabase
    .from('recurring_payments')
    .insert([row])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create recurring payment: ${error.message}`)
  }

  return mapRowToPayment(data as RecurringPaymentRow)
}

/**
 * Update an existing recurring payment
 */
export async function updateRecurringPayment(
  id: string,
  input: Partial<RecurringPaymentInput>
): Promise<RecurringPayment> {
  const userId = await getCurrentUserId()

  // Build the update object with only provided fields
  const updates: Partial<Omit<RecurringPaymentRow, 'id' | 'created_at' | 'updated_at'>> =
    {}

  if (input.name !== undefined) updates.name = input.name
  if (input.location !== undefined) updates.location = input.location
  if (input.company !== undefined) updates.company = input.company
  if (input.website !== undefined) updates.website = input.website
  if (input.phone !== undefined) updates.phone = input.phone
  if (input.periodicity !== undefined) updates.periodicity = input.periodicity
  if (input.paymentMonth !== undefined) updates.payment_month = input.paymentMonth
  if (input.paymentDay !== undefined) updates.payment_day = input.paymentDay
  if (input.cost !== undefined) updates.cost = input.cost
  if (input.bank !== undefined) updates.bank = input.bank

  const { data, error } = await supabase
    .from('recurring_payments')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update recurring payment: ${error.message}`)
  }

  return mapRowToPayment(data as RecurringPaymentRow)
}

/**
 * Delete a recurring payment
 */
export async function deleteRecurringPayment(id: string): Promise<void> {
  const userId = await getCurrentUserId()

  const { error } = await supabase
    .from('recurring_payments')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to delete recurring payment: ${error.message}`)
  }
}
