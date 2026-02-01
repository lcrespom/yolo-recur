import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/page2')({
  component: Page2,
})

function Page2() {
  return (
    <div className="flex flex-col items-center gap-4 pt-10">
      <h1 className="text-4xl font-bold">Page 2</h1>
      <p className="text-base-content/70">This is the second page.</p>
    </div>
  )
}
