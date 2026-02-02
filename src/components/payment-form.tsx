import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, Trash2, X } from 'lucide-react'

import type { RecurringPayment } from '../types/payment'
import {
  createRecurringPayment,
  updateRecurringPayment,
  deleteRecurringPayment,
} from '../services/payment-service'
import { paymentFormSchema, type PaymentFormData } from '../validation/payment-schema'

interface PaymentFormProps {
  payment: RecurringPayment | null
  onSaveSuccess: () => void
  onDeleteSuccess: () => void
  onCancel: () => void
}

export function PaymentForm({
  payment,
  onSaveSuccess,
  onDeleteSuccess,
  onCancel,
}: PaymentFormProps) {
  const isNew = !payment

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      name: payment?.name || '',
      location: payment?.location || '',
      company: payment?.company || '',
      website: payment?.website || '',
      phone: payment?.phone || '',
      periodicity: payment?.periodicity || 1,
      paymentMonth: payment?.paymentMonth || 1,
      paymentDay: payment?.paymentDay || 1,
      cost: payment?.cost || 0,
      bank: payment?.bank || '',
    },
  })

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Update form when payment prop changes
  useEffect(() => {
    if (payment) {
      reset({
        name: payment.name,
        location: payment.location,
        company: payment.company,
        website: payment.website,
        phone: payment.phone,
        periodicity: payment.periodicity,
        paymentMonth: payment.paymentMonth,
        paymentDay: payment.paymentDay,
        cost: payment.cost,
        bank: payment.bank,
      })
    }
  }, [payment, reset])

  async function handleSubmit(data: PaymentFormData) {
    try {
      if (isNew) {
        await createRecurringPayment(data)
      } else {
        await updateRecurringPayment(payment.id, data)
      }
      onSaveSuccess()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save payment')
    }
  }

  async function handleDelete() {
    if (!payment) return

    try {
      await deleteRecurringPayment(payment.id)
      onDeleteSuccess()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete payment')
    } finally {
      setShowDeleteModal(false)
    }
  }

  function handleCancel() {
    if (isDirty) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        onCancel()
      }
    } else {
      onCancel()
    }
  }

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-6">
          {/* Name and Location */}
          <div className="grid grid-cols-1 items-start gap-x-8 gap-y-6 md:grid-cols-2">
            <div className="form-control">
              <label className="label mb-2 block">
                <span className="label-text font-medium">Name *</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                {...register('name')}
                placeholder="e.g., Netflix Subscription"
              />
              {errors.name && (
                <div className="mt-1 text-sm text-error">{errors.name.message}</div>
              )}
            </div>

            <div className="form-control">
              <label className="label mb-2 block">
                <span className="label-text font-medium">Location *</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${errors.location ? 'input-error' : ''}`}
                {...register('location')}
                placeholder="e.g., Home, Office, Personal"
              />
              {errors.location && (
                <div className="mt-1 text-sm text-error">{errors.location.message}</div>
              )}
            </div>
          </div>

          {/* Company and Bank */}
          <div className="grid grid-cols-1 items-start gap-x-8 gap-y-6 md:grid-cols-2">
            <div className="form-control">
              <label className="label mb-2 block">
                <span className="label-text font-medium">Company *</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${errors.company ? 'input-error' : ''}`}
                {...register('company')}
                placeholder="e.g., Netflix"
              />
              {errors.company && (
                <div className="mt-1 text-sm text-error">{errors.company.message}</div>
              )}
            </div>

            <div className="form-control">
              <label className="label mb-2 block">
                <span className="label-text font-medium">Bank</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                {...register('bank')}
                placeholder="e.g., Chase, Wells Fargo"
              />
            </div>
          </div>

          {/* Website and Phone */}
          <div className="grid grid-cols-1 items-start gap-x-8 gap-y-6 md:grid-cols-2">
            <div className="form-control">
              <label className="label mb-2 block">
                <span className="label-text font-medium">Website</span>
              </label>
              <input
                type="url"
                className="input input-bordered"
                {...register('website')}
                placeholder="https://example.com"
              />
            </div>

            <div className="form-control">
              <label className="label mb-2 block">
                <span className="label-text font-medium">Phone</span>
              </label>
              <input
                type="tel"
                className="input input-bordered"
                {...register('phone')}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          {/* Cost and Periodicity */}
          <div className="grid grid-cols-1 items-start gap-x-8 gap-y-6 md:grid-cols-2">
            <div className="form-control">
              <label className="label mb-2 block">
                <span className="label-text font-medium">Cost *</span>
              </label>
              <input
                type="number"
                step="0.01"
                className={`input input-bordered ${errors.cost ? 'input-error' : ''}`}
                {...register('cost', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.cost && (
                <div className="mt-1 text-sm text-error">{errors.cost.message}</div>
              )}
            </div>

            <div className="form-control">
              <label className="label mb-2 block">
                <span className="label-text font-medium">Periodicity *</span>
              </label>
              <select
                className={`select select-bordered ${errors.periodicity ? 'select-error' : ''}`}
                {...register('periodicity', { valueAsNumber: true })}
              >
                <option value={1}>Monthly (1)</option>
                <option value={2}>Every 2 months</option>
                <option value={3}>Quarterly (3)</option>
                <option value={6}>Semi-annually (6)</option>
                <option value={12}>Yearly (12)</option>
              </select>
              {errors.periodicity && (
                <div className="mt-1 text-sm text-error">{errors.periodicity.message}</div>
              )}
            </div>
          </div>

          {/* Payment Day and Payment Start Month */}
          <div className="grid grid-cols-1 items-start gap-x-8 gap-y-6 md:grid-cols-2">
            <div className="form-control">
              <label className="label mb-2 block">
                <span className="label-text font-medium">Payment Day *</span>
              </label>
              <input
                type="number"
                min="1"
                max="31"
                className={`input input-bordered ${errors.paymentDay ? 'input-error' : ''}`}
                {...register('paymentDay', { valueAsNumber: true })}
                placeholder="1-31"
              />
              {errors.paymentDay && (
                <div className="mt-1 text-sm text-error">{errors.paymentDay.message}</div>
              )}
            </div>

            <div className="form-control">
              <label className="label mb-2 block">
                <span className="label-text font-medium">Payment Start Month *</span>
              </label>
              <select
                className={`select select-bordered ${errors.paymentMonth ? 'select-error' : ''}`}
                {...register('paymentMonth', { valueAsNumber: true })}
              >
                <option value={1}>January</option>
                <option value={2}>February</option>
                <option value={3}>March</option>
                <option value={4}>April</option>
                <option value={5}>May</option>
                <option value={6}>June</option>
                <option value={7}>July</option>
                <option value={8}>August</option>
                <option value={9}>September</option>
                <option value={10}>October</option>
                <option value={11}>November</option>
                <option value={12}>December</option>
              </select>
              {errors.paymentMonth && (
                <div className="mt-1 text-sm text-error">{errors.paymentMonth.message}</div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap gap-2 pt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || (!isNew && !isDirty)}
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>

            <button type="button" className="btn btn-ghost" onClick={handleCancel}>
              <X className="h-4 w-4" />
              Cancel
            </button>

            {!isNew && (
              <button
                type="button"
                className="btn btn-error ml-auto"
                onClick={() => setShowDeleteModal(true)}
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete this recurring payment? This action cannot be
              undone.
            </p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={handleDelete} disabled={isSubmitting}>
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
