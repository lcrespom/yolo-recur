import type { RecurringPayment, PaymentHistoryEntry } from '../../types/payment'
import { formatCurrency, formatDate } from '../../utils/format'

type UpcomingPaymentsProps = {
  payments: RecurringPayment[]
  history: PaymentHistoryEntry[]
}

type UpcomingPayment = {
  id: string
  date: string
  amount: number
  paymentName: string
  location: string
}

function getUpcomingPayments(
  payments: RecurringPayment[],
  history: PaymentHistoryEntry[]
): UpcomingPayment[] {
  // Create a map of payment IDs to payment names
  const paymentMap = new Map(payments.map(p => [p.id, p]))

  // Filter unpaid history entries and enrich with payment details
  const upcoming = history
    .filter(entry => !entry.isPaid)
    .map(entry => {
      const payment = paymentMap.get(entry.recurringPaymentId)
      return {
        id: entry.id,
        date: entry.date,
        amount: entry.amount,
        paymentName: payment?.name || 'Unknown',
        location: payment?.location || 'Unknown',
      }
    })
    .sort((a, b) => a.date.localeCompare(b.date))

  return upcoming
}

export function UpcomingPayments({ payments, history }: UpcomingPaymentsProps) {
  const upcomingPayments = getUpcomingPayments(payments, history)

  if (upcomingPayments.length === 0) {
    return (
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Upcoming Payments</h2>
          <p className="text-base-content/70">All payments are up to date!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h2 className="card-title">Upcoming Payments</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Due Date</th>
                <th>Payment</th>
                <th>Location</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {upcomingPayments.map(payment => (
                <tr key={payment.id}>
                  <td className="font-medium">{formatDate(payment.date)}</td>
                  <td>{payment.paymentName}</td>
                  <td>{payment.location}</td>
                  <td className="text-right tabular-nums">
                    {formatCurrency(payment.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td colSpan={3}>Total Due</td>
                <td className="text-right">
                  {formatCurrency(upcomingPayments.reduce((sum, p) => sum + p.amount, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
