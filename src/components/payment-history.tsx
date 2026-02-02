import { useState } from 'react'
import { Check, X, Edit2, Save } from 'lucide-react'

import type { PaymentHistoryEntry } from '../types/payment'
import {
  updatePaymentHistoryEntry,
  deletePaymentHistoryEntry,
} from '../services/payment-history-service'
import { config } from '../config'

interface PaymentHistoryProps {
  paymentId: string
  history: PaymentHistoryEntry[]
  onHistoryChange: () => void
}

interface EditingEntry {
  id: string
  amount: number
  isPaid: boolean
}

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

export function PaymentHistory({
  paymentId,
  history,
  onHistoryChange,
}: PaymentHistoryProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<EditingEntry | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  function handleEdit(entry: PaymentHistoryEntry) {
    setEditingId(entry.id)
    setEditingData({
      id: entry.id,
      amount: entry.amount,
      isPaid: entry.isPaid,
    })
  }

  function handleCancelEdit() {
    setEditingId(null)
    setEditingData(null)
  }

  async function handleSave() {
    if (!editingData) return

    try {
      setIsSaving(true)
      await updatePaymentHistoryEntry(editingData.id, {
        amount: editingData.amount,
        isPaid: editingData.isPaid,
        recurringPaymentId: paymentId,
        date: history.find(h => h.id === editingData.id)?.date || '',
      })
      setEditingId(null)
      setEditingData(null)
      onHistoryChange()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update payment history')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleTogglePaid(entry: PaymentHistoryEntry) {
    try {
      await updatePaymentHistoryEntry(entry.id, {
        isPaid: !entry.isPaid,
        recurringPaymentId: paymentId,
        date: entry.date,
        amount: entry.amount,
      })
      onHistoryChange()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update payment status')
    }
  }

  async function handleDelete(entryId: string) {
    if (!confirm('Are you sure you want to delete this payment history entry?')) {
      return
    }

    try {
      await deletePaymentHistoryEntry(entryId)
      onHistoryChange()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete payment history entry')
    }
  }

  if (history.length === 0) {
    return (
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Payment History</h2>
          <p className="text-base-content/70">No payment history yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h2 className="card-title">Payment History</h2>
        <div className="space-y-2">
          {history.map(entry => {
            const isEditing = editingId === entry.id

            return (
              <div
                key={entry.id}
                className={`bg-base-100 flex flex-wrap items-center gap-4 rounded-lg p-4 ${
                  entry.isPaid ? 'opacity-60' : ''
                }`}
              >
                {/* Date */}
                <div className="shrink-0">
                  <div className="text-sm font-medium">{formatDate(entry.date)}</div>
                </div>

                {/* Amount */}
                <div className="grow">
                  {isEditing && editingData ? (
                    <input
                      type="number"
                      step="0.01"
                      className="input input-bordered input-sm w-32"
                      value={editingData.amount}
                      onChange={e =>
                        setEditingData({
                          ...editingData,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  ) : (
                    <div className="text-sm font-semibold">
                      {formatCurrency(entry.amount)}
                    </div>
                  )}
                </div>

                {/* Paid Status */}
                <div className="flex items-center gap-2">
                  {isEditing && editingData ? (
                    <label className="label cursor-pointer gap-2">
                      <span className="label-text text-sm">Paid</span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={editingData.isPaid}
                        onChange={e =>
                          setEditingData({ ...editingData, isPaid: e.target.checked })
                        }
                      />
                    </label>
                  ) : (
                    <button
                      className={`btn btn-sm ${entry.isPaid ? 'btn-success' : 'btn-ghost'}`}
                      onClick={() => handleTogglePaid(entry)}
                      title={entry.isPaid ? 'Mark as unpaid' : 'Mark as paid'}
                    >
                      {entry.isPaid ? (
                        <>
                          <Check className="h-4 w-4" />
                          Paid
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4" />
                          Unpaid
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleEdit(entry)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
