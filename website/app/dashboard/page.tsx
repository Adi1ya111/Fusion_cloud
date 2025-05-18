"use client"

import { useEffect, useState } from "react"
import { RefreshCcw, BarChart3, Menu, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Sidebar } from "../components/sidebar"

interface Alert {
  id: string
  sourceIp: string
  eventName: string
  timestamp: string
  anomaly: boolean
  confidenceScore: number
}

export default function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const fetchAlerts = async () => {
    setLoading(true)
    try {
      // Try to fetch from the API
      const response = await fetch("http://localhost:5000/api/alerts", {
        // Adding a timeout to prevent long waiting times
        signal: AbortSignal.timeout(5000),
      })
      const data = await response.json()
      setAlerts(data)
    } catch (error) {
      console.error("Error fetching alerts:", error)

      // Use mock data as fallback
      const mockAlerts: Alert[] = [
        {
          id: "1",
          sourceIp: "192.168.1.105",
          eventName: "Suspicious Login Attempt",
          timestamp: new Date().toISOString(),
          anomaly: true,
          confidenceScore: 0.89,
        },
        {
          id: "2",
          sourceIp: "10.0.0.23",
          eventName: "Port Scan Detected",
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
          anomaly: true,
          confidenceScore: 0.76,
        },
        {
          id: "3",
          sourceIp: "172.16.254.1",
          eventName: "Firewall Rule Update",
          timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
          anomaly: false,
          confidenceScore: 0.12,
        },
        {
          id: "4",
          sourceIp: "192.168.0.5",
          eventName: "System Update",
          timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
          anomaly: false,
          confidenceScore: 0.05,
        },
        {
          id: "5",
          sourceIp: "10.10.10.123",
          eventName: "Data Exfiltration Attempt",
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          anomaly: true,
          confidenceScore: 0.95,
        },
        {
          id: "6",
          sourceIp: "192.168.1.200",
          eventName: "Authentication Failure",
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          anomaly: true,
          confidenceScore: 0.82,
        },
      ]

      setAlerts(mockAlerts)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

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
            <h1 className="text-xl font-bold text-blue-600">Fusion Cloud Threat Detection Dashboard</h1>
          </div>
          <Button onClick={fetchAlerts} variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {alerts.length > 0 && (
            <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700">
              <p className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Using mock data. Connection to API server at localhost:5000 failed.
              </p>
            </div>
          )}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-white border-gray-200">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-2/3 bg-gray-100" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full bg-gray-100" />
                    <Skeleton className="h-4 w-3/4 bg-gray-100" />
                    <Skeleton className="h-4 w-1/2 bg-gray-100" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {alerts.map((alert) => (
                <Card
                  key={alert.id}
                  className="bg-white border-gray-200 transition-all duration-200 hover:shadow-lg hover:shadow-blue-100/50 hover:border-blue-300"
                >
                  <CardHeader className="pb-2 flex flex-row items-start justify-between">
                    <CardTitle className="text-blue-600">{alert.eventName}</CardTitle>
                    <Badge
                      variant={alert.anomaly ? "destructive" : "default"}
                      className={cn(
                        "px-2 py-1",
                        alert.anomaly
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-green-100 text-green-600 hover:bg-green-200",
                      )}
                    >
                      {alert.anomaly ? "Anomaly 🚨" : "Normal ✅"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Source IP:</span>
                      <span className="font-mono text-gray-800">{alert.sourceIp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Timestamp:</span>
                      <span className="text-gray-800">{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Confidence:</span>
                      <span
                        className={cn(
                          "font-medium",
                          alert.confidenceScore > 0.7
                            ? "text-red-500"
                            : alert.confidenceScore > 0.4
                              ? "text-yellow-500"
                              : "text-green-500",
                        )}
                      >
                        {alert.confidenceScore.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Placeholder for future chart view */}
          <div className="mt-8 p-6 border border-dashed border-gray-300 rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-blue-600">Threat Analytics</h2>
              <Badge variant="outline" className="border-blue-300 text-blue-600">
                Coming Soon
              </Badge>
            </div>
            <div className="h-64 flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-gray-200" />
              <p className="ml-4 text-gray-500">Chart visualization will be available in a future update</p>
            </div>
          </div>

          {/* Placeholder for filters */}
          <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-white">
            <div className="flex items-center text-gray-500">
              <p>Filter controls will be added in a future update</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
