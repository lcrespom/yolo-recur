import type {
  RecurringPayment,
  RecurringPaymentInput,
} from '../types/payment'

const API_BASE_URL = 'http://localhost:3030'

/**
 * Fetch all recurring payments
 */
export async function getRecurringPayments(): Promise<RecurringPayment[]> {
  const response = await fetch(`${API_BASE_URL}/recurringPayments`)
  if (!response.ok) {
    throw new Error('Failed to fetch recurring payments')
  }
  return response.json()
}

/**
 * Fetch a single recurring payment by ID
 */
export async function getRecurringPayment(
  id: string,
): Promise<RecurringPayment> {
  const response = await fetch(`${API_BASE_URL}/recurringPayments/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch recurring payment ${id}`)
  }
  return response.json()
}

/**
 * Create a new recurring payment
 */
export async function createRecurringPayment(
  data: RecurringPaymentInput,
): Promise<RecurringPayment> {
  const response = await fetch(`${API_BASE_URL}/recurringPayments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create recurring payment')
  }
  return response.json()
}

/**
 * Update an existing recurring payment
 */
export async function updateRecurringPayment(
  id: string,
  data: Partial<RecurringPaymentInput>,
): Promise<RecurringPayment> {
  const response = await fetch(`${API_BASE_URL}/recurringPayments/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`Failed to update recurring payment ${id}`)
  }
  return response.json()
}

/**
 * Delete a recurring payment
 */
export async function deleteRecurringPayment(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/recurringPayments/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`Failed to delete recurring payment ${id}`)
  }
}
