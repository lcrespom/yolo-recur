import type { PaymentHistoryEntry, PaymentHistoryEntryInput } from '../types/payment'
import { config } from '../config'
import { fetchWithErrorHandling } from '../utils/error-handler'

/**
 * Fetch payment history for a specific recurring payment
 */
export async function getPaymentHistory(
  recurringPaymentId: string
): Promise<PaymentHistoryEntry[]> {
  const response = await fetchWithErrorHandling(
    `${config.apiBaseUrl}/paymentHistory?recurringPaymentId=${recurringPaymentId}&_sort=-date`
  )
  return response.json()
}

/**
 * Fetch all payment history entries
 */
export async function getAllPaymentHistory(): Promise<PaymentHistoryEntry[]> {
  const response = await fetchWithErrorHandling(
    `${config.apiBaseUrl}/paymentHistory?_sort=-date`
  )
  return response.json()
}

/**
 * Create a new payment history entry
 */
export async function createPaymentHistoryEntry(
  data: PaymentHistoryEntryInput
): Promise<PaymentHistoryEntry> {
  const response = await fetchWithErrorHandling(`${config.apiBaseUrl}/paymentHistory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

/**
 * Update an existing payment history entry
 */
export async function updatePaymentHistoryEntry(
  id: string,
  data: Partial<PaymentHistoryEntryInput>
): Promise<PaymentHistoryEntry> {
  const response = await fetchWithErrorHandling(`${config.apiBaseUrl}/paymentHistory/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

/**
 * Delete a payment history entry
 */
export async function deletePaymentHistoryEntry(id: string): Promise<void> {
  await fetchWithErrorHandling(`${config.apiBaseUrl}/paymentHistory/${id}`, {
    method: 'DELETE',
  })
}
