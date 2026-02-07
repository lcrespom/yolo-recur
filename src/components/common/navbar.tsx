import { Link } from '@tanstack/react-router'
import { Menu, LogOut } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

export type NavLink = {
  to: string
  label: string
  search?: Record<string, string>
}

type NavbarProps = {
  links: NavLink[]
  userEmail?: string | null
  onLogout?: () => void
}

export function Navbar({ links, userEmail, onLogout }: NavbarProps) {
  return (
    <div className="navbar bg-base-200 shadow-sm">
      <div className="navbar-start">
        {/*--------------- Mobile dropdown ---------------*/}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <Menu className="h-5 w-5" />
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content menu-sm rounded-box bg-base-200 z-10 mt-3 w-52 p-2 shadow"
          >
            {links.map(link => (
              <li key={link.to + (link.search?.mode ?? '')}>
                <Link
                  to={link.to}
                  search={link.search}
                  activeProps={{ className: 'menu-active' }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">
          PayTrack
        </Link>
      </div>
      {/*--------------- Desktop menu ---------------*/}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-4 px-1">
          {links.map(link => (
            <li key={link.to + (link.search?.mode ?? '')}>
              <Link
                to={link.to}
                search={link.search}
                activeProps={{ className: 'menu-active' }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end me-4 gap-2">
        {userEmail && (
          <span className="text-base-content/70 hidden text-sm sm:inline">
            {userEmail}
          </span>
        )}
        {onLogout && (
          <button className="btn btn-ghost btn-sm" onClick={onLogout} title="Log out">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        )}
        <ThemeToggle />
      </div>
    </div>
  )
}
