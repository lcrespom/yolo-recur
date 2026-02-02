import type { RecurringPayment } from '../types/payment'
import { config } from '../config'

interface ExpensesSummaryProps {
  payments: RecurringPayment[]
}

function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `${config.currencySymbol} ${formatted}`
}

function calculateMonthlyTotal(payments: RecurringPayment[]): number {
  return payments.reduce((total, payment) => {
    // Convert to monthly cost based on periodicity
    const monthlyAmount = payment.cost / payment.periodicity
    return total + monthlyAmount
  }, 0)
}

function calculateYearlyTotal(monthlyTotal: number): number {
  return monthlyTotal * 12
}

export function ExpensesSummary({ payments }: ExpensesSummaryProps) {
  const monthlyTotal = calculateMonthlyTotal(payments)
  const yearlyTotal = calculateYearlyTotal(monthlyTotal)
  const totalPayments = payments.length

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Monthly Total */}
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Monthly Total</div>
          <div className="stat-value text-primary">{formatCurrency(monthlyTotal)}</div>
          <div className="stat-desc">Average per month</div>
        </div>
      </div>

      {/* Yearly Total */}
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Yearly Total</div>
          <div className="stat-value text-secondary">{formatCurrency(yearlyTotal)}</div>
          <div className="stat-desc">Total per year</div>
        </div>
      </div>

      {/* Total Payments */}
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Active Payments</div>
          <div className="stat-value">{totalPayments}</div>
          <div className="stat-desc">Recurring subscriptions</div>
        </div>
      </div>
    </div>
  )
}
