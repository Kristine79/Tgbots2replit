import Link from "next/link"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Mail className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
        <h1 className="mb-2 font-display text-2xl font-bold text-white">Проверь почту</h1>
        <p className="mb-6 text-muted-foreground">
          Мы отправили ссылку для подтверждения на твой email. Открой её, чтобы завершить регистрацию.
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
