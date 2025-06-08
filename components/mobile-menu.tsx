"use client"
import Link from "next/link"
import { X } from "lucide-react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col">
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="text-white">
          <X className="h-8 w-8" />
        </button>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 space-y-8">
        <Link href="#" className="text-white text-xl font-medium hover:text-pink-500" onClick={onClose}>
          Home
        </Link>
        <Link href="#about" className="text-white text-xl font-medium hover:text-pink-500" onClick={onClose}>
          About Us
        </Link>
        <Link href="#services" className="text-white text-xl font-medium hover:text-pink-500" onClick={onClose}>
          Services
        </Link>
        <Link href="#work" className="text-white text-xl font-medium hover:text-pink-500" onClick={onClose}>
          Portfolio
        </Link>
        <Link href="#testimonials" className="text-white text-xl font-medium hover:text-pink-500" onClick={onClose}>
          Testimonials
        </Link>
        <Link href="#contact" className="text-white text-xl font-medium hover:text-pink-500" onClick={onClose}>
          Contact
        </Link>
      </div>
    </div>
  )
}
