import type { RecurringPayment, PaymentHistoryEntry } from '../types/payment'

/**
 * Calculate yearly cost from actual payment history if sufficient data exists
 * @param payment The recurring payment
 * @param history All payment history entries
 * @param lookbackMonths How many months to look back (default 12)
 * @returns Actual yearly cost or null if insufficient data
 */
export function calculateYearlyFromHistory(
  payment: RecurringPayment,
  history: PaymentHistoryEntry[],
  lookbackMonths: number = 12
): number | null {
  // Calculate cutoff date
  const cutoffDate = new Date()
  cutoffDate.setMonth(cutoffDate.getMonth() - lookbackMonths)
  // Filter paid entries for this payment in the lookback period
  const relevantHistory = history.filter(entry => {
    return (
      entry.recurringPaymentId === payment.id &&
      new Date(entry.date) >= cutoffDate &&
      entry.isPaid
    )
  })
  // Calculate expected number of payments based on periodicity
  const expectedEntries = Math.ceil(lookbackMonths / payment.periodicity)
  // Require at least 80% of expected entries for accurate calculation
  if (relevantHistory.length >= expectedEntries * 0.8) {
    // Sum actual amounts paid
    return relevantHistory.reduce((sum, entry) => sum + entry.amount, 0)
  }
  return null // Not enough data
}

/**
 * Calculate monthly and yearly totals using actual history when available
 * Falls back to template-based estimation when insufficient history exists
 */
export function calculateTotals(
  payments: RecurringPayment[],
  history: PaymentHistoryEntry[]
): { monthlyTotal: number; yearlyTotal: number } {
  let yearlyTotal = 0
  for (const payment of payments) {
    // Try to use actual payment history first
    const actualYearly = calculateYearlyFromHistory(payment, history)
    if (actualYearly !== null) {
      yearlyTotal += actualYearly
    } else {
      // Fallback to estimation based on template
      const monthlyAmount = payment.cost / payment.periodicity
      yearlyTotal += monthlyAmount * 12
    }
  }
  const monthlyTotal = yearlyTotal / 12
  return { monthlyTotal, yearlyTotal }
}

export interface LocationSummary {
  location: string
  monthlyTotal: number
  yearlyTotal: number
  count: number
}

/**
 * Group payments by location and calculate totals using actual history when available
 * Falls back to template-based estimation when insufficient history exists
 */
export function groupByLocation(
  payments: RecurringPayment[],
  history: PaymentHistoryEntry[]
): LocationSummary[] {
  const locationMap = new Map<string, LocationSummary>()

  for (const payment of payments) {
    const location = payment.location

    // Try to use actual history first
    const actualYearly = calculateYearlyFromHistory(payment, history)
    const yearlyAmount = actualYearly !== null
      ? actualYearly
      : (payment.cost / payment.periodicity) * 12
    const monthlyAmount = yearlyAmount / 12

    if (locationMap.has(location)) {
      const existing = locationMap.get(location)!
      existing.monthlyTotal += monthlyAmount
      existing.yearlyTotal += yearlyAmount
      existing.count += 1
    } else {
      locationMap.set(location, {
        location,
        monthlyTotal: monthlyAmount,
        yearlyTotal: yearlyAmount,
        count: 1,
      })
    }
  }

  return Array.from(locationMap.values()).sort((a, b) => b.monthlyTotal - a.monthlyTotal)
}
