import { describe, it, expect } from 'vitest'
import {
  calculateYearlyFromHistory,
  calculateTotals,
  groupByLocation,
} from './expense-calculation-service'
import type { RecurringPayment, PaymentHistoryEntry } from '../types/payment'

const createMockPayment = (
  overrides: Partial<RecurringPayment> = {}
): RecurringPayment => ({
  id: '1',
  userId: 'test-user-id',
  name: 'Test Payment',
  location: 'Test',
  company: 'Test Co',
  website: '',
  phone: '',
  periodicity: 1,
  paymentMonth: 1,
  paymentDay: 15,
  cost: 100,
  bank: 'Test Bank',
  ...overrides,
})

describe('calculateYearlyFromHistory', () => {
  it('returns null when no history exists', () => {
    const payment = createMockPayment()
    const result = calculateYearlyFromHistory(payment, [])
    expect(result).toBeNull()
  })

  it('returns null with insufficient history', () => {
    const payment = createMockPayment({ periodicity: 1 })
    const now = new Date()

    // Only 6 months (less than 80% of 12)
    const history: PaymentHistoryEntry[] = []
    for (let i = 0; i < 6; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      history.push({
        id: `${i}`,
        userId: 'test-user-id',
        recurringPaymentId: '1',
        date: date.toISOString().split('T')[0],
        amount: 100,
        isPaid: true,
      })
    }

    const result = calculateYearlyFromHistory(payment, history)
    expect(result).toBeNull()
  })

  it('calculates yearly total with sufficient history', () => {
    const payment = createMockPayment({ periodicity: 1 })
    const now = new Date()

    const history: PaymentHistoryEntry[] = []
    for (let i = 0; i < 12; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      history.push({
        id: `${i}`,
        userId: 'test-user-id',
        recurringPaymentId: '1',
        date: date.toISOString().split('T')[0],
        amount: 150,
        isPaid: true,
      })
    }

    const result = calculateYearlyFromHistory(payment, history)
    expect(result).toBe(1800) // 12 * 150
  })

  it('only counts paid entries', () => {
    const payment = createMockPayment({ periodicity: 1 })
    const now = new Date()

    const history: PaymentHistoryEntry[] = []
    // 10 paid
    for (let i = 0; i < 10; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      history.push({
        id: `paid-${i}`,
        userId: 'test-user-id',
        recurringPaymentId: '1',
        date: date.toISOString().split('T')[0],
        amount: 100,
        isPaid: true,
      })
    }
    // 5 unpaid
    for (let i = 10; i < 15; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      history.push({
        id: `unpaid-${i}`,
        userId: 'test-user-id',
        recurringPaymentId: '1',
        date: date.toISOString().split('T')[0],
        amount: 200,
        isPaid: false,
      })
    }

    const result = calculateYearlyFromHistory(payment, history)
    expect(result).toBe(1000) // 10 * 100, ignoring unpaid
  })

  it('handles quarterly payments correctly', () => {
    const payment = createMockPayment({ periodicity: 3 })
    const now = new Date()

    const history: PaymentHistoryEntry[] = []
    // 4 quarterly payments
    for (let i = 0; i < 4; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i * 3)
      history.push({
        id: `${i}`,
        userId: 'test-user-id',
        recurringPaymentId: '1',
        date: date.toISOString().split('T')[0],
        amount: 300,
        isPaid: true,
      })
    }

    const result = calculateYearlyFromHistory(payment, history)
    expect(result).toBe(1200) // 4 * 300
  })

  it('filters by payment ID', () => {
    const payment = createMockPayment({ id: '1' })
    const now = new Date()

    const history: PaymentHistoryEntry[] = []
    // 12 entries for payment 1
    for (let i = 0; i < 12; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      history.push({
        id: `1-${i}`,
        userId: 'test-user-id',
        recurringPaymentId: '1',
        date: date.toISOString().split('T')[0],
        amount: 100,
        isPaid: true,
      })
    }
    // 12 entries for payment 2
    for (let i = 0; i < 12; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      history.push({
        id: `2-${i}`,
        userId: 'test-user-id',
        recurringPaymentId: '2',
        date: date.toISOString().split('T')[0],
        amount: 200,
        isPaid: true,
      })
    }

    const result = calculateYearlyFromHistory(payment, history)
    expect(result).toBe(1200) // Only payment 1: 12 * 100
  })

  it('only includes entries within lookback period', () => {
    const payment = createMockPayment({ periodicity: 1 })
    const now = new Date()

    const history: PaymentHistoryEntry[] = []
    // 12 entries within the last year
    for (let i = 0; i < 12; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      history.push({
        id: `recent-${i}`,
        userId: 'test-user-id',
        recurringPaymentId: '1',
        date: date.toISOString().split('T')[0],
        amount: 100,
        isPaid: true,
      })
    }
    // 12 old entries (more than 12 months ago)
    for (let i = 13; i < 25; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      history.push({
        id: `old-${i}`,
        userId: 'test-user-id',
        recurringPaymentId: '1',
        date: date.toISOString().split('T')[0],
        amount: 200,
        isPaid: true,
      })
    }

    const result = calculateYearlyFromHistory(payment, history)
    expect(result).toBe(1200) // Only recent: 12 * 100
  })
})

