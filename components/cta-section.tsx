import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/10 py-24 md:py-32 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-red-500/20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      <div className="absolute inset-0 backdrop-blur-sm"></div>

      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-secondary/15 to-primary/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl"></div>

      <div className="container px-4 text-center relative z-10 flex items-center justify-center">
        <div className="max-w-3xl mx-auto space-y-8 flex flex-col items-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-foreground text-balance drop-shadow-lg">
            Ready to become the go-to agent in your industry?
          </h2>
          <p className="text-lg text-foreground/80 text-pretty max-w-2xl mx-auto">
            Don't let your competitors take the best sales anymore. It's time to grow yourself. It's time to win.
          </p>
          <Button size="lg" className="px-12 text-xl">
            Choose the Winning Formula
          </Button>
        </div>
      </div>
    </section>
  )
}
