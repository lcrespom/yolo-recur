import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ExpensesByLocation } from './expenses-by-location'
import type { RecurringPayment } from '../../types/payment'

const mockPayments: RecurringPayment[] = [
  {
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
  },
  {
    id: '2',
    name: 'Spotify',
    location: 'Personal',
    company: 'Spotify',
    website: 'https://spotify.com',
    phone: '',
    periodicity: 1,
    paymentMonth: 1,
    paymentDay: 1,
    cost: 9.99,
    bank: 'Chase',
  },
  {
    id: '3',
    name: 'Home Insurance',
    location: 'Home',
    company: 'Insurance Co',
    website: '',
    phone: '',
    periodicity: 12,
    paymentMonth: 1,
    paymentDay: 1,
    cost: 1200,
    bank: 'Wells Fargo',
  },
]

describe('ExpensesByLocation', () => {
  it('renders expenses grouped by location', () => {
    render(<ExpensesByLocation payments={mockPayments} history={[]} />)

    expect(screen.getByText('Expenses by Location')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Personal')).toBeInTheDocument()
  })

  it('calculates location totals correctly', () => {
    render(<ExpensesByLocation payments={mockPayments} history={[]} />)

    // Home: Netflix (15.99) + Insurance (1200/12 = 100) = 115.99/month
    expect(screen.getByText('€ 115.99')).toBeInTheDocument()

    // Personal: Spotify (9.99)
    expect(screen.getByText('€ 9.99')).toBeInTheDocument()
  })

  it('shows payment count per location', () => {
    render(<ExpensesByLocation payments={mockPayments} history={[]} />)

    const rows = screen.getAllByRole('row')
    // Header + 2 location rows + footer
    expect(rows).toHaveLength(4)
  })

  it('sorts locations by monthly total descending', () => {
    render(<ExpensesByLocation payments={mockPayments} history={[]} />)

    const locationCells = screen.getAllByRole('cell').filter(cell => {
      const text = cell.textContent
      return text === 'Home' || text === 'Personal'
    })

    // Home should appear before Personal (higher total)
    expect(locationCells[0].textContent).toBe('Home')
    expect(locationCells[1].textContent).toBe('Personal')
  })

  it('shows total row with correct sums', () => {
    render(<ExpensesByLocation payments={mockPayments} history={[]} />)

    expect(screen.getByText('Total')).toBeInTheDocument()
    // Total monthly: 115.99 + 9.99 = 125.98
    expect(screen.getByText('€ 125.98')).toBeInTheDocument()
  })

  it('renders nothing for empty payments array', () => {
    const { container } = render(<ExpensesByLocation payments={[]} history={[]} />)

    expect(container.firstChild).toBeNull()
  })
})
