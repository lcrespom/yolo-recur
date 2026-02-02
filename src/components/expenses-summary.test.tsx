import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ExpensesSummary } from './expenses-summary'
import type { RecurringPayment } from '../types/payment'

const mockPayments: RecurringPayment[] = [
  {
    id: '1',
    name: 'Netflix',
    location: 'Home',
    company: 'Netflix Inc',
    website: 'https://netflix.com',
    phone: '1-800-555-1234',
    periodicity: 1, // Monthly
    paymentMonth: 1,
    paymentDay: 15,
    cost: 15.99,
    bank: 'Chase',
  },
  {
    id: '2',
    name: 'Spotify',
    location: 'Personal',
    company: 'Spotify',
    website: 'https://spotify.com',
    phone: '',
    periodicity: 1, // Monthly
    paymentMonth: 1,
    paymentDay: 1,
    cost: 9.99,
    bank: 'Chase',
  },
  {
    id: '3',
    name: 'Annual Insurance',
    location: 'Home',
    company: 'Insurance Co',
    website: '',
    phone: '',
    periodicity: 12, // Yearly
    paymentMonth: 1,
    paymentDay: 1,
    cost: 1200,
    bank: 'Wells Fargo',
  },
]

describe('ExpensesSummary', () => {
  it('renders summary cards', () => {
    render(<ExpensesSummary payments={mockPayments} />)

    expect(screen.getByText('Monthly Total')).toBeInTheDocument()
    expect(screen.getByText('Yearly Total')).toBeInTheDocument()
    expect(screen.getByText('Active Payments')).toBeInTheDocument()
  })

  it('calculates monthly total correctly', () => {
    render(<ExpensesSummary payments={mockPayments} />)

    // Netflix: 15.99/month + Spotify: 9.99/month + Insurance: 1200/12 = 125.98
    expect(screen.getByText('€ 125.98')).toBeInTheDocument()
  })

  it('calculates yearly total correctly', () => {
    render(<ExpensesSummary payments={mockPayments} />)

    // Monthly total * 12 = 125.98 * 12 = 1511.76
    expect(screen.getByText('€ 1,511.76')).toBeInTheDocument()
  })

  it('shows correct payment count', () => {
    render(<ExpensesSummary payments={mockPayments} />)

    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('handles empty payments array', () => {
    render(<ExpensesSummary payments={[]} />)

    const zeroAmounts = screen.getAllByText('€ 0.00')
    expect(zeroAmounts).toHaveLength(2) // Monthly and Yearly
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
