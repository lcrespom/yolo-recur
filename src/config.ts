/**
 * Application configuration
 * Reads from environment variables with fallback defaults
 */

interface Config {
  apiBaseUrl: string
  currencySymbol: string
}

function getConfig(): Config {
  return {
    // In Vite, env vars are accessed via import.meta.env and must be prefixed with VITE_
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030',
    currencySymbol: import.meta.env.VITE_CURRENCY_SYMBOL || '€',
  }
}

export const config = getConfig()
