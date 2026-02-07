import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { UpcomingPayments } from './upcoming-payments'
import type { RecurringPayment, PaymentHistoryEntry } from '../../types/payment'

const mockPayments: RecurringPayment[] = [
  {
    id: '1',
    userId: 'test-user-id',
    name: 'Netflix',
    location: 'Home',
    company: 'Netflix Inc',
    website: 'https://netflix.com',
    phone: '',
    periodicity: 1,
    paymentMonth: 1,
    paymentDay: 15,
    cost: 15.99,
    bank: 'Chase',
  },
  {
    id: '2',
    userId: 'test-user-id',
    name: 'Spotify',
    location: 'Personal',
    company: 'Spotify',
    website: '',
    phone: '',
    periodicity: 1,
    paymentMonth: 1,
    paymentDay: 1,
    cost: 9.99,
    bank: 'Chase',
  },
]

const mockHistory: PaymentHistoryEntry[] = [
  {
    id: 'h1',
    userId: 'test-user-id',
    recurringPaymentId: '1',
    date: '2026-02-15',
    amount: 15.99,
    isPaid: false,
  },
  {
    id: 'h2',
    userId: 'test-user-id',
    recurringPaymentId: '2',
    date: '2026-02-01',
    amount: 9.99,
    isPaid: false,
  },
  {
    id: 'h3',
    userId: 'test-user-id',
    recurringPaymentId: '1',
    date: '2026-01-15',
    amount: 15.99,
    isPaid: true,
  },
]

describe('UpcomingPayments', () => {
  it('renders upcoming unpaid payments', () => {
    render(<UpcomingPayments payments={mockPayments} history={mockHistory} />)

    expect(screen.getByText('Upcoming Payments')).toBeInTheDocument()
    expect(screen.getByText('Netflix')).toBeInTheDocument()
    expect(screen.getByText('Spotify')).toBeInTheDocument()
  })

  it('sorts payments by date ascending', () => {
    render(<UpcomingPayments payments={mockPayments} history={mockHistory} />)

    const rows = screen.getAllByRole('row')
    // Should have header + 2 unpaid payments + footer
    expect(rows).toHaveLength(4)

    // First payment should be Spotify (Feb 1), then Netflix (Feb 15)
    expect(screen.getByText('Feb 1, 2026')).toBeInTheDocument()
    expect(screen.getByText('Feb 15, 2026')).toBeInTheDocument()
  })

  it('does not show paid payments', () => {
    render(<UpcomingPayments payments={mockPayments} history={mockHistory} />)

    // Jan 15 payment is paid, should not appear
    expect(screen.queryByText('Jan 15, 2026')).not.toBeInTheDocument()
  })

  it('calculates total due correctly', () => {
    render(<UpcomingPayments payments={mockPayments} history={mockHistory} />)

    expect(screen.getByText('Total Due')).toBeInTheDocument()
    // 15.99 + 9.99 = 25.98
    expect(screen.getByText('€ 25.98')).toBeInTheDocument()
  })

  it('shows message when no unpaid payments', () => {
    const allPaidHistory: PaymentHistoryEntry[] = [
      {
        id: 'h1',
        userId: 'test-user-id',
        recurringPaymentId: '1',
        date: '2026-02-15',
        amount: 15.99,
        isPaid: true,
      },
    ]

    render(<UpcomingPayments payments={mockPayments} history={allPaidHistory} />)

    expect(screen.getByText('All payments are up to date!')).toBeInTheDocument()
  })

  it('handles empty history array', () => {
    render(<UpcomingPayments payments={mockPayments} history={[]} />)

    expect(screen.getByText('All payments are up to date!')).toBeInTheDocument()
  })

  it('displays location for each payment', () => {
    render(<UpcomingPayments payments={mockPayments} history={mockHistory} />)

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Personal')).toBeInTheDocument()
  })
})
