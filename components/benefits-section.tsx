import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Zap, TrendingUp } from "lucide-react"

export function BenefitsSection() {
  const benefits = [
    {
      icon: Target,
      title: "Unbeatable Brand Image",
      description: "Sell at unbeatable prices that justify a higher commission.",
    },
    {
      icon: Zap,
      title: "Fast, Time, Maximized Sales",
      description: "Reduce prospecting efforts by 80% and get more listings from your existing.",
    },
    {
      icon: TrendingUp,
      title: "Marketing on Autopilot",
      description: "Automated lead generation and marketing that delivers results while you sleep.",
    },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/10 py-16 sm:py-20 md:py-24 lg:py-32 flex items-center justify-center min-h-screen">
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center text-center">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 w-full">
          <Badge
            variant="secondary"
            className="mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-primary/30 to-secondary/30 text-foreground border-primary/40 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base md:text-lg shadow-lg"
          >
            Benefits
          </Badge>

          <div className="relative">
            <div className="flex flex-col items-center space-y-2 sm:space-y-4">
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-muted-foreground/80 text-balance">
                  Take back control of your
                </h2>
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur-xl opacity-50"></div>
              </div>

              <div className="relative group">
                <h1 className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black tracking-tighter text-white animate-pulse">
                  SALES
                </h1>
              </div>

              <div className="flex items-center space-x-4 mt-6">
                <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent w-16 sm:w-24"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <div className="h-px bg-gradient-to-r from-transparent via-secondary to-transparent w-16 sm:w-24"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto w-full">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <Card
                key={index}
                className="border-primary/20 shadow-2xl hover:shadow-primary/20 transition-all duration-700 bg-slate-900/90 backdrop-blur-xl hover:bg-slate-800/90 hover:scale-105 hover:rotate-1 group"
              >
                <CardContent className="p-6 sm:p-8 md:p-10 text-center h-full flex flex-col justify-center relative overflow-hidden">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-primary/30 shadow-xl group-hover:shadow-primary/30 transition-all duration-500 group-hover:scale-110">
                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-primary group-hover:text-secondary transition-colors duration-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white group-hover:text-primary transition-colors duration-500">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-300 text-pretty leading-relaxed text-base sm:text-lg">
                    {benefit.description}
                  </p>

                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-700"></div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="absolute top-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gradient-to-tr from-secondary/10 to-primary/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl"></div>
    </section>
  )
}
