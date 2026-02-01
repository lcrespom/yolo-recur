import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/payments/$paymentId')({
  component: PaymentDetailPage,
})

function PaymentDetailPage() {
  const { paymentId } = Route.useParams()
  
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">
        {paymentId === 'new' ? 'New Payment' : 'Payment Details'}
      </h1>
      <div className="alert alert-info">
        <span>Payment detail page - Coming in Phase 3!</span>
        <span className="text-sm">Payment ID: {paymentId}</span>
      </div>
    </div>
  )
}
