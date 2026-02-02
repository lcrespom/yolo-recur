import { createFileRoute } from '@tanstack/react-router'
import { PaymentsTable } from '../../components/payments/payments-table'

export const Route = createFileRoute('/payments/')({
  component: PaymentsPage,
})

function PaymentsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Recurring Payments</h1>
      </div>
      <PaymentsTable />
    </div>
  )
}
