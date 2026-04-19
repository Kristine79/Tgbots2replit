import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  as?: "div" | "article" | "section"
}

export function GlassCard({ children, className, hoverable = false, as: Tag = "div" }: GlassCardProps) {
  return (
    <Tag
      className={cn(
        "glass-panel relative overflow-hidden rounded-2xl",
        hoverable &&
          "transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-[0_8px_32px_0_rgba(34,158,217,0.15)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {children}
    </Tag>
  )
}
