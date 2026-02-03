import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="hero bg-base-200 rounded-lg">
        <div className="hero-content text-center py-12">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Welcome to PayTrack</h1>
            <p className="text-xl mb-6">
              Take control of your recurring payments and subscriptions
            </p>
            <p className="text-base-content/70 mb-8">
              PayTrack helps you track, manage, and understand your recurring expenses.
              Never miss a payment and get accurate insights into your monthly and yearly
              spending.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                View Dashboard
              </Link>
              <Link to="/payments" className="btn btn-outline btn-lg">
                Manage Payments
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="card-title">Auto-Generated Payment History</h3>
              <p className="text-base-content/70">
                Automatically generates payment entries based on your recurring schedules.
                Monthly, quarterly, or yearly - we track them all.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="card-title">Accurate Expense Tracking</h3>
              <p className="text-base-content/70">
                Uses actual payment history when available, falling back to estimates. Get
                real insights into your spending patterns over time.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="card-title">Location-Based Analytics</h3>
              <p className="text-base-content/70">
                Group your expenses by location to understand where your money goes. Track
                home, office, and personal expenses separately.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="card-title">Upcoming Payments</h3>
              <p className="text-base-content/70">
                Never miss a payment again. See all upcoming unpaid expenses in one place,
                sorted by due date.
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="card-title">Payment History Management</h3>
              <p className="text-base-content/70">
                Mark payments as paid, adjust amounts, and maintain a complete history of
                all your recurring expenses.
              </p>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="card-title">Monthly & Yearly Totals</h3>
              <p className="text-base-content/70">
                Instantly see your total recurring expenses broken down by month and year.
                Plan your budget with confidence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">1. Add Your Recurring Payments</h3>
              <p className="text-base-content/70">
                Navigate to the Payments page and add all your recurring subscriptions,
                bills, and regular expenses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">2. View Your Dashboard</h3>
              <p className="text-base-content/70">
                Check your dashboard to see expense summaries, upcoming payments, and
                location-based analytics.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">3. Manage Payment History</h3>
              <p className="text-base-content/70">
                Click on any payment to view its history, mark payments as paid, and adjust
                amounts as needed.
              </p>
            </div>
          </div>
          <div className="card-actions justify-end mt-4">
            <Link to="/payments" className="btn btn-primary">
              Add Your First Payment
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
