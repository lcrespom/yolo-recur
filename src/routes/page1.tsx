import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/page1')({
  component: Page1,
})

function Page1() {
  return (
    <div className="flex flex-col items-center gap-4 pt-10">
      <h1 className="text-4xl font-bold">Page 1</h1>
      <p className="text-base-content/70">This is the first page.</p>
    </div>
  )
}
