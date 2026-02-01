import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navbar, type NavLink } from '../components/navbar'

const navLinks: NavLink[] = [
  { to: '/page1', label: 'Page 1' },
  { to: '/page2', label: 'Page 2' },
]

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar links={navLinks} />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}
