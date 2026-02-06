import type { RecurringPayment, PaymentHistoryEntry } from '../../types/payment'
import { groupByLocation } from '../../services/expense-calculation-service'
import { formatCurrency } from '../../utils/format'

interface ExpensesByLocationProps {
  payments: RecurringPayment[]
  history: PaymentHistoryEntry[]
}

export function ExpensesByLocation({ payments, history }: ExpensesByLocationProps) {
  const locationSummaries = groupByLocation(payments, history)

  if (locationSummaries.length === 0) {
    return null
  }

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h2 className="card-title">Expenses by Location</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Location</th>
                <th className="text-right">Count</th>
                <th className="text-right">Monthly</th>
                <th className="text-right">Yearly</th>
              </tr>
            </thead>
            <tbody>
              {locationSummaries.map(summary => (
                <tr key={summary.location}>
                  <td className="font-medium">{summary.location}</td>
                  <td className="text-right">{summary.count}</td>
                  <td className="text-right">{formatCurrency(summary.monthlyTotal)}</td>
                  <td className="text-right">{formatCurrency(summary.yearlyTotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td>Total</td>
                <td className="text-right">{payments.length}</td>
                <td className="text-right">
                  {formatCurrency(
                    locationSummaries.reduce((sum, s) => sum + s.monthlyTotal, 0)
                  )}
                </td>
                <td className="text-right">
                  {formatCurrency(
                    locationSummaries.reduce((sum, s) => sum + s.yearlyTotal, 0)
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
