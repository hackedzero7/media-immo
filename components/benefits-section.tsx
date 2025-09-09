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
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50/80 to-indigo-100 dark:from-background dark:via-background/95 dark:to-primary/5 py-16 sm:py-20 md:py-24 lg:py-32 flex items-center justify-center min-h-screen">
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center text-center">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 w-full">
          <Badge
            variant="secondary"
            className="mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-blue-500/90 to-purple-600/90 dark:from-primary/40 dark:to-secondary/40 text-white dark:text-foreground border-blue-400 dark:border-primary/50 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base md:text-lg shadow-lg"
          >
            Benefits
          </Badge>

          <div className="relative">
            <div className="flex flex-col items-center space-y-2 sm:space-y-4">
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-slate-800 dark:text-muted-foreground/90 text-balance">
                  Take back control of your
                </h2>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/30 via-purple-500/20 to-indigo-400/30 dark:from-primary/30 dark:to-secondary/30 blur-xl opacity-60"></div>
              </div>

              <div className="relative group">
                <h1 className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black tracking-tighter text-slate-900 dark:text-foreground animate-pulse">
                  SALES
                </h1>
              </div>

              <div className="flex items-center space-x-4 mt-6">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent dark:via-primary w-16 sm:w-24"></div>
                <div className="w-2 h-2 bg-blue-500 dark:bg-primary rounded-full animate-pulse"></div>
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent dark:via-secondary w-16 sm:w-24"></div>
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
                className="border-blue-200 dark:border-primary/30 shadow-2xl hover:shadow-blue-500/30 dark:hover:shadow-primary/30 transition-all duration-700 bg-white/95 dark:bg-card/90 backdrop-blur-xl hover:bg-white dark:hover:bg-card/95 hover:scale-105 hover:-translate-y-2 group border-2 hover:border-blue-400 dark:hover:border-primary/50"
              >
                <CardContent className="p-6 sm:p-8 md:p-10 text-center h-full flex flex-col justify-center relative overflow-hidden">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-primary/30 dark:to-secondary/30 rounded-3xl flex items-center justify-center backdrop-blur-sm border-2 border-blue-300 dark:border-primary/40 shadow-xl group-hover:shadow-blue-500/40 dark:group-hover:shadow-primary/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-purple-600 dark:group-hover:from-primary/50 dark:group-hover:to-secondary/50">
                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-primary group-hover:text-white transition-all duration-500 group-hover:scale-110" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-slate-900 dark:text-foreground group-hover:text-blue-600 dark:group-hover:text-primary transition-colors duration-500">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-700 dark:text-muted-foreground text-pretty leading-relaxed text-base sm:text-lg group-hover:text-slate-800 dark:group-hover:text-muted-foreground/90 transition-colors duration-500">
                    {benefit.description}
                  </p>

                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-200/40 to-purple-200/40 dark:from-primary/20 dark:to-secondary/20 rounded-full blur-2xl group-hover:from-blue-400/50 group-hover:to-purple-400/50 dark:group-hover:from-primary/30 dark:group-hover:to-secondary/30 transition-all duration-700"></div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="absolute top-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-blue-300/25 to-purple-300/25 dark:from-primary/25 dark:to-secondary/25 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gradient-to-tr from-purple-200/20 to-indigo-300/20 dark:from-secondary/20 dark:to-primary/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] bg-gradient-to-r from-blue-200/15 to-purple-200/15 dark:from-primary/10 dark:to-secondary/10 rounded-full blur-3xl"></div>
    </section>
  )
}
