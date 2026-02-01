import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex flex-col items-center gap-4 pt-10">
      <h1 className="text-4xl font-bold">Welcome to MyApp</h1>
      <p className="text-base-content/70">
        Select a page from the navigation bar to get started.
      </p>
    </div>
  )
}
