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
import { ProfileSkeleton } from "@/components/ProfileSkeleton";

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
        throw new Error("Échec du chargement du profil");
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
            ? `${subData?.currentPlan?.annual}/an`
            : `${subData?.currentPlan?.monthly}/mois`,
          status: subData?.stripeData?.status,
          nextBilling: subData?.stripeData?.currentPeriodEnd,
          features: subData?.currentPlan?.features || [],
        },
      });
    } catch (error) {
      toast.error("Impossible de charger les données du profil");
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
        throw new Error(errorData.error || "Échec de la mise à jour du profil");
      }

      await response.json();
      toast.success("Profil mis à jour avec succès !");
      setIsEditing(false);

      if (session?.user) {
        session.user.name = `${userData.firstName} ${userData.lastName}`;
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast.error(
        error instanceof Error ? error.message : "Échec de la mise à jour du profil"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
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
      toast.error("Échec de l’annulation de l’abonnement. Réessayez plus tard.");
      return;
    }
    setUserData((prev) => ({
      ...prev,
      subscription: { ...prev.subscription, status: "annulé" },
    }));

    toast.success("Abonnement annulé avec succès");
  };

  if (status === "loading" || loading) {
    return (
      <ProfileSkeleton/>
    );
  }

  return loading ? (
    <>Chargement...</>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* En-tête */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-black dark:text-transparent px-4 sm:px-0">
            Paramètres du Profil
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4 sm:px-0">
            Gérez vos informations de compte et vos préférences d’abonnement
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 xl:grid-cols-2">
          {/* Informations du Profil */}
          <Card className="backdrop-blur-sm bg-card/50 border-2 border-primary/20 shadow-xl">
            <CardHeader className="space-y-1 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <User className="h-5 w-5 text-primary" />
                Informations du Profil
              </CardTitle>
              <CardDescription className="text-sm">
                Mettez à jour vos informations personnelles et préférences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    Prénom
                  </Label>
                  <Input
                    id="firstName"
                    value={userData.firstName}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Nom
                  </Label>
                  <Input
                    id="lastName"
                    value={userData.lastName}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Adresse Email
                  </Label>
                  <Input id="email" type="email" value={userData.email} disabled />
                  <p className="text-xs text-muted-foreground">
                    L’adresse email ne peut pas être modifiée
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Rôle</Label>
                  <div className="flex items-center gap-2 p-3 bg-background/50 border rounded-md">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Badge>
                      {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Membre depuis</Label>
                  <div className="flex items-center gap-2 p-3 bg-background/50 border rounded-md">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(userData.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Modifier le Profil
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSaveProfile} disabled={saving}>
                      {saving ? "Sauvegarde..." : "Enregistrer"}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        fetchUserProfile();
                      }}
                      variant="outline"
                      disabled={saving}
                    >
                      Annuler
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Gestion de l’Abonnement */}
          {subscriptionData?.stripeData ? (
            <Card className="backdrop-blur-sm bg-card/50 border-2 border-primary/20 shadow-xl">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Détails de l’Abonnement
                </CardTitle>
                <CardDescription>
                  Gérez votre abonnement et votre facturation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                <div className="flex justify-between">
                  <span>Plan Actuel</span>
                  <Badge>{userData.subscription.plan}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Prix</span>
                  <span>{userData.subscription.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Statut</span>
                  <Badge>{userData.subscription.status}</Badge>
                </div>
                {userData.subscription.status === "active" && (
                  <div className="flex justify-between">
                    <span>Prochaine Facturation</span>
                    <span>
                      {new Date(userData.subscription.nextBilling).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <Separator />
                <h4 className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" /> Fonctionnalités
                </h4>
                <ul>
                  {userData.subscription.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                {userData.subscription.status === "active" && (
                  <Button variant="destructive" onClick={() => setShowCancelDialog(true)}>
                    <AlertTriangle className="h-4 w-4 mr-2" /> Annuler l’Abonnement
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Link href="/#pricing">
              <Button variant="outline">Souscrire à un Plan</Button>
            </Link>
          )}
        </div>

        {/* Dialogue Annulation */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full border border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Annuler l’Abonnement
                </CardTitle>
                <CardDescription>
                  Êtes-vous sûr de vouloir annuler ? Cette action est irréversible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Votre abonnement restera actif jusqu’au{" "}
                  {new Date(userData.subscription.nextBilling).toLocaleDateString()}
                </p>
                <div className="flex gap-3 mt-4">
                  <Button variant="destructive" onClick={handleCancelSubscription}>
                    Oui, Annuler
                  </Button>
                  <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                    Garder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center">
          <Link href="/">
            <Button variant="outline">Retour à l’Accueil</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
