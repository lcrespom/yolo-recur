import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <label className="swap swap-rotate" aria-label="Toggle theme">
      <input
        type="checkbox"
        checked={isDark}
        onChange={e => setIsDark(e.target.checked)}
      />
      <Sun className="swap-off h-6 w-6" />
      <Moon className="swap-on h-6 w-6" />
    </label>
  )
}
