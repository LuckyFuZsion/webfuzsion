"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/admin/logout")
    router.push("/admin/login")
  }

  return (
    <Button
      onClick={handleLogout}
      variant="default"
      className="absolute top-4 right-4 bg-brand-pink hover:bg-brand-pink/80 text-white"
    >
      <LogOut className="h-4 w-4 mr-2" /> Logout
    </Button>
  )
}
