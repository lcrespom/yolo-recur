import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../hooks/use-auth'
import { FormInput } from '../components/common/form-input'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().optional(),
})

const signupSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = {
  email: string
  password: string
  confirmPassword?: string
}

type SearchParams = {
  mode?: 'login' | 'signup'
}

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    mode: search.mode === 'signup' ? 'signup' : 'login',
  }),
  component: LoginPage,
})

function LoginPage() {
  const { mode } = Route.useSearch()
  const { user, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<string | null>(null)
  const [signupSuccess, setSignupSuccess] = useState(false)

  const isLogin = mode === 'login'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
  })

  useEffect(() => {
    if (user) {
      navigate({ to: '/dashboard' })
    }
  }, [user, navigate])

  const onSubmit = async (data: FormData) => {
    setAuthError(null)
    setSignupSuccess(false)

    const { error } = isLogin
      ? await signIn(data.email, data.password)
      : await signUp(data.email, data.password)

    if (error) {
      setAuthError(error)
    } else if (!isLogin) {
      setSignupSuccess(true)
    }
  }

  const switchMode = () => {
    reset()
    setAuthError(null)
    setSignupSuccess(false)
    navigate({
      to: '/login',
      search: { mode: isLogin ? 'signup' : 'login' },
    })
  }

  if (user) return null

  return (
    <div className="flex min-h-[60vh] items-start justify-center pt-12">
      <div className="card bg-base-200 w-full max-w-md shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4 justify-center text-2xl">
            {isLogin ? 'Log In' : 'Sign Up'}
          </h2>

          {/* Mode toggle tabs */}
          <div role="tablist" className="tabs tabs-box mb-4">
            <button
              role="tab"
              className={`tab ${isLogin ? 'tab-active' : ''}`}
              onClick={() => navigate({ to: '/login', search: { mode: 'login' } })}
            >
              Log In
            </button>
            <button
              role="tab"
              className={`tab ${!isLogin ? 'tab-active' : ''}`}
              onClick={() => navigate({ to: '/login', search: { mode: 'signup' } })}
            >
              Sign Up
            </button>
          </div>

          {authError && (
            <div role="alert" className="alert alert-error mb-4">
              <span>{authError}</span>
            </div>
          )}

          {signupSuccess && (
            <div role="alert" className="alert alert-success mb-4">
              <span>
                Account created! Please check your email to confirm your account.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              registration={register('email')}
              error={errors.email}
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              registration={register('password')}
              error={errors.password}
            />

            {!isLogin && (
              <FormInput
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                registration={register('confirmPassword')}
                error={errors.confirmPassword}
              />
            )}

            <button
              type="submit"
              className="btn btn-primary mt-10 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting && <span className="loading loading-spinner loading-sm" />}
              {isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            {isLogin ? (
              <p>
                Don&apos;t have an account?{' '}
                <button className="link link-primary" onClick={switchMode}>
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button className="link link-primary" onClick={switchMode}>
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
