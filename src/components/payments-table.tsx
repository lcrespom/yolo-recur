import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Plus, ArrowUpDown } from 'lucide-react'

import type { RecurringPayment } from '../types/payment'
import { getRecurringPayments } from '../services/payment-service'
import { calculateNextDueDate } from '../services/payment-generator'
import { SearchInput } from './search-input'
import { config } from '../config'

type SortField = 'name' | 'cost' | 'nextDue' | 'location'
type SortDirection = 'asc' | 'desc'

interface PaymentWithNextDue extends RecurringPayment {
  nextDueDate: string
}

//#region -------------------- Helper Functions --------------------
function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `${config.currencySymbol} ${formatted}`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getPeriodicityLabel(months: number): string {
  if (months === 1) return 'Monthly'
  if (months === 12) return 'Yearly'
  return `Every ${months} months`
}

function sortResults(
  result: PaymentWithNextDue[],
  sortField: SortField,
  sortDirection: SortDirection
) {
  result.sort((a, b) => {
    let compareValue = 0
    switch (sortField) {
      case 'name':
        compareValue = a.name.localeCompare(b.name)
        break
      case 'cost':
        compareValue = a.cost - b.cost
        break
      case 'nextDue':
        compareValue = a.nextDueDate.localeCompare(b.nextDueDate)
        break
      case 'location':
        compareValue = a.location.localeCompare(b.location)
        break
    }
    return sortDirection === 'asc' ? compareValue : -compareValue
  })
}

//#region -------------------- Main component --------------------
export function PaymentsTable() {
  const navigate = useNavigate()
  const [payments, setPayments] = useState<PaymentWithNextDue[]>([])
  const [filteredPayments, setFilteredPayments] = useState<PaymentWithNextDue[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filterAndSortPayments = useCallback(() => {
    let result = [...payments]
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        payment =>
          payment.name.toLowerCase().includes(query) ||
          payment.company.toLowerCase().includes(query) ||
          payment.location.toLowerCase().includes(query)
      )
    }
    sortResults(result, sortField, sortDirection)
    setFilteredPayments(result)
  }, [payments, searchQuery, sortField, sortDirection])

  const loadPayments = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getRecurringPayments()
      // Calculate next due date for each payment
      const paymentsWithDueDates: PaymentWithNextDue[] = data.map(payment => ({
        ...payment,
        nextDueDate: calculateNextDueDate(payment),
      }))
      setPayments(paymentsWithDueDates)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payments')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPayments()
  }, [loadPayments])

  useEffect(() => {
    filterAndSortPayments()
  }, [filterAndSortPayments])

  function handleRowClick(paymentId: string) {
    navigate({ to: '/payments/$paymentId', params: { paymentId } })
  }

  function handleNewPayment() {
    navigate({ to: '/payments/$paymentId', params: { paymentId: 'new' } })
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  function SortableHeader({
    field,
    label,
    className,
  }: {
    field: SortField
    label: string
    className?: string
  }) {
    return (
      <th className={className}>
        <button className="btn btn-ghost btn-sm" onClick={() => handleSort(field)}>
          {label}
          <ArrowUpDown className="h-4 w-4" />
        </button>
      </th>
    )
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
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    )
  }

  //#region -------------------- Component render --------------------
  return (
    <div className="space-y-4">
      {/* Search and New Payment Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, company, or location..."
        />
        <button className="btn btn-primary" onClick={handleNewPayment}>
          <Plus className="h-5 w-5" />
          New Payment
        </button>
      </div>

      {/* Payments Table */}
      {filteredPayments.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-base-content/70">
            {searchQuery
              ? 'No payments found matching your search.'
              : 'No recurring payments yet.'}
          </p>
          {!searchQuery && (
            <button className="btn btn-primary mt-4" onClick={handleNewPayment}>
              <Plus className="h-5 w-5" />
              Add Your First Payment
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-zebra table">
            <thead>
              <tr>
                <SortableHeader field="name" label="Name" />
                <SortableHeader field="location" label="Location" />
                <th>Company</th>
                <SortableHeader field="cost" label="Cost" className="text-right" />
                <th className="text-center">Frequency</th>
                <SortableHeader field="nextDue" label="Next Due" className="text-right" />
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => (
                <tr
                  key={payment.id}
                  className="hover:bg-base-200 cursor-pointer"
                  onClick={() => handleRowClick(payment.id)}
                >
                  <td className="font-medium">{payment.name}</td>
                  <td>{payment.location}</td>
                  <td>{payment.company}</td>
                  <td className="text-right">{formatCurrency(payment.cost)}</td>
                  <td className="text-center">
                    {getPeriodicityLabel(payment.periodicity)}
                  </td>
                  <td className="text-right">{formatDate(payment.nextDueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {filteredPayments.length > 0 && (
        <div className="text-base-content/70 text-sm">
          Showing {filteredPayments.length} of {payments.length} payment
          {payments.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
