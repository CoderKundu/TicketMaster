"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Ticket, Clock, HelpCircle, X, Globe, Calendar, CreditCard, Trash2, Eye } from "lucide-react"
import { SlotPicker } from "./slot-picker"
import { VisitorDetailsForm } from "./visitor-details-form"
import { PaymentForm } from "./payment-form"
import { TicketCard } from "./ticket-card"
import { FAQSystem } from "./faq-system"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  quickReplies?: string[]
}

interface ChatBotProps {
  isOpen: boolean
  onClose: () => void
}

interface BookingData {
  experience?: any
  date?: string
  time?: any
  tickets?: number
  visitorDetails?: any
  paymentData?: any
}

interface StoredBooking {
  id: string
  ticketId: string
  experience: any
  date: string
  time: any
  tickets: number
  visitorDetails: any
  paymentData: any
  qrCode: string
  status: "active" | "cancelled"
  createdAt: Date
}

const QUICK_REPLIES = {
  initial: ["Book Tickets", "My Tickets", "How to Book", "Cancel Booking", "Help"],
  booking: ["Museum Tour", "Art Exhibition", "Science Show", "History Walk"],
  timings: ["Today", "Tomorrow", "This Weekend", "Next Week"],
  help: ["How to Book", "Payment Methods", "Cancellation", "Contact Support"],
  faq: ["Booking Questions", "Payment Info", "Cancellation Policy", "Accessibility"],
  tickets: ["View All Tickets", "Download Tickets", "Cancel Booking", "Book More"],
}

// const LANGUAGES = [
//   { code: "en", name: "English", flag: "🇺🇸" },
//   { code: "es", name: "Español", flag: "🇪🇸" },
//   { code: "fr", name: "Français", flag: "🇫🇷" },
//   { code: "de", name: "Deutsch", flag: "🇩🇪" },
//   { code: "zh", name: "中文", flag: "🇨🇳" },
// ]

const parseBookingRequest = (message: string) => {
  const lowerMessage = message.toLowerCase()

  // Extract number of tickets
  const ticketMatch = lowerMessage.match(/(\d+)\s*tickets?/)
  const ticketCount = ticketMatch ? Number.parseInt(ticketMatch[1]) : null

  // Extract experience type
  let experience = null
  if (lowerMessage.includes("museum")) experience = "Museum Tour"
  else if (lowerMessage.includes("art")) experience = "Art Exhibition"
  else if (lowerMessage.includes("science")) experience = "Science Show"
  else if (lowerMessage.includes("history")) experience = "History Walk"
  else if (lowerMessage.includes("concert") || lowerMessage.includes("singing")) experience = "Art Exhibition"

  // Extract time preferences
  let timePreference = null
  if (lowerMessage.includes("10am") || lowerMessage.includes("10:00")) timePreference = "10:00"
  else if (lowerMessage.includes("5pm") || lowerMessage.includes("17:00")) timePreference = "17:00"
  else if (lowerMessage.includes("morning")) timePreference = "morning"
  else if (lowerMessage.includes("afternoon")) timePreference = "afternoon"
  else if (lowerMessage.includes("evening")) timePreference = "evening"

  return { ticketCount, experience, timePreference }
}

