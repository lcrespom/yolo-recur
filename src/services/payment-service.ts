import type { RecurringPayment, RecurringPaymentInput } from '../types/payment'
import { config } from '../config'
import { fetchWithErrorHandling } from '../utils/error-handler'

/**
 * Fetch all recurring payments
 */
export async function getRecurringPayments(): Promise<RecurringPayment[]> {
  const response = await fetchWithErrorHandling(`${config.apiBaseUrl}/recurringPayments`)
  return response.json()
}

/**
 * Fetch a single recurring payment by ID
 */
export async function getRecurringPayment(id: string): Promise<RecurringPayment> {
  const response = await fetchWithErrorHandling(
    `${config.apiBaseUrl}/recurringPayments/${id}`
  )
  return response.json()
}

/**
 * Create a new recurring payment
 */
export async function createRecurringPayment(
  data: RecurringPaymentInput
): Promise<RecurringPayment> {
  const response = await fetchWithErrorHandling(`${config.apiBaseUrl}/recurringPayments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

/**
 * Update an existing recurring payment
 */
export async function updateRecurringPayment(
  id: string,
  data: Partial<RecurringPaymentInput>
): Promise<RecurringPayment> {
  const response = await fetchWithErrorHandling(
    `${config.apiBaseUrl}/recurringPayments/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  )
  return response.json()
}

/**
 * Delete a recurring payment
 */
export async function deleteRecurringPayment(id: string): Promise<void> {
  await fetchWithErrorHandling(`${config.apiBaseUrl}/recurringPayments/${id}`, {
    method: 'DELETE',
  })
}
