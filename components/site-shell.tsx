import type { ReactNode } from "react"
import { SiteNav } from "./site-nav"
import { SiteFooter } from "./site-footer"

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34,158,217,0.18), transparent 60%), radial-gradient(ellipse 60% 40% at 80% 10%, rgba(99,102,241,0.10), transparent 60%)",
        }}
      />
      <SiteNav />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      <SiteFooter />
    </div>
  )
}
