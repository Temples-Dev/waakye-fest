
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/details')({
  component: Details,
})

function Details() {
  return <div className="p-20 text-center text-white">Event Details Page (Under Construction)</div>
}
