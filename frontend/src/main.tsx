import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

// Layout / Shell
import { AppShell } from './routes/__root'

// Public pages
import { Index } from './routes/index'
import { BuyTickets } from './routes/buy-tickets'
import { Contact } from './routes/contact'
import { Details } from './routes/details'
import { LoginPage } from './routes/login'

// Dashboard layout
import { DashboardLayout } from './routes/dashboard'

// Dashboard pages
import { Dashboard } from './routes/dashboard/index'
import { CheckIn } from './routes/dashboard/check-in'
import { Analytics } from './routes/dashboard/analytics'
import { Attendees } from './routes/dashboard/attendees'
import { Inquiries } from './routes/dashboard/inquiries'
import { Organizers } from './routes/dashboard/organizers'
import { Settings } from './routes/dashboard/settings'

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          {/* App shell wraps all routes (provides Toaster, etc.) */}
          <Route element={<AppShell />}>
            {/* Public routes */}
            <Route index element={<Index />} />
            <Route path="buy-tickets" element={<BuyTickets />} />
            <Route path="contact" element={<Contact />} />
            <Route path="details" element={<Details />} />
            <Route path="login" element={<LoginPage />} />

            {/* Dashboard routes (protected layout) */}
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="check-in" element={<CheckIn />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="attendees" element={<Attendees />} />
              <Route path="inquiries" element={<Inquiries />} />
              <Route path="organizers" element={<Organizers />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>,
  )
}

reportWebVitals()
