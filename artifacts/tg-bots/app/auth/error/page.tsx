import Link from "next/link"
import { ShieldAlert } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 text-center">
        <ShieldAlert className="mx-auto mb-4 h-12 w-12 text-destructive" aria-hidden="true" />
        <h1 className="mb-2 font-display text-2xl font-bold text-white">Ошибка авторизации</h1>
        <p className="mb-6 text-muted-foreground">
          Не удалось завершить вход. Попробуй ещё раз или свяжись с администратором.
        </p>
        <Link
          href="/admin/login"
          className="inline-block rounded-xl bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90"
        >
          К странице входа
        </Link>
      </div>
    </div>
  )
}
