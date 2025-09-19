"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const testimonials = [
    {
      videoUrl: "/feedback1.mp4",
      title: "Client Testimonial 1",
    },
    {
      videoUrl: "/feedback2.mp4",
      title: "Client Testimonial 2",
    },

  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    setIsPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsPlaying(false)
  }

  const togglePlay = () => {
    const video = document.getElementById(`video-${currentSlide}`) as HTMLVideoElement
    if (video) {
      if (isPlaying) {
        video.pause()
      } else {
        video.play().catch((error) => {
          console.log("Video play interrupted:", error)
          setIsPlaying(false)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <section className="py-16 md:py-24 xl:py-32 relative overflow-hidden min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      {/* Background gradient blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-spin-slow" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Centered content */}
      <div className="container px-4 relative z-10 flex flex-col items-center justify-center text-center">
        <div className="mb-12 md:mb-16 xl:mb-24 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-white/80">Histoires de réussite clients</span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-balance mb-6">
            <span className="block text-white">RÉELS</span>
            <span className="block text-blue-400">RÉSULTATS</span>
          </h2>
          <p className="text-white/60 text-lg xl:text-xl max-w-2xl mx-auto leading-relaxed">
          Témoignages authentiques de clients qui ont transformé leur entreprise grâce à notre plateforme.
          </p>
        </div>

        {/* Testimonial video card */}
        <div className="relative max-w-sm mx-auto">
          {/* Floating decorative shapes */}
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl backdrop-blur-sm rotate-12 animate-float" />
          <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full backdrop-blur-sm animate-float-delayed" />

          {/* Video */}
          <div className="relative mb-8">
            <div className="aspect-[9/16] rounded-3xl overflow-hidden relative shadow-2xl shadow-purple-500/20 border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm">
              <video
                key={currentSlide} // ✅ force reload on slide change
                id={`video-${currentSlide}`}
                className="w-full h-full object-cover rounded-3xl"
                controls={false}
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              >
                <source src={testimonials[currentSlide].videoUrl} type="video/mp4" />
                <span className="text-white">Votre navigateur ne prend pas en charge la balise vidéo.</span>
              </video>

              {/* Play/Pause overlay button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={togglePlay}
                  size="lg"
                  className="rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-500 border border-white/20 hover:border-white/40 hover:scale-110 shadow-2xl"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8 text-white drop-shadow-lg" />
                  ) : (
                    <Play className="h-8 w-8 text-white ml-1 drop-shadow-lg" />
                  )}
                </Button>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full w-1/3 transition-all duration-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full bg-white/5 backdrop-blur-md border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </Button>

            <div className="flex gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index)
                    setIsPlaying(false)
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? "w-8 h-3 bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg shadow-purple-400/50"
                      : "w-3 h-3 bg-white/30 hover:bg-white/50 hover:scale-125"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full bg-white/5 backdrop-blur-md border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </Button>
          </div>

          {/* Slide counter */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 backdrop-blur-sm border border-white/20">
              <span className="text-sm font-medium text-white">
                {currentSlide + 1} of {testimonials.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  )
}
