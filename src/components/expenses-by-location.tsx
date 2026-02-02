import type { RecurringPayment } from '../types/payment'
import { config } from '../config'

interface ExpensesByLocationProps {
  payments: RecurringPayment[]
}

interface LocationSummary {
  location: string
  monthlyTotal: number
  yearlyTotal: number
  count: number
}

function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `${config.currencySymbol} ${formatted}`
}

function groupByLocation(payments: RecurringPayment[]): LocationSummary[] {
  const locationMap = new Map<string, LocationSummary>()

  payments.forEach(payment => {
    const location = payment.location
    const monthlyAmount = payment.cost / payment.periodicity
    const yearlyAmount = monthlyAmount * 12

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
  })

  return Array.from(locationMap.values()).sort((a, b) => b.monthlyTotal - a.monthlyTotal)
}

export function ExpensesByLocation({ payments }: ExpensesByLocationProps) {
  const locationSummaries = groupByLocation(payments)

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
