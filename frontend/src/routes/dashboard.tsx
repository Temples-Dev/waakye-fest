import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LayoutDashboard, Users, LogOut, ScanLine, Menu, X, TrendingUp, Shield, Mail, Settings as SettingsIcon } from 'lucide-react'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001'

export function DashboardLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isSuperuser, setIsSuperuser] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('access_token')
            if (!token) {
                navigate('/login')
                return
            }

            try {
                const res = await fetch(`${apiUrl}/api/me/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setIsSuperuser(data.is_superuser)
                }
                
                // Fetch unread count
                const countRes = await fetch(`${apiUrl}/api/inquiries/unread-count/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (countRes.ok) {
                    const countData = await countRes.json()
                    setUnreadCount(countData.unread_count)
                }
            } catch (err) {
                console.error("Failed to fetch user info", err)
            }
        }
        checkUser()
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        navigate('/login')
    }

    const closeMobileMenu = () => {
        setMobileMenuOpen(false)
    }

    const navLinkClass = (path: string, exact = false) => {
        const isActive = exact
            ? location.pathname === path
            : location.pathname === path || location.pathname.startsWith(path + '/')
        return [
            'flex items-center space-x-3 px-4 py-3 rounded-lg text-white transition-all duration-200 group',
            isActive
                ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border-l-2 border-yellow-500 text-yellow-400'
                : 'hover:bg-white/5 text-gray-400 hover:text-white',
        ].join(' ')
    }

    return (
        <div className="flex bg-black min-h-screen relative overflow-hidden font-outfit text-white">
            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-4 right-4 z-50">
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 bg-white/10 rounded-full text-white backdrop-blur-md border border-white/20"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:static inset-y-0 left-0 bg-[#111] border-r border-white/10 w-64 p-6 flex flex-col justify-between 
                transition-transform duration-300 z-50 md:translate-x-0
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div>
                    <div className="mb-10 pt-2 px-2">
                        <Link to="/" className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                            WAAKYE FEST
                        </Link>
                    </div>
                    
                    <nav className="space-y-2">
                        <Link 
                            to="/dashboard"
                            className={navLinkClass('/dashboard', true)}
                            onClick={closeMobileMenu}
                        >
                            <LayoutDashboard size={20} className="group-hover:text-yellow-400 transition-colors" />
                            <span>Overview</span>
                        </Link>
                        
                        <Link 
                            to="/dashboard/check-in"
                            className={navLinkClass('/dashboard/check-in')}
                            onClick={closeMobileMenu}
                        >
                            <ScanLine size={20} className="group-hover:text-yellow-400 transition-colors" />
                            <span>Check-in</span>
                        </Link>

                        <Link 
                            to="/dashboard/attendees"
                            className={navLinkClass('/dashboard/attendees')}
                            onClick={closeMobileMenu}
                        >
                            <Users size={20} className="group-hover:text-yellow-400 transition-colors" />
                            <span>Attendees</span>
                        </Link>

                        <Link 
                            to="/dashboard/analytics"
                            className={navLinkClass('/dashboard/analytics')}
                            onClick={closeMobileMenu}
                        >
                            <TrendingUp size={20} className="group-hover:text-yellow-400 transition-colors" />
                            <span>Analytics</span>
                        </Link>

                        <Link 
                            to="/dashboard/inquiries"
                            className={navLinkClass('/dashboard/inquiries')}
                            onClick={closeMobileMenu}
                        >
                            <Mail size={20} className="group-hover:text-yellow-400 transition-colors" />
                            <span>Inquiries</span>
                            {unreadCount > 0 && (
                                <span className="ml-auto bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>

                        <Link 
                            to="/dashboard/settings"
                            className={navLinkClass('/dashboard/settings')}
                            onClick={closeMobileMenu}
                        >
                            <SettingsIcon size={20} className="group-hover:text-yellow-400 transition-colors" />
                            <span>Event Settings</span>
                        </Link>

                        {isSuperuser && (
                            <Link 
                                to="/dashboard/organizers"
                                className={navLinkClass('/dashboard/organizers')}
                                onClick={closeMobileMenu}
                            >
                                <Shield size={20} className="group-hover:text-purple-400 transition-colors" />
                                <span>Organizers</span>
                            </Link>
                        )}
                    </nav>
                </div>

                <div className="p-4 border-t border-white/10 relative z-10">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg w-full transition"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#0a0a0a] relative">
                <div className="pt-0 md:pt-0">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
