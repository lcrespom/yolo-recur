import { Search } from 'lucide-react'

export type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="form-control w-full sm:w-96">
      <label className="input input-bordered flex items-center gap-2">
        <Search className="h-4 w-4 opacity-70" />
        <input
          type="text"
          placeholder={placeholder}
          className="grow"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </label>
    </div>
  )
}
