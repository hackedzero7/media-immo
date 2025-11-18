export const plans = (isAnnual) => {
  return [
    {
      name: "Découverte",
      monthly: "0€",
      annual: "0€",
      fakeamount: "€0",
      period: "",
      description:
        "Testez notre qualité sur votre premier bien, c’est gratuit.",
      features: [
        "Shooting photo offert (10 à 15 photos HDR)",
        "Kit réseaux sociaux inclus",
        "Site web dédié au bien (mini-site vitrine)",
        "Livraison en 48h garantie",
      ],
      cta: "Essayez sans risque",
      popular: false,
      isPremium: false,
    },
    {
      name: "Indépendant",
      monthly: "€7.99",
      annual: "€79.90",
      fakeamount: "€6.65",
      period: isAnnual ? "/year" : "/month",
      monthlyStripePriceId: "price_1S8PGODXn8wpi5tc8kNv3RGF",
      yearlyStripePriceId: "price_1SUpX2DXn8wpi5tc0sJMSm2D", //new price
      // yearlyStripePriceId: "price_1S8PJLDXn8wpi5tcMvCAfDPZ", //archived this price
      // monthlyStripePriceId: "price_1S8Lse1mkOUsOofRthDKWEpr",
      // yearlyStripePriceId: "price_1S8LsS1mkOUsOofRxW1JOiC1",
      description:
        "Pour l’agent ambitieux qui veut se démarquer et atteindre de nouveaux sommets",
      features: [
        "Portrait professionnel offert tous les 6 mois",
        "Home Staging virtuel offert (appartements)",
        "Photos crépusculaires offertes (maisons)",
        "Livraison express 24h garantie",
        "Support client VIP + priorité sur les créneaux",
        "10% de remise sur tous les services",
        "Un shooting offert à chaque 11e projet",
        "Kit réseaux sociaux & Site web pour chaque bien",
      ],
      cta: "S’abonner",
      popular: true,
      isPremium: true,
    },
    {
      name: "Agence",
      monthly: "€49.50",
      annual: "€475.20",
      fakeamount: "€41.60",
      period: isAnnual ? "/year" : "/month",
      monthlyStripePriceId: "price_1S8PMxDXn8wpi5tcOq3jKYbO",
      yearlyStripePriceId: "price_1S8PQtDXn8wpi5tczntQIsv7",
      // monthlyStripePriceId: "price_1S8LuD1mkOUsOofRsvpMgaYP",
      // yearlyStripePriceId: "price_1S8LuO1mkOUsOofR8CIZIphb",
      description:
      "Pour les équipes qui veulent dominer leur marché et évoluer rapidement.",
    features: [
      "Tous les avantages Indépendant pour chaque agent",
      "Portraits pro de l’équipe et de chaque agent",
      "Priorité maximale sur les shootings",
      "Livraison 24h garantie pour toute l’agence",
      "Charte graphique personnalisée (logo, couleurs)",
      "Galerie immobilière dédiée à l’agence",
      "Formations express offertes (cadrage, retouche…)",
      ],
      cta: "S’abonner",
      popular: false,
      isPremium: true,
    },
  ];
};
