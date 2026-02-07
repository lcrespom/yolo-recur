import { Component, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
  fallback?: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="bg-base-100 flex min-h-screen items-center justify-center">
          <div className="card bg-base-200 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-error">Something went wrong</h2>
              <p className="text-base-content/70">
                An unexpected error occurred. Please try refreshing the page.
              </p>
              {this.state.error && (
                <div className="mt-4">
                  <details className="collapse-arrow bg-base-300 collapse">
                    <summary className="collapse-title text-sm font-medium">
                      Error details
                    </summary>
                    <div className="collapse-content">
                      <pre className="mt-2 max-h-40 overflow-auto text-xs">
                        {this.state.error.message}
                      </pre>
                    </div>
                  </details>
                </div>
              )}
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Reload page
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
