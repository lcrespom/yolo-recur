import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navbar, type NavLink } from '../components/common/navbar'

const navLinks: NavLink[] = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/payments', label: 'Payments' },
]

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="bg-base-100 min-h-screen">
      <Navbar links={navLinks} />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}
