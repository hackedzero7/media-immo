import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"

export function ComparisonTable() {
  const features = [
    { name: "Business & key Benefits", discovery: true, independent: true, agency: true },
    { name: "Unlimited Messaging", discovery: false, independent: true, agency: true },
    { name: "No annoying Ads", discovery: false, independent: true, agency: true },
    { name: "Unlimited services", discovery: false, independent: false, agency: true },
    { name: "Social media kit", discovery: false, independent: true, agency: true },
    { name: "Services included", discovery: false, independent: false, agency: true },
    { name: "Monthly live webinars", discovery: false, independent: true, agency: true },
    { name: "Professional personal advising", discovery: false, independent: true, agency: true },
    { name: "Mini site by property", discovery: false, independent: false, agency: true },
    { name: "24 hour delivery guaranteed", discovery: false, independent: true, agency: true },
    { name: "Dedicated advisor", discovery: false, independent: false, agency: true },
    { name: "Management & Support", discovery: false, independent: false, agency: true },
    { name: "Monthly Webinars", discovery: false, independent: true, agency: true },
    { name: "User accounts", discovery: "1", independent: "1", agency: "Unlimited" },
    { name: "Support", discovery: "Email", independent: "Email & WhatsApp", agency: "24/7 Priority" },
  ]

  return (
    <section className="py-24 bg-background flex flex-col items-center justify-center">
      <div className="container px-4 flex flex-col items-center">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl xl:text-6xl text-balance">
            The game-changing formula for your career
          </h2>
          <p className="text-muted-foreground mt-4 text-lg xl:text-xl">
            Find the plan that perfectly matches your ambitions.
          </p>
        </div>

        <Card className="max-w-7xl xl:max-w-8xl mx-auto w-full bg-card">
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
                  {features.map((feature, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-4 lg:p-6 xl:p-8 font-medium text-sm lg:text-base xl:text-lg">{feature.name}</td>
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
                      <td className="p-4 lg:p-6 xl:p-8 text-center bg-primary/20 text-slate-800">
                        {typeof feature.independent === "boolean" ? (
                          feature.independent ? (
                            <Check className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-primary mx-auto" />
                          ) : (
                            <X className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className="text-sm lg:text-base xl:text-lg text-slate-800">{feature.independent}</span>
                        )}
                      </td>
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
      </div>
    </section>
  )
}
