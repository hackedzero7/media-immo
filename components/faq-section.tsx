import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, MessageCircle, Shield, Zap } from "lucide-react"

export function FaqSection() {
  const faqs = [
    {
      question: "Quelle est la différence entre les forfaits Indépendant et Agence ?",
      answer:
        "Le forfait Indépendant est conçu pour les agents individuels avec des fonctionnalités comme le kit marketing réseaux sociaux et l’accompagnement professionnel. Le forfait Agence inclut tout ce qu’offre l’Indépendant, plus des outils de gestion d’équipe, des comptes utilisateurs illimités et un support prioritaire 24/7.",
      icon: HelpCircle,
    },
    {
      question: "Puis-je annuler à tout moment ?",
      answer:
        "Oui, vous pouvez annuler votre abonnement à tout moment. Il n’y a pas de contrat à long terme ni de frais d’annulation. Votre accès restera actif jusqu’à la fin de votre période de facturation en cours.",
      icon: Shield,
    },
    {
      question: "L’offre Découverte est-elle vraiment gratuite ?",
      answer:
        "Le forfait Découverte est entièrement gratuit et inclut 5 minutes d’appels téléphoniques, un accès basique et un accompagnement professionnel pour vous aider à démarrer sur notre plateforme.",
      icon: Zap,
    },
    {
      question: "Comment fonctionne la réduction de 20 % ?",
      answer:
        "Les abonnés Indépendant et Agence bénéficient d’une réduction de 20 % sur tous les services supplémentaires et fonctionnalités premium non inclus dans leur forfait de base. Cette remise est appliquée automatiquement lors du paiement.",
      icon: MessageCircle,
    },
  ];
  

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-black dark:via-black dark:to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.05),transparent_50%)]" />

      <div className="container px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            <MessageCircle className="w-4 h-4" />
            Foire aux questions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
          Vous avez{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            des questions ?
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Trouvez des réponses aux questions les plus fréquentes sur notre plateforme et nos services.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-6">
            {faqs.map((faq, index) => {
              const IconComponent = faq.icon
              return (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="group bg-white/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-8 py-2 backdrop-blur-sm shadow-sm hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-purple-500/10 transition-all duration-300 hover:border-blue-300/50 dark:hover:border-purple-500/50"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-purple-400 transition-colors duration-300 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-lg">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-300 text-base leading-relaxed ml-14 pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>

          
        </div>
      </div>
    </section>
  )
}
