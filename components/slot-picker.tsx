"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, MapPin } from "lucide-react"

interface TimeSlot {
  id: string
  time: string
  available: number
  total: number
  price: number
}

interface Experience {
  id: string
  name: string
  duration: string
  description: string
  icon: string
}

interface SlotPickerProps {
  onSlotSelected: (slot: { experience: Experience; date: string; time: TimeSlot; tickets: number }) => void
  onBack: () => void
}

const EXPERIENCES: Experience[] = [
  {
    id: "museum-tour",
    name: "Museum Tour",
    duration: "90 min",
    description: "Comprehensive tour of all major exhibits with expert guide",
    icon: "🏛️",
  },
  {
    id: "art-exhibition",
    name: "Art Exhibition",
    duration: "60 min",
    description: "Modern Masterpieces - Contemporary art collection showcase",
    icon: "🎨",
  },
  {
    id: "science-show",
    name: "Science Show",
    duration: "45 min",
    description: "Interactive demonstrations and hands-on experiments",
    icon: "🔬",
  },
  {
    id: "history-walk",
    name: "History Walk",
    duration: "75 min",
    description: "Journey through time with historical artifacts and stories",
    icon: "📜",
  },
]

const generateTimeSlots = (date: string): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17]

  hours.forEach((hour) => {
    const available = Math.floor(Math.random() * 20) + 5
    const total = 25
    slots.push({
      id: `${date}-${hour}`,
      time: `${hour.toString().padStart(2, "0")}:00`,
      available,
      total,
      price: 25,
    })
  })

  return slots
}

const getNextDays = (count: number): string[] => {
  const days = []
  const today = new Date()

  for (let i = 0; i < count; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    days.push(date.toISOString().split("T")[0])
  }

  return days
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  if (dateString === today.toISOString().split("T")[0]) {
    return "Today"
  }
  if (dateString === tomorrow.toISOString().split("T")[0]) {
    return "Tomorrow"
  }

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export function SlotPicker({ onSlotSelected, onBack }: SlotPickerProps) {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null)
  const [ticketCount, setTicketCount] = useState(1)
  const [step, setStep] = useState<"experience" | "date" | "time" | "tickets">("experience")

  const availableDates = getNextDays(7)
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : []

  const handleExperienceSelect = (experience: Experience) => {
    setSelectedExperience(experience)
    setStep("date")
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setStep("time")
  }

  const handleTimeSelect = (time: TimeSlot) => {
    setSelectedTime(time)
    setStep("tickets")
  }

  const handleConfirmBooking = () => {
    if (selectedExperience && selectedDate && selectedTime) {
      onSlotSelected({
        experience: selectedExperience,
        date: selectedDate,
        time: selectedTime,
        tickets: ticketCount,
      })
    }
  }

  const getAvailabilityColor = (available: number, total: number) => {
    const ratio = available / total
    if (ratio > 0.7) return "text-green-500"
    if (ratio > 0.3) return "text-yellow-500"
    return "text-red-500"
  }

  const getAvailabilityText = (available: number, total: number) => {
    const ratio = available / total
    if (ratio > 0.7) return "Good availability"
    if (ratio > 0.3) return "Limited spots"
    if (available > 0) return "Few spots left"
    return "Fully booked"
  }

  return (
    <Card className="terminal-card w-full max-w-2xl mx-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground">Book Your Experience</h3>
            <p className="text-muted-foreground">Select your preferred date and time</p>
          </div>
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground hover:text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200"
          >
            ← Back to Chat
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center space-x-2 mb-8">
          {["experience", "date", "time", "tickets"].map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === stepName
                    ? "bg-primary text-primary-foreground"
                    : index < ["experience", "date", "time", "tickets"].indexOf(step)
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              {index < 3 && <div className="w-8 h-0.5 bg-border mx-2" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {step === "experience" && (
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Choose Your Experience
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {EXPERIENCES.map((experience) => (
                  <Card
                    key={experience.id}
                    className="p-4 cursor-pointer hover:terminal-glow transition-all duration-200 border-border hover:border-primary"
                    onClick={() => handleExperienceSelect(experience)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{experience.icon}</div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-foreground">{experience.name}</h5>
                        <p className="text-sm text-muted-foreground mb-2">{experience.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {experience.duration}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {step === "date" && selectedExperience && (
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Select Date for {selectedExperience.name}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableDates.map((date) => (
                  <Button
                    key={date}
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center border-border hover:border-primary hover:bg-primary/25 hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 bg-card transition-all duration-200"
                    onClick={() => handleDateSelect(date)}
                  >
                    <span className="font-medium">{formatDate(date)}</span>
                    <span className="text-xs opacity-75">
                      {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === "time" && selectedDate && (
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Available Times for {formatDate(selectedDate)}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant="outline"
                    disabled={slot.available === 0}
                    className="h-20 flex flex-col items-center justify-center border-border hover:border-primary hover:bg-primary/25 hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-border disabled:hover:shadow-none bg-card transition-all duration-200"
                    onClick={() => handleTimeSelect(slot)}
                  >
                    <span className="font-medium text-lg">{slot.time}</span>
                    <span className={`text-xs ${getAvailabilityColor(slot.available, slot.total)}`}>
                      {getAvailabilityText(slot.available, slot.total)}
                    </span>
                    <span className="text-xs opacity-75">${slot.price}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === "tickets" && selectedTime && (
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Number of Tickets
              </h4>

              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    disabled={ticketCount <= 1}
                  >
                    -
                  </Button>
                  <span className="text-2xl font-bold w-16 text-center">{ticketCount}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTicketCount(Math.min(selectedTime.available, ticketCount + 1))}
                    disabled={ticketCount >= selectedTime.available}
                  >
                    +
                  </Button>
                </div>

                {/* Booking Summary */}
                <Card className="p-4 bg-muted/50">
                  <h5 className="font-semibold mb-3">Booking Summary</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Experience:</span>
                      <span className="font-medium">{selectedExperience?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{formatDate(selectedDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{selectedTime.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tickets:</span>
                      <span className="font-medium">
                        {ticketCount} × ${selectedTime.price}
                      </span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span className="text-primary">${ticketCount * selectedTime.price}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Button onClick={handleConfirmBooking} className="w-full terminal-button text-lg py-6">
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
