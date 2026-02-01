import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Plus, Search, ArrowUpDown } from 'lucide-react'
import type { RecurringPayment } from '../types/payment'
import { getRecurringPayments } from '../services/payment-service'
import { calculateNextDueDate } from '../services/payment-generator'

type SortField = 'name' | 'cost' | 'nextDue' | 'location'
type SortDirection = 'asc' | 'desc'

interface PaymentWithNextDue extends RecurringPayment {
  nextDueDate: string
}

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
          payment.location.toLowerCase().includes(query),
      )
    }

    // Sort
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

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  function handleRowClick(paymentId: string) {
    navigate({ to: '/payments/$paymentId', params: { paymentId } })
  }

  function handleNewPayment() {
    navigate({ to: '/payments/$paymentId', params: { paymentId: 'new' } })
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
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
    <div className="space-y-4">
      {/* Search and New Payment Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="form-control w-full sm:w-96">
          <div className="input-group">
            <span className="bg-base-200">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Search by name, company, or location..."
              className="input input-bordered w-full"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleNewPayment}>
          <Plus className="h-5 w-5" />
          New Payment
        </button>
      </div>

      {/* Payments Table */}
      {filteredPayments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-base-content/70">
            {searchQuery ? 'No payments found matching your search.' : 'No recurring payments yet.'}
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
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleSort('name')}
                  >
                    Name
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleSort('location')}
                  >
                    Location
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th>Company</th>
                <th>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleSort('cost')}
                  >
                    Cost
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th>Frequency</th>
                <th>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleSort('nextDue')}
                  >
                    Next Due
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => (
                <tr
                  key={payment.id}
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => handleRowClick(payment.id)}
                >
                  <td className="font-medium">{payment.name}</td>
                  <td>{payment.location}</td>
                  <td>{payment.company}</td>
                  <td>{formatCurrency(payment.cost)}</td>
                  <td>{getPeriodicityLabel(payment.periodicity)}</td>
                  <td>{formatDate(payment.nextDueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {filteredPayments.length > 0 && (
        <div className="text-sm text-base-content/70">
          Showing {filteredPayments.length} of {payments.length} payment{payments.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
