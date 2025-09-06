"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { ShowManagement } from "@/components/show-management"
import { BarChart3, Settings, Users, DollarSign, Calendar, Ticket, ArrowLeft, Shield, Activity } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("analytics")

  // Mock admin stats
  const stats = {
    totalBookings: 1247,
    totalRevenue: 31175,
    activeShows: 4,
    todayVisitors: 89,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Site</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-500/20 text-green-600 border-green-500/30">
                <Activity className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="terminal-card">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Ticket className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.totalBookings.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="terminal-card">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="terminal-card">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Shows</p>
                <p className="text-2xl font-bold">{stats.activeShows}</p>
              </div>
            </div>
          </Card>

          <Card className="terminal-card">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Visitors</p>
                <p className="text-2xl font-bold">{stats.todayVisitors}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="shows" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Shows</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="shows" className="space-y-6">
            <ShowManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="terminal-card">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-6">System Settings</h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="venue-name">Venue Name</Label>
                      <Input id="venue-name" defaultValue="TicketMaster Museum" className="terminal-input" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="venue-capacity">Default Capacity</Label>
                      <Input id="venue-capacity" type="number" defaultValue="25" className="terminal-input" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="operating-hours">Operating Hours</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Select defaultValue="09:00">
                        <SelectTrigger className="terminal-input">
                          <SelectValue placeholder="Opening time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="08:00">8:00 AM</SelectItem>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="18:00">
                        <SelectTrigger className="terminal-input">
                          <SelectValue placeholder="Closing time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="17:00">5:00 PM</SelectItem>
                          <SelectItem value="18:00">6:00 PM</SelectItem>
                          <SelectItem value="19:00">7:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="booking-window">Booking Window (days ahead)</Label>
                    <Input id="booking-window" type="number" defaultValue="30" className="terminal-input" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cancellation-policy">Cancellation Policy (hours before)</Label>
                    <Input id="cancellation-policy" type="number" defaultValue="24" className="terminal-input" />
                  </div>

                  <Button className="terminal-button">Save Settings</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
