import Link from "next/link"
import { Bot, ShieldCheck } from "lucide-react"

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-xl bg-background/60">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-400 shadow-[0_0_20px_rgba(34,158,217,0.35)]">
            <Bot className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight text-white">TG Bots</span>
            <span className="text-[11px] text-muted-foreground">каталог 2026</span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>Админ</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
