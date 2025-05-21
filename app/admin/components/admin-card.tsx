import type React from "react"

interface AdminCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

export function AdminCard({ title, description, icon }: AdminCardProps) {
  return (
    <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-all duration-300 cursor-pointer">
      <div className="flex items-start">
        <div className="mr-4 text-brand-pink">{icon}</div>
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  )
}
