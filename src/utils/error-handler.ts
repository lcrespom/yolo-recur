/**
 * Custom error class for API-related errors
 */
export class ApiError extends Error {
  statusCode?: number
  isNetworkError: boolean

  constructor(message: string, statusCode?: number, isNetworkError = false) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.isNetworkError = isNetworkError
  }
}

/**
 * Get a user-friendly error message based on the error type
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.isNetworkError) {
      return 'Unable to connect to the server. Please check your internet connection and try again.'
    }
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred. Please try again.'
}

/**
 * Handle fetch response errors and throw appropriate ApiError
 */
export async function handleFetchResponse(response: Response): Promise<Response> {
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`

    // Try to get error message from response body
    try {
      const errorData = await response.json()
      if (errorData.message) {
        errorMessage = errorData.message
      }
    } catch {
      // Ignore JSON parse errors
    }

    // Provide user-friendly messages for common HTTP status codes
    if (response.status === 404) {
      errorMessage = 'The requested resource was not found'
    } else if (response.status === 400) {
      errorMessage = 'Invalid request. Please check your input and try again'
    } else if (response.status === 500) {
      errorMessage = 'Server error. Please try again later'
    } else if (response.status >= 500) {
      errorMessage = 'The server is currently unavailable. Please try again later'
    }

    throw new ApiError(errorMessage, response.status)
  }

  return response
}

/**
 * Wrapper for fetch that handles network errors
 */
export async function fetchWithErrorHandling(
  url: string,
  options?: RequestInit
): Promise<Response> {
  try {
    const response = await fetch(url, options)
    return handleFetchResponse(response)
  } catch (error) {
    // Network errors (no internet, DNS failure, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        'Unable to connect to the server. Please check your internet connection.',
        undefined,
        true
      )
    }
    throw error
  }
}
