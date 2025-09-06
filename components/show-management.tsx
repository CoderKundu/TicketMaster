"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Clock, Users, DollarSign, Calendar, Save, X } from "lucide-react"

interface Show {
  id: string
  name: string
  description: string
  duration: string
  capacity: number
  price: number
  icon: string
  status: "active" | "inactive"
  category: string
}

interface TimeSlot {
  id: string
  showId: string
  time: string
  date: string
  available: number
  booked: number
  status: "available" | "full" | "cancelled"
}

const mockShows: Show[] = [
  {
    id: "1",
    name: "Museum Tour",
    description: "Comprehensive tour of all major exhibits with expert guide",
    duration: "90 min",
    capacity: 25,
    price: 25,
    icon: "🏛️",
    status: "active",
    category: "tour",
  },
  {
    id: "2",
    name: "Art Exhibition",
    description: "Modern Masterpieces - Contemporary art collection showcase",
    duration: "60 min",
    capacity: 20,
    price: 30,
    icon: "🎨",
    status: "active",
    category: "exhibition",
  },
  {
    id: "3",
    name: "Science Show",
    description: "Interactive demonstrations and hands-on experiments",
    duration: "45 min",
    capacity: 30,
    price: 20,
    icon: "🔬",
    status: "active",
    category: "interactive",
  },
  {
    id: "4",
    name: "History Walk",
    description: "Journey through time with historical artifacts and stories",
    duration: "75 min",
    capacity: 15,
    price: 25,
    icon: "📜",
    status: "inactive",
    category: "tour",
  },
]

const mockTimeSlots: TimeSlot[] = [
  { id: "1", showId: "1", time: "09:00", date: "2024-01-15", available: 20, booked: 5, status: "available" },
  { id: "2", showId: "1", time: "11:00", date: "2024-01-15", available: 15, booked: 10, status: "available" },
  { id: "3", showId: "1", time: "14:00", date: "2024-01-15", available: 0, booked: 25, status: "full" },
  { id: "4", showId: "2", time: "10:00", date: "2024-01-15", available: 18, booked: 2, status: "available" },
  { id: "5", showId: "2", time: "15:00", date: "2024-01-15", available: 12, booked: 8, status: "available" },
]

