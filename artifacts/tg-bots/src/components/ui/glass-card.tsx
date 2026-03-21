import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, hoverable = false, onClick }: GlassCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "glass-panel rounded-2xl overflow-hidden relative group",
        hoverable && "glass-panel-hover cursor-pointer",
        className
      )}
    >
      {/* Subtle top glare effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
      
      {children}
    </div>
  );
}
