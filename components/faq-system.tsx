"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  keywords: string[]
}

const FAQS: FAQ[] = [
  {
    id: "1",
    question: "How do I book tickets?",
    answer:
      "You can book tickets through our AI chatbot by clicking 'Book Ticket' or by saying 'I want to book tickets'. The chatbot will guide you through selecting your experience, date, time, and completing payment.",
    category: "Booking",
    keywords: ["book", "tickets", "reservation", "purchase"],
  },
  {
    id: "2",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. All payments are processed securely through our encrypted payment system.",
    category: "Payment",
    keywords: ["payment", "credit card", "paypal", "apple pay", "google pay"],
  },
  {
    id: "3",
    question: "Can I cancel or refund my tickets?",
    answer:
      "Yes, you can cancel tickets up to 24 hours before your scheduled visit for a full refund. Cancellations made less than 24 hours in advance are subject to a 50% cancellation fee.",
    category: "Cancellation",
    keywords: ["cancel", "refund", "cancellation", "policy"],
  },
  {
    id: "4",
    question: "How do I use my digital ticket?",
    answer:
      "Your digital ticket contains a QR code that you can show on your phone or print out. Simply present it at the entrance for scanning. Make sure your phone screen is bright and the QR code is clearly visible.",
    category: "Tickets",
    keywords: ["digital", "qr code", "entrance", "scan", "mobile"],
  },
  {
    id: "5",
    question: "What are your opening hours?",
    answer:
      "We're open daily from 9:00 AM to 6:00 PM. Last entry is at 5:00 PM. Shows and tours run every hour on the hour. We're closed on major holidays.",
    category: "Hours",
    keywords: ["hours", "opening", "schedule", "time", "closed"],
  },
  {
    id: "6",
    question: "Do you offer group discounts?",
    answer:
      "Yes! Groups of 10 or more people receive a 15% discount. Groups of 20+ receive 20% off. Contact our group sales team or mention group booking in the chatbot for special rates.",
    category: "Pricing",
    keywords: ["group", "discount", "bulk", "corporate", "school"],
  },
  {
    id: "7",
    question: "Is the venue wheelchair accessible?",
    answer:
      "Yes, our entire facility is fully wheelchair accessible with ramps, elevators, and accessible restrooms. We also offer special assistance for visitors with mobility needs.",
    category: "Accessibility",
    keywords: ["wheelchair", "accessible", "disability", "mobility", "assistance"],
  },
  {
    id: "8",
    question: "Can I change my booking date or time?",
    answer:
      "You can modify your booking up to 2 hours before your scheduled time, subject to availability. Use the chatbot or contact support to make changes. No additional fees apply for modifications.",
    category: "Booking",
    keywords: ["change", "modify", "reschedule", "date", "time"],
  },
]

interface FAQSystemProps {
  onQuestionSelect?: (question: string, answer: string) => void
}

export function FAQSystem({ onQuestionSelect }: FAQSystemProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const categories = ["All", ...Array.from(new Set(FAQS.map((faq) => faq.category)))]

  const filteredFAQs = FAQS.filter((faq) => {
    const matchesSearch =
      searchTerm === "" ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleFAQClick = (faq: FAQ) => {
    if (expandedFAQ === faq.id) {
      setExpandedFAQ(null)
    } else {
      setExpandedFAQ(faq.id)
      if (onQuestionSelect) {
        onQuestionSelect(faq.question, faq.answer)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <HelpCircle className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="text-xs"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-2">
        {filteredFAQs.length === 0 ? (
          <Card className="p-4 text-center text-muted-foreground">No FAQs found matching your search.</Card>
        ) : (
          filteredFAQs.map((faq) => (
            <Card key={faq.id} className="terminal-card">
              <button
                onClick={() => handleFAQClick(faq)}
                className="w-full p-4 text-left hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{faq.question}</h4>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded mt-2 inline-block">
                      {faq.category}
                    </span>
                  </div>
                  {expandedFAQ === faq.id ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {expandedFAQ === faq.id && (
                <div className="px-4 pb-4 border-t border-border mt-2 pt-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