export function ShowManagement() {
  const [shows, setShows] = useState<Show[]>(mockShows)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(mockTimeSlots)
  const [editingShow, setEditingShow] = useState<Show | null>(null)
  const [isAddingShow, setIsAddingShow] = useState(false)
  const [activeTab, setActiveTab] = useState<"shows" | "slots">("shows")

  const [newShow, setNewShow] = useState<Partial<Show>>({
    name: "",
    description: "",
    duration: "",
    capacity: 25,
    price: 25,
    icon: "🎭",
    status: "active",
    category: "tour",
  })

  const handleSaveShow = () => {
    if (editingShow) {
      setShows(shows.map((show) => (show.id === editingShow.id ? editingShow : show)))
      setEditingShow(null)
    } else if (isAddingShow) {
      const show: Show = {
        ...(newShow as Show),
        id: Date.now().toString(),
      }
      setShows([...shows, show])
      setNewShow({
        name: "",
        description: "",
        duration: "",
        capacity: 25,
        price: 25,
        icon: "🎭",
        status: "active",
        category: "tour",
      })
      setIsAddingShow(false)
    }
  }

  const handleDeleteShow = (id: string) => {
    setShows(shows.filter((show) => show.id !== id))
    setTimeSlots(timeSlots.filter((slot) => slot.showId !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-600 border-green-500/30"
      case "inactive":
        return "bg-gray-500/20 text-gray-600 border-gray-500/30"
      case "available":
        return "bg-blue-500/20 text-blue-600 border-blue-500/30"
      case "full":
        return "bg-red-500/20 text-red-600 border-red-500/30"
      case "cancelled":
        return "bg-orange-500/20 text-orange-600 border-orange-500/30"
      default:
        return "bg-gray-500/20 text-gray-600 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Show Management</h2>
        <div className="flex items-center space-x-4">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={activeTab === "shows" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("shows")}
              className={activeTab === "shows" ? "terminal-button" : ""}
            >
              Shows
            </Button>
            <Button
              variant={activeTab === "slots" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("slots")}
              className={activeTab === "slots" ? "terminal-button" : ""}
            >
              Time Slots
            </Button>
          </div>
          {activeTab === "shows" && (
            <Button onClick={() => setIsAddingShow(true)} className="terminal-button">
              <Plus className="h-4 w-4 mr-2" />
              Add Show
            </Button>
          )}
        </div>
      </div>

      {activeTab === "shows" && (
        <div className="space-y-6">
          {/* Add/Edit Show Form */}
          {(isAddingShow || editingShow) && (
            <Card className="terminal-card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">{editingShow ? "Edit Show" : "Add New Show"}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsAddingShow(false)
                      setEditingShow(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="show-name">Show Name</Label>
                      <Input
                        id="show-name"
                        value={editingShow?.name || newShow.name}
                        onChange={(e) => {
                          if (editingShow) {
                            setEditingShow({ ...editingShow, name: e.target.value })
                          } else {
                            setNewShow({ ...newShow, name: e.target.value })
                          }
                        }}
                        className="terminal-input"
                        placeholder="Enter show name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="show-description">Description</Label>
                      <Textarea
                        id="show-description"
                        value={editingShow?.description || newShow.description}
                        onChange={(e) => {
                          if (editingShow) {
                            setEditingShow({ ...editingShow, description: e.target.value })
                          } else {
                            setNewShow({ ...newShow, description: e.target.value })
                          }
                        }}
                        className="terminal-input"
                        placeholder="Enter show description"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="show-duration">Duration</Label>
                      <Input
                        id="show-duration"
                        value={editingShow?.duration || newShow.duration}
                        onChange={(e) => {
                          if (editingShow) {
                            setEditingShow({ ...editingShow, duration: e.target.value })
                          } else {
                            setNewShow({ ...newShow, duration: e.target.value })
                          }
                        }}
                        className="terminal-input"
                        placeholder="e.g., 90 min"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="show-capacity">Capacity</Label>
                      <Input
                        id="show-capacity"
                        type="number"
                        value={editingShow?.capacity || newShow.capacity}
                        onChange={(e) => {
                          if (editingShow) {
                            setEditingShow({ ...editingShow, capacity: Number.parseInt(e.target.value) })
                          } else {
                            setNewShow({ ...newShow, capacity: Number.parseInt(e.target.value) })
                          }
                        }}
                        className="terminal-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="show-price">Price ($)</Label>
                      <Input
                        id="show-price"
                        type="number"
                        value={editingShow?.price || newShow.price}
                        onChange={(e) => {
                          if (editingShow) {
                            setEditingShow({ ...editingShow, price: Number.parseInt(e.target.value) })
                          } else {
                            setNewShow({ ...newShow, price: Number.parseInt(e.target.value) })
                          }
                        }}
                        className="terminal-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="show-category">Category</Label>
                      <Select
                        value={editingShow?.category || newShow.category}
                        onValueChange={(value) => {
                          if (editingShow) {
                            setEditingShow({ ...editingShow, category: value })
                          } else {
                            setNewShow({ ...newShow, category: value })
                          }
                        }}
                      >
                        <SelectTrigger className="terminal-input">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tour">Tour</SelectItem>
                          <SelectItem value="exhibition">Exhibition</SelectItem>
                          <SelectItem value="interactive">Interactive</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="show-status">Status</Label>
                      <Select
                        value={editingShow?.status || newShow.status}
                        onValueChange={(value: "active" | "inactive") => {
                          if (editingShow) {
                            setEditingShow({ ...editingShow, status: value })
                          } else {
                            setNewShow({ ...newShow, status: value })
                          }
                        }}
                      >
                        <SelectTrigger className="terminal-input">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingShow(false)
                      setEditingShow(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveShow} className="terminal-button">
                    <Save className="h-4 w-4 mr-2" />
                    Save Show
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Shows List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shows.map((show) => (
              <Card key={show.id} className="terminal-card hover:terminal-glow transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{show.icon}</div>
                      <div>
                        <h4 className="font-semibold">{show.name}</h4>
                        <Badge className={getStatusColor(show.status)}>{show.status}</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingShow(show)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteShow(show.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{show.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Duration
                      </span>
                      <span>{show.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        Capacity
                      </span>
                      <span>{show.capacity}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Price
                      </span>
                      <span>${show.price}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "slots" && (
        <div className="space-y-6">
          <Card className="terminal-card">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Time Slot Management</h3>

              <div className="space-y-4">
                {timeSlots.map((slot) => {
                  const show = shows.find((s) => s.id === slot.showId)
                  return (
                    <div key={slot.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-xl">{show?.icon}</div>
                        <div>
                          <h5 className="font-medium">{show?.name}</h5>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {slot.date}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {slot.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {slot.booked}/{slot.booked + slot.available} booked
                          </div>
                          <div className="text-xs text-muted-foreground">{slot.available} available</div>
                        </div>
                        <Badge className={getStatusColor(slot.status)}>{slot.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
