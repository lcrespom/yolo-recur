import { Navigate } from '@tanstack/react-router'
import { useAuth } from '../../hooks/use-auth'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" search={{ mode: 'login' }} />
  }

  return <>{children}</>
}
