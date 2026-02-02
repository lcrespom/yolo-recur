import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, Trash2, X } from 'lucide-react'

import type { RecurringPayment } from '../../types/payment'
import {
  createRecurringPayment,
  updateRecurringPayment,
  deleteRecurringPayment,
} from '../../services/payment-service'
import { paymentFormSchema, type PaymentFormData } from '../../validation/payment-schema'
import { FormInput } from '../common/form-input'

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
    if (payment) reset({ ...payment })
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
          <div className="form-row">
            <FormInput
              label="Name *"
              registration={register('name')}
              error={errors.name}
              type="text"
              placeholder="e.g., Netflix Subscription"
            />

            <FormInput
              label="Location *"
              registration={register('location')}
              error={errors.location}
              type="text"
              placeholder="e.g., Home, Office, Personal"
            />
          </div>

          {/* Company and Bank */}
          <div className="form-row">
            <FormInput
              label="Company *"
              registration={register('company')}
              error={errors.company}
              type="text"
              placeholder="e.g., Netflix"
            />

            <FormInput
              label="Bank"
              registration={register('bank')}
              type="text"
              placeholder="e.g., Chase, Wells Fargo"
            />
          </div>

          {/* Website and Phone */}
          <div className="form-row">
            <FormInput
              label="Website"
              registration={register('website')}
              type="url"
              placeholder="https://example.com"
            />

            <FormInput
              label="Phone"
              registration={register('phone')}
              type="tel"
              placeholder="(555) 123-4567"
            />
          </div>

          {/* Cost and Periodicity */}
          <div className="form-row">
            <FormInput
              label="Cost *"
              registration={register('cost', { valueAsNumber: true })}
              error={errors.cost}
              type="number"
              step="0.01"
              placeholder="0.00"
            />

            <label className="form-control">
              <span className="label-text mb-2 block">Periodicity *</span>
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
                <div className="text-error mt-1 text-sm">
                  {errors.periodicity.message}
                </div>
              )}
            </label>
          </div>

          {/* Payment Day and Payment Start Month */}
          <div className="form-row">
            <FormInput
              label="Payment Day *"
              registration={register('paymentDay', { valueAsNumber: true })}
              error={errors.paymentDay}
              type="number"
              min="1"
              max="31"
              placeholder="1-31"
            />

            <label className="form-control">
              <span className="label-text mb-2 block">Payment Start Month *</span>
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
                <div className="text-error mt-1 text-sm">
                  {errors.paymentMonth.message}
                </div>
              )}
            </label>
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
              Are you sure you want to delete this recurring payment? This action cannot
              be undone.
            </p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
