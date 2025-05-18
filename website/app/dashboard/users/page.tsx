"use client"

import { useState } from "react"
import { Menu, Search, MoreHorizontal, UserPlus, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sidebar } from "../../components/sidebar"

// Mock user data
const mockUsers = [
  {
    id: "user-001",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Administrator",
    status: "active",
    lastActive: new Date(Date.now() - 30 * 60000).toISOString(),
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-002",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "Security Analyst",
    status: "active",
    lastActive: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-003",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Security Analyst",
    status: "inactive",
    lastActive: new Date(Date.now() - 7 * 24 * 60 * 60000).toISOString(),
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Read Only",
    status: "active",
    lastActive: new Date(Date.now() - 45 * 60000).toISOString(),
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-005",
    name: "David Wilson",
    email: "david.wilson@example.com",
    role: "Administrator",
    status: "active",
    lastActive: new Date(Date.now() - 15 * 60000).toISOString(),
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-006",
    name: "Jessica Martinez",
    email: "jessica.martinez@example.com",
    role: "Security Analyst",
    status: "pending",
    lastActive: null,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function UsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
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
            <h1 className="text-xl font-bold text-blue-600">User Management</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </header>

        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-4 h-auto">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium text-gray-500">Users ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <th className="px-4 py-3">User</th>
                          <th className="px-4 py-3">Role</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Last Active</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-3">
                                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                    <AvatarFallback>
                                      {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <Badge
                                  variant="outline"
                                  className={
                                    user.role === "Administrator"
                                      ? "border-blue-300 text-blue-600"
                                      : "border-gray-300 text-gray-600"
                                  }
                                >
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <Badge
                                  className={
                                    user.status === "active"
                                      ? "bg-green-100 text-green-600"
                                      : user.status === "inactive"
                                        ? "bg-gray-100 text-gray-600"
                                        : "bg-yellow-100 text-yellow-600"
                                  }
                                >
                                  {user.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {user.lastActive ? new Date(user.lastActive).toLocaleString() : "Never logged in"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>Edit User</DropdownMenuItem>
                                    <DropdownMenuItem>Reset Password</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">Deactivate User</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                              No users found matching your search criteria
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="active" className="mt-6">
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium text-gray-500">Active Users</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-500">
                    Showing active users tab content. This would display only active users.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inactive" className="mt-6">
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium text-gray-500">Inactive Users</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-500">
                    Showing inactive users tab content. This would display only inactive users.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium text-gray-500">Pending Users</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-500">
                    Showing pending users tab content. This would display users who have not yet activated their
                    accounts.
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