describe('calculateTotals', () => {
  it('returns zero for empty payments', () => {
    const result = calculateTotals([], [])
    expect(result).toEqual({ monthlyTotal: 0, yearlyTotal: 0 })
  })

  it('uses template estimation when no history', () => {
    const payments = [createMockPayment({ cost: 99, periodicity: 1 })]
    const result = calculateTotals(payments, [])

    expect(result.yearlyTotal).toBe(1188) // 99 * 12
    expect(result.monthlyTotal).toBe(99) // 1188 / 12
  })

  it('uses actual history when available', () => {
    const payments = [createMockPayment({ periodicity: 1 })]
    const now = new Date()

    const history: PaymentHistoryEntry[] = []
    for (let i = 0; i < 12; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      history.push({
        id: `${i}`,
        userId: 'test-user-id',
        recurringPaymentId: '1',
        date: date.toISOString().split('T')[0],
        amount: 120,
        isPaid: true,
      })
    }

    const result = calculateTotals(payments, history)

    expect(result.yearlyTotal).toBe(1440) // 12 * 120
    expect(result.monthlyTotal).toBe(120) // 1440 / 12
  })

  it('combines actual and estimated for multiple payments', () => {
    const payment1 = createMockPayment({ id: '1', cost: 100, periodicity: 1 })
    const payment2 = createMockPayment({ id: '2', cost: 200, periodicity: 1 })

    const now = new Date()
    const history: PaymentHistoryEntry[] = []
    // Payment 1 has full history
    for (let i = 0; i < 12; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      history.push({
        id: `1-${i}`,
        userId: 'test-user-id',
        recurringPaymentId: '1',
        date: date.toISOString().split('T')[0],
        amount: 150,
        isPaid: true,
      })
    }
    // Payment 2 has no history

    const result = calculateTotals([payment1, payment2], history)

    // Payment 1: 12 * 150 = 1800
    // Payment 2: 200 * 12 = 2400
    // Total: 4200
    expect(result.yearlyTotal).toBe(4200)
    expect(result.monthlyTotal).toBe(350) // 4200 / 12
  })

  it('handles yearly payments correctly', () => {
    const payment = createMockPayment({ periodicity: 12, cost: 1200 })
    const result = calculateTotals([payment], [])

    expect(result.yearlyTotal).toBe(1200) // 1200 / 12 * 12
    expect(result.monthlyTotal).toBe(100) // 1200 / 12
  })
})

