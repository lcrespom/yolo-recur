/**
 * Represents a recurring payment configuration
 */
export type RecurringPayment = {
  id: string
  name: string
  location: string
  company: string
  website: string
  phone: string
  /** Periodicity in months: 1 = monthly, 12 = yearly, etc. */
  periodicity: number
  /** Month when the payment cycle starts (1-12) */
  paymentMonth: number
  /** Day of the month when payment is due (1-31) */
  paymentDay: number
  /** Default/expected cost per payment */
  cost: number
  bank: string
}

/**
 * Form data for creating or updating a recurring payment (without id)
 */
export type RecurringPaymentInput = Omit<RecurringPayment, 'id'>

/**
 * Represents a single payment history entry
 */
export type PaymentHistoryEntry = {
  id: string
  recurringPaymentId: string
  /** Payment date in ISO format (YYYY-MM-DD) */
  date: string
  /** Actual amount paid (may differ from recurring payment cost) */
  amount: number
  /** Whether the payment has been completed */
  isPaid: boolean
}

/**
 * Form data for creating or updating a payment history entry (without id)
 */
export type PaymentHistoryEntryInput = Omit<PaymentHistoryEntry, 'id'>
