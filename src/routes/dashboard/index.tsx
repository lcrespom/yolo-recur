import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'

import type { RecurringPayment, PaymentHistoryEntry } from '../../types/payment'
import { getRecurringPayments } from '../../services/payment-service'
import { getAllPaymentHistory } from '../../services/payment-history-service'
import { ExpensesSummary } from '../../components/expenses-summary'
import { ExpensesByLocation } from '../../components/expenses-by-location'
import { UpcomingPayments } from '../../components/upcoming-payments'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  const [payments, setPayments] = useState<RecurringPayment[]>([])
  const [history, setHistory] = useState<PaymentHistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPayments = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [paymentsData, historyData] = await Promise.all([
        getRecurringPayments(),
        getAllPaymentHistory(),
      ])
      setPayments(paymentsData)
      setHistory(historyData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPayments()
  }, [loadPayments])

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <ExpensesSummary payments={payments} />

      <UpcomingPayments payments={payments} history={history} />

      <ExpensesByLocation payments={payments} />
    </div>
  )
}
