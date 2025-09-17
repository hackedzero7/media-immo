"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Calendar,
  CreditCard,
  AlertTriangle,
  Settings,
  Shield,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { plans } from "@/utils/plans";
import { set } from "mongoose";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "user" as "user" | "admin",
    joinDate: "",
    subscription: {
      plan: "",
      price: "",
      status: "",
      nextBilling: "",
      features: [],
    },
  });

  const getSubscription = async (session: any) => {
    setLoading(true);
    if (session.user.email) {
      const subscription = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      });
      const subData = await subscription.json();

      const isAnnual =
        subData?.subscriptions?.interval === "month" ? false : true;
      const plansData = plans(isAnnual);
      const currentPlan = plansData.find((plan) =>
        isAnnual
          ? subData?.subscriptions?.priceId === plan.yearlyStripePriceId
          : subData?.subscriptions?.priceId === plan.monthlyStripePriceId
      );
      setLoading(false);
      return {
        currentPlan: currentPlan,
        isAnnual: isAnnual,
        stripeData: subData?.subscriptions,
      };
    }
  };
  console.log("Subscription Data:", subscriptionData);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user) {
      (async () => {
        setLoading(true);
        fetchUserProfile();
        setLoading(false);
      })();
    }
  }, [session, status, router]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/profile");

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const subData: any = await getSubscription(session);
      setSubscriptionData(subData);
      const data = await response.json();
      const user = data.user;

      setUserData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role: user.role || "user",
        joinDate: user.createdAt || new Date().toISOString(),
        subscription: {
          plan: subData?.currentPlan?.name,
          price: subData?.isAnnual
            ? `${subData?.currentPlan?.annual}/year`
            : `${subData?.currentPlan?.monthly}/month`,
          status: subData?.stripeData?.status,
          nextBilling: subData?.stripeData?.currentPeriodEnd,
          features: subData?.currentPlan?.features || [],
        },
      });
    } catch (error) {
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const data = await response.json();
      toast.success("Profile updated successfully!");
      setIsEditing(false);

      // Update session data if needed
      if (session?.user) {
        session.user.name = `${userData.firstName} ${userData.lastName}`;
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    // Add your subscription cancellation logic here
    setShowCancelDialog(false);

    const cancelSubscription = await fetch("/api/subscription", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscriptionId: subscriptionData?.stripeData?.subscriptionId,
      }),
    });
    if (!cancelSubscription.ok) {
      toast.error("Failed to cancel subscription. Please try again later.");
      return;
    }
    setUserData((prev) => ({
      ...prev,
      subscription: { ...prev.subscription, status: "cancelled" },
    }));

    toast.success("Subscription cancelled successfully");
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  return loading ? (
    <>Loading</>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-black dark:text-transparent px-4 sm:px-0">
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
              <CardDescription className="text-sm">
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={userData.firstName}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className="bg-background/50 border-primary/30 h-10 sm:h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={userData.lastName}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
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
                    disabled={true}
                    className="bg-background/30 border-primary/20 h-10 sm:h-11 opacity-60"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Role</Label>
                  <div className="flex items-center gap-2 p-3 bg-background/50 border border-primary/30 rounded-md min-h-[44px]">
                    <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <Badge
                      variant={
                        userData.role === "admin" ? "default" : "secondary"
                      }
                    >
                      {userData.role.charAt(0).toUpperCase() +
                        userData.role.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Member Since</Label>
                  <div className="flex items-center gap-2 p-3 bg-background/50 border border-primary/30 rounded-md min-h-[44px]">
                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">
                      {new Date(userData.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="w-full sm:flex-1 h-11"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={
                        saving ||
                        !userData.firstName.trim() ||
                        !userData.lastName.trim()
                      }
                      className="w-full sm:flex-1 h-11 text-foreground/90 hover:text-primary"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        fetchUserProfile(); // Reset to original data
                      }}
                      variant="outline"
                      className="w-full sm:w-auto h-11"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Subscription Management */}
          {subscriptionData?.stripeData ? (
            <Card className="backdrop-blur-sm bg-card/50 border-2 border-primary/20 shadow-xl">
              <CardHeader className="space-y-1 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Subscription Details
                </CardTitle>
                <CardDescription className="text-sm">
                  Manage your current subscription and billing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium">Current Plan</span>
                    <Badge
                      variant={
                        userData.subscription.status === "active"
                          ? "default"
                          : "destructive"
                      }
                      className="bg-black dark:bg-gradient-to-r from-primary to-secondary text-white flex-shrink-0"
                    >
                      {userData.subscription.plan}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium">Price</span>
                    <span className="text-sm text-muted-foreground flex-shrink-0">
                      {userData.subscription.price}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium">Status</span>
                    <Badge
                      variant={
                        userData.subscription.status === "Active"
                          ? "default"
                          : "destructive"
                      }
                      className="flex-shrink-0 bg-black dark:bg-gradient-to-r from-primary to-secondary text-white"
                    >
                      {userData.subscription.status}
                    </Badge>
                  </div>

                  {userData.subscription.status === "active" && (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium">Next Billing</span>
                      <span className="text-sm text-muted-foreground flex-shrink-0">
                        {new Date(
                          userData.subscription.nextBilling
                        ).toLocaleDateString()}
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
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* <Link href="/#pricing" className="block">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent h-11"
                  >
                    Upgrade Plan
                  </Button>
                </Link> */}

                  {userData.subscription.status === "active" && (
                    <Button
                      variant="destructive"
                      className="w-full h-11"
                      onClick={() => setShowCancelDialog(true)}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Cancel Subscription
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Link href="/#pricing" className="block">
              <Button variant="outline" className="w-full bg-transparent h-11">
                Subscribe Plan
              </Button>
            </Link>
          )}
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
                  Are you sure you want to cancel your subscription? This action
                  cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-sm text-destructive font-medium">
                    Your subscription will remain active until{" "}
                    {new Date(
                      userData.subscription.nextBilling
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="destructive"
                    onClick={handleCancelSubscription}
                    className="w-full sm:flex-1 h-11"
                  >
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
            <Button
              variant="outline"
              className="backdrop-blur-sm bg-transparent h-11 px-6"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
