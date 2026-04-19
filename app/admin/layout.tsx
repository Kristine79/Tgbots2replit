import type { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34,158,217,0.15), transparent 60%)",
        }}
      />
      {children}
    </div>
  )
}
