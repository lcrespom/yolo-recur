/**
 * Represents a recurring payment configuration
 */
export type RecurringPayment = {
  id: string
  userId: string
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
 * Form data for creating or updating a recurring payment (without id and userId)
 * The userId is automatically set from the authenticated session
 */
export type RecurringPaymentInput = Omit<RecurringPayment, 'id' | 'userId'>

/**
 * Represents a single payment history entry
 */
export type PaymentHistoryEntry = {
  id: string
  userId: string
  recurringPaymentId: string
  /** Payment date in ISO format (YYYY-MM-DD) */
  date: string
  /** Actual amount paid (may differ from recurring payment cost) */
  amount: number
  /** Whether the payment has been completed */
  isPaid: boolean
}

/**
 * Form data for creating or updating a payment history entry (without id and userId)
 * The userId is automatically set from the authenticated session
 */
export type PaymentHistoryEntryInput = Omit<PaymentHistoryEntry, 'id' | 'userId'>
