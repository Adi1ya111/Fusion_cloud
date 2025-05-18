"use client"

import { useState } from "react"
import { Menu, Search, Filter, RefreshCcw, AlertCircle, Download, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "../../components/sidebar"
import { cn } from "@/lib/utils"

// Mock alert data
const mockAlerts = [
  {
    id: "alert-001",
    title: "Suspicious Login Attempt",
    severity: "critical",
    source: "Authentication Service",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    status: "open",
    description: "Multiple failed login attempts detected from IP 192.168.1.105",
    details: "5 failed attempts within 2 minutes, account temporarily locked",
  },
  {
    id: "alert-002",
    title: "Unusual Data Transfer",
    severity: "high",
    source: "Data Loss Prevention",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    status: "investigating",
    description: "Large data transfer detected to external domain",
    details: "User jsmith transferred 250MB to external storage service",
  },
  {
    id: "alert-003",
    title: "Firewall Rule Violation",
    severity: "medium",
    source: "Network Security",
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    status: "open",
    description: "Outbound connection to blocked IP address",
    details: "Connection attempt to known malicious IP 203.0.113.42",
  },
  {
    id: "alert-004",
    title: "System Update Available",
    severity: "low",
    source: "System Management",
    timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    status: "resolved",
    description: "Security patches available for application server",
    details: "Critical security updates available for Apache server",
  },
  {
    id: "alert-005",
    title: "Malware Detected",
    severity: "critical",
    source: "Endpoint Protection",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    status: "open",
    description: "Malware detected on workstation WS-42",
    details: "Trojan.Emotet variant detected in email attachment",
  },
  {
    id: "alert-006",
    title: "API Rate Limit Exceeded",
    severity: "medium",
    source: "API Gateway",
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    status: "resolved",
    description: "API rate limit exceeded for authentication service",
    details: "Rate limit of 100 requests per minute exceeded from IP 10.0.0.23",
  },
  {
    id: "alert-007",
    title: "Unauthorized Access Attempt",
    severity: "high",
    source: "Access Control",
    timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
    status: "investigating",
    description: "Unauthorized access attempt to restricted resource",
    details: "User attempted to access financial database without proper permissions",
  },
  {
    id: "alert-008",
    title: "SSL Certificate Expiring",
    severity: "low",
    source: "Certificate Management",
    timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    status: "open",
    description: "SSL certificate expiring in 7 days",
    details: "Certificate for api.example.com expires on 2023-06-01",
  },
]

export default function AlertsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null)

  // Filter alerts based on search query
  const filteredAlerts = mockAlerts.filter(
    (alert) =>
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
            <h1 className="text-xl font-bold text-blue-600">Security Alerts</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </header>

        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search alerts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-4 h-auto">
              <TabsTrigger value="all">All Alerts</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        Alerts ({filteredAlerts.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-gray-200">
                        {filteredAlerts.length > 0 ? (
                          filteredAlerts.map((alert) => (
                            <button
                              key={alert.id}
                              className={cn(
                                "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors",
                                selectedAlert === alert.id && "bg-blue-50",
                              )}
                              onClick={() => setSelectedAlert(alert.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                  <AlertSeverityIcon severity={alert.severity} />
                                  <div>
                                    <p className="font-medium text-gray-900">{alert.title}</p>
                                    <p className="text-sm text-gray-500 mt-1">{alert.description}</p>
                                    <div className="flex items-center mt-2 text-xs text-gray-500">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {new Date(alert.timestamp).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                  <Badge
                                    className={cn(
                                      "ml-2",
                                      alert.severity === "critical"
                                        ? "bg-red-100 text-red-600"
                                        : alert.severity === "high"
                                          ? "bg-orange-100 text-orange-600"
                                          : alert.severity === "medium"
                                            ? "bg-yellow-100 text-yellow-600"
                                            : "bg-blue-100 text-blue-600",
                                    )}
                                  >
                                    {alert.severity}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "ml-2",
                                      alert.status === "open"
                                        ? "border-blue-300 text-blue-600"
                                        : alert.status === "investigating"
                                          ? "border-purple-300 text-purple-600"
                                          : "border-green-300 text-green-600",
                                    )}
                                  >
                                    {alert.status}
                                  </Badge>
                                </div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="py-8 text-center">
                            <p className="text-gray-500">No alerts found matching your search criteria</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-sm font-medium text-gray-500">Alert Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedAlert ? (
                        <div>
                          {(() => {
                            const alert = mockAlerts.find((a) => a.id === selectedAlert)
                            if (!alert) return null

                            return (
                              <>
                                <div className="mb-4">
                                  <h3 className="text-lg font-medium">{alert.title}</h3>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {new Date(alert.timestamp).toLocaleString()}
                                  </p>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Severity</h4>
                                    <Badge
                                      className={cn(
                                        alert.severity === "critical"
                                          ? "bg-red-100 text-red-600"
                                          : alert.severity === "high"
                                            ? "bg-orange-100 text-orange-600"
                                            : alert.severity === "medium"
                                              ? "bg-yellow-100 text-yellow-600"
                                              : "bg-blue-100 text-blue-600",
                                      )}
                                    >
                                      {alert.severity}
                                    </Badge>
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        alert.status === "open"
                                          ? "border-blue-300 text-blue-600"
                                          : alert.status === "investigating"
                                            ? "border-purple-300 text-purple-600"
                                            : "border-green-300 text-green-600",
                                      )}
                                    >
                                      {alert.status}
                                    </Badge>
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Source</h4>
                                    <p>{alert.source}</p>
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                                    <p className="text-sm">{alert.description}</p>
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Details</h4>
                                    <p className="text-sm">{alert.details}</p>
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Actions</h4>
                                    <div className="flex gap-2 mt-2">
                                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                                        Investigate
                                      </Button>
                                      <Button size="sm" variant="outline" className="text-xs">
                                        Mark as Resolved
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )
                          })()}
                        </div>
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-gray-500">Select an alert to view details</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="critical" className="mt-6">
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium text-gray-500">Critical Alerts</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-500">
                    Showing critical alerts tab content. This would display only critical severity alerts.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="open" className="mt-6">
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium text-gray-500">Open Alerts</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-500">
                    Showing open alerts tab content. This would display only alerts with open status.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resolved" className="mt-6">
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium text-gray-500">Resolved Alerts</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-500">
                    Showing resolved alerts tab content. This would display only alerts that have been resolved.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

function AlertSeverityIcon({ severity }: { severity: string }) {
  switch (severity) {
    case "critical":
      return <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
    case "high":
      return <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
    case "medium":
      return <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
    default:
      return <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
  }
}
