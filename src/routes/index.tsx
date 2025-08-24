import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

async function RouteComponent() {
  return <div>Hello "/"!</div>
}
