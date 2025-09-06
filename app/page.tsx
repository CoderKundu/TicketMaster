"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, Ticket, Clock, Shield, Globe, BarChart3, Scan } from "lucide-react"
import { ChatBot } from "@/components/chatbot"
import { QRScanner } from "@/components/qr-scanner"
import Link from "next/link"

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false)

  const handleQRScanResult = (result: string) => {
    console.log("QR Scan Result:", result)
    // Could integrate with backend to validate ticket
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Ticket className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">TicketMaster</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
              How It Works
            </a>
            <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
              Admin
            </Link>
            <Button
              onClick={() => setIsQRScannerOpen(true)}
              size="sm"
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Scan className="h-4 w-4 mr-2" />
              Scan
            </Button>
            <Button onClick={() => setIsChatOpen(true)} size="sm" className="terminal-button">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-8">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
              Skip the <span className="text-primary">Queue</span>
              <br />
              Book with <span className="text-primary typing-cursor">AI</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Experience seamless museum and show booking with our intelligent chatbot. No more long lines, no more
              mistakes - just instant, accurate reservations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="terminal-button text-lg px-8 py-6" onClick={() => setIsChatOpen(true)}>
              <MessageCircle className="mr-2 h-5 w-5" />
              Chat Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              onClick={() => setIsChatOpen(true)}
            >
              <Ticket className="mr-2 h-5 w-5" />
              Book Tickets
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Faster Booking</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">AI Assistant</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">0</div>
              <div className="text-muted-foreground">Queue Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-4xl font-bold text-center mb-16 text-balance">
            Why Choose <span className="text-primary">TicketMaster</span>?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="terminal-card hover:terminal-glow transition-all duration-300">
              <MessageCircle className="h-12 w-12 text-primary mb-4" />
              <h4 className="text-xl font-semibold mb-3">Smart Chatbot</h4>
              <p className="text-muted-foreground">
                Conversational AI that understands your needs and guides you through the booking process naturally.
              </p>
            </Card>

            <Card className="terminal-card hover:terminal-glow transition-all duration-300">
              <Clock className="h-12 w-12 text-primary mb-4" />
              <h4 className="text-xl font-semibold mb-3">Real-time Availability</h4>
              <p className="text-muted-foreground">
                Live slot updates ensure you always see accurate availability and can book instantly.
              </p>
            </Card>

            <Card className="terminal-card hover:terminal-glow transition-all duration-300">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h4 className="text-xl font-semibold mb-3">Secure Payments</h4>
              <p className="text-muted-foreground">
                Integrated payment gateway with QR code generation for seamless entry verification.
              </p>
            </Card>

            <Card className="terminal-card hover:terminal-glow transition-all duration-300">
              <Globe className="h-12 w-12 text-primary mb-4" />
              <h4 className="text-xl font-semibold mb-3">Multi-language</h4>
              <p className="text-muted-foreground">
                Support for multiple languages to serve diverse visitors from around the world.
              </p>
            </Card>

            <Card className="terminal-card hover:terminal-glow transition-all duration-300">
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <h4 className="text-xl font-semibold mb-3">Analytics Dashboard</h4>
              <p className="text-muted-foreground">
                Comprehensive insights into booking patterns, revenue, and visitor preferences.
              </p>
            </Card>

            <Card className="terminal-card hover:terminal-glow transition-all duration-300">
              <Ticket className="h-12 w-12 text-primary mb-4" />
              <h4 className="text-xl font-semibold mb-3">Digital Tickets</h4>
              <p className="text-muted-foreground">
                Instant PDF tickets with QR codes for quick scanning and hassle-free entry.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-4xl font-bold text-center mb-16 text-balance">
            How It <span className="text-primary">Works</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">1. Chat</h4>
              <p className="text-foreground/70 text-sm">Start a conversation with our AI assistant</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">2. Select</h4>
              <p className="text-foreground/70 text-sm">Choose your experience, date, and time</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">3. Pay</h4>
              <p className="text-foreground/70 text-sm">Secure payment with instant confirmation</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">4. Enter</h4>
              <p className="text-foreground/70 text-sm">Show your QR code ticket for entry</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-4xl font-bold mb-6 text-balance">
            Ready to Transform Your <span className="text-primary">Booking Experience</span>?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Join thousands of satisfied visitors who've discovered the future of ticket booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="terminal-button text-lg px-8 py-6" onClick={() => setIsChatOpen(true)}>
              <MessageCircle className="mr-2 h-5 w-5" />
              Start Chatting Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              onClick={() => setIsQRScannerOpen(true)}
            >
              <Scan className="mr-2 h-5 w-5" />
              Scan Tickets
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Ticket className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TicketMaster</span>
          </div>
          <p className="text-muted-foreground">AI-powered ticketing solution for museums and entertainment venues</p>
          <div className="flex justify-center space-x-6 mt-6 text-sm text-muted-foreground">
            <button onClick={() => setIsChatOpen(true)} className="hover:text-primary transition-colors">
              Book Tickets
            </button>
            <Link href="/admin" className="hover:text-primary transition-colors">
              Admin Portal
            </Link>
            <button onClick={() => setIsQRScannerOpen(true)} className="hover:text-primary transition-colors">
              Scan QR Code
            </button>
          </div>
        </div>
      </footer>

      {/* ChatBot Component */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <QRScanner isOpen={isQRScannerOpen} onClose={() => setIsQRScannerOpen(false)} onScanResult={handleQRScanResult} />
    </div>
  )
}