export function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hi there! I'm your personal booking assistant. I can help you book tickets, check your existing bookings, or cancel reservations. What would you like to do today?",
      timestamp: new Date(),
      quickReplies: QUICK_REPLIES.initial,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [showLanguages, setShowLanguages] = useState(false)
  const [currentView, setCurrentView] = useState<
    "chat" | "slot-picker" | "visitor-details" | "payment" | "ticket" | "my-tickets"
  >("chat")
  const [bookingData, setBookingData] = useState<BookingData>({})
  const [ticketData, setTicketData] = useState<any>(null)
  const [showFAQ, setShowFAQ] = useState(false)
  const [storedBookings, setStoredBookings] = useState<StoredBooking[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("ticketmaster-bookings")
    if (saved) {
      try {
        const bookings = JSON.parse(saved).map((b: any) => ({
          ...b,
          createdAt: new Date(b.createdAt),
        }))
        setStoredBookings(bookings)
      } catch (error) {
        console.log("[v0] Error loading bookings:", error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("ticketmaster-bookings", JSON.stringify(storedBookings))
  }, [storedBookings])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const simulateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    const parsed = parseBookingRequest(userMessage)

    // Handle specific booking requests with natural language
    if (lowerMessage.includes("book") && (parsed.ticketCount || parsed.experience)) {
      setTimeout(() => setCurrentView("slot-picker"), 500)
      let response = "Perfect! I'd love to help you book "
      if (parsed.ticketCount) response += `${parsed.ticketCount} ticket${parsed.ticketCount > 1 ? "s" : ""} `
      if (parsed.experience) response += `for the ${parsed.experience} `
      if (parsed.timePreference) response += `around ${parsed.timePreference} `
      response += "Let me open our booking system to get you set up right away."
      return response
    }

    // Handle general booking requests
    if (lowerMessage.includes("book") || lowerMessage.includes("ticket")) {
      setTimeout(() => setCurrentView("slot-picker"), 500)
      return "I'll help you find the perfect experience. Let me show you what's available and you can pick your preferred date and time."
    }

    // Handle ticket viewing requests
    if (
      lowerMessage.includes("my tickets") ||
      lowerMessage.includes("show me my") ||
      lowerMessage.includes("review my booking")
    ) {
      const activeBookings = storedBookings.filter((b) => b.status === "active")
      if (activeBookings.length === 0) {
        return "You don't have any active bookings yet. Would you like to book some tickets? I can help you find great experiences!"
      }
      setTimeout(() => setCurrentView("my-tickets"), 500)
      return `You have ${activeBookings.length} active booking${activeBookings.length > 1 ? "s" : ""}. Let me show you all your tickets with QR codes and details.`
    }

    // Handle cancellation requests
    if (lowerMessage.includes("cancel")) {
      const activeBookings = storedBookings.filter((b) => b.status === "active")
      if (activeBookings.length === 0) {
        return "You don't have any active bookings to cancel. If you need help with something else, just let me know!"
      }
      setTimeout(() => setCurrentView("my-tickets"), 500)
      return "I can help you cancel your booking. Let me show you your active tickets so you can choose which one to cancel."
    }

    // Handle "How to Book" requests
    if (lowerMessage.includes("how to book") || lowerMessage === "how to book") {
      return `Here's how easy it is to book with me:

**1. Choose Your Experience** - Tell me what interests you (museum, art, science, history)
**2. Pick Date & Time** - Select when you'd like to visit
**3. Enter Details** - Just your name, email, and party size
**4. Pay Securely** - Quick payment right here in chat
**5. Get Your Ticket** - Instant QR code ticket ready to use!

The whole process takes less than 2 minutes. Would you like to start booking now?`
    }

    if (lowerMessage.includes("proceed to payment")) {
      setTimeout(() => setCurrentView("payment"), 500)
      return "Great! Let's get your payment sorted. I'll open our secure payment form - it only takes a minute to complete."
    }

    if (lowerMessage.includes("timing") || lowerMessage.includes("schedule") || lowerMessage.includes("hours")) {
      return "We're open daily from 9:00 AM to 6:00 PM with experiences starting every hour. Most popular times are 10 AM, 2 PM, and 4 PM. What time works best for you?"
    }

    if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      return "I'm here to help! I can book tickets, show your existing bookings, handle cancellations, or answer questions about pricing and policies. What do you need assistance with?"
    }

    if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("pricing")) {
      return "Our ticket prices are: Adults $25, Students $15, Children (under 12) $10, Seniors $20. Groups of 10+ get a 15% discount! Ready to book?"
    }

    // Experience-specific responses
    if (lowerMessage.includes("museum tour")) {
      return "The Museum Tour is fantastic! It's our most comprehensive 90-minute journey through all exhibits. Available every hour from 9 AM to 4 PM. Shall I check today's availability for you?"
    }

    if (lowerMessage.includes("art exhibition")) {
      return "Our 'Modern Masterpieces' exhibition is absolutely stunning! It's a 60-minute guided tour of contemporary works. Very popular, so I'd recommend booking soon. How many tickets do you need?"
    }

    if (lowerMessage.includes("faq") || lowerMessage.includes("frequently asked")) {
      setTimeout(() => setShowFAQ(true), 500)
      return "I'll open our help center where you can find detailed answers to common questions about booking, payments, and policies."
    }

    // Default friendly response
    return "I'd be happy to help you with that! I specialize in booking tickets, managing your reservations, and answering questions. What would you like to do today?"
  }

  const getQuickReplies = (message: string): string[] => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("book") && lowerMessage.includes("system")) {
      return QUICK_REPLIES.booking
    }

    if (lowerMessage.includes("timing") || lowerMessage.includes("when")) {
      return QUICK_REPLIES.timings
    }

    if (lowerMessage.includes("help")) {
      return QUICK_REPLIES.help
    }

    if (lowerMessage.includes("active booking")) {
      return QUICK_REPLIES.tickets
    }

    if (lowerMessage.includes("how easy it is")) {
      return ["Start Booking", "See Pricing", "More Info", "Contact Support"]
    }

    if (lowerMessage.includes("proceed to payment")) {
      return []
    }

    if (lowerMessage.includes("faq") || lowerMessage.includes("help center")) {
      return QUICK_REPLIES.faq
    }

    return ["Book Now", "My Tickets", "Get Help", "See Pricing"]
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(
      () => {
        const botResponse = simulateBotResponse(content)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: botResponse,
          timestamp: new Date(),
          quickReplies: getQuickReplies(botResponse),
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  const handleSlotSelected = (slotData: any) => {
    setBookingData({
      ...bookingData,
      experience: slotData.experience,
      date: slotData.date,
      time: slotData.time,
      tickets: slotData.tickets,
    })
    setCurrentView("visitor-details")
  }

  const handleVisitorDetailsSubmit = (details: any) => {
    setBookingData({
      ...bookingData,
      visitorDetails: details,
    })

    // Add confirmation message to chat
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: `Great! I've collected all your details. You're booking ${bookingData.tickets} ticket(s) for ${bookingData.experience?.name} on ${new Date(bookingData.date!).toLocaleDateString()}. Let's proceed to payment.`,
      timestamp: new Date(),
      quickReplies: ["Proceed to Payment", "Review Details", "Start Over"],
    }

    setMessages((prev) => [...prev, confirmationMessage])
    setCurrentView("chat")
  }

  const handlePaymentSuccess = (paymentData: any) => {
    const finalBookingData = {
      ...bookingData,
      paymentData,
    }

    const newTicketData = {
      ticketId: `TM-${Date.now()}`,
      ...finalBookingData,
      qrCode: `QR-${Date.now()}`,
    }

    const newBooking: StoredBooking = {
      id: `booking-${Date.now()}`,
      ticketId: newTicketData.ticketId,
      experience: finalBookingData.experience,
      date: finalBookingData.date!,
      time: finalBookingData.time,
      tickets: finalBookingData.tickets!,
      visitorDetails: finalBookingData.visitorDetails,
      paymentData: paymentData,
      qrCode: newTicketData.qrCode,
      status: "active",
      createdAt: new Date(),
    }

    setStoredBookings((prev) => [...prev, newBooking])
    setTicketData(newTicketData)
    setCurrentView("ticket")

    const successMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: `🎉 Perfect! Your booking is confirmed and saved. Your digital ticket with QR code is ready. Transaction ID: ${paymentData.transactionId}`,
      timestamp: new Date(),
      quickReplies: ["Download Ticket", "Book Another", "View All Tickets"],
    }

    setMessages((prev) => [...prev, successMessage])
  }

  const handleCancelBooking = (bookingId: string) => {
    setStoredBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" as const } : booking)),
    )

    const cancelMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content:
        "Your booking has been cancelled successfully. If you paid online, your refund will be processed within 3-5 business days. Is there anything else I can help you with?",
      timestamp: new Date(),
      quickReplies: ["Book New Tickets", "View Remaining Tickets", "Contact Support", "Back to Chat"],
    }

    setMessages((prev) => [...prev, cancelMessage])
    setCurrentView("chat")
  }

  const handleBackToChat = () => {
    setCurrentView("chat")
  }

  const handleNewBooking = () => {
    setBookingData({})
    setTicketData(null)
    setCurrentView("chat")

    const newBookingMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: "I'd be happy to help you book another experience! What would you like to do?",
      timestamp: new Date(),
      quickReplies: QUICK_REPLIES.initial,
    }

    setMessages((prev) => [...prev, newBookingMessage])
  }

  const handleTicketDownload = () => {
    // Add download confirmation to chat
    const downloadMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: "Your ticket has been downloaded successfully! Don't forget to bring it with you on your visit.",
      timestamp: new Date(),
      quickReplies: ["Book Another", "Get Directions", "Contact Support"],
    }

    setMessages((prev) => [...prev, downloadMessage])
  }

  const handleFAQSelect = (question: string, answer: string) => {
    const faqMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: `**${question}**\n\n${answer}`,
      timestamp: new Date(),
      quickReplies: ["Ask Another", "Book Now", "Contact Support", "Back to Chat"],
    }

    setMessages((prev) => [...prev, faqMessage])
    setShowFAQ(false)
  }

  const handleBackFromFAQ = () => {
    setShowFAQ(false)
    const backMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: "I'm back! How else can I help you today?",
      timestamp: new Date(),
      quickReplies: QUICK_REPLIES.initial,
    }

    setMessages((prev) => [...prev, backMessage])
  }

  const MyTicketsView = () => {
    const activeBookings = storedBookings.filter((b) => b.status === "active")

    return (
      <Card className="w-full max-w-4xl h-[90vh] sm:h-[600px] flex flex-col terminal-card terminal-glow">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-lg flex items-center">
            <Ticket className="h-5 w-5 mr-2 text-primary" />
            My Tickets ({activeBookings.length})
          </h3>
          <Button variant="ghost" size="sm" onClick={handleBackToChat}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          {activeBookings.length === 0 ? (
            <div className="text-center py-8">
              <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No active bookings found</p>
              <Button onClick={() => setCurrentView("slot-picker")} className="terminal-button">
                Book Your First Ticket
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBookings.map((booking) => (
                <Card key={booking.id} className="p-4 terminal-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{booking.experience.icon}</span>
                        <div>
                          <h4 className="font-semibold">{booking.experience.name}</h4>
                          <p className="text-sm text-muted-foreground">ID: {booking.ticketId}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Date:</span>
                          <p>{new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Time:</span>
                          <p>{booking.time.time}</p>
                        </div>
                        <div>
                          <span className="font-medium">Tickets:</span>
                          <p>{booking.tickets}</p>
                        </div>
                        <div>
                          <span className="font-medium">Visitor:</span>
                          <p>
                            {booking.visitorDetails.firstName} {booking.visitorDetails.lastName}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTicketData(booking)
                          setCurrentView("ticket")
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      {currentView === "slot-picker" && <SlotPicker onSlotSelected={handleSlotSelected} onBack={handleBackToChat} />}

      {currentView === "visitor-details" && (
        <VisitorDetailsForm
          onSubmit={handleVisitorDetailsSubmit}
          onBack={() => setCurrentView("slot-picker")}
          ticketCount={bookingData.tickets || 1}
        />
      )}

      {currentView === "payment" && (
        <PaymentForm bookingData={bookingData} onPaymentSuccess={handlePaymentSuccess} onBack={handleBackToChat} />
      )}

      {currentView === "ticket" && ticketData && (
        <div
          className="w-full max-w-6xl max-h-[95vh] overflow-y-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <TicketCard ticketData={ticketData} onDownload={handleTicketDownload} onNewBooking={handleNewBooking} />
        </div>
      )}

      {currentView === "my-tickets" && <MyTicketsView />}

      {showFAQ && (
        <Card className="w-full max-w-4xl h-[90vh] sm:h-[600px] flex flex-col terminal-card terminal-glow">
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
            <h3 className="font-semibold text-base sm:text-lg">Help Center</h3>
            <Button variant="ghost" size="sm" onClick={handleBackFromFAQ}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            <FAQSystem onQuestionSelect={handleFAQSelect} />
          </div>
        </Card>
      )}

      {currentView === "chat" && (
        <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl h-[95vh] sm:h-[90vh] md:h-[600px] flex flex-col terminal-card terminal-glow">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="relative flex-shrink-0">
                <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-lg truncate">TicketMaster AI</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Online • Ready to help</p>
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {/* Language Selector
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLanguages(!showLanguages)}
                  className="text-muted-foreground hover:text-primary p-1 sm:p-2"
                >
                  <Globe className="h-3 w-3 sm:h-4 sm:w-4 mr-0 sm:mr-1" />
                  <span className="hidden sm:inline">
                    {LANGUAGES.find((lang) => lang.code === currentLanguage)?.flag}
                  </span>
                </Button>

                {showLanguages && (
                  <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-2 min-w-[120px] sm:min-w-[150px] z-10">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLanguage(lang.code)
                          setShowLanguages(false)
                        }}
                        className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded hover:bg-accent hover:text-accent-foreground text-xs sm:text-sm flex items-center space-x-2"
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div> */}

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground hover:text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 relative">
            <ScrollArea className="h-full">
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex items-start space-x-2 max-w-[85%] sm:max-w-[80%]`}>
                      {message.type === "bot" && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        </div>
                      )}

                      <div
                        className={`rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <div className="text-sm leading-relaxed break-words">
                          {message.content.split("\n").map((line, index) => {
                            if (line.startsWith("**") && line.endsWith("**")) {
                              return (
                                <div key={index} className="font-semibold mb-1 sm:mb-2">
                                  {line.slice(2, -2)}
                                </div>
                              )
                            }
                            return (
                              <div key={index} className={index > 0 ? "mt-1 sm:mt-2" : ""}>
                                {line}
                              </div>
                            )
                          })}
                        </div>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>

                      {message.type === "user" && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Quick Replies */}
                {messages.length > 0 &&
                  messages[messages.length - 1].type === "bot" &&
                  messages[messages.length - 1].quickReplies && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4 px-1 sm:px-0">
                      {messages[messages.length - 1].quickReplies!.map((reply, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickReply(reply)}
                          className="text-xs sm:text-sm border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground 
                                   px-2 sm:px-3 py-1 sm:py-2 min-w-0 flex-shrink-0 whitespace-nowrap"
                        >
                          {reply === "Book Tickets" && <Ticket className="h-3 w-3 mr-1 flex-shrink-0" />}
                          {reply === "My Tickets" && <Eye className="h-3 w-3 mr-1 flex-shrink-0" />}
                          {reply === "Show Timings" && <Clock className="h-3 w-3 mr-1 flex-shrink-0" />}
                          {reply === "Help" && <HelpCircle className="h-3 w-3 mr-1 flex-shrink-0" />}
                          {reply === "Book Now" && <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />}
                          {reply === "Pricing" && <CreditCard className="h-3 w-3 mr-1 flex-shrink-0" />}
                          {reply === "FAQ" && <HelpCircle className="h-3 w-3 mr-1 flex-shrink-0" />}
                          {reply === "Cancel Booking" && <Trash2 className="h-3 w-3 mr-1 flex-shrink-0" />}
                          <span className="truncate">{reply}</span>
                        </Button>
                      ))}
                    </div>
                  )}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg px-3 sm:px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-border flex-shrink-0">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="terminal-input flex-1 text-sm sm:text-base"
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="terminal-button flex-shrink-0"
                size="sm"
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send • AI-powered booking assistant
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
