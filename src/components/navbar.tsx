import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

export interface NavLink {
  to: string
  label: string
}

interface NavbarProps {
  links: NavLink[]
}

export function Navbar({ links }: NavbarProps) {
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
              <li key={link.to}>
                <Link to={link.to} activeProps={{ className: 'menu-active' }}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">
          MyApp
        </Link>
      </div>
      {/*--------------- Desktop menu ---------------*/}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {links.map(link => (
            <li key={link.to}>
              <Link to={link.to} activeProps={{ className: 'menu-active' }}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end">
        <ThemeToggle />
      </div>
    </div>
  )
}
