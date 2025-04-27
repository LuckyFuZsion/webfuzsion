"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoSvg } from "./logo-svg"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/95 backdrop-blur-sm border-b border-brand-pink/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/favicon.png" alt="WebFuZsion Icon" width={40} height={40} className="h-10 w-10" priority />
            <LogoSvg />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#services" className="text-white hover:text-brand-pink transition-colors">
              Services
            </Link>
            <Link href="#portfolio" className="text-white hover:text-brand-pink transition-colors">
              Portfolio
            </Link>
            <Link href="#pricing" className="text-white hover:text-brand-pink transition-colors">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-white hover:text-brand-pink transition-colors">
              Testimonials
            </Link>
            <Link href="#contact">
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
        <div className="md:hidden bg-brand-dark/95 backdrop-blur-sm">
          <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            <Link
              href="#services"
              className="text-white hover:text-brand-pink transition-colors py-2"
              onClick={toggleMenu}
            >
              Services
            </Link>
            <Link
              href="#portfolio"
              className="text-white hover:text-brand-pink transition-colors py-2"
              onClick={toggleMenu}
            >
              Portfolio
            </Link>
            <Link
              href="#pricing"
              className="text-white hover:text-brand-pink transition-colors py-2"
              onClick={toggleMenu}
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-white hover:text-brand-pink transition-colors py-2"
              onClick={toggleMenu}
            >
              Testimonials
            </Link>
            <Link href="#contact" onClick={toggleMenu}>
              <Button className="w-full bg-brand-pink hover:bg-brand-pink/80 text-white">Contact Us</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
