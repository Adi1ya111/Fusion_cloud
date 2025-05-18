"use client"

import { useState } from "react"
import { Menu, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Sidebar } from "../../components/sidebar"

export default function SettingsPage() {
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
            <h1 className="text-xl font-bold text-blue-600">Settings</h1>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-4 h-auto">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Settings</CardTitle>
                  <CardDescription>Configure your dashboard preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="dashboard-name">Dashboard Name</Label>
                    <Input id="dashboard-name" defaultValue="Fusion Cloud Security Dashboard" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="refresh-rate">Data Refresh Rate</Label>
                    <Select defaultValue="5">
                      <SelectTrigger id="refresh-rate">
                        <SelectValue placeholder="Select refresh rate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Every 1 minute</SelectItem>
                        <SelectItem value="5">Every 5 minutes</SelectItem>
                        <SelectItem value="15">Every 15 minutes</SelectItem>
                        <SelectItem value="30">Every 30 minutes</SelectItem>
                        <SelectItem value="60">Every hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-gray-500">Enable dark mode for the dashboard</p>
                    </div>
                    <Switch id="dark-mode" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-refresh">Auto Refresh</Label>
                      <p className="text-sm text-gray-500">Automatically refresh dashboard data</p>
                    </div>
                    <Switch id="auto-refresh" defaultChecked />
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Preferences</CardTitle>
                  <CardDescription>Personalize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time (ET)</SelectItem>
                        <SelectItem value="cst">Central Time (CT)</SelectItem>
                        <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                        <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select defaultValue="mdy">
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how you receive alerts and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Critical Alerts</Label>
                        <p className="text-sm text-gray-500">Receive emails for critical security alerts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Warning Alerts</Label>
                        <p className="text-sm text-gray-500">Receive emails for warning level alerts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>System Updates</Label>
                        <p className="text-sm text-gray-500">Receive emails about system updates</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-addresses">Email Recipients</Label>
                      <Input id="email-addresses" placeholder="Enter email addresses (comma separated)" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">In-App Notifications</h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Dashboard Alerts</Label>
                        <p className="text-sm text-gray-500">Show notifications in the dashboard</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Sound Alerts</Label>
                        <p className="text-sm text-gray-500">Play sound for critical alerts</p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Configuration</CardTitle>
                  <CardDescription>Manage API connections and settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="api-url">API Endpoint URL</Label>
                    <Input id="api-url" defaultValue="http://localhost:5000/api" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex">
                      <Input id="api-key" type="password" value="••••••••••••••••••••••" className="rounded-r-none" />
                      <Button variant="outline" className="rounded-l-none border-l-0">
                        Regenerate
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Last regenerated: 2023-05-15 14:30:22</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-timeout">Request Timeout (seconds)</Label>
                    <Input id="api-timeout" type="number" defaultValue="30" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>API Access Logging</Label>
                      <p className="text-sm text-gray-500">Log all API requests and responses</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Webhook Configuration</CardTitle>
                  <CardDescription>Set up webhooks for external integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input id="webhook-url" placeholder="https://example.com/webhook" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-secret">Webhook Secret</Label>
                    <Input id="webhook-secret" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-events">Events to Send</Label>
                    <Textarea
                      id="webhook-events"
                      placeholder="Enter events to trigger webhooks (one per line)"
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Configure security options for your dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Authentication</h3>

                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input id="session-timeout" type="number" defaultValue="30" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Require 2FA for all users</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>IP Restriction</Label>
                        <p className="text-sm text-gray-500">Limit access to specific IP addresses</p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Data Protection</h3>

                    <div className="space-y-2">
                      <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                      <Input id="data-retention" type="number" defaultValue="90" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Data Encryption</Label>
                        <p className="text-sm text-gray-500">Encrypt sensitive data at rest</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Audit Logging</Label>
                        <p className="text-sm text-gray-500">Log all user actions for audit purposes</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
