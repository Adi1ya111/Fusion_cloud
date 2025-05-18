"use client"

import { useState } from "react"
import { Menu, BarChart3, PieChart, LineChart, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "../../components/sidebar"

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-blue-600"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-blue-600">Security Analytics</h1>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="30d">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Alerts"
              value="1,284"
              change="+12.5%"
              trend="up"
              description="vs. previous 30 days"
            />
            <MetricCard
              title="Critical Threats"
              value="37"
              change="-8.3%"
              trend="down"
              description="vs. previous 30 days"
            />
            <MetricCard
              title="Avg. Response Time"
              value="4.2m"
              change="+1.5%"
              trend="up"
              description="vs. previous 30 days"
            />
            <MetricCard
              title="Security Score"
              value="86/100"
              change="+3.2%"
              trend="up"
              description="vs. previous 30 days"
            />
          </div>

          <Tabs defaultValue="threats" className="mt-6">
            <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto">
              <TabsTrigger value="threats">Threat Analysis</TabsTrigger>
              <TabsTrigger value="sources">Attack Sources</TabsTrigger>
              <TabsTrigger value="trends">Security Trends</TabsTrigger>
            </TabsList>
            <TabsContent value="threats" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Threat Distribution</CardTitle>
                    <CardDescription>Breakdown of threat types detected</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <PieChart className="w-16 h-16 text-gray-300" />
                      <p className="absolute text-sm text-gray-500">Chart visualization will be implemented here</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Top Attack Vectors</CardTitle>
                    <CardDescription>Most common attack methods</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <BarChart3 className="w-16 h-16 text-gray-300" />
                      <p className="absolute text-sm text-gray-500">Chart visualization will be implemented here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="sources" className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Geographic Attack Origins</CardTitle>
                  <CardDescription>Source locations of security threats</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-full h-64 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                        <p className="text-gray-500">World map visualization will be implemented here</p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-white p-3 rounded-md border border-gray-200">
                          <div className="font-medium">United States</div>
                          <div className="text-gray-500">42.3%</div>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-gray-200">
                          <div className="font-medium">Russia</div>
                          <div className="text-gray-500">18.7%</div>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-gray-200">
                          <div className="font-medium">China</div>
                          <div className="text-gray-500">15.2%</div>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-gray-200">
                          <div className="font-medium">Other</div>
                          <div className="text-gray-500">23.8%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="trends" className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Security Incidents Over Time</CardTitle>
                  <CardDescription>30-day trend analysis</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <LineChart className="w-16 h-16 text-gray-300" />
                    <p className="absolute text-sm text-gray-500">Chart visualization will be implemented here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  description: string
}

function MetricCard({ title, value, change, trend, description }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          <span
            className={`text-sm font-medium flex items-center ${trend === "up" ? "text-red-500" : "text-green-500"}`}
          >
            {trend === "up" ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
            {change}
          </span>
          <span className="text-xs text-gray-500 ml-2">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}
