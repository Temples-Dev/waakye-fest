
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone, Instagram, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Header from '@/components/Header'
import { useState } from 'react'

export const Route = createFileRoute('/contact')({
  component: Contact,
})

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001'
      const res = await fetch(`${apiUrl}/api/inquiries/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        setSubmitSuccess(true)
        setFormData({ name: '', email: '', phone: '', message: '' })
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        const data = await res.json()
        setSubmitError(data.error || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Failed to submit inquiry', error)
      setSubmitError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 px-4 pb-12">
      <Header />
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            CONTACT US
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have questions? Get in touch!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-center gap-4">
                            <Mail className="w-6 h-6 text-yellow-500" />
                            <div>
                                <h3 className="font-bold">Email</h3>
                                <p className="text-gray-400">emmanuelmawudor014@gmail.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Phone className="w-6 h-6 text-yellow-500" />
                             <div>
                                <h3 className="font-bold">Phone</h3>
                                <p className="text-gray-400">0591496532</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-4">
                            <Instagram className="w-6 h-6 text-yellow-500" />
                             <div>
                                <h3 className="font-bold">Social</h3>
                                <p className="text-gray-400">@wakyefest</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Message Form */}
            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardContent className="pt-6">
                    {submitSuccess ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <CheckCircle className="w-16 h-16 text-green-500" />
                            <h3 className="text-xl font-bold text-green-500">Message Sent!</h3>
                            <p className="text-gray-400 text-center">We'll get back to you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input 
                                    placeholder="Your name" 
                                    className="bg-black border-zinc-700"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input 
                                    type="email"
                                    placeholder="Your email" 
                                    className="bg-black border-zinc-700"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input 
                                    type="tel"
                                    placeholder="+233 XX XXX XXXX" 
                                    className="bg-black border-zinc-700"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Message</Label>
                                <textarea 
                                    className="w-full h-32 rounded-md border border-zinc-700 bg-black px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="How can we help?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    required
                                    minLength={10}
                                />
                            </div>
                            {submitError && (
                                <p className="text-red-500 text-sm">{submitError}</p>
                            )}
                            <Button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Message'
                                )}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  )
}
