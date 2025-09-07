export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white py-8 md:py-12 lg:py-16 overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-gray-800/20 animate-pulse" />

      <div className="absolute inset-0 backdrop-blur-sm bg-black/10" />

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        <div className="grid gap-6 sm:gap-8 md:gap-8 lg:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-7xl place-items-center sm:place-items-start">
          <div className="space-y-3 md:space-y-4 text-center sm:text-left sm:col-span-2 lg:col-span-1">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white bg-gradient-to-r from-primary-foreground to-secondary-foreground bg-clip-text text-transparent">
              MEDIA IMAG
            </div>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-xs mx-auto sm:mx-0">
              The all-in-one solution for real estate professionals.
            </p>
          </div>

          <div className="space-y-3 md:space-y-4 text-center sm:text-left">
            <h3 className="font-semibold text-white text-base sm:text-lg">Navigation</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <a
                  href="#features"
                  className="text-gray-300 hover:text-white transition-colors duration-300 inline-block py-1 px-2 sm:px-0 rounded hover:bg-white/10 sm:hover:bg-transparent"
                >
                  Our Offers
                </a>
              </li>
              <li>
                <a
                  href="#benefits"
                  className="text-gray-300 hover:text-white transition-colors duration-300 inline-block py-1 px-2 sm:px-0 rounded hover:bg-white/10 sm:hover:bg-transparent"
                >
                  Benefits
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-gray-300 hover:text-white transition-colors duration-300 inline-block py-1 px-2 sm:px-0 rounded hover:bg-white/10 sm:hover:bg-transparent"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-gray-300 hover:text-white transition-colors duration-300 inline-block py-1 px-2 sm:px-0 rounded hover:bg-white/10 sm:hover:bg-transparent"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3 md:space-y-4 text-center sm:text-left">
            <h3 className="font-semibold text-white text-base sm:text-lg">Legal</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300 inline-block py-1 px-2 sm:px-0 rounded hover:bg-white/10 sm:hover:bg-transparent"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300 inline-block py-1 px-2 sm:px-0 rounded hover:bg-white/10 sm:hover:bg-transparent"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300 inline-block py-1 px-2 sm:px-0 rounded hover:bg-white/10 sm:hover:bg-transparent"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3 md:space-y-4 text-center sm:text-left">
            <h3 className="font-semibold text-white text-base sm:text-lg">Contact</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-300">
              <li className="break-all sm:break-normal">
                <a
                  href="mailto:support@mediaimag.com"
                  className="hover:text-white transition-colors duration-300 inline-block py-1 px-2 sm:px-0 rounded hover:bg-white/10 sm:hover:bg-transparent"
                >
                  support@mediaimag.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+15551234567"
                  className="hover:text-white transition-colors duration-300 inline-block py-1 px-2 sm:px-0 rounded hover:bg-white/10 sm:hover:bg-transparent"
                >
                  +1 (555) 123-4567
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400 w-full max-w-7xl">
          <p className="px-4">© 2024 MEDIA IMAG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
