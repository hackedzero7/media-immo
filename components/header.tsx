"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, X, LogOut, User, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
    setIsDropdownOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Link
            href="/"
            className="text-xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent [&:not(:has(.bg-clip-text))]:text-foreground"
          >
            MEDIA IMAG
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <nav className="hidden md:flex items-center justify-center flex-grow mx-8">
          <div className="flex items-center space-x-6 lg:space-x-8">
            <a
              href="#features"
              className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors whitespace-nowrap"
            >
              Our Offers
            </a>
            <a
              href="#benefits"
              className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors whitespace-nowrap"
            >
              Benefits
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors whitespace-nowrap"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors whitespace-nowrap"
            >
              FAQ
            </a>
          </div>
        </nav>

        <div className="hidden md:flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              {user?.role === "admin" && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="text-foreground/90 hover:text-primary">
                    <span className="hidden lg:inline">Admin</span>
                    <span className="lg:hidden">Admin</span>
                  </Button>
                </Link>
              )}
            
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-1 text-sm text-foreground/70 hover:text-primary transition-colors"
                  >
                    <span className="hidden lg:inline">Hi, {user.firstName || user.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-background border border-border/20 rounded-md shadow-lg z-50">
                      <div className="py-1">
                        {user.role === "user" && (
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-foreground/90 hover:bg-muted transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <User className="h-4 w-4 inline mr-2" />
                            Profile
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-foreground/90 hover:bg-muted transition-colors"
                        >
                          <LogOut className="h-4 w-4 inline mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-foreground/90 hover:text-primary">
                  <span className="hidden lg:inline">Log In</span>
                  <span className="lg:hidden">Login</span>
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="text-xs lg:text-sm text-foreground/90 hover:text-primary">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur-xl">
          <nav className="container px-4 py-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center space-y-4 text-center">
              <a
                href="#features"
                className="block py-2 text-sm font-medium text-foreground/90 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Our Offers
              </a>
              <a
                href="#benefits"
                className="block py-2 text-sm font-medium text-foreground/90 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Benefits
              </a>
              <a
                href="#testimonials"
                className="block py-2 text-sm font-medium text-foreground/90 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="block py-2 text-sm font-medium text-foreground/90 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a>
              <div className="pt-4 border-t border-border/20 w-full max-w-xs space-y-3">
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
                {isAuthenticated ? (
                  <>
                    {user?.role === "admin" && (
                      <Link href="/admin" className="block">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-center text-foreground/90 hover:text-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                    {user?.role === "user" && (
                      <Link href="/profile" className="block">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-center text-foreground/90 hover:text-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Button>
                      </Link>
                    )}
                    {user && <div className="text-sm text-foreground/70 py-2">Hi, {user.firstName || user.email}</div>}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center text-foreground/90 hover:text-primary"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center text-foreground/90 hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Log In
                      </Button>
                    </Link>
                    <Link href="/signup" className="block">
                      <Button size="sm" className="w-full text-foreground/90 hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
