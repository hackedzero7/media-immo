import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqSection() {
  const faqs = [
    {
      question: "What is the difference between the Independent and Agency packages?",
      answer:
        "The Independent package is designed for individual agents with features like social media marketing kit and professional guidance. The Agency package includes everything from Independent plus team management tools, unlimited user accounts, and 24/7 priority support.",
    },
    {
      question: "Can I cancel at any time?",
      answer:
        "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your access will continue until the end of your current billing period.",
    },
    {
      question: "Is the Discovery offer really free?",
      answer:
        "The Discovery package is completely free and includes 5 minutes of phone calls, basic access, and professional guidance to help you get started with our platform.",
    },
    {
      question: "How does the 20% discount work?",
      answer:
        "Independent and Agency subscribers receive a 20% discount on all additional services and premium features not included in their base package. This discount is automatically applied at checkout.",
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-background/80 to-muted/20 flex items-center justify-center">
      <div className="container px-4 flex flex-col items-center justify-center text-center">
        <div className="text-center mb-16 w-full">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">Your questions, our answers</h2>
        </div>

        <div className="max-w-3xl mx-auto w-full flex flex-col items-center">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background/90 border-border/30 rounded-lg px-6 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 text-pretty">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
