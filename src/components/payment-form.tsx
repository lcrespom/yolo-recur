import { useEffect, useState } from 'react'
import { Save, Trash2, X } from 'lucide-react'

import type { RecurringPayment, RecurringPaymentInput } from '../types/payment'
import {
  createRecurringPayment,
  updateRecurringPayment,
  deleteRecurringPayment,
} from '../services/payment-service'

interface PaymentFormProps {
  payment: RecurringPayment | null
  onSaveSuccess: () => void
  onDeleteSuccess: () => void
  onCancel: () => void
}

type FormData = RecurringPaymentInput

interface FormErrors {
  name?: string
  location?: string
  company?: string
  cost?: string
  periodicity?: string
  paymentMonth?: string
  paymentDay?: string
}

export function PaymentForm({
  payment,
  onSaveSuccess,
  onDeleteSuccess,
  onCancel,
}: PaymentFormProps) {
  const isNew = !payment

  const [formData, setFormData] = useState<FormData>(() => ({
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
  }))

  const [originalData, setOriginalData] = useState<FormData>(formData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Update form data when payment prop changes
  useEffect(() => {
    if (payment) {
      const data: FormData = {
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
      }
      setFormData(data)
      setOriginalData(data)
    }
  }, [payment])

  // Detect unsaved changes
  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(originalData)
    setHasUnsavedChanges(changed)
  }, [formData, originalData])

  function validateForm(): boolean {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company is required'
    }

    if (formData.cost <= 0) {
      newErrors.cost = 'Cost must be greater than 0'
    }

    if (formData.periodicity < 1) {
      newErrors.periodicity = 'Periodicity must be at least 1 month'
    }

    if (formData.paymentMonth < 1 || formData.paymentMonth > 12) {
      newErrors.paymentMonth = 'Payment month must be between 1 and 12'
    }

    if (formData.paymentDay < 1 || formData.paymentDay > 31) {
      newErrors.paymentDay = 'Payment day must be between 1 and 31'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSaving(true)
      if (isNew) {
        await createRecurringPayment(formData)
      } else {
        await updateRecurringPayment(payment.id, formData)
      }
      onSaveSuccess()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save payment')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!payment) return

    try {
      setIsSaving(true)
      await deleteRecurringPayment(payment.id)
      onDeleteSuccess()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete payment')
    } finally {
      setIsSaving(false)
      setShowDeleteModal(false)
    }
  }

  function handleCancel() {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        onCancel()
      }
    } else {
      onCancel()
    }
  }

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name and Location */}
          <div className="grid grid-cols-1 items-start gap-x-8 gap-y-6 md:grid-cols-2">
            <div className="form-control">
              <label className="label mb-2 block">
                <span className="label-text font-medium">Name *</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                value={formData.name}
                onChange={e => updateField('name', e.target.value)}
                placeholder="e.g., Netflix Subscription"
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.name}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label mb-2 block">
                <span className="label-text font-medium">Location *</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${errors.location ? 'input-error' : ''}`}
                value={formData.location}
                onChange={e => updateField('location', e.target.value)}
                placeholder="e.g., Home, Office, Personal"
              />
              {errors.location && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.location}</span>
                </label>
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
                value={formData.company}
                onChange={e => updateField('company', e.target.value)}
                placeholder="e.g., Netflix"
              />
              {errors.company && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.company}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label mb-2 block">
                <span className="label-text font-medium">Bank</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={formData.bank}
                onChange={e => updateField('bank', e.target.value)}
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
                value={formData.website}
                onChange={e => updateField('website', e.target.value)}
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
                value={formData.phone}
                onChange={e => updateField('phone', e.target.value)}
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
                value={formData.cost}
                onChange={e => updateField('cost', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
              {errors.cost && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.cost}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label mb-2 block">
                <span className="label-text font-medium">Periodicity *</span>
              </label>
              <select
                className={`select select-bordered ${errors.periodicity ? 'select-error' : ''}`}
                value={formData.periodicity}
                onChange={e => updateField('periodicity', parseInt(e.target.value))}
              >
                <option value={1}>Monthly (1)</option>
                <option value={2}>Every 2 months</option>
                <option value={3}>Quarterly (3)</option>
                <option value={6}>Semi-annually (6)</option>
                <option value={12}>Yearly (12)</option>
              </select>
              {errors.periodicity && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.periodicity}</span>
                </label>
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
                value={formData.paymentDay}
                onChange={e => updateField('paymentDay', parseInt(e.target.value) || 1)}
                placeholder="1-31"
              />
              {errors.paymentDay && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.paymentDay}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label mb-2 block">
                <span className="label-text font-medium">Payment Start Month *</span>
              </label>
              <select
                className={`select select-bordered ${errors.paymentMonth ? 'select-error' : ''}`}
                value={formData.paymentMonth}
                onChange={e => updateField('paymentMonth', parseInt(e.target.value))}
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
                <label className="label">
                  <span className="label-text-alt text-error">{errors.paymentMonth}</span>
                </label>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap gap-2 pt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving || (!isNew && !hasUnsavedChanges)}
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save'}
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
                disabled={isSaving}
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
              <button className="btn btn-error" onClick={handleDelete} disabled={isSaving}>
                {isSaving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
