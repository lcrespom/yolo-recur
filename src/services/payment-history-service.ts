import type { PaymentHistoryEntry, PaymentHistoryEntryInput } from '../types/payment'
import { config } from '../config'

/**
 * Fetch payment history for a specific recurring payment
 */
export async function getPaymentHistory(
  recurringPaymentId: string
): Promise<PaymentHistoryEntry[]> {
  const response = await fetch(
    `${config.apiBaseUrl}/paymentHistory?recurringPaymentId=${recurringPaymentId}&_sort=-date`
  )
  if (!response.ok) {
    throw new Error('Failed to fetch payment history')
  }
  return response.json()
}

/**
 * Fetch all payment history entries
 */
export async function getAllPaymentHistory(): Promise<PaymentHistoryEntry[]> {
  const response = await fetch(`${config.apiBaseUrl}/paymentHistory?_sort=-date`)
  if (!response.ok) {
    throw new Error('Failed to fetch payment history')
  }
  return response.json()
}

/**
 * Create a new payment history entry
 */
export async function createPaymentHistoryEntry(
  data: PaymentHistoryEntryInput
): Promise<PaymentHistoryEntry> {
  const response = await fetch(`${config.apiBaseUrl}/paymentHistory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create payment history entry')
  }
  return response.json()
}

/**
 * Update an existing payment history entry
 */
export async function updatePaymentHistoryEntry(
  id: string,
  data: Partial<PaymentHistoryEntryInput>
): Promise<PaymentHistoryEntry> {
  const response = await fetch(`${config.apiBaseUrl}/paymentHistory/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`Failed to update payment history entry ${id}`)
  }
  return response.json()
}

/**
 * Delete a payment history entry
 */
export async function deletePaymentHistoryEntry(id: string): Promise<void> {
  const response = await fetch(`${config.apiBaseUrl}/paymentHistory/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`Failed to delete payment history entry ${id}`)
  }
}
