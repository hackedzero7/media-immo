"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown } from "lucide-react";
import { plans } from "@/utils/plans";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);

  const user = localStorage.getItem("auth-storage");

  const userEmail = user ? JSON.parse(user)?.state?.user?.email : null;

  const goToStripe = async (plan: any) => {
    if (!userEmail || userEmail === null) {
      window.location.href = "/login";
    } else {
      try {
        const getSubscriptions = await fetch("/api/subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });
        const subscriptionsData = await getSubscriptions.json();
        console.log("this is the subscription data", subscriptionsData);
        if (subscriptionsData?.subscriptions) {
          alert(
            "You already have an active subscription. Please go to your profile and cancel previous subscription first."
          );
          return;
        } else {
          const payload = {
            email: userEmail,
            priceId: isAnnual
              ? plan.yearlyStripePriceId
              : plan.monthlyStripePriceId,
          };

          const response = await fetch("/api/stripe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          console.log(response);
          const data = await response.json();

          if (data.url) {
            window.location.href = data.url;
          }
        }
      } catch (error) {
        console.error("Error creating Stripe checkout session:", error);
      }
    }
  };

  // const plans = [
  //   {
  //     name: "Discovery",
  //     monthly: "0€",
  //     annual: "0€",
  //     period: "",
  //     description: "Test our quality on your first property, it's free.",
  //     features: [
  //       "1 free photo shoot for 1 property (10-15 photos)",
  //       "Dedicated mini-website for this property",
  //       "Access our guide to ads that convert",
  //     ],
  //     cta: "Try it risk-free",
  //     popular: false,
  //     isPremium: false,
  //   },
  //   {
  //     name: "Independent",
  //     monthly: "€6.65",
  //     annual: "€63.84", // Updated annual price calculation: €6.65 * 12 * 0.8 = €63.84 (20% discount)
  //     period: isAnnual ? "/year" : "/month",
  //     monthlyStripePriceId: "price_1S7lHh1mkOUsOofRSgAvN8Nr",
  //     yearlyStripePriceId: "price_1S7lHh1mkOUsOofRTIiyGx3q",
  //     description:
  //       "For the ambitious agent who wants to stand out and reach new heights.",
  //     features: [
  //       "Bonus for the 4th shooting: Virtual home staging, 5 drone photos or 2D plan (150m² max) of your choice",
  //       "Professional portrait shoot offered every semester to impress your customers",
  //       "20% discount on all additional services (drone, video, etc.)",
  //       "Social media marketing kit delivered with each shoot",
  //       "Unlimited mini websites that impress your customers",
  //       "24-hour express delivery to beat your competitors",
  //       "Dedicated personal advisor to guide you towards success",
  //     ],
  //     cta: "Subscribe",
  //     popular: true,
  //     isPremium: true,
  //   },
  //   {
  //     name: "Agency",
  //     monthly: "€41.60",
  //     annual: "€399.36", // Updated annual price calculation: €41.60 * 12 * 0.8 = €399.36 (20% discount)
  //     period: isAnnual ? "/year" : "/month",
  //     monthlyStripePriceId: "price_1S7lJF1mkOUsOofRtiTOWrDN",
  //     yearlyStripePriceId: "price_1S7lJF1mkOUsOofR5HRHEOK4",
  //     description:
  //       "For teams that want to dominate their market and scale quickly.",
  //     features: [
  //       "1H shooting offered as a loyalty bonus",
  //       "Everything from the Independent package for each agent on your team",
  //       "Team portal shared for a unified image",
  //       "Multi-user accounts with centralized billing",
  //       "24/7 priority support for maximum responsiveness",
  //       "Exclusive webinars to train and motivate your team",
  //     ],
  //     cta: "Contact an expert",
  //     popular: false,
  //     isPremium: true,
  //   },
  // ];

  const getVisibleFeatures = (features: string[], planIndex: number) => {
    if (expandedPlan === planIndex) {
      return features;
    }
    return features.slice(0, 3);
  };

  const toggleFeatures = (planIndex: number) => {
    setExpandedPlan(expandedPlan === planIndex ? null : planIndex);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50/80 to-indigo-100 dark:from-background dark:via-background/95 dark:to-primary/5 py-16 sm:py-20 md:py-24 xl:py-32 flex flex-col items-center justify-center min-h-screen">
      <div className="container px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 flex flex-col items-center justify-center">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16 xl:mb-24 w-full flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl text-balance mb-4 xl:mb-6 px-4 sm:px-0 text-center text-slate-900 dark:text-foreground">
            The game-changing formula for your career
          </h2>
          <p className="text-slate-700 dark:text-muted-foreground text-lg sm:text-xl xl:text-2xl max-w-2xl xl:max-w-4xl mx-auto px-4 sm:px-0 text-center">
            A premium membership for a premium lifestyle, for professionals.
          </p>

          <div className="flex items-center gap-4 mt-6">
            <Button
              onClick={() => setIsAnnual(false)}
              className={`px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg rounded-full transition-all duration-300 ${
                !isAnnual
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 dark:from-primary dark:to-secondary text-white shadow-lg border-0 hover:from-blue-600 hover:to-purple-700"
                  : "bg-white dark:bg-card text-slate-800 dark:text-foreground border-2 border-blue-400 dark:border-primary/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 dark:hover:from-primary dark:hover:to-secondary hover:text-white backdrop-blur-sm"
              }`}
              variant={!isAnnual ? "default" : "outline"}
            >
              Monthly
            </Button>

            <Button
              onClick={() => setIsAnnual(true)}
              className={`px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg rounded-full transition-all duration-300 ${
                isAnnual
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 dark:from-primary dark:to-secondary text-white shadow-lg border-0 hover:from-blue-600 hover:to-purple-700"
                  : "bg-white dark:bg-card text-slate-800 dark:text-foreground border-2 border-blue-400 dark:border-primary/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 dark:hover:from-primary dark:hover:to-secondary hover:text-white backdrop-blur-sm"
              }`}
              variant={isAnnual ? "default" : "outline"}
            >
              Annual{" "}
              <span className="ml-1 text-green-600 dark:text-green-400 font-semibold">
                Save 20%
              </span>
            </Button>
          </div>
        </div>

        <div className="w-full max-w-sm sm:max-w-6xl mx-auto relative">
          <div className="flex justify-center mb-6 sm:mb-0 sm:absolute sm:-top-4 sm:left-1/2 sm:-translate-x-1/2 sm:z-20">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-primary dark:to-secondary text-white px-6 py-2 text-sm font-medium rounded-full shadow-lg">
              By popularity
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 items-center sm:items-stretch">
            {plans(isAnnual).map((plan, index) => (
              <Card
                key={index}
                className={`relative w-full max-w-sm mx-auto sm:mx-0 sm:flex-1 transition-all duration-700 hover:shadow-2xl ${
                  plan.isPremium
                    ? "bg-white/95 dark:bg-card/90 backdrop-blur-xl border-2 border-blue-200 dark:border-primary/30 hover:border-blue-400 dark:hover:border-primary/50 hover:shadow-blue-500/30 dark:hover:shadow-primary/30 hover:scale-105 hover:-translate-y-2"
                    : "bg-white/95 dark:bg-card/90 backdrop-blur-xl border-2 border-blue-200 dark:border-primary/30 hover:border-blue-400 dark:hover:border-primary/50 hover:shadow-blue-500/30 dark:hover:shadow-primary/30 hover:scale-105 hover:-translate-y-2"
                } ${plan.popular ? "sm:scale-105 shadow-2xl" : ""}`}
              >
                {plan.isPremium && (
                  <div className="absolute -top-3 right-4">
                    <Crown className="h-8 w-8 text-blue-500 dark:text-primary fill-blue-400 dark:fill-primary/80" />
                  </div>
                )}

                <CardHeader className="text-center pb-6 px-6 relative overflow-hidden">
                  <div
                    className={`text-xs mb-2 font-medium ${
                      plan.isPremium
                        ? "text-slate-700 dark:text-muted-foreground"
                        : "text-slate-600 dark:text-muted-foreground"
                    }`}
                  >
                    {/* For one person only */}
                  </div>

                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-foreground mb-4">
                    {plan.name}
                  </CardTitle>
                  <p className="text-sm text-slate-700 dark:text-muted-foreground mb-6">
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900 dark:text-foreground">
                      {isAnnual ? plan.annual : plan.monthly}
                    </span>
                    <span className="text-slate-700 dark:text-muted-foreground text-base ml-1">
                      {plan.period}
                    </span>
                  </div>

                  <div
                    className={`w-full mb-6 py-3 text-base font-medium rounded-lg transition-all duration-300 text-center cursor-pointer ${
                      plan.isPremium
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 dark:from-primary dark:to-secondary hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/40 dark:hover:shadow-primary/40"
                        : "bg-gradient-to-r from-slate-700 to-slate-800 dark:from-muted dark:to-muted/80 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg"
                    }`}
                    onClick={() => goToStripe(plan)}
                  >
                    {plan.cta}
                  </div>

                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-200/40 to-purple-200/40 dark:from-primary/20 dark:to-secondary/20 rounded-full blur-2xl group-hover:from-blue-400/50 group-hover:to-purple-400/50 dark:group-hover:from-primary/30 dark:group-hover:to-secondary/30 transition-all duration-700"></div>
                </CardHeader>

                <CardContent className="px-6 pb-6">
                  <div className="relative">
                    <div className="text-sm font-medium text-slate-900 dark:text-foreground bg-gray-100 dark:bg-slate-800 mb-4 px-3 py-2 rounded-lg">
                      Main features
                    </div>

                    <div className="relative">
                      <ul className="space-y-3">
                        {getVisibleFeatures(plan.features, index).map(
                          (feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-start gap-3"
                            >
                              <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400" />
                              <span className="text-sm text-slate-700 dark:text-muted-foreground">
                                {feature}
                              </span>
                            </li>
                          )
                        )}
                      </ul>

                      {expandedPlan !== index && plan.features.length > 3 && (
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-card via-white/90 dark:via-card/90 to-transparent pointer-events-none" />
                      )}
                    </div>

                    {expandedPlan !== index && plan.features.length > 3 && (
                      <div className="flex justify-center mt-4">
                        <button
                          onClick={() => toggleFeatures(index)}
                          className="bg-gradient-to-r from-blue-500/90 to-purple-600/90 dark:from-primary/40 dark:to-secondary/40 text-white dark:text-foreground border border-blue-400 dark:border-primary/50 backdrop-blur-sm px-4 py-2 rounded-lg font-medium text-sm shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600/90 hover:to-purple-700/90 dark:hover:from-primary/50 dark:hover:to-secondary/50"
                        >
                          Explore features
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-blue-300/25 to-purple-300/25 dark:from-primary/25 dark:to-secondary/25 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gradient-to-tr from-purple-200/20 to-indigo-300/20 dark:from-secondary/20 dark:to-primary/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] bg-gradient-to-r from-blue-200/15 to-purple-200/15 dark:from-primary/10 dark:to-secondary/10 rounded-full blur-3xl"></div>
    </section>
  );
}
