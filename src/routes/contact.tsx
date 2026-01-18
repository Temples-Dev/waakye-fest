
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: Contact,
})

function Contact() {
  return <div className="p-20 text-center text-white">Contact Page (Under Construction)</div>
}
