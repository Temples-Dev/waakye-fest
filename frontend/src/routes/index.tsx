import EventHero from '../components/EventHero'
import Header from '../components/Header'

export function Index() {
  return (
    <div className="bg-black min-h-screen">
      <Header />
      <EventHero />
      {/* More sections can be added here later */}
    </div>
  )
}
