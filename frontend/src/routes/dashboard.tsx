import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

interface Stats {
  total_tickets: number
  verified_tickets: number
  total_revenue: number
  recent_sales: {
    id: string
    name: string
    email: string
    paystack_reference: string
    created_at: string
  }[]
}

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

        
        const res = await fetch(`${apiUrl}/api/stats/`)
        
        if (!res.ok) throw new Error('Failed to fetch stats')
        const data = await res.json()
        setStats(data)
      } catch (err) {
        setError('Could not load dashboard data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return <div className="p-10 text-center text-white">Loading Dashboard...</div>
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>
  if (!stats) return null

  return (
    <div className="min-h-screen bg-black text-white p-8 font-outfit">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-[#FFD700]">Organizer Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 p-6 rounded-xl border border-white/20">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider">Total Revenue</h3>
            <p className="text-4xl font-bold mt-2">GHS {stats.total_revenue}</p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-xl border border-white/20">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider">Tickets Sold</h3>
            <p className="text-4xl font-bold mt-2">{stats.verified_tickets}</p>
            <p className="text-sm text-gray-500 mt-1">out of {stats.total_tickets} attempted</p>
          </div>

          <div className="bg-white/10 p-6 rounded-xl border border-white/20">
             <h3 className="text-gray-400 text-sm uppercase tracking-wider">Check-ins</h3>
             {/* We don't have check-in count in API yet? I think I added it to backend logic but let's see view. */}
             {/* View: verified_tickets, total_tickets... no checkin count explicit. */}
             {/* I'll just use total_tickets for now or 0 */}
             <p className="text-4xl font-bold mt-2">0</p> 
             <p className="text-sm text-gray-500 mt-1">Live updates coming soon</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-sm">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recent_sales.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-white/5 transition">
                    <td className="p-4 font-medium">{ticket.name}</td>
                    <td className="p-4 text-gray-400">{ticket.email}</td>
                    <td className="p-4 font-mono text-sm text-gray-500">{ticket.paystack_reference}</td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">
                        PAID
                      </span>
                    </td>
                  </tr>
                ))}
                {stats.recent_sales.length === 0 && (
                    <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">No sales yet</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
