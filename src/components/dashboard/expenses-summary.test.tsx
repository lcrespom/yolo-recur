import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ExpensesSummary } from './expenses-summary'
import type { RecurringPayment, PaymentHistoryEntry } from '../../types/payment'

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

describe('ExpensesSummary', () => {
  it('renders with no payments', () => {
    render(<ExpensesSummary payments={[]} history={[]} />)

    const zeroAmounts = screen.getAllByText('€ 0.00')
    expect(zeroAmounts).toHaveLength(2) // Monthly and Yearly
    expect(screen.getByText('0')).toBeInTheDocument() // Active Payments
  })

  it('calculates using template when no history exists', () => {
    const payments = [mockPayment]
    render(<ExpensesSummary payments={payments} history={[]} />)

    // Monthly: 15.99 / 1 = 15.99
    expect(screen.getByText('€ 15.99')).toBeInTheDocument()
    // Yearly: 15.99 * 12 = 191.88
    expect(screen.getByText('€ 191.88')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('calculates using actual history when sufficient data exists', () => {
    const payments = [mockPayment]

    // Create 12 months of history with varying amounts
    const history: PaymentHistoryEntry[] = []
    const now = new Date()
    for (let i = 0; i < 12; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      history.push({
        id: `${i}`,
        recurringPaymentId: '1',
        date: date.toISOString().split('T')[0],
        amount: 20.0, // Actual amount differs from template
        isPaid: true,
      })
    }

    render(<ExpensesSummary payments={payments} history={history} />)

    // Yearly: 12 * 20 = 240
    expect(screen.getByText('€ 240.00')).toBeInTheDocument()
    // Monthly: 240 / 12 = 20
    expect(screen.getByText('€ 20.00')).toBeInTheDocument()
  })

  it('falls back to estimation with insufficient history', () => {
    const payments = [mockPayment]

    // Only 6 months of history (less than 80% of 12)
    const history: PaymentHistoryEntry[] = []
    const now = new Date()
    for (let i = 0; i < 6; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      history.push({
        id: `${i}`,
        recurringPaymentId: '1',
        date: date.toISOString().split('T')[0],
        amount: 20.0,
        isPaid: true,
      })
    }

    render(<ExpensesSummary payments={payments} history={history} />)

    // Should use template-based estimation
    expect(screen.getByText('€ 15.99')).toBeInTheDocument()
    expect(screen.getByText('€ 191.88')).toBeInTheDocument()
  })

  it('only counts paid entries in history calculation', () => {
    const payments = [mockPayment]

    const history: PaymentHistoryEntry[] = []
    const now = new Date()

    // 10 paid entries
    for (let i = 0; i < 10; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      history.push({
        id: `paid-${i}`,
        recurringPaymentId: '1',
        date: date.toISOString().split('T')[0],
        amount: 20.0,
        isPaid: true,
      })
    }

    // 5 unpaid entries (should be ignored)
    for (let i = 10; i < 15; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      history.push({
        id: `unpaid-${i}`,
        recurringPaymentId: '1',
        date: date.toISOString().split('T')[0],
        amount: 100.0,
        isPaid: false,
      })
    }

    render(<ExpensesSummary payments={payments} history={history} />)

    // Should use actual history (10 entries >= 80% of 12)
    // Yearly: 10 * 20 = 200
    expect(screen.getByText('€ 200.00')).toBeInTheDocument()
    // Monthly: 200 / 12 = 16.67
    expect(screen.getByText('€ 16.67')).toBeInTheDocument()
  })

  it('handles quarterly payments with actual history', () => {
    const quarterlyPayment: RecurringPayment = {
      ...mockPayment,
      periodicity: 3,
      cost: 300,
    }

    const history: PaymentHistoryEntry[] = []
    const now = new Date()

    // 4 quarterly payments over 12 months
    for (let i = 0; i < 4; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i * 3)
      history.push({
        id: `${i}`,
        recurringPaymentId: '1',
        date: date.toISOString().split('T')[0],
        amount: 350.0, // Actual differs from template
        isPaid: true,
      })
    }

    render(<ExpensesSummary payments={[quarterlyPayment]} history={history} />)

    // Yearly: 4 * 350 = 1400
    expect(screen.getByText('€ 1,400.00')).toBeInTheDocument()
    // Monthly: 1400 / 12 = 116.67
    expect(screen.getByText('€ 116.67')).toBeInTheDocument()
  })

  it('combines actual and estimated for mixed payment types', () => {
    const payment1: RecurringPayment = {
      ...mockPayment,
      id: '1',
      cost: 100,
      periodicity: 1,
    }

    const payment2: RecurringPayment = {
      ...mockPayment,
      id: '2',
      cost: 200,
      periodicity: 1,
    }

    // Payment 1 has full history
    const history: PaymentHistoryEntry[] = []
    const now = new Date()
    for (let i = 0; i < 12; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      history.push({
        id: `1-${i}`,
        recurringPaymentId: '1',
        date: date.toISOString().split('T')[0],
        amount: 150.0,
        isPaid: true,
      })
    }
    // Payment 2 has no history

    render(<ExpensesSummary payments={[payment1, payment2]} history={history} />)

    // Payment 1 yearly: 12 * 150 = 1800
    // Payment 2 yearly: 200 * 12 = 2400
    // Total yearly: 4200
    expect(screen.getByText('€ 4,200.00')).toBeInTheDocument()
    // Monthly: 4200 / 12 = 350
    expect(screen.getByText('€ 350.00')).toBeInTheDocument()
  })
})
