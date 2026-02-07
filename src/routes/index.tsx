import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth } from '../hooks/use-auth'

export const Route = createFileRoute('/')({
  component: HomePage,
})

type FeatureCardProps = {
  title: string
  children: React.ReactNode
}

function FeatureCard({ title, children }: FeatureCardProps) {
  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="text-base-content/70">{children}</p>
      </div>
    </div>
  )
}

function HomePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="hero bg-base-200 rounded-lg">
        <div className="hero-content py-12 text-center">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-5xl font-bold">Welcome to PayTrack</h1>
            <p className="mb-6 text-xl">
              Take control of your recurring payments and subscriptions
            </p>
            <p className="text-base-content/70 mb-8">
              PayTrack helps you track, manage, and understand your recurring expenses.
              Never miss a payment and get accurate insights into your monthly and yearly
              spending.
            </p>
            <div className="flex justify-center gap-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="btn btn-primary btn-md lg:btn-lg">
                    View Dashboard
                  </Link>
                  <Link to="/payments" className="btn btn-outline btn-md lg:btn-lg">
                    Manage Payments
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    search={{ mode: 'login' }}
                    className="btn btn-primary btn-md lg:btn-lg"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/login"
                    search={{ mode: 'signup' }}
                    className="btn btn-outline btn-md lg:btn-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="mb-8 text-center text-3xl font-bold">Key Features</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard title="Auto-Generated Payment History">
            Automatically generates payment entries based on your recurring schedules.
            Monthly, quarterly, or yearly - we track them all.
          </FeatureCard>
          <FeatureCard title="Accurate Expense Tracking">
            Uses actual payment history when available, falling back to estimates. Get
            real insights into your spending patterns over time.
          </FeatureCard>
          <FeatureCard title="Location-Based Analytics">
            Group your expenses by location to understand where your money goes. Track
            home, office, and personal expenses separately.
          </FeatureCard>
          <FeatureCard title="Upcoming Payments">
            Never miss a payment again. See all upcoming unpaid expenses in one place,
            sorted by due date.
          </FeatureCard>
          <FeatureCard title="Payment History Management">
            Mark payments as paid, adjust amounts, and maintain a complete history of all
            your recurring expenses.
          </FeatureCard>
          <FeatureCard title="Monthly & Yearly Totals">
            Instantly see your total recurring expenses broken down by month and year.
            Plan your budget with confidence.
          </FeatureCard>
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title mb-4 text-2xl">Getting Started</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">1. Add Your Recurring Payments</h3>
              <p className="text-base-content/70">
                Navigate to the Payments page and add all your recurring subscriptions,
                bills, and regular expenses.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">2. View Your Dashboard</h3>
              <p className="text-base-content/70">
                Check your dashboard to see expense summaries, upcoming payments, and
                location-based analytics.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">3. Manage Payment History</h3>
              <p className="text-base-content/70">
                Click on any payment to view its history, mark payments as paid, and
                adjust amounts as needed.
              </p>
            </div>
          </div>
          <div className="card-actions mt-4 justify-end">
            {user ? (
              <Link to="/payments" className="btn btn-primary">
                Add Your First Payment
              </Link>
            ) : (
              <Link to="/login" search={{ mode: 'signup' }} className="btn btn-primary">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
