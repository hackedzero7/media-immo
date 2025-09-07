import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

export function PricingSection() {
  const plans = [
    {
      name: "Discovery",
      price: "0€",
      period: "",
      description: "Perfect for getting started",
      features: [
        "Free phone calls (5 minutes)",
        "Basic access",
        "Professional guidance (5 min)",
        "Access our goals (5 min free)",
      ],
      cta: "Try it out free",
      popular: false,
    },
    {
      name: "Independent",
      price: "€6.65",
      period: "/month",
      description: "For independent agents who want to grow their business",
      features: [
        "Bonus for the 200 chatting",
        "Online course training + Online course training + Online course training",
        "Professional product does not require any additional setup of your image",
        "20% discount on additional services",
        "Social media marketing kit",
        "Optimized personal advisor to guide you towards success",
        "24 hour business delivery to boost your business",
        "Dedicated personal advisor to guide you towards success",
      ],
      cta: "Subscribe",
      popular: true,
    },
    {
      name: "Agency",
      price: "€41.60",
      period: "/month",
      description: "For agencies and teams",
      features: [
        "Everything from Independent package",
        "We strongly offered + 6 months",
        "Everything from the independent package + 6 months in your name or yours",
        "Team perfect about + 6 months",
        "Multi-user access + 6 months",
        "24/7 priority support",
        "Exclusive webinars + 6 months",
        "Advanced analytics + 6 months",
      ],
      cta: "Contact an expert",
      popular: false,
    },
  ]

  return (
    <section className="py-16 sm:py-20 md:py-24 xl:py-32 bg-gradient-to-b from-background to-background/50 relative overflow-hidden flex items-center justify-center min-h-screen">
      <div className="container px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 flex flex-col items-center justify-center">
        <div className="text-center mb-12 sm:mb-16 xl:mb-24 w-full flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl text-balance mb-4 xl:mb-6 px-4 sm:px-0 text-center">
            The game-changing formula for your career
          </h2>
          <p className="text-foreground/70 text-lg sm:text-xl xl:text-2xl max-w-2xl xl:max-w-4xl mx-auto px-4 sm:px-0 text-center">
            A premium membership for a premium lifestyle, for professionals.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3 xl:gap-12 max-w-7xl xl:max-w-8xl mx-auto w-full place-items-center">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative backdrop-blur-xl border-border/20 w-full max-w-sm mx-auto ${
                plan.popular
                  ? "bg-gradient-to-br from-card/80 to-primary/5 border-primary/30 shadow-2xl lg:scale-105 xl:scale-110 shadow-primary/20"
                  : "bg-card/60 hover:bg-card/80"
              } transition-all duration-500 hover:shadow-xl hover:scale-102`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0 shadow-lg">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-6 sm:pb-8 xl:pb-10 px-4 sm:px-6 xl:px-8">
                <CardTitle className="text-xl sm:text-2xl xl:text-3xl font-bold text-card-foreground">
                  {plan.name}
                </CardTitle>
                <div className="mt-4 xl:mt-6">
                  <span
                    className={`text-4xl sm:text-5xl xl:text-6xl font-bold ${plan.popular ? "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" : "text-card-foreground"}`}
                  >
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-base sm:text-lg xl:text-xl">{plan.period}</span>
                </div>
                <p className="text-sm xl:text-base text-muted-foreground mt-2 xl:mt-4 px-2 sm:px-0">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6 xl:space-y-8 px-4 sm:px-6 xl:px-8">
                <ul className="space-y-4 xl:space-y-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3 xl:gap-4">
                      <Check
                        className={`h-5 w-5 xl:h-6 xl:w-6 mt-0.5 flex-shrink-0 ${plan.popular ? "text-primary" : "text-secondary"}`}
                      />
                      <span className="text-sm xl:text-base text-pretty text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full transition-all duration-300 py-3 sm:py-4 xl:py-5 xl:text-lg`}
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="absolute top-1/4 right-0 w-72 h-72 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-gradient-to-tr from-secondary/8 to-primary/8 rounded-full blur-2xl"></div>
    </section>
  )
}
