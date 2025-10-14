"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Users, CreditCard, AlertTriangle, Filter, Download } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showCancelDialog, setShowCancelDialog] = useState<object | null>(null)
  const [loading, setLoading] = useState(false)

  // Mock users data - replace with actual data from your database
  const [users, setUsers] = useState([
    {
      _id: "",
      firstName: "",
      lastName: "",
      email: "",
      createdAt: "",
      subscription: {
        subscriptionId: "",
        status: "",
        currentPeriodEnd: "",
        priceId: "-",
        priceAmount: 0.0,
        priceCurrency: "-",
        interval: "",
        productId: "",
        productName: "",
      },
    },
  ])

  const getUsers = async () => {
    setLoading(true)
    const response = await fetch("/api/subscription") // plural
    const res = await response.json()
    setUsers(res.result)
    setLoading(false)
  }

  useEffect(() => {
    getUsers()
  }, [])

  const DashboardSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4 sm:p-6">
              <Skeleton className="h-10 w-10 mb-3 rounded-full" />
              <Skeleton className="h-6 w-20 mb-2" />
              <Skeleton className="h-4 w-16" />
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="p-4 sm:p-6">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Skeleton className="h-10 w-full sm:w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>

            {/* Table Skeleton */}
            <div className="rounded-lg border border-primary/20 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {[...Array(5)].map((_, i) => (
                      <TableHead key={i}>
                        <Skeleton className="h-4 w-20" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4].map((i) => (
                    <TableRow key={i}>
                      {[...Array(5)].map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const handleCancelSubscription = async (userData: any) => {
    const cancelSubscription = await fetch("/api/subscription", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscriptionId: userData?.subscription?.subscriptionId,
      }),
    })
    if (!cancelSubscription.ok) {
      toast.error("Failed to cancel subscription. Please try again later.")
      return
    }
    setUsers((prev) =>
      prev?.map((user) =>
        user._id === userData._id.toString()
          ? {
              ...user,
              subscription: { ...user.subscription, status: "cancelled" },
            }
          : user,
      ),
    )
    setShowCancelDialog(null)
  }

  const handleDownloadInvoice = async (userData: any) => {
    try {
      const subId = userData?.subscription?.subscriptionId
      if (!subId) {
        toast.error("No subscription found for this user.")
        return
      }
      const res = await fetch(`/api/invoices?subscriptionId=${encodeURIComponent(subId)}`)
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        toast.error(e?.error || "No invoice available for this subscription.")
        return
      }
      // Streamed as attachment; convert to blob and trigger download
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `invoice-${subId}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (e: any) {
      toast.error(e?.message || "Failed to download invoice.")
    }
  }

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterStatus === "all" || user?.subscription?.status?.toLowerCase() === filterStatus?.toLowerCase()

    return matchesSearch && matchesFilter
  })

  const stats = {
    totalUsers: users?.length,
    activeSubscriptions: users?.filter((u) => u?.subscription?.status === "active").length,
    cancelledSubscriptions: users?.filter((u) => u?.subscription?.status !== "active").length,
    totalRevenue: users
      ?.filter((u) => u?.subscription?.status === "active")
      .reduce((sum, u) => sum + Number.parseFloat(u?.subscription?.priceAmount), 0),
    // totalRevenue: 2000,
  }

  return loading ? (
    <>
      <DashboardSkeleton />
    </>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-black dark:text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-1">
              Manage user subscriptions and monitor platform activity
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="backdrop-blur-sm bg-transparent h-10 sm:h-11">
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Users */}
          <Card className="backdrop-blur-sm bg-primary/10 dark:bg-primary/20 border-2 border-primary/40">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-2xl sm:text-3xl font-bold text-primary">{stats.totalUsers}</p>
                  <p className="text-xs sm:text-sm text-foreground/70 dark:text-foreground/80 truncate">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Subscriptions */}
          <Card className="backdrop-blur-sm bg-green-500/10 dark:bg-green-500/20 border-2 border-green-500/40">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-green-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                    {stats.activeSubscriptions}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground/70 dark:text-foreground/80 truncate">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancelled Subscriptions */}
          <Card className="backdrop-blur-sm bg-red-500/10 dark:bg-red-500/20 border-2 border-red-500/40">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
                    {stats.cancelledSubscriptions}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground/70 dark:text-foreground/80 truncate">Cancelled</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Revenue */}
          <Card className="backdrop-blur-sm bg-blue-500/10 dark:bg-blue-500/20 border-2 border-blue-500/40">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <Download className="h-8 w-8 text-blue-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    €{stats.totalRevenue?.toFixed(2)}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground/70 dark:text-foreground/80 truncate">
                    Monthly Revenue
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="backdrop-blur-sm bg-card/50 border-2 border-primary/20">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">User Management</CardTitle>
            <CardDescription className="text-sm">Search and filter user subscriptions</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-primary/30 h-10 sm:h-11"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  size="sm"
                  className="h-10 sm:h-11 px-3 sm:px-4"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  All
                </Button>
                <Button
                  variant={filterStatus === "active" ? "default" : "outline"}
                  onClick={() => setFilterStatus("active")}
                  size="sm"
                  className="h-10 sm:h-11 px-3 sm:px-4"
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === "cancelled" ? "default" : "outline"}
                  onClick={() => setFilterStatus("cancelled")}
                  size="sm"
                  className="h-10 sm:h-11 px-3 sm:px-4"
                >
                  Cancelled
                </Button>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-lg border border-primary/20 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead className="font-semibold text-foreground p-3 sm:p-4">User</TableHead>
                      <TableHead className="font-semibold text-foreground p-3 sm:p-4">productName</TableHead>
                      <TableHead className="font-semibold text-foreground p-3 sm:p-4">Status</TableHead>
                      <TableHead className="font-semibold text-foreground p-3 sm:p-4 hidden sm:table-cell">
                        Next Billing
                      </TableHead>
                      <TableHead className="font-semibold text-foreground p-3 sm:p-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers?.map((user) => (
                      <TableRow key={user?._id} className="hover:bg-primary/5">
                        <TableCell className="p-3 sm:p-4">
                          <div className="space-y-1">
                            <p className="font-medium text-sm sm:text-base">
                              {user?.firstName}
                              {""} {user?.lastName}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">{user?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="p-3 sm:p-4">
                          <div className="space-y-1">
                            <p className="font-medium text-sm sm:text-base">{user?.subscription?.productName}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {Number.parseFloat(user?.subscription?.priceAmount).toFixed(2)}/
                              {user?.subscription?.interval}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="p-3 sm:p-4">
                          <Badge
                            variant={user?.subscription?.status === "active" ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {user?.subscription?.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-3 sm:p-4 hidden sm:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {new Date(user?.subscription?.currentPeriodEnd).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell className="p-3 sm:p-4">
                          {user?.subscription?.status === "active" && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadInvoice(user)}
                                className="h-8 px-3 text-xs"
                              >
                                Download Invoice
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setShowCancelDialog(user)}
                                className="h-8 px-3 text-xs"
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {filteredUsers?.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No users found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cancellation Confirmation Dialog */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full mx-4 backdrop-blur-sm bg-card/95 border-2 border-destructive/20">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-destructive text-lg">
                  <AlertTriangle className="h-5 w-5" />
                  Cancel User Subscription
                </CardTitle>
                <CardDescription className="text-sm">
                  Are you sure you want to cancel this user's subscription? This action cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-sm text-destructive font-medium">
                    The user's subscription will be cancelled immediately and they will lose access to premium features.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="destructive"
                    onClick={() => handleCancelSubscription(showCancelDialog)}
                    className="w-full sm:flex-1 h-11"
                  >
                    Yes, Cancel Subscription
                  </Button>
                  <Button variant="outline" onClick={() => setShowCancelDialog(null)} className="w-full sm:flex-1 h-11">
                    Keep Active
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
