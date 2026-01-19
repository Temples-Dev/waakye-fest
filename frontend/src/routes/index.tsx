import { createFileRoute } from '@tanstack/react-router'
import EventHero from '../components/EventHero'

export const Route = createFileRoute('/')({
  component: Index,
})

export function Index() {
  return (
    <div className="bg-black min-h-screen">
      <EventHero />
      {/* More sections can be added here later */}
    </div>
  )
}
