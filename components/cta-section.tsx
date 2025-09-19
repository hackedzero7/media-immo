import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/95 to-purple-100/80 dark:from-background dark:via-background/95 dark:to-primary/10 py-24 md:py-32 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 dark:from-purple-500/20 dark:to-red-500/20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent dark:from-black/20 dark:to-transparent"></div>
      <div className="absolute inset-0 backdrop-blur-sm"></div>

      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/40 to-purple-400/40 dark:from-primary/20 dark:to-secondary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-purple-400/30 to-blue-400/30 dark:from-secondary/15 dark:to-primary/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-300/20 to-purple-300/20 dark:from-primary/5 dark:to-secondary/5 rounded-full blur-3xl"></div>

      <div className="container px-4 text-center relative z-10 flex items-center justify-center">
        <div className="max-w-3xl mx-auto space-y-8 flex flex-col items-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-slate-900 dark:text-foreground text-balance drop-shadow-lg">
            Prêt à devenir l’agent de référence dans votre secteur ?
          </h2>
          <p className="text-lg text-slate-700 dark:text-foreground/80 text-pretty max-w-2xl mx-auto">
          Ne laissez plus vos concurrents réaliser les meilleures ventes. Il est temps de vous développer. Il est temps de gagner.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="px-12 text-xl bg-transparent border-2 border-blue-600 dark:border-primary text-blue-600 dark:text-primary hover:bg-blue-600 hover:text-white dark:hover:bg-primary dark:hover:text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Choisissez la formule gagnante
          </Button>
        </div>
      </div>
    </section>
  )
}
