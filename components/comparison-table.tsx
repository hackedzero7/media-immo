"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"

export function ComparisonTable() {
  const [showComparison, setShowComparison] = useState(false)

  const features = [
    // Bonuses & Key Benefits
    { name: "Bonus at the 4th shooting", discovery: false, independent: "Choice", agency: "Included by agent" },
    { name: "11th shooting free", discovery: false, independent: false, agency: true },
    { name: "Discount on services", discovery: false, independent: "-20%", agency: "-20%" },
    { name: "Social media kit", discovery: false, independent: true, agency: true },

    // Services Included
    { name: "Shooting of good (Test)", discovery: "1 (offered)", independent: false, agency: false },
    { name: "Professional portrait shooting", discovery: false, independent: "Biannual", agency: "Team (Semi-annual)" },
    { name: "Mini-site by property", discovery: "1", independent: "Unlimited", agency: "Unlimited" },
    { name: "24-hour delivery guaranteed", discovery: false, independent: true, agency: true },
    { name: "Dedicated advisor", discovery: false, independent: true, agency: true },

    // Management & Support
    { name: "Monthly Webinars", discovery: false, independent: true, agency: true },
    { name: "User accounts", discovery: "1", independent: "1", agency: "Unlimited" },
    { name: "Support", discovery: "E-mail", independent: "Email & WhatsApp", agency: "Priority 24/7" },
  ]

  const visibleFeatures = showComparison ? features : features.slice(0, 3)

  return (
    <section className="py-24 bg-background flex flex-col items-center justify-center">
      <div className="container px-4 flex flex-col items-center">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl xl:text-6xl text-balance">
            Compare our plans at a glance
          </h2>
          <p className="text-muted-foreground mt-4 text-lg xl:text-xl">
            Find the plan that perfectly matches your ambitions.
          </p>
        </div>

        <div className="relative max-w-7xl xl:max-w-8xl mx-auto w-full">
          <div className="relative">
            <Card className="w-full bg-card">
              <CardHeader>
                <CardTitle className="sr-only">Feature Comparison</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 lg:p-6 xl:p-8 font-semibold text-base lg:text-lg xl:text-xl">
                          Features & Key Benefits
                        </th>
                        <th className="text-center p-4 lg:p-6 xl:p-8 font-semibold text-base lg:text-lg xl:text-xl">
                          Discovery
                        </th>
                        <th className="text-center p-4 lg:p-6 xl:p-8 font-semibold text-base lg:text-lg xl:text-xl bg-primary/20 text-slate-800">
                          Independent
                        </th>
                        <th className="text-center p-4 lg:p-6 xl:p-8 font-semibold text-base lg:text-lg xl:text-xl">
                          Agency
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleFeatures.map((feature, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-4 lg:p-6 xl:p-8 font-medium text-sm lg:text-base xl:text-lg">
                            {feature.name}
                          </td>

                          {/* Discovery */}
                          <td className="p-4 lg:p-6 xl:p-8 text-center">
                            {typeof feature.discovery === "boolean" ? (
                              feature.discovery ? (
                                <Check className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-primary mx-auto" />
                              ) : (
                                <X className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-muted-foreground mx-auto" />
                              )
                            ) : (
                              <span className="text-sm lg:text-base xl:text-lg">{feature.discovery}</span>
                            )}
                          </td>

                          {/* Independent */}
                          <td className="p-4 lg:p-6 xl:p-8 text-center bg-primary/20 text-slate-800">
                            {typeof feature.independent === "boolean" ? (
                              feature.independent ? (
                                <Check className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-primary mx-auto" />
                              ) : (
                                <X className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-muted-foreground mx-auto" />
                              )
                            ) : (
                              <span className="text-sm lg:text-base xl:text-lg text-slate-800">
                                {feature.independent}
                              </span>
                            )}
                          </td>

                          {/* Agency */}
                          <td className="p-4 lg:p-6 xl:p-8 text-center">
                            {typeof feature.agency === "boolean" ? (
                              feature.agency ? (
                                <Check className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-primary mx-auto" />
                              ) : (
                                <X className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-muted-foreground mx-auto" />
                              )
                            ) : (
                              <span className="text-sm lg:text-base xl:text-lg">{feature.agency}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {!showComparison && (
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/90 to-transparent backdrop-blur-sm pointer-events-none" />
            )}
          </div>

          {!showComparison && (
            <div className="flex justify-center mt-8">
               <button
                onClick={() => setShowComparison(true)}
                className="bg-gradient-to-r from-blue-500/90 to-purple-600/90 dark:from-primary/40 dark:to-secondary/40 text-white dark:text-foreground border border-blue-400 dark:border-primary/50 backdrop-blur-sm px-6 py-3 rounded-lg font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600/90 hover:to-purple-700/90 dark:hover:from-primary/50 dark:hover:to-secondary/50"
              >
                Compare tools
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
