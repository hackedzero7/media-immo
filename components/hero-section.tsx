import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative mt-10 overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/10 dark:from-background dark:via-background/95 dark:to-primary/5 pt-0 pb-12 sm:pb-16 md:pb-24 lg:pb-32 flex items-start justify-center">
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center text-center">
        <div className="mx-auto max-w-5xl space-y-4 sm:space-y-6 md:space-y-8 flex flex-col items-center">
          <div className="space-y-4 md:space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 backdrop-blur-sm">
              <span className="text-sm font-medium text-white dark:text-white bg-primary dark:bg-primary px-2 py-1 rounded-full">
                🚀 Plateforme de Vente Révolutionnaire
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-balance">
              <span className="block text-foreground dark:text-foreground">Arrêtez de perdre</span>
              <span className="block text-foreground dark:text-foreground font-black drop-shadow-2xl">MANDATS</span>
              <span className="block text-foreground/80 dark:text-foreground/70 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mt-2">
                Vendez plus vite, à un meilleur prix.
              </span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2 sm:pt-4 md:pt-6 w-full">
            <Button
              size="lg"
              className="group relative overflow-hidden w-full sm:w-auto px-8 md:px-16 text-lg md:text-xl py-4 md:py-6 min-h-[56px] 
             bg-transparent border-2 border-primary text-primary dark:text-primary rounded-xl
             hover:bg-primary hover:text-white dark:hover:text-white transition-all duration-300 
             transform hover:scale-105 shadow-2xl"
            >
              <span className="relative z-10">Commencez votre essai gratuit</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 dark:from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>

            <button className="text-foreground/80 dark:text-foreground/80 hover:text-foreground dark:hover:text-foreground transition-colors duration-200 text-lg underline underline-offset-4">
              Regarder la démo
            </button>
          </div>
        </div>
      </div>

      <div className="absolute top-20 right-20 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-blue-500/20 dark:from-blue-400/30 to-purple-500/20 dark:to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 sm:w-48 sm:h-48 md:w-72 md:h-72 lg:w-80 lg:h-80 bg-gradient-to-tr from-pink-500/15 dark:from-pink-400/25 to-blue-500/15 dark:to-blue-400/25 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-1/3 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-gradient-to-r from-purple-400/10 dark:from-purple-300/20 to-pink-400/10 dark:to-pink-300/20 rounded-full blur-xl animate-bounce"></div>
      <div className="absolute bottom-1/3 left-1/2 w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 bg-gradient-to-l from-blue-400/15 dark:from-blue-300/25 to-purple-400/15 dark:to-purple-300/25 rounded-full blur-2xl animate-pulse delay-500"></div>
    </section>
  )
}
