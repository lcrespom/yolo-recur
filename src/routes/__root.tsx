import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { ErrorBoundary } from '../components/common/error-boundary'
import { Navbar, type NavLink } from '../components/common/navbar'
import { useAuth } from '../hooks/use-auth'

const authenticatedLinks: NavLink[] = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/payments', label: 'Payments' },
]

const guestLinks: NavLink[] = [
  { to: '/login', label: 'Log In', search: { mode: 'login' } },
  { to: '/login', label: 'Sign Up', search: { mode: 'signup' } },
]

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const links = user ? authenticatedLinks : guestLinks

  const handleLogout = async () => {
    await signOut()
    navigate({ to: '/' })
  }

  return (
    <div className="bg-base-100 min-h-screen">
      <Navbar
        links={links}
        userEmail={user?.email}
        onLogout={user ? handleLogout : undefined}
      />
      <main className="container mx-auto p-4">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  )
}
