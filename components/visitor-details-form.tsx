"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Phone, Calendar } from "lucide-react"

interface VisitorDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  age: string
  specialRequirements: string
}

interface VisitorDetailsFormProps {
  onSubmit: (details: VisitorDetails) => void
  onBack: () => void
  ticketCount: number
}

export function VisitorDetailsForm({ onSubmit, onBack, ticketCount }: VisitorDetailsFormProps) {
  const [details, setDetails] = useState<VisitorDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    specialRequirements: "",
  })

  const [errors, setErrors] = useState<Partial<VisitorDetails>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<VisitorDetails> = {}

    if (!details.firstName.trim()) newErrors.firstName = "First name is required"
    if (!details.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!details.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(details.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!details.phone.trim()) newErrors.phone = "Phone number is required"
    if (!details.age) newErrors.age = "Age group is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(details)
    }
  }

  const handleInputChange = (field: keyof VisitorDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div
      className="w-full h-screen overflow-y-auto scrollbar-hide p-4 sm:p-6 lg:p-8"
      style={{
        scrollbarWidth: "none" /* Firefox */,
        msOverflowStyle: "none" /* Internet Explorer 10+ */,
      }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }
      `}</style>
      <Card className="terminal-card w-full max-w-2xl mx-auto">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">Visitor Details</h3>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Please provide details for the primary visitor ({ticketCount} ticket{ticketCount > 1 ? "s" : ""})
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-muted-foreground hover:text-primary self-start sm:self-auto"
            >
              ← Back
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center text-sm sm:text-base">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={details.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={`terminal-input ${errors.firstName ? "border-red-500" : ""}`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-red-500 text-xs sm:text-sm">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center text-sm sm:text-base">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  value={details.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={`terminal-input ${errors.lastName ? "border-red-500" : ""}`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-red-500 text-xs sm:text-sm">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center text-sm sm:text-base">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={details.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`terminal-input ${errors.email ? "border-red-500" : ""}`}
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-500 text-xs sm:text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center text-sm sm:text-base">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={details.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`terminal-input ${errors.phone ? "border-red-500" : ""}`}
                placeholder="Enter your phone number"
              />
              {errors.phone && <p className="text-red-500 text-xs sm:text-sm">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center text-sm sm:text-base">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                Age Group *
              </Label>
              <Select value={details.age} onValueChange={(value) => handleInputChange("age", value)}>
                <SelectTrigger className={`terminal-input ${errors.age ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select your age group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="child">Child (Under 12)</SelectItem>
                  <SelectItem value="student">Student (13-25)</SelectItem>
                  <SelectItem value="adult">Adult (26-64)</SelectItem>
                  <SelectItem value="senior">Senior (65+)</SelectItem>
                </SelectContent>
              </Select>
              {errors.age && <p className="text-red-500 text-xs sm:text-sm">{errors.age}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequirements" className="text-sm sm:text-base">
                Special Requirements (Optional)
              </Label>
              <Input
                id="specialRequirements"
                value={details.specialRequirements}
                onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
                className="terminal-input"
                placeholder="Wheelchair access, dietary requirements, etc."
              />
            </div>

            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Important Information</h4>
              <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                <li>• Please arrive 15 minutes before your scheduled time</li>
                <li>• Bring a valid ID for verification</li>
                <li>• Photography may be restricted in certain areas</li>
                <li>• Tickets are non-refundable but can be rescheduled up to 24 hours in advance</li>
              </ul>
            </div>

            <Button type="submit" className="w-full terminal-button text-base sm:text-lg py-4 sm:py-6">
              Continue to Payment
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
