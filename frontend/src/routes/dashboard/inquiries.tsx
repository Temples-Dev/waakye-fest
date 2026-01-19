import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table'
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, ChevronLeft, ChevronRight, Loader2, Mail, Phone, Calendar } from 'lucide-react'

export const Route = createFileRoute('/dashboard/inquiries')({
  component: Inquiries,
})

interface Inquiry {
    id: number
    name: string
    email: string
    phone: string
    message: string
    is_read: boolean
    created_at: string
}

interface PaginatedResponse {
    count: number
    next: boolean
    previous: boolean
    results: Inquiry[]
}

function Inquiries() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [expandedId, setExpandedId] = useState<number | null>(null)
    
    const fetchInquiries = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('access_token')
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001'
            const res = await fetch(`${apiUrl}/api/inquiries/list/?page=${page}&search=${search}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (res.ok) {
                const data: PaginatedResponse = await res.json()
                setInquiries(data.results)
                setTotalPages(Math.ceil(data.count / 10))
            }
        } catch (error) {
            console.error("Failed to fetch inquiries", error)
        } finally {
            setLoading(false)
        }
    }

    const toggleRead = async (id: number, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('access_token')
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001'
            const endpoint = currentStatus ? 'mark-unread' : 'mark-read'
            
            const res = await fetch(`${apiUrl}/api/inquiries/${id}/${endpoint}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            
            if (res.ok) {
                setInquiries(prev => prev.map(inq => 
                    inq.id === id ? {...inq, is_read: !currentStatus} : inq
                ))
            }
        } catch (error) {
            console.error("Failed to toggle read status", error)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchInquiries()
        }, 500)
        return () => clearTimeout(timer)
    }, [search, page])

    return (
        <div className="p-8 space-y-8 min-h-full text-white">
            <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                    Inquiries
                </h2>
                <p className="text-gray-400">Manage customer inquiries and messages.</p>
            </div>

            <Card className="bg-[#111] border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="space-y-1">
                        <CardTitle className="text-white">All Inquiries</CardTitle>
                        <CardDescription className="text-gray-400">
                            List of all customer messages and inquiries.
                        </CardDescription>
                    </div>
                    <div className="relative w-64">
                         <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input 
                            placeholder="Search name, email, phone..." 
                            className="pl-8 bg-white/5 border-white/10 text-white"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setPage(1)
                            }}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-white/10">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableHead className="text-gray-400">Contact</TableHead>
                                    <TableHead className="text-gray-400">Message Preview</TableHead>
                                    <TableHead className="text-gray-400">Date</TableHead>
                                    <TableHead className="text-gray-400">Status</TableHead>
                                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                                                Loading...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : inquiries.length === 0 ? (
                                    <TableRow>
                                         <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                            No inquiries found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    inquiries.map((inquiry) => (
                                        <>
                                            <TableRow 
                                                key={inquiry.id} 
                                                className="border-white/10 hover:bg-white/5 cursor-pointer"
                                                onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
                                            >
                                                <TableCell>
                                                    <div className="font-medium text-white">{inquiry.name}</div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                        <Mail className="h-3 w-3" />
                                                        {inquiry.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Phone className="h-3 w-3" />
                                                        {inquiry.phone}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-300 max-w-xs truncate">
                                                    {inquiry.message}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(inquiry.created_at).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(inquiry.created_at).toLocaleTimeString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {inquiry.is_read ? (
                                                        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/50 hover:bg-gray-500/20">Read</Badge>
                                                    ) : (
                                                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/20">Unread</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            toggleRead(inquiry.id, inquiry.is_read)
                                                        }}
                                                        className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10"
                                                    >
                                                        Mark as {inquiry.is_read ? 'Unread' : 'Read'}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            {expandedId === inquiry.id && (
                                                <TableRow className="border-white/10 bg-white/5">
                                                    <TableCell colSpan={5} className="p-6">
                                                        <div className="space-y-2">
                                                            <h4 className="font-bold text-white">Full Message:</h4>
                                                            <p className="text-gray-300 whitespace-pre-wrap">{inquiry.message}</p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                            className="bg-transparent border-white/10 text-white hover:bg-white/10"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <div className="text-sm text-gray-400">
                            Page {page} of {totalPages || 1}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || loading}
                            className="bg-transparent border-white/10 text-white hover:bg-white/10"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
