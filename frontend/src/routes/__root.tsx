import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import { Toaster } from '@/components/ui/sonner'

export function AppShell() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')

  return (
    <>
      {!isDashboard && <Header />}
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  )
}
