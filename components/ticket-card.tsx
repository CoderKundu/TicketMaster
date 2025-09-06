"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar, Clock, MapPin, User, Ticket, QrCode, Printer } from "lucide-react"

interface TicketData {
  ticketId: string
  experience: any
  date: string
  time: any
  tickets: number
  visitorDetails: any
  paymentData: any
  qrCode: string
}

interface TicketCardProps {
  ticketData: TicketData
  onDownload: () => void
  onNewBooking: () => void
}

const generateQRCode = async (data: string): Promise<string> => {
  try {
    // Dynamic import to avoid SSR issues
    const QRCode = (await import("qrcode")).default
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
    return qrCodeDataURL
  } catch (error) {
    console.log("[v0] QR Code generation error:", error)
    // Fallback to placeholder
    return "/qr-code-generic.png"
  }
}

export function TicketCard({ ticketData, onDownload, onNewBooking }: TicketCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  useEffect(() => {
    const qrData = JSON.stringify({
      ticketId: ticketData.ticketId,
      experience: ticketData.experience.name,
      date: ticketData.date,
      time: ticketData.time.time,
      visitor: `${ticketData.visitorDetails.firstName} ${ticketData.visitorDetails.lastName}`,
      tickets: ticketData.tickets,
    })

    generateQRCode(qrData).then(setQrCodeUrl)
  }, [ticketData])

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const generatePDF = () => {
    const ticketContent = `
═══════════════════════════════════════════════════════════════
                        TICKETMASTER
                      DIGITAL TICKET
═══════════════════════════════════════════════════════════════

TICKET INFORMATION
──────────────────────────────────────────────────────────────
Ticket ID: ${ticketData.ticketId}
Experience: ${ticketData.experience.name}
Date: ${formatDate(ticketData.date)}
Time: ${formatTime(ticketData.time.time)}
Number of Tickets: ${ticketData.tickets}

VISITOR DETAILS
──────────────────────────────────────────────────────────────
Name: ${ticketData.visitorDetails.firstName} ${ticketData.visitorDetails.lastName}
Email: ${ticketData.visitorDetails.email}
Phone: ${ticketData.visitorDetails.phone}

PAYMENT INFORMATION
──────────────────────────────────────────────────────────────
Transaction ID: ${ticketData.paymentData.transactionId}
Amount Paid: $${ticketData.paymentData.amount.toFixed(2)}
Payment Method: ${ticketData.paymentData.paymentMethod}

IMPORTANT INSTRUCTIONS
──────────────────────────────────────────────────────────────
• Please arrive 15 minutes before your scheduled time
• Bring a valid ID for verification
• Present this QR code at the entrance for scanning
• Keep your ticket accessible on your mobile device
• Contact support at help@ticketmaster.com for assistance

QR CODE DATA: ${ticketData.qrCode}

═══════════════════════════════════════════════════════════════
Thank you for choosing TicketMaster!
Visit us at: 123 Museum Street, City, State 12345
Phone: (555) 123-4567 | Email: info@ticketmaster.com
═══════════════════════════════════════════════════════════════
    `

    const blob = new Blob([ticketContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `TicketMaster-${ticketData.ticketId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    onDownload()
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Ticket - ${ticketData.ticketId}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .ticket { border: 2px solid #000; padding: 20px; max-width: 600px; }
              .header { text-align: center; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
              .qr-code { text-align: center; margin: 20px 0; }
              .details { margin: 10px 0; }
              .label { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="ticket">
              <div class="header">
                <h1>TICKETMASTER</h1>
                <h2>DIGITAL TICKET</h2>
              </div>
              <div class="details">
                <p><span class="label">Ticket ID:</span> ${ticketData.ticketId}</p>
                <p><span class="label">Experience:</span> ${ticketData.experience.name}</p>
                <p><span class="label">Date:</span> ${formatDate(ticketData.date)}</p>
                <p><span class="label">Time:</span> ${formatTime(ticketData.time.time)}</p>
                <p><span class="label">Tickets:</span> ${ticketData.tickets}</p>
                <p><span class="label">Visitor:</span> ${ticketData.visitorDetails.firstName} ${ticketData.visitorDetails.lastName}</p>
              </div>
              <div class="qr-code">
                <img src="${qrCodeUrl}" alt="QR Code" style="width: 150px; height: 150px;" />
                <p>Scan this QR code at entrance</p>
              </div>
              <div style="margin-top: 20px; font-size: 12px;">
                <p>• Please arrive 15 minutes before your scheduled time</p>
                <p>• Bring a valid ID for verification</p>
                <p>• Present this QR code at the entrance</p>
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Success Message */}
      <Card className="terminal-card bg-green-500/10 border-green-500/20">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ticket className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground">
            Your tickets have been successfully booked and saved. Check your email for confirmation details.
          </p>
        </div>
      </Card>

      {/* Digital Ticket */}
      <Card className="terminal-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Digital Ticket</h3>
              <p className="text-muted-foreground">Present this QR code at the entrance</p>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-600 border-green-500/30">
              CONFIRMED
            </Badge>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ticket Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Experience Details
                </h4>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{ticketData.experience.icon}</div>
                    <div className="flex-1">
                      <h5 className="text-xl font-semibold">{ticketData.experience.name}</h5>
                      <p className="text-muted-foreground">{ticketData.experience.description}</p>
                      <div className="flex items-center space-x-1 mt-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm">{ticketData.experience.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">Date</span>
                      </div>
                      <p className="text-sm">{formatDate(ticketData.date)}</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">Time</span>
                      </div>
                      <p className="text-sm">{formatTime(ticketData.time.time)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Visitor Information
                </h4>

                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <span className="font-medium">Name:</span>
                    <p className="text-sm">
                      {ticketData.visitorDetails.firstName} {ticketData.visitorDetails.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <p className="text-sm">{ticketData.visitorDetails.email}</p>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>
                    <p className="text-sm">{ticketData.visitorDetails.phone}</p>
                  </div>
                  <div>
                    <span className="font-medium">Tickets:</span>
                    <p className="text-sm">
                      {ticketData.tickets} ticket{ticketData.tickets > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-600 mb-2">Important Information</h5>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Please arrive 15 minutes before your scheduled time</li>
                  <li>• Bring a valid ID for verification</li>
                  <li>• Present this QR code at the entrance for scanning</li>
                  <li>• Keep your ticket accessible on your mobile device</li>
                </ul>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <img
                  src={qrCodeUrl || "/placeholder.svg?height=200&width=200&query=QR+Code"}
                  alt="Ticket QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <QrCode className="h-4 w-4 text-primary" />
                  <span className="font-medium">Scan to Enter</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">ID: {ticketData.ticketId}</p>
              </div>

              <div className="flex flex-col space-y-2 w-full">
                <Button onClick={generatePDF} className="terminal-button">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Ticket
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="outline"
          onClick={onNewBooking}
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
        >
          Book Another Experience
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          Print This Page
        </Button>
      </div>
    </div>
  )
}
