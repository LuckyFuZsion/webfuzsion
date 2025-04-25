import Image from "next/image"
import { Mail, Phone } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-navy-900">
      {/* Header with Logo */}
      <header className="bg-black py-4">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center h-16">
            <Image
              src="/images/webfuzsion-logo.png"
              alt="WebFuZsion Logo"
              width={240}
              height={60}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-3xl w-full text-center space-y-8">
          {/* Main Content */}
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-pink-500 px-3 py-1 text-sm text-white">Coming Soon</div>
            <h1 className="text-4xl md:text-6xl font-bold text-white">Our Website is Under Construction</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We're working hard to bring you an amazing new website. Stay tuned for our launch!
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Progress</span>
              <span>75%</span>
            </div>
            <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-pink-400 w-3/4 rounded-full"></div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 pt-8">
            <h2 className="text-2xl font-bold text-white">Get In Touch</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-pink-500/20 p-2">
                  <Phone className="h-5 w-5 text-pink-500" />
                </div>
                <span className="text-gray-300">+447590763430</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-pink-500/20 p-2">
                  <Mail className="h-5 w-5 text-pink-500" />
                </div>
                <span className="text-gray-300">steve@luckyfuzsion.com</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Wave shape at bottom */}
      <div className="wave-shape">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-navy-700 bg-black py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} WebFuZsion Web Design Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
