import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

import type { RecurringPayment, PaymentHistoryEntry } from '../../types/payment'
import { getRecurringPayment } from '../../services/payment-service'
import { getPaymentHistory } from '../../services/payment-history-service'
import { PaymentForm } from '../../components/payments/payment-form'
import { PaymentHistory } from '../../components/payments/payment-history'
import { AuthGuard } from '../../components/common/auth-guard'

export const Route = createFileRoute('/payments/$paymentId')({
  component: () => (
    <AuthGuard>
      <PaymentDetailPage />
    </AuthGuard>
  ),
})

function PaymentDetailPage() {
  const navigate = useNavigate()
  const { paymentId } = Route.useParams()
  const isNew = paymentId === 'new'

  const [payment, setPayment] = useState<RecurringPayment | null>(null)
  const [history, setHistory] = useState<PaymentHistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(!isNew)
  const [error, setError] = useState<string | null>(null)

  const loadPaymentData = useCallback(async () => {
    if (isNew) return

    try {
      setIsLoading(true)
      setError(null)
      const [paymentData, historyData] = await Promise.all([
        getRecurringPayment(paymentId),
        getPaymentHistory(paymentId),
      ])
      setPayment(paymentData)
      setHistory(historyData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payment data')
    } finally {
      setIsLoading(false)
    }
  }, [paymentId, isNew])

  useEffect(() => {
    loadPaymentData()
  }, [loadPaymentData])

  function handleBack() {
    navigate({ to: '/payments' })
  }

  function handleSaveSuccess() {
    navigate({ to: '/payments' })
  }

  function handleDeleteSuccess() {
    navigate({ to: '/payments' })
  }

  async function handleHistoryChange() {
    // Reload only the payment history without showing loading spinner
    try {
      const historyData = await getPaymentHistory(paymentId)
      setHistory(historyData)
    } catch (err) {
      console.error('Failed to reload payment history:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button className="btn btn-ghost btn-sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
          Back to Payments
        </button>
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button className="btn btn-ghost btn-sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold">
          {isNew ? 'New Recurring Payment' : 'Edit Payment'}
        </h1>
      </div>

      {/* Payment Form */}
      <PaymentForm
        payment={payment}
        onSaveSuccess={handleSaveSuccess}
        onDeleteSuccess={handleDeleteSuccess}
        onCancel={handleBack}
      />

      {/* Payment History (only for existing payments) */}
      {!isNew && payment && (
        <PaymentHistory
          paymentId={payment.id}
          history={history}
          onHistoryChange={handleHistoryChange}
        />
      )}
    </div>
  )
}
