import type { RecurringPayment, PaymentHistoryEntry } from '../../types/payment'
import { calculateTotals } from '../../services/expense-calculation-service'
import { formatCurrency } from '../../utils/format'

interface ExpensesSummaryProps {
  payments: RecurringPayment[]
  history: PaymentHistoryEntry[]
}

export function ExpensesSummary({ payments, history }: ExpensesSummaryProps) {
  const { monthlyTotal, yearlyTotal } = calculateTotals(payments, history)
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
