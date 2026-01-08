"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"email" | "code">("email")
  const [rememberMe, setRememberMe] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const { sendLoginCode, isLoading, error, clearError } = useAuth()
  const router = useRouter()

  // Load saved email if "Remember Me" was checked previously
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail")
    const wasRemembered = localStorage.getItem("rememberMe") === "true"
    
    if (savedEmail && wasRemembered) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!email) {
      return
    }

    // Save or remove email based on "Remember Me" checkbox
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email)
      localStorage.setItem("rememberMe", "true")
    } else {
      localStorage.removeItem("rememberedEmail")
      localStorage.removeItem("rememberMe")
    }

    const result = await sendLoginCode(email)
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

    try {
      // Verify code and create session using NextAuth
      const result = await signIn("otp", {
        email,
        code,
        redirect: false,
      })

      if (result?.error) {
        setVerifyError(result.error === "CredentialsSignin" 
          ? "Code invalide ou expiré. Veuillez demander un nouveau code."
          : result.error)
        setIsVerifying(false)
        return
      }

      if (result?.ok) {
        router.push("/")
      } else {
        setIsVerifying(false)
      }
    } catch (err) {
      setVerifyError("Une erreur est survenue. Veuillez réessayer.")
      setIsVerifying(false)
    }
  }

  const handleBackToEmail = () => {
    setStep("email")
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
              Bon Retour
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Connectez-vous à votre compte pour continuer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === "email" ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                {/* 🔥 Boîte d'erreur */}
                {error && (
                  <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
                    {error}
                  </div>
                )}

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
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                    className="w-4 h-4 text-primary bg-transparent border-2 border-primary/30 rounded focus:ring-primary/50"
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground">
                    Se souvenir de moi
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full text-foreground/90 hover:text-primary"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer le code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                {/* 🔥 Boîte d'erreur */}
                {(error || verifyError) && (
                  <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
                    {verifyError || error}
                  </div>
                )}

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
                    onClick={handleBackToEmail}
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
              Vous n'avez pas de compte ?{" "}
              <Link href="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Inscrivez-vous
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}