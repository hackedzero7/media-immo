import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { BenefitsSection } from "@/components/benefits-section"
import { PricingSection } from "@/components/pricing-section"
import { ComparisonTable } from "@/components/comparison-table"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FaqSection } from "@/components/faq-section"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    
      
      <main>
        <HeroSection />
        <section id="benefits">
          <BenefitsSection />
        </section>
        <section id="pricing">
          <PricingSection />
        </section>
        <ComparisonTable />
        <section id="testimonials">
          <TestimonialsSection />
        </section>
        <section id="faq">
          <FaqSection />
        </section>
        <CtaSection />
      </main>
    
  
  )
}
