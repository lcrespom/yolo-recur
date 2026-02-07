/**
 * Application configuration
 * Reads from environment variables with fallback defaults
 */

type Config = {
  apiBaseUrl: string
  currencySymbol: string
  supabaseUrl: string
  supabaseAnonKey: string
}

function getConfig(): Config {
  return {
    // In Vite, env vars are accessed via import.meta.env and must be prefixed with VITE_
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030',
    currencySymbol: import.meta.env.VITE_CURRENCY_SYMBOL || '€',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_CLIENT_KEY || '',
  }
}

export const config = getConfig()
