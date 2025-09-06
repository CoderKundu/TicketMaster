"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Lock, Shield, Calendar, User, Clock } from "lucide-react"

interface PaymentFormProps {
  bookingData: any
  onPaymentSuccess: (paymentData: any) => void
  onBack: () => void
}

interface PaymentDetails {
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  cardholderName: string
  billingAddress: string
  city: string
  zipCode: string
  country: string
}

export function PaymentForm({ bookingData, onPaymentSuccess, onBack }: PaymentFormProps) {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    country: "",
  })

  const [errors, setErrors] = useState<Partial<PaymentDetails>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentDetails> = {}

    if (!paymentDetails.cardNumber.replace(/\s/g, "")) {
      newErrors.cardNumber = "Card number is required"
    } else if (paymentDetails.cardNumber.replace(/\s/g, "").length < 13) {
      newErrors.cardNumber = "Please enter a valid card number"
    }

    if (!paymentDetails.expiryMonth) newErrors.expiryMonth = "Month is required"
    if (!paymentDetails.expiryYear) newErrors.expiryYear = "Year is required"
    if (!paymentDetails.cvv) {
      newErrors.cvv = "CVV is required"
    } else if (paymentDetails.cvv.length < 3) {
      newErrors.cvv = "Please enter a valid CVV"
    }
    if (!paymentDetails.cardholderName.trim()) newErrors.cardholderName = "Cardholder name is required"
    if (!paymentDetails.billingAddress.trim()) newErrors.billingAddress = "Billing address is required"
    if (!paymentDetails.city.trim()) newErrors.city = "City is required"
    if (!paymentDetails.zipCode.trim()) newErrors.zipCode = "ZIP code is required"
    if (!paymentDetails.country) newErrors.country = "Country is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof PaymentDetails, value: string) => {
    if (field === "cardNumber") {
      value = formatCardNumber(value)
    }
    if (field === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4)
    }

    setPaymentDetails((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      const paymentData = {
        transactionId: `TXN-${Date.now()}`,
        amount: calculateTotal(),
        currency: "USD",
        paymentMethod: `****${paymentDetails.cardNumber.slice(-4)}`,
        status: "completed",
        timestamp: new Date(),
      }

      onPaymentSuccess(paymentData)
      setIsProcessing(false)
    }, 3000)
  }

  const calculateTotal = () => {
    const basePrice = bookingData.time?.price || 25
    const tickets = bookingData.tickets || 1
    const subtotal = basePrice * tickets
    const tax = subtotal * 0.08 // 8% tax
    const processingFee = 2.99
    return subtotal + tax + processingFee
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div
      className="h-screen overflow-y-auto"
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
      <Card className="terminal-card w-full max-w-4xl mx-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Secure Payment</h3>
              <p className="text-muted-foreground flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                Your payment information is encrypted and secure
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-muted-foreground hover:text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200"
            >
              ← Back
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-primary" />
                    Payment Information
                  </h4>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                      className={`terminal-input ${errors.cardNumber ? "border-red-500" : ""}`}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryMonth">Month *</Label>
                      <Select
                        value={paymentDetails.expiryMonth}
                        onValueChange={(value) => handleInputChange("expiryMonth", value)}
                      >
                        <SelectTrigger className={`terminal-input ${errors.expiryMonth ? "border-red-500" : ""}`}>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                              {String(i + 1).padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.expiryMonth && <p className="text-red-500 text-sm">{errors.expiryMonth}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiryYear">Year *</Label>
                      <Select
                        value={paymentDetails.expiryYear}
                        onValueChange={(value) => handleInputChange("expiryYear", value)}
                      >
                        <SelectTrigger className={`terminal-input ${errors.expiryYear ? "border-red-500" : ""}`}>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i
                            return (
                              <SelectItem key={year} value={String(year)}>
                                {year}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      {errors.expiryYear && <p className="text-red-500 text-sm">{errors.expiryYear}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        value={paymentDetails.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value)}
                        className={`terminal-input ${errors.cvv ? "border-red-500" : ""}`}
                        placeholder="123"
                        maxLength={4}
                      />
                      {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                    <Input
                      id="cardholderName"
                      value={paymentDetails.cardholderName}
                      onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                      className={`terminal-input ${errors.cardholderName ? "border-red-500" : ""}`}
                      placeholder="John Doe"
                    />
                    {errors.cardholderName && <p className="text-red-500 text-sm">{errors.cardholderName}</p>}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Billing Address</h4>

                  <div className="space-y-2">
                    <Label htmlFor="billingAddress">Address *</Label>
                    <Input
                      id="billingAddress"
                      value={paymentDetails.billingAddress}
                      onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                      className={`terminal-input ${errors.billingAddress ? "border-red-500" : ""}`}
                      placeholder="123 Main Street"
                    />
                    {errors.billingAddress && <p className="text-red-500 text-sm">{errors.billingAddress}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={paymentDetails.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className={`terminal-input ${errors.city ? "border-red-500" : ""}`}
                        placeholder="New York"
                      />
                      {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={paymentDetails.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        className={`terminal-input ${errors.zipCode ? "border-red-500" : ""}`}
                        placeholder="10001"
                      />
                      {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select
                      value={paymentDetails.country}
                      onValueChange={(value) => handleInputChange("country", value)}
                    >
                      <SelectTrigger className={`terminal-input ${errors.country ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        <SelectItem value="FR">France</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
                  </div>
                </div>

                <Button type="submit" disabled={isProcessing} className="w-full terminal-button text-lg py-6">
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Processing Payment...
                    </div>
                  ) : (
                    <>
                      <Lock className="h-5 w-5 mr-2" />
                      Pay ${calculateTotal().toFixed(2)}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="p-6 bg-muted/50">
                <h4 className="text-lg font-semibold mb-4">Order Summary</h4>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{bookingData.experience?.icon}</div>
                    <div className="flex-1">
                      <h5 className="font-medium">{bookingData.experience?.name}</h5>
                      <p className="text-sm text-muted-foreground">{bookingData.experience?.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(bookingData.date)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {bookingData.time?.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tickets ({bookingData.tickets}x)</span>
                      <span>${((bookingData.time?.price || 25) * (bookingData.tickets || 1)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span>${((bookingData.time?.price || 25) * (bookingData.tickets || 1) * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee</span>
                      <span>$2.99</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-card p-4 rounded-lg">
                    <h6 className="font-medium mb-2 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Primary Visitor
                    </h6>
                    <p className="text-sm">
                      {bookingData.visitorDetails?.firstName} {bookingData.visitorDetails?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{bookingData.visitorDetails?.email}</p>
                  </div>
                </div>
              </Card>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-green-600">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Secure Payment</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Your payment is protected by 256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
