"use client"

import { useState } from "react"
import { Menu, Search, Filter, Download, RefreshCcw, AlertCircle, Info, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "../../components/sidebar"
import { cn } from "@/lib/utils"

// Mock log data
const mockLogs = [
  {
    id: "log-001",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    level: "error",
    source: "firewall",
    message: "Multiple failed login attempts detected from IP 192.168.1.105",
    details: "5 failed attempts within 2 minutes, account temporarily locked",
  },
  {
    id: "log-002",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    level: "warning",
    source: "ids",
    message: "Unusual outbound traffic pattern detected",
    details: "High volume of data transfer to external IP 203.0.113.42",
  },
  {
    id: "log-003",
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    level: "info",
    source: "system",
    message: "System update completed successfully",
    details: "Security patches applied: CVE-2023-1234, CVE-2023-5678",
  },
  {
    id: "log-004",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    level: "error",
    source: "application",
    message: "API rate limit exceeded",
    details: "Service temporarily unavailable due to excessive requests",
  },
  {
    id: "log-005",
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    level: "info",
    source: "auth",
    message: "New user account created",
    details: "Username: jsmith, Role: analyst",
  },
  {
    id: "log-006",
    timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
    level: "warning",
    source: "network",
    message: "Unusual port scanning activity detected",
    details: "Multiple ports scanned from IP 10.0.0.23",
  },
  {
    id: "log-007",
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    level: "info",
    source: "system",
    message: "Scheduled backup completed",
    details: "All critical systems backed up successfully",
  },
  {
    id: "log-008",
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    level: "error",
    source: "database",
    message: "Database connection failure",
    details: "Connection timeout after 30 seconds, automatic retry initiated",
  },
]

export default function LogsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLog, setSelectedLog] = useState<string | null>(null)

  // Filter logs based on search query
  const filteredLogs = mockLogs.filter(
    (log) =>
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()),
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
            <h1 className="text-xl font-bold text-blue-600">Security Logs</h1>
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
                placeholder="Search logs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Log level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="firewall">Firewall</SelectItem>
                  <SelectItem value="ids">IDS</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="application">Application</SelectItem>
                  <SelectItem value="network">Network</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium text-gray-500">Log Entries</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200">
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
                        <button
                          key={log.id}
                          className={cn(
                            "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors",
                            selectedLog === log.id && "bg-blue-50",
                          )}
                          onClick={() => setSelectedLog(log.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <LogLevelIcon level={log.level} />
                              <div>
                                <p className="font-medium text-gray-900">{log.message}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Source: {log.source} • {new Date(log.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <Badge
                              className={cn(
                                "ml-2",
                                log.level === "error"
                                  ? "bg-red-100 text-red-600"
                                  : log.level === "warning"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-green-100 text-green-600",
                              )}
                            >
                              {log.level}
                            </Badge>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-gray-500">No logs found matching your search criteria</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium text-gray-500">Log Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedLog ? (
                    <div>
                      {(() => {
                        const log = mockLogs.find((l) => l.id === selectedLog)
                        if (!log) return null

                        return (
                          <>
                            <div className="mb-4">
                              <h3 className="text-lg font-medium">{log.message}</h3>
                              <p className="text-sm text-gray-500 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Level</h4>
                                <Badge
                                  className={cn(
                                    log.level === "error"
                                      ? "bg-red-100 text-red-600"
                                      : log.level === "warning"
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "bg-green-100 text-green-600",
                                  )}
                                >
                                  {log.level}
                                </Badge>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Source</h4>
                                <p>{log.source}</p>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Details</h4>
                                <p className="text-sm">{log.details}</p>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Actions</h4>
                                <div className="flex gap-2 mt-2">
                                  <Button size="sm" variant="outline" className="text-xs">
                                    Mark as Reviewed
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-xs">
                                    Create Alert
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
                      <p className="text-gray-500">Select a log entry to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function LogLevelIcon({ level }: { level: string }) {
  switch (level) {
    case "error":
      return <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
    case "warning":
      return <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
    case "info":
      return <Info className="h-5 w-5 text-blue-500 mt-0.5" />
    default:
      return <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
  }
}
