"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function SignupPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"details" | "code">("details")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const { sendSignupCode, signup, isLoading, error, clearError } = useAuth()
  const router = useRouter()

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!acceptTerms) {
      return // Les conditions doivent être acceptées
    }

    // Split full name into first and last name
    const nameParts = fullName.trim().split(/\s+/)
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    if (!firstName) {
      setVerifyError("Veuillez entrer votre nom complet")
      return
    }

    const result = await sendSignupCode(firstName, lastName || firstName, email)
    if (result.success) {
      setStep("code")
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setVerifyError(null)
    setIsVerifying(true)

    if (!code || code.length !== 6) {
      setVerifyError("Veuillez entrer un code à 6 chiffres")
      setIsVerifying(false)
      return
    }

    // Split full name into first and last name
    const nameParts = fullName.trim().split(/\s+/)
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || firstName

    const result = await signup({
      fullName,
      email,
      code,
    })

    setIsVerifying(false)

    if (result.success) {
      router.push("/login") // Redirection vers la page de connexion après inscription réussie
    } else {
      setVerifyError(result.error || "Une erreur est survenue")
    }
  }

  const handleBackToDetails = () => {
    setStep("details")
    setCode("")
    clearError()
    setVerifyError(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-xl bg-card/80 border-2 border-primary/20 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-black dark:text-transparent">
              Créer un compte
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Rejoignez-nous et commencez votre aventure dès aujourd'hui
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === "details" ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                {(error || verifyError) && (
                  <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
                    {error || verifyError}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Nom complet
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Entrez votre nom complet"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-background/50 border-2 border-primary/20 focus:border-primary/50 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Entrez votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-background/50 border-2 border-primary/20 focus:border-primary/50 backdrop-blur-sm"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    required
                    disabled={isLoading}
                    className="w-4 h-4 text-primary bg-transparent border-2 border-primary/30 rounded focus:ring-primary/50"
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground">
                    J'accepte les{" "}
                    <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
                      Conditions d'utilisation
                    </Link>{" "}
                    et la{" "}
                    <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
                      Politique de confidentialité
                    </Link>
                  </Label>
                </div>
                <Button
                  type="submit"
                  className="w-full text-foreground/90 hover:text-primary"
                  size="lg"
                  disabled={isLoading || !acceptTerms}
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer le code de vérification"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                {(error || verifyError) && (
                  <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
                    {verifyError || error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name-display" className="text-sm font-medium">
                    Nom complet
                  </Label>
                  <Input
                    id="name-display"
                    type="text"
                    value={fullName}
                    disabled
                    className="bg-background/30 border-2 border-primary/20 backdrop-blur-sm opacity-70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-display" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email-display"
                    type="email"
                    value={email}
                    disabled
                    className="bg-background/30 border-2 border-primary/20 backdrop-blur-sm opacity-70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-medium">
                    Code de vérification (6 chiffres)
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    placeholder="000000"
                    value={code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                      setCode(value)
                    }}
                    required
                    disabled={isVerifying}
                    className="bg-background/50 border-2 border-primary/20 focus:border-primary/50 backdrop-blur-sm text-center text-2xl tracking-widest font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Entrez le code à 6 chiffres envoyé à {email}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToDetails}
                    disabled={isVerifying}
                    className="flex-1"
                  >
                    Retour
                  </Button>
                  <Button
                    type="submit"
                    variant="outline"
                    className="flex-1"
                    disabled={isVerifying || code.length !== 6}
                  >
                    {isVerifying ? "Vérification..." : "Vérifier"}
                  </Button>
                </div>
              </form>
            )}
            <div className="text-center text-sm text-muted-foreground">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Se connecter
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}