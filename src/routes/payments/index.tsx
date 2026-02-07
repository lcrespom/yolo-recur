import { createFileRoute } from '@tanstack/react-router'
import { PaymentsTable } from '../../components/payments/payments-table'
import { AuthGuard } from '../../components/common/auth-guard'

export const Route = createFileRoute('/payments/')({
  component: () => (
    <AuthGuard>
      <PaymentsPage />
    </AuthGuard>
  ),
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
