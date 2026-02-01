import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  createRouter,
  createRootRoute,
  createRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router'
import { Navbar, type NavLink } from './Navbar'

const navLinks: NavLink[] = [
  { to: '/page1', label: 'Page 1' },
  { to: '/page2', label: 'Page 2' },
]

function renderWithRouter(initialPath = '/') {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <Navbar links={navLinks} />
        <Outlet />
      </>
    ),
  })

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <div>Home</div>,
  })

  const page1Route = createRoute({
    getParentRoute: () => rootRoute,
    path: '/page1',
    component: () => <div>Page 1 Content</div>,
  })

  const page2Route = createRoute({
    getParentRoute: () => rootRoute,
    path: '/page2',
    component: () => <div>Page 2 Content</div>,
  })

  const routeTree = rootRoute.addChildren([indexRoute, page1Route, page2Route])
  const router = createRouter({ routeTree })

  router.navigate({ to: initialPath })

  return render(<RouterProvider router={router} />)
}

describe('Navbar', () => {
  it('renders the app title', async () => {
    renderWithRouter()
    expect(await screen.findByText('MyApp')).toBeInTheDocument()
  })

  it('renders navigation links for Page 1 and Page 2', async () => {
    renderWithRouter()
    await screen.findByText('MyApp')
    await waitFor(() => {
      const page1Links = screen.getAllByText('Page 1')
      const page2Links = screen.getAllByText('Page 2')
      expect(page1Links.length).toBeGreaterThan(0)
      expect(page2Links.length).toBeGreaterThan(0)
    })
  })

  it('renders the theme toggle', async () => {
    renderWithRouter()
    expect(await screen.findByLabelText('Toggle theme')).toBeInTheDocument()
  })

  it('app title links to root path', async () => {
    renderWithRouter()
    const titleLink = await screen.findByText('MyApp')
    expect(titleLink.closest('a')).toHaveAttribute('href', '/')
  })
})
