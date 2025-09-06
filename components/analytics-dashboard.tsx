"use client"

import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, TrendingDown, Calendar, Clock, Users, DollarSign } from "lucide-react"

// Mock data for charts
const bookingData = [
  { name: "Mon", bookings: 45, revenue: 1125 },
  { name: "Tue", bookings: 52, revenue: 1300 },
  { name: "Wed", bookings: 38, revenue: 950 },
  { name: "Thu", bookings: 61, revenue: 1525 },
  { name: "Fri", bookings: 73, revenue: 1825 },
  { name: "Sat", bookings: 89, revenue: 2225 },
  { name: "Sun", bookings: 67, revenue: 1675 },
]

const experienceData = [
  { name: "Museum Tour", bookings: 156, percentage: 35, color: "#FFD700" },
  { name: "Art Exhibition", bookings: 134, percentage: 30, color: "#FF6B6B" },
  { name: "Science Show", bookings: 89, percentage: 20, color: "#4ECDC4" },
  { name: "History Walk", bookings: 67, percentage: 15, color: "#45B7D1" },
]

const timeSlotData = [
  { time: "9:00", bookings: 23 },
  { time: "10:00", bookings: 45 },
  { time: "11:00", bookings: 67 },
  { time: "12:00", bookings: 89 },
  { time: "13:00", bookings: 78 },
  { time: "14:00", bookings: 92 },
  { time: "15:00", bookings: 85 },
  { time: "16:00", bookings: 71 },
  { time: "17:00", bookings: 56 },
]

const monthlyTrends = [
  { month: "Jan", visitors: 1200, revenue: 30000 },
  { month: "Feb", visitors: 1350, revenue: 33750 },
  { month: "Mar", visitors: 1180, revenue: 29500 },
  { month: "Apr", visitors: 1420, revenue: 35500 },
  { month: "May", visitors: 1680, revenue: 42000 },
  { month: "Jun", visitors: 1890, revenue: 47250 },
]

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Time Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Overview</h2>
        <Select defaultValue="7days">
          <SelectTrigger className="w-[180px] terminal-input">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="terminal-card">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Bookings</p>
                <p className="text-2xl font-bold">425</p>
              </div>
              <div className="flex items-center space-x-1 text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+12%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="terminal-card">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Revenue</p>
                <p className="text-2xl font-bold">$10,625</p>
              </div>
              <div className="flex items-center space-x-1 text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+8%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="terminal-card">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Booking Value</p>
                <p className="text-2xl font-bold">$25</p>
              </div>
              <div className="flex items-center space-x-1 text-red-500">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm">-3%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="terminal-card">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Capacity Utilization</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
              <div className="flex items-center space-x-1 text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+5%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Bookings Chart */}
        <Card className="terminal-card">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Daily Bookings & Revenue
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Experience Popularity */}
        <Card className="terminal-card">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Experience Popularity
            </h3>
            <div className="space-y-4">
              {experienceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{item.bookings}</span>
                    <Badge variant="secondary">{item.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={experienceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="bookings">
                    {experienceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Time Slot Analysis */}
        <Card className="terminal-card">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Popular Time Slots
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSlotData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Trends */}
        <Card className="terminal-card">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary" />
              Monthly Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
