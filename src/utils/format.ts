import { config } from '../config'

/**
 * Format a number as currency using the configured currency symbol
 */
export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `${config.currencySymbol} ${formatted}`
}

/**
 * Format a date string as a localized date
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
