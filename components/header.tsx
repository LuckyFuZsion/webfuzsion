// Add a comment at the top of the file to trigger a refresh
// Updated for v0 preview refresh - current timestamp: 2025-05-18

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoSvg } from "./logo-svg"
import { SafeImage } from "./safe-image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Add this new useEffect to handle clicks outside the menu
  useEffect(() => {
    if (!isMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click was outside the mobile menu
      const mobileMenu = document.querySelector(".mobile-menu-container")
      if (mobileMenu && !mobileMenu.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside)

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/95 backdrop-blur-sm border-b border-brand-pink/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <SafeImage
              src="/images/webfuzsion-flame-logo.png"
              alt="WebFuZsion Icon"
              width={40}
              height={40}
              className="h-10 w-10"
              priority={true}
            />
            <LogoSvg priority={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href={pathname === "/" ? "#services" : "/#services"}
              className="text-white hover:text-brand-pink transition-colors"
            >
              Services
            </Link>
            <Link
              href={pathname === "/" ? "#portfolio" : "/#portfolio"}
              className="text-white hover:text-brand-pink transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href={pathname === "/" ? "#pricing" : "/#pricing"}
              className="text-white hover:text-brand-pink transition-colors"
            >
              Pricing
            </Link>
            <Link
              href={pathname === "/" ? "#testimonials" : "/#testimonials"}
              className="text-white hover:text-brand-pink transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="/blog"
              className="text-white hover:text-brand-pink transition-colors"
              onClick={() => {
                setTimeout(() => {
                  window.scrollTo(0, 0)
                }, 0)
              }}
            >
              Blog
            </Link>
            <Link
              href="/locations/grantham"
              className="text-white hover:text-brand-pink transition-colors"
              onClick={() => {
                setTimeout(() => {
                  window.scrollTo(0, 0)
                }, 0)
              }}
            >
              Grantham
            </Link>
            <Link href={pathname === "/" ? "#contact" : "/#contact"}>
              <Button className="bg-brand-pink hover:bg-brand-pink/80 text-white">Contact Us</Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-brand-dark/95 backdrop-blur-sm mobile-menu-container">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <Link
              href={pathname === "/" ? "#services" : "/#services"}
              className="text-white hover:text-brand-pink transition-colors py-2"
              onClick={toggleMenu}
            >
              Services
            </Link>
            <Link
              href={pathname === "/" ? "#portfolio" : "/#portfolio"}
              className="text-white hover:text-brand-pink transition-colors py-2"
              onClick={toggleMenu}
            >
              Portfolio
            </Link>
            <Link
              href={pathname === "/" ? "#pricing" : "/#pricing"}
              className="text-white hover:text-brand-pink transition-colors py-2"
              onClick={toggleMenu}
            >
              Pricing
            </Link>
            <Link
              href={pathname === "/" ? "#testimonials" : "/#testimonials"}
              className="text-white hover:text-brand-pink transition-colors py-2"
              onClick={toggleMenu}
            >
              Testimonials
            </Link>
            <Link
              href="/blog"
              className="text-white hover:text-brand-pink transition-colors py-2"
              onClick={(e) => {
                toggleMenu()
                setTimeout(() => {
                  window.scrollTo(0, 0)
                }, 0)
              }}
            >
              Blog
            </Link>
            <Link
              href="/locations/grantham"
              className="text-white hover:text-brand-pink transition-colors py-2"
              onClick={(e) => {
                toggleMenu()
                setTimeout(() => {
                  window.scrollTo(0, 0)
                }, 0)
              }}
            >
              Grantham
            </Link>
            <Link href={pathname === "/" ? "#contact" : "/#contact"} onClick={toggleMenu}>
              <Button className="w-full bg-brand-pink hover:bg-brand-pink/80 text-white">Contact Us</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
