export const plans = (isAnnual) => {
  return [
    {
      name: "Découverte",
      monthly: "0€",
      annual: "0€",
      period: "",
      description:
        "Testez notre qualité sur votre premier bien, c’est gratuit.",
      features: [
        "1 séance photo gratuite pour 1 bien (10-15 photos)",
        "Mini-site dédié pour ce bien",
        "Accédez à notre guide des annonces qui convertissent",
      ],
      cta: "Essayez sans risque",
      popular: false,
      isPremium: false,
    },
    {
      name: "Indépendant",
      monthly: "€7.99",
      annual: "€79.90",
      period: isAnnual ? "/year" : "/month",
      monthlyStripePriceId: "price_1S8PGODXn8wpi5tc8kNv3RGF",
      yearlyStripePriceId: "price_1S8PJLDXn8wpi5tcMvCAfDPZ",
      description:
        "Pour l’agent ambitieux qui veut se démarquer et atteindre de nouveaux sommets",
      features: [
        "Bonus pour le 4ème shooting : Home staging virtuel, 5 photos drone ou plan 2D (150m² max) au choix",
        "Séance photo portrait professionnelle offerte chaque semestre pour impressionner vos clients",
        "20 % de réduction sur tous les services supplémentaires (drone, vidéo, etc.)",
        "Kit marketing réseaux sociaux livré avec chaque shooting",
        "Mini-sites illimités qui impressionnent vos clients",
        "Livraison express en 24h pour devancer vos concurrents",
        "Conseiller personnel dédié pour vous guider vers le succès",
      ],
      cta: "S’abonner",
      popular: true,
      isPremium: true,
    },
    {
      name: "Agence",
      monthly: "€49.50",
      annual: "€475.20",
      period: isAnnual ? "/year" : "/month",
      monthlyStripePriceId: "price_1S8PMxDXn8wpi5tcOq3jKYbO",
      yearlyStripePriceId: "price_1S8PQtDXn8wpi5tczntQIsv7",
      description:
      "Pour les équipes qui veulent dominer leur marché et évoluer rapidement.",
    features: [
      "1h de shooting offert en bonus de fidélité",
      "Tout le pack Indépendant pour chaque agent de votre équipe",
      "Portail d’équipe partagé pour une image unifiée",
      "Comptes multi-utilisateurs avec facturation centralisée",
      "Support prioritaire 24/7 pour une réactivité maximale",
      "Webinaires exclusifs pour former et motiver votre équipe",
      ],
      cta: "S’abonner",
      popular: false,
      isPremium: true,
    },
  ];
};
