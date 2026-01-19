import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router'

// Import the generated route tree
// import { routeTree } from './routeTree.gen' // This line will be replaced by manual route tree definition

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

// Create a new router instance
import { LoginPage } from './routes/login'
import { Index } from './routes/index'
import { Details } from './routes/details'
import { BuyTickets } from './routes/buy-tickets'
import { Contact } from './routes/contact'

import { Outlet } from '@tanstack/react-router'
import Header from './components/Header'

// Define a root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
})
const detailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/details',
  component: Details,
})
const buyTicketsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/buy-tickets',
  component: BuyTickets,
})
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: Contact,
})
import { DashboardLayout } from './routes/dashboard'
import { Dashboard } from './routes/dashboard/index'

const dashboardLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: DashboardLayout,
})

const dashboardIndexRoute = createRoute({
    getParentRoute: () => dashboardLayoutRoute,
    path: '/',
    component: Dashboard,
})

const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: LoginPage,
})

const routeTree = rootRoute.addChildren([
    indexRoute, 
    detailsRoute, 
    buyTicketsRoute, 
    contactRoute,
    dashboardLayoutRoute.addChildren([
        dashboardIndexRoute
    ]),
    loginRoute
])

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
