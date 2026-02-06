import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError
  registration: UseFormRegisterReturn
}

export function FormInput({
  label,
  error,
  registration,
  className = '',
  ...props
}: FormInputProps) {
  return (
    <label className="form-control">
      <span className="label-text mb-2 block">{label}</span>
      <input
        className={`input input-bordered ${error ? 'input-error' : ''} ${className}`}
        {...registration}
        {...props}
      />
      {error && <div className="text-error mt-1 text-sm">{error.message}</div>}
    </label>
  )
}