describe('groupByLocation', () => {
  it('groups payments by location with template estimation', () => {
    const payments = [
      createMockPayment({ id: '1', location: 'Home', cost: 100, periodicity: 1 }),
      createMockPayment({ id: '2', location: 'Home', cost: 50, periodicity: 1 }),
      createMockPayment({ id: '3', location: 'Office', cost: 200, periodicity: 1 }),
    ]

    const result = groupByLocation(payments, [])

    expect(result).toHaveLength(2)
    // Office should be first (higher total: 200 vs 150)
    expect(result[0].location).toBe('Office')
    expect(result[0].monthlyTotal).toBe(200)
    expect(result[0].yearlyTotal).toBe(2400)
    expect(result[0].count).toBe(1)

    expect(result[1].location).toBe('Home')
    expect(result[1].monthlyTotal).toBe(150) // 100 + 50
    expect(result[1].yearlyTotal).toBe(1800) // 150 * 12
    expect(result[1].count).toBe(2)
  })

  it('uses actual history when available', () => {
    const payments = [
      createMockPayment({ id: '1', location: 'Home', cost: 100, periodicity: 1 }),
      createMockPayment({ id: '2', location: 'Office', cost: 200, periodicity: 1 }),
    ]

    const now = new Date()
    const history: PaymentHistoryEntry[] = []
    // Home payment has history
    for (let i = 0; i < 12; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      history.push({
        id: `1-${i}`,
        userId: 'test-user-id',
        recurringPaymentId: '1',
        date: date.toISOString().split('T')[0],
        amount: 150, // Different from template
        isPaid: true,
      })
    }
    // Office payment has no history

    const result = groupByLocation(payments, history)

    expect(result).toHaveLength(2)
    // Office first (higher total)
    expect(result[0].location).toBe('Office')
    expect(result[0].yearlyTotal).toBe(2400) // Template: 200 * 12
    expect(result[0].monthlyTotal).toBe(200)

    // Home uses actual history
    expect(result[1].location).toBe('Home')
    expect(result[1].yearlyTotal).toBe(1800) // Actual: 12 * 150
    expect(result[1].monthlyTotal).toBe(150) // 1800 / 12
  })

  it('combines multiple payments in same location with mixed history', () => {
    const payments = [
      createMockPayment({ id: '1', location: 'Home', cost: 100, periodicity: 1 }),
      createMockPayment({ id: '2', location: 'Home', cost: 50, periodicity: 1 }),
    ]

    const now = new Date()
    const history: PaymentHistoryEntry[] = []
    // Only first payment has history
    for (let i = 0; i < 12; i++) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      history.push({
        id: `1-${i}`,
        userId: 'test-user-id',
        recurringPaymentId: '1',
        date: date.toISOString().split('T')[0],
        amount: 120,
        isPaid: true,
      })
    }

    const result = groupByLocation(payments, history)

    expect(result).toHaveLength(1)
    expect(result[0].location).toBe('Home')
    // Payment 1: 12 * 120 = 1440 (actual)
    // Payment 2: 50 * 12 = 600 (template)
    // Total yearly: 2040
    expect(result[0].yearlyTotal).toBe(2040)
    expect(result[0].monthlyTotal).toBe(170) // 2040 / 12
    expect(result[0].count).toBe(2)
  })

  it('sorts locations by monthly total descending', () => {
    const payments = [
      createMockPayment({ id: '1', location: 'A', cost: 50, periodicity: 1 }),
      createMockPayment({ id: '2', location: 'B', cost: 200, periodicity: 1 }),
      createMockPayment({ id: '3', location: 'C', cost: 100, periodicity: 1 }),
    ]

    const result = groupByLocation(payments, [])

    expect(result[0].location).toBe('B') // 200
    expect(result[1].location).toBe('C') // 100
    expect(result[2].location).toBe('A') // 50
  })

  it('returns empty array for no payments', () => {
    const result = groupByLocation([], [])
    expect(result).toEqual([])
  })
})
