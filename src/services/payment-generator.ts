import type { RecurringPayment } from '../types/payment'
import { createPaymentHistoryEntry, getPaymentHistory } from './payment-history-service'

/**
 * Calculate the next payment due date for a recurring payment
 * @param payment The recurring payment
 * @param fromDate Starting date (defaults to today)
 * @returns Next due date as ISO string (YYYY-MM-DD)
 */
export function calculateNextDueDate(
  payment: RecurringPayment,
  fromDate: Date = new Date()
): string {
  const { paymentMonth, paymentDay, periodicity } = payment

  // Start from the payment's initial month and day
  const currentYear = fromDate.getFullYear()
  let candidateDate = new Date(currentYear, paymentMonth - 1, paymentDay)

  // If the candidate date is in the past, advance by periodicity
  while (candidateDate <= fromDate) {
    candidateDate = addMonths(candidateDate, periodicity)
  }

  return formatDate(candidateDate)
}

/**
 * Calculate all due dates between two dates
 * @param payment The recurring payment
 * @param startDate Start of range
 * @param endDate End of range
 * @returns Array of due dates as ISO strings
 */
export function calculateDueDatesInRange(
  payment: RecurringPayment,
  startDate: Date,
  endDate: Date
): string[] {
  const dueDates: string[] = []
  const { paymentMonth, paymentDay, periodicity } = payment

  // Find the first occurrence on or after startDate
  let currentDate = new Date(startDate.getFullYear(), paymentMonth - 1, paymentDay)

  // Go back to find the actual first occurrence
  while (currentDate > startDate) {
    currentDate = addMonths(currentDate, -periodicity)
  }

  // Advance to first date >= startDate
  while (currentDate < startDate) {
    currentDate = addMonths(currentDate, periodicity)
  }

  // Collect all dates in range
  while (currentDate <= endDate) {
    dueDates.push(formatDate(currentDate))
    currentDate = addMonths(currentDate, periodicity)
  }

  return dueDates
}

/**
 * Generate missing payment history entries for all recurring payments
 * Looks for payments that should have occurred but don't have history entries
 * @param payments Array of recurring payments
 * @param upToDate Generate entries up to this date (defaults to today)
 * @returns Number of entries created
 */
export async function generateDuePayments(
  payments: RecurringPayment[],
  upToDate: Date = new Date()
): Promise<number> {
  let createdCount = 0

  for (const payment of payments) {
    // Fetch fresh history for this payment to avoid duplicates
    const paymentHistory = await getPaymentHistory(payment.id)

    // Find the date of the last payment, or use a reasonable start date
    const lastPaymentDate = paymentHistory.length
      ? new Date(paymentHistory[0].date) // Already sorted desc
      : new Date(upToDate.getFullYear() - 1, upToDate.getMonth(), upToDate.getDate())

    // Calculate all due dates from last payment to upToDate
    const dueDates = calculateDueDatesInRange(payment, lastPaymentDate, upToDate)

    // Create entries for dates that don't have history
    for (const dueDate of dueDates) {
      const exists = paymentHistory.some(h => h.date === dueDate)
      if (!exists) {
        await createPaymentHistoryEntry({
          recurringPaymentId: payment.id,
          date: dueDate,
          amount: payment.cost,
          isPaid: false,
        })
        createdCount++
        // Add the newly created entry to our local cache to prevent duplicates in this run
        paymentHistory.push({
          id: 'temp',
          recurringPaymentId: payment.id,
          date: dueDate,
          amount: payment.cost,
          isPaid: false,
        })
      }
    }
  }

  return createdCount
}

/**
 * Add months to a date, handling month-end edge cases
 */
function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  const originalDay = result.getDate()

  result.setMonth(result.getMonth() + months)

  // Handle month-end edge cases (e.g., Jan 31 + 1 month should be Feb 28/29)
  if (result.getDate() !== originalDay) {
    // We've overflowed into the next month, go back to the last day of previous month
    result.setDate(0)
  }

  return result
}

/**
 * Format a date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
