"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Discovery",
      monthly: "0€",
      annual: "0€",
      period: "",
      description: "Test our quality on your first property, it’s free.",
      features: [
        "1 free photo shoot for 1 property (10-15 photos)",
        "Dedicated mini-website for this property",
        "Access our guide to ads that convert",
      ],
      cta: "Try it risk-free",
      popular: false,
    },
    {
      name: "Independent",
      monthly: "€6.65",
      annual: "€66", // Example with discount
      period: isAnnual ? "/year" : "/month",
      description:
        "For the ambitious agent who wants to stand out and reach new heights.",
      features: [
        "Bonus for the 4th shooting: Virtual home staging, 5 drone photos or 2D plan (150m² max) of your choice",
        "Professional portrait shoot offered every semester to impress your customers",
        "20% discount on all additional services (drone, video, etc.)",
        "Social media marketing kit delivered with each shoot",
        "Unlimited mini websites that impress your customers",
        "24-hour express delivery to beat your competitors",
        "Dedicated personal advisor to guide you towards success",
      ],
      cta: "Subscribe",
      popular: true,
    },
    {
      name: "Agency",
      monthly: "€41.60",
      annual: "€416", // Example with discount
      period: isAnnual ? "/year" : "/month",
      description:
        "For teams that want to dominate their market and scale quickly.",
      features: [
        "1H shooting offered as a loyalty bonus",
        "Everything from the Independent package for each agent on your team",
        "Team portal shared for a unified image",
        "Multi-user accounts with centralized billing",
        "24/7 priority support for maximum responsiveness",
        "Exclusive webinars to train and motivate your team",
      ],
      cta: "Contact an expert",
      popular: false,
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 xl:py-32 bg-gradient-to-b from-blue-50 to-indigo-100/50 dark:from-background dark:to-background/50 relative overflow-hidden flex flex-col items-center justify-center min-h-screen">
      <div className="container px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 flex flex-col items-center justify-center">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16 xl:mb-24 w-full flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl text-balance mb-4 xl:mb-6 px-4 sm:px-0 text-center text-slate-900 dark:text-foreground">
            The game-changing formula for your career
          </h2>
          <p className="text-slate-700 dark:text-muted-foreground text-lg sm:text-xl xl:text-2xl max-w-2xl xl:max-w-4xl mx-auto px-4 sm:px-0 text-center">
            A premium membership for a premium lifestyle, for professionals.
          </p>

          {/* 🔹 Monthly / Annual Toggle */}
          <div className="flex items-center gap-4 mt-6">
            <Button
              onClick={() => setIsAnnual(false)}
              className={`px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg rounded-full transition-all duration-300 ${
                !isAnnual
                  ? "bg-gradient-to-r from-blue-500/90 to-purple-600/90 dark:from-primary/40 dark:to-secondary/40 text-white dark:text-foreground border-blue-400 dark:border-primary/50 shadow-lg"
                  : "bg-white dark:bg-background text-slate-700 dark:text-foreground border-2 border-blue-400 dark:border-primary/50 hover:bg-gradient-to-r hover:from-blue-500/90 hover:to-purple-600/90 hover:text-white"
              }`}
              variant={!isAnnual ? "default" : "outline"}
            >
              Monthly
            </Button>

            <Button
              onClick={() => setIsAnnual(true)}
              className={`px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg rounded-full transition-all duration-300 ${
                isAnnual
                  ? "bg-gradient-to-r from-blue-500/90 to-purple-600/90 dark:from-primary/40 dark:to-secondary/40 text-white dark:text-foreground border-blue-400 dark:border-primary/50 shadow-lg"
                  : "bg-white dark:bg-background text-slate-700 dark:text-foreground border-2 border-blue-400 dark:border-primary/50 hover:bg-gradient-to-r hover:from-blue-500/90 hover:to-purple-600/90 hover:text-white"
              }`}
              variant={isAnnual ? "default" : "outline"}
            >
              Annual{" "}
              <span className="ml-1 text-green-500 font-semibold">
                Save 15%
              </span>
            </Button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3 xl:gap-12 max-w-7xl xl:max-w-8xl mx-auto w-full place-items-center">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative backdrop-blur-xl w-full max-w-sm mx-auto ${
                plan.popular
                  ? "bg-gradient-to-br from-white to-blue-50 dark:from-card/80 dark:to-primary/5 border-blue-300 dark:border-primary/30 shadow-2xl lg:scale-105 xl:scale-110 shadow-blue-500/20 dark:shadow-primary/20"
                  : "bg-white/90 dark:bg-card/60 hover:bg-white dark:hover:bg-card/80 border-blue-200 dark:border-border/20"
              } transition-all duration-500 hover:shadow-xl hover:scale-102`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-primary dark:to-secondary text-white dark:text-primary-foreground border-0 shadow-lg">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-6 sm:pb-8 xl:pb-10 px-4 sm:px-6 xl:px-8">
                <CardTitle className="text-xl sm:text-2xl xl:text-3xl font-bold text-slate-900 dark:text-card-foreground">
                  {plan.name}
                </CardTitle>
                <div className="mt-4 xl:mt-6">
                  <span
                    className={`text-4xl sm:text-5xl xl:text-6xl font-bold ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 dark:from-primary dark:to-secondary bg-clip-text text-transparent"
                        : "text-slate-900 dark:text-card-foreground"
                    }`}
                  >
                    {isAnnual ? plan.annual : plan.monthly}
                  </span>
                  <span className="text-slate-600 dark:text-muted-foreground text-base sm:text-lg xl:text-xl">
                    {plan.period}
                  </span>
                </div>
                <p className="text-sm xl:text-base text-slate-600 dark:text-muted-foreground mt-2 xl:mt-4 px-2 sm:px-0">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6 xl:space-y-8 px-4 sm:px-6 xl:px-8">
                <ul className="space-y-4 xl:space-y-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-3 xl:gap-4"
                    >
                      <Check
                        className={`h-5 w-5 xl:h-6 xl:w-6 mt-0.5 flex-shrink-0 ${
                          plan.popular
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-purple-600 dark:text-purple-400"
                        }`}
                      />
                      <span className="text-sm xl:text-base text-pretty text-slate-800 dark:text-card-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  className={`w-full transition-all duration-300 py-3 sm:py-4 xl:py-5 xl:text-lg ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-500/90 to-purple-600/90 dark:from-primary/40 dark:to-secondary/40 text-white dark:text-foreground border-blue-400 dark:border-primary/50 shadow-lg hover:scale-105"
                      : "border-2 border-blue-400 dark:border-primary/50 text-blue-700 dark:text-foreground bg-white dark:bg-background hover:bg-gradient-to-r hover:from-blue-500/90 hover:to-purple-600/90 hover:text-white dark:hover:from-primary/50 dark:hover:to-secondary/50"
                  }`}
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

      {/* Background Decoration */}
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-purple-200/30 dark:from-primary/10 dark:to-secondary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-gradient-to-tr from-purple-200/20 to-blue-200/20 dark:from-secondary/8 dark:to-primary/8 rounded-full blur-2xl"></div>
    </section>
  );
}
