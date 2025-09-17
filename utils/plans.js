export const plans = (isAnnual) => {
  return [
    {
      name: "Discovery",
      monthly: "0€",
      annual: "0€",
      period: "",
      description: "Test our quality on your first property, it's free.",
      features: [
        "1 free photo shoot for 1 property (10-15 photos)",
        "Dedicated mini-website for this property",
        "Access our guide to ads that convert",
      ],
      cta: "Try it risk-free",
      popular: false,
      isPremium: false,
    },
    {
      name: "Independent",
      monthly: "€7.99",
      annual: "€79.90",
      period: isAnnual ? "/year" : "/month",
      monthlyStripePriceId: "price_1S8PGODXn8wpi5tc8kNv3RGF",
      yearlyStripePriceId: "price_1S8PJLDXn8wpi5tcMvCAfDPZ",
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
      isPremium: true,
    },
    {
      name: "Agency",
      monthly: "€49.50",
      annual: "€475.20",
      period: isAnnual ? "/year" : "/month",
      monthlyStripePriceId: "price_1S8PMxDXn8wpi5tcOq3jKYbO",
      yearlyStripePriceId: "price_1S8PQtDXn8wpi5tczntQIsv7",
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
      cta: "Subscribe",
      popular: false,
      isPremium: true,
    },
  ];
};
