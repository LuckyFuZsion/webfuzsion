"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function BackButton() {
  return (
    <Link href="/admin">
      <Button variant="default" className="absolute top-4 left-4 bg-brand-blue hover:bg-brand-blue/80 text-white">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </Button>
    </Link>
  )
}
