import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, MessageCircle, Shield, Zap } from "lucide-react"

export function FaqSection() {
  const faqs = [
    {
      question: "What is the difference between the Independent and Agency packages?",
      answer:
        "The Independent package is designed for individual agents with features like social media marketing kit and professional guidance. The Agency package includes everything from Independent plus team management tools, unlimited user accounts, and 24/7 priority support.",
      icon: HelpCircle,
    },
    {
      question: "Can I cancel at any time?",
      answer:
        "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your access will continue until the end of your current billing period.",
      icon: Shield,
    },
    {
      question: "Is the Discovery offer really free?",
      answer:
        "The Discovery package is completely free and includes 5 minutes of phone calls, basic access, and professional guidance to help you get started with our platform.",
      icon: Zap,
    },
    {
      question: "How does the 20% discount work?",
      answer:
        "Independent and Agency subscribers receive a 20% discount on all additional services and premium features not included in their base package. This discount is automatically applied at checkout.",
      icon: MessageCircle,
    },
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-black dark:via-black dark:to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.05),transparent_50%)]" />

      <div className="container px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            <MessageCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Got{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Questions?
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Find answers to the most common questions about our platform and services
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
