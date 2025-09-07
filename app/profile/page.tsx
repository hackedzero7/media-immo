"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Calendar, CreditCard, AlertTriangle, Settings, Shield } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  // Mock user data - replace with actual user data from your auth system
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    joinDate: "2024-01-15",
    subscription: {
      plan: "Independent",
      price: "€6.65/month",
      status: "Active",
      nextBilling: "2024-02-15",
      features: ["Advanced Analytics", "Priority Support", "Custom Integrations"],
    },
  })

  const handleSaveProfile = () => {
    setIsEditing(false)
    // Add your profile update logic here
  }

  const handleCancelSubscription = () => {
    // Add your subscription cancellation logic here
    setShowCancelDialog(false)
    setUserData((prev) => ({
      ...prev,
      subscription: { ...prev.subscription, status: "Cancelled" },
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent px-4 sm:px-0">
            Profile Settings
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4 sm:px-0">
            Manage your account information and subscription preferences
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 xl:grid-cols-2">
          {/* Profile Information */}
          <Card className="backdrop-blur-sm bg-card/50 border-2 border-primary/20 shadow-xl">
            <CardHeader className="space-y-1 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <User className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-sm">Update your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    className="bg-background/50 border-primary/30 h-10 sm:h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    className="bg-background/50 border-primary/30 h-10 sm:h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Member Since</Label>
                  <div className="flex items-center gap-2 p-3 bg-background/50 border border-primary/30 rounded-md min-h-[44px]">
                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">{new Date(userData.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full sm:flex-1 h-11">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSaveProfile} className="w-full sm:flex-1 h-11">
                      Save Changes
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" className="w-full sm:w-auto h-11">
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Subscription Management */}
          <Card className="backdrop-blur-sm bg-card/50 border-2 border-primary/20 shadow-xl">
            <CardHeader className="space-y-1 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CreditCard className="h-5 w-5 text-primary" />
                Subscription Details
              </CardTitle>
              <CardDescription className="text-sm">Manage your current subscription and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium">Current Plan</span>
                  <Badge
                    variant={userData.subscription.status === "Active" ? "default" : "destructive"}
                    className="bg-gradient-to-r from-primary to-secondary text-white flex-shrink-0"
                  >
                    {userData.subscription.plan}
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium">Price</span>
                  <span className="text-sm text-muted-foreground flex-shrink-0">{userData.subscription.price}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium">Status</span>
                  <Badge
                    variant={userData.subscription.status === "Active" ? "default" : "destructive"}
                    className="flex-shrink-0"
                  >
                    {userData.subscription.status}
                  </Badge>
                </div>

                {userData.subscription.status === "Active" && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium">Next Billing</span>
                    <span className="text-sm text-muted-foreground flex-shrink-0">
                      {new Date(userData.subscription.nextBilling).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Plan Features
                  </h4>
                  <ul className="space-y-1">
                    {userData.subscription.features.map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/#pricing" className="block">
                  <Button variant="outline" className="w-full bg-transparent h-11">
                    Upgrade Plan
                  </Button>
                </Link>

                {userData.subscription.status === "Active" && (
                  <Button variant="destructive" className="w-full h-11" onClick={() => setShowCancelDialog(true)}>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cancellation Confirmation Dialog */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full mx-4 backdrop-blur-sm bg-card/95 border-2 border-destructive/20">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-destructive text-lg">
                  <AlertTriangle className="h-5 w-5" />
                  Cancel Subscription
                </CardTitle>
                <CardDescription className="text-sm">
                  Are you sure you want to cancel your subscription? This action cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-sm text-destructive font-medium">
                    Your subscription will remain active until{" "}
                    {new Date(userData.subscription.nextBilling).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="destructive" onClick={handleCancelSubscription} className="w-full sm:flex-1 h-11">
                    Yes, Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelDialog(false)}
                    className="w-full sm:flex-1 h-11"
                  >
                    Keep Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/">
            <Button variant="outline" className="backdrop-blur-sm bg-transparent h-11 px-6">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
