import Link from "next/link"
import { ShieldAlert } from "lucide-react"
import { SiteShell } from "@/components/site-shell"

export default function NotFound() {
  return (
    <SiteShell>
      <div className="flex flex-col items-center py-20 text-center">
        <ShieldAlert className="mb-4 h-16 w-16 text-destructive" aria-hidden="true" />
        <h2 className="mb-2 font-display text-2xl font-bold text-white">Не найдено</h2>
        <p className="mb-6 text-muted-foreground">Страница не существует или была удалена.</p>
        <Link
          href="/"
          className="rounded-xl bg-primary px-6 py-3 font-medium text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90"
        >
          На главную
        </Link>
      </div>
    </SiteShell>
  )
}
