import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, Facebook, MapPin } from "lucide-react"
import { LogoSvg } from "./logo-svg"

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/webfuzsion-logo-compressed.webp"
                alt="WebFuZsion Logo"
                width={40}
                height={40}
                className="h-10 w-10"
                unoptimized={true}
              />
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
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-brand-pink transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-xl font-bold mb-4">Locations</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/locations/grantham" className="flex items-start group">
                  <MapPin className="h-5 w-5 mr-2 text-brand-pink mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-300 group-hover:text-brand-pink transition-colors">
                      Grantham, Lincolnshire
                    </span>
                    <p className="text-sm text-gray-400">Serving clients locally and globally</p>
                  </div>
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
                <a href="mailto:info.webfuzsion@gmail.com" className="text-gray-300 hover:text-white">
                  info.webfuzsion@gmail.com
                </a>
              </li>
              <li className="flex items-center mt-4">
                <span className="text-gray-300">Social Media:</span>
                <div className="flex space-x-3 ml-2">
                  <a
                    href="https://www.facebook.com/profile.php?id=61575611918979"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-brand-pink transition-colors flex items-center"
                  >
                    <Facebook className="h-5 w-5 mr-1" /> Facebook
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} WebFuZsion Web Design Studio. All rights reserved.</p>
          <p className="mt-2 text-sm">Based in Grantham, Lincolnshire. Serving clients worldwide.</p>
        </div>
      </div>
    </footer>
  )
}
