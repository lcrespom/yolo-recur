import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { PaymentForm } from './payment-form'
import type { RecurringPayment } from '../types/payment'
import * as paymentService from '../services/payment-service'

// Mock the payment service
vi.mock('../services/payment-service', () => ({
  createRecurringPayment: vi.fn(),
  updateRecurringPayment: vi.fn(),
  deleteRecurringPayment: vi.fn(),
}))

const mockPayment: RecurringPayment = {
  id: '1',
  name: 'Netflix',
  location: 'Home',
  company: 'Netflix Inc',
  website: 'https://netflix.com',
  phone: '1-800-555-1234',
  periodicity: 1,
  paymentMonth: 1,
  paymentDay: 15,
  cost: 15.99,
  bank: 'Chase',
}

describe('PaymentForm', () => {
  const mockCallbacks = {
    onSaveSuccess: vi.fn(),
    onDeleteSuccess: vi.fn(),
    onCancel: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty form for new payment', () => {
    render(<PaymentForm payment={null} {...mockCallbacks} />)

    expect(screen.getByPlaceholderText('e.g., Netflix Subscription')).toHaveValue('')
    expect(screen.getByPlaceholderText('e.g., Home, Office, Personal')).toHaveValue('')
    expect(screen.getByPlaceholderText('e.g., Netflix')).toHaveValue('')
  })

  it('renders pre-filled form for existing payment', () => {
    render(<PaymentForm payment={mockPayment} {...mockCallbacks} />)

    expect(screen.getByDisplayValue('Netflix')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Home')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Netflix Inc')).toBeInTheDocument()
    expect(screen.getByDisplayValue('15.99')).toBeInTheDocument()
  })

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup()
    render(<PaymentForm payment={null} {...mockCallbacks} />)

    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Location is required')).toBeInTheDocument()
      expect(screen.getByText('Company is required')).toBeInTheDocument()
    })
  })

  it('has cost input field with proper validation', () => {
    render(<PaymentForm payment={null} {...mockCallbacks} />)

    const costInput = screen.getByPlaceholderText('0.00')
    expect(costInput).toBeInTheDocument()
    expect(costInput).toHaveAttribute('type', 'number')
    expect(costInput).toHaveAttribute('step', '0.01')
  })

  it('calls createRecurringPayment for new payment', async () => {
    const user = userEvent.setup()
    vi.mocked(paymentService.createRecurringPayment).mockResolvedValue({
      ...mockPayment,
      id: 'new-id',
    })

    render(<PaymentForm payment={null} {...mockCallbacks} />)

    // Fill in required fields
    await user.type(screen.getByPlaceholderText('e.g., Netflix Subscription'), 'Netflix')
    await user.type(screen.getByPlaceholderText('e.g., Home, Office, Personal'), 'Home')
    await user.type(screen.getByPlaceholderText('e.g., Netflix'), 'Netflix Inc')
    await user.clear(screen.getByPlaceholderText('0.00'))
    await user.type(screen.getByPlaceholderText('0.00'), '15.99')

    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(paymentService.createRecurringPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Netflix',
          location: 'Home',
          company: 'Netflix Inc',
          cost: 15.99,
        })
      )
      expect(mockCallbacks.onSaveSuccess).toHaveBeenCalled()
    })
  })

  it('calls updateRecurringPayment for existing payment', async () => {
    const user = userEvent.setup()
    vi.mocked(paymentService.updateRecurringPayment).mockResolvedValue({
      ...mockPayment,
      name: 'Netflix Premium',
    })

    render(<PaymentForm payment={mockPayment} {...mockCallbacks} />)

    // Modify the name
    const nameInput = screen.getByDisplayValue('Netflix')
    await user.clear(nameInput)
    await user.type(nameInput, 'Netflix Premium')

    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(paymentService.updateRecurringPayment).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          name: 'Netflix Premium',
        })
      )
      expect(mockCallbacks.onSaveSuccess).toHaveBeenCalled()
    })
  })

  it('shows delete button only for existing payments', () => {
    const { rerender } = render(<PaymentForm payment={null} {...mockCallbacks} />)
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()

    rerender(<PaymentForm payment={mockPayment} {...mockCallbacks} />)
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('shows confirmation modal before delete', async () => {
    const user = userEvent.setup()
    render(<PaymentForm payment={mockPayment} {...mockCallbacks} />)

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)

    expect(screen.getByText('Confirm Delete')).toBeInTheDocument()
    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument()
  })

  it('calls deleteRecurringPayment when confirmed', async () => {
    const user = userEvent.setup()
    vi.mocked(paymentService.deleteRecurringPayment).mockResolvedValue()

    render(<PaymentForm payment={mockPayment} {...mockCallbacks} />)

    // Open delete modal
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)

    // Confirm delete
    const confirmButton = screen.getAllByRole('button', { name: /delete/i })[1]
    await user.click(confirmButton)

    await waitFor(() => {
      expect(paymentService.deleteRecurringPayment).toHaveBeenCalledWith('1')
      expect(mockCallbacks.onDeleteSuccess).toHaveBeenCalled()
    })
  })

  it('disables save button when no unsaved changes', () => {
    render(<PaymentForm payment={mockPayment} {...mockCallbacks} />)

    const saveButton = screen.getByRole('button', { name: /save/i })
    expect(saveButton).toBeDisabled()
  })

  it('enables save button when form is modified', async () => {
    const user = userEvent.setup()
    render(<PaymentForm payment={mockPayment} {...mockCallbacks} />)

    const nameInput = screen.getByDisplayValue('Netflix')
    await user.type(nameInput, ' Premium')

    const saveButton = screen.getByRole('button', { name: /save/i })
    expect(saveButton).not.toBeDisabled()
  })
})
