import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createRouter,
  createRootRoute,
  createRoute,
  RouterProvider,
} from '@tanstack/react-router'
import { PaymentsTable } from './payments-table'
import * as paymentService from '../services/payment-service'
import type { RecurringPayment } from '../types/payment'

// Mock the payment service
vi.mock('../services/payment-service')

const mockPayments: RecurringPayment[] = [
  {
    id: '1',
    name: 'Electricity',
    location: 'Main House',
    company: 'PowerCo',
    website: 'https://powerco.example.com',
    phone: '555-0100',
    periodicity: 1,
    paymentMonth: 1,
    paymentDay: 15,
    cost: 150.0,
    bank: 'Chase Bank',
  },
  {
    id: '2',
    name: 'Internet',
    location: 'Main House',
    company: 'FastNet ISP',
    website: 'https://fastnet.example.com',
    phone: '555-0200',
    periodicity: 1,
    paymentMonth: 1,
    paymentDay: 1,
    cost: 79.99,
    bank: 'Chase Bank',
  },
  {
    id: '3',
    name: 'Home Insurance',
    location: 'Beach House',
    company: 'SecureHome Insurance',
    website: 'https://securehome.example.com',
    phone: '555-0300',
    periodicity: 12,
    paymentMonth: 3,
    paymentDay: 1,
    cost: 1200.0,
    bank: 'Wells Fargo',
  },
]

function renderWithRouter() {
  const rootRoute = createRootRoute({
    component: () => <PaymentsTable />,
  })

  const paymentsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/payments',
    component: () => <PaymentsTable />,
  })

  const paymentDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/payments/$paymentId',
    component: () => <div>Payment Detail</div>,
  })

  const routeTree = rootRoute.addChildren([paymentsRoute, paymentDetailRoute])
  const router = createRouter({ routeTree })

  return render(<RouterProvider router={router} />)
}

describe('PaymentsTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(paymentService.getRecurringPayments).mockResolvedValue(
      mockPayments,
    )
  })

  it('renders payments table with data', async () => {
    renderWithRouter()

    await waitFor(() => {
      expect(screen.getByText('Electricity')).toBeInTheDocument()
    })

    expect(screen.getByText('Internet')).toBeInTheDocument()
    expect(screen.getByText('Home Insurance')).toBeInTheDocument()
  })

  it('displays payment details correctly', async () => {
    renderWithRouter()

    await waitFor(() => {
      expect(screen.getByText('Electricity')).toBeInTheDocument()
    })

    expect(screen.getByText('PowerCo')).toBeInTheDocument()
    expect(screen.getAllByText('Main House').length).toBeGreaterThan(0)
    expect(screen.getByText('$150.00')).toBeInTheDocument()
    expect(screen.getAllByText('Monthly').length).toBeGreaterThan(0)
  })

  it('renders New Payment button', async () => {
    renderWithRouter()

    await waitFor(() => {
      expect(screen.getByText('Electricity')).toBeInTheDocument()
    })

    const newPaymentButtons = screen.getAllByText('New Payment')
    expect(newPaymentButtons.length).toBeGreaterThan(0)
  })

  it('filters payments by search query', async () => {
    const user = userEvent.setup()
    renderWithRouter()

    await waitFor(() => {
      expect(screen.getByText('Electricity')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(
      /search by name, company, or location/i,
    )
    await user.type(searchInput, 'Insurance')

    await waitFor(() => {
      expect(screen.getByText('Home Insurance')).toBeInTheDocument()
      expect(screen.queryByText('Electricity')).not.toBeInTheDocument()
      expect(screen.queryByText('Internet')).not.toBeInTheDocument()
    })
  })

  it('filters payments by location', async () => {
    const user = userEvent.setup()
    renderWithRouter()

    await waitFor(() => {
      expect(screen.getByText('Electricity')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(
      /search by name, company, or location/i,
    )
    await user.type(searchInput, 'Beach House')

    await waitFor(() => {
      expect(screen.getByText('Home Insurance')).toBeInTheDocument()
      expect(screen.queryByText('Electricity')).not.toBeInTheDocument()
    })
  })

  it('shows empty state when no payments match search', async () => {
    const user = userEvent.setup()
    renderWithRouter()

    await waitFor(() => {
      expect(screen.getByText('Electricity')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(
      /search by name, company, or location/i,
    )
    await user.type(searchInput, 'NonexistentPayment')

    await waitFor(() => {
      expect(
        screen.getByText('No payments found matching your search.'),
      ).toBeInTheDocument()
    })
  })

  it('displays error message on fetch failure', async () => {
    vi.mocked(paymentService.getRecurringPayments).mockRejectedValue(
      new Error('Network error'),
    )

    renderWithRouter()

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('shows payment count', async () => {
    renderWithRouter()

    await waitFor(() => {
      expect(screen.getByText('Electricity')).toBeInTheDocument()
    })

    expect(screen.getByText(/showing 3 of 3 payments/i)).toBeInTheDocument()
  })
})
