import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, Facebook } from "lucide-react"
import { LogoSvg } from "./logo-svg"

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image src="/favicon.png" alt="WebFuZsion Logo" width={40} height={40} className="h-10 w-10" />
              <LogoSvg />
            </div>
            <p className="text-gray-300 mt-4">
              Creating exceptional digital experiences for small businesses, tradesmen, and content creators.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#services" className="text-gray-300 hover:text-brand-pink transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#portfolio" className="text-gray-300 hover:text-brand-pink transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-gray-300 hover:text-brand-pink transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-gray-300 hover:text-brand-pink transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-300 hover:text-brand-pink transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-brand-pink" />
                <a href="tel:07590763430" className="text-gray-300 hover:text-white">
                  07590 763430
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-brand-pink" />
                <a href="mailto:steve@luckyfuzsion.com" className="text-gray-300 hover:text-white">
                  steve@luckyfuzsion.com
                </a>
              </li>
              <li className="flex items-center mt-4">
                <span className="text-gray-300">Social Media:</span>
                <div className="flex space-x-3 ml-2">
                  <span className="text-gray-400 flex items-center">
                    <Facebook className="h-5 w-5 mr-1" /> Coming Soon
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} WebFuZsion Web Design Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
