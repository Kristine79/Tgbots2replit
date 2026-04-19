"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Lock, Mail, UserPlus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function AdminSignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError("Пароли не совпадают")
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      router.push("/admin/sign-up-success")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Не удалось зарегистрироваться"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden p-4"
      style={{ background: "radial-gradient(circle at 50% 0%, #122040 0%, #080c17 60%)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
      />

      <div className="w-full max-w-md">
        <div className="glass-panel rounded-3xl p-8">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/80 to-primary shadow-[0_0_30px_rgba(34,158,217,0.4)]">
              <UserPlus className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Регистрация</h1>
            <p className="mt-1 text-sm text-muted-foreground">Создай аккаунт администратора</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail
                className="pointer-events-none absolute inset-y-0 left-4 my-auto h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 pl-11 text-white placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>

            <div className="relative">
              <Lock
                className="pointer-events-none absolute inset-y-0 left-4 my-auto h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль (мин. 6 символов)"
                minLength={6}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 pl-11 text-white placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>

            <div className="relative">
              <Lock
                className="pointer-events-none absolute inset-y-0 left-4 my-auto h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <label htmlFor="confirm" className="sr-only">
                Подтверди пароль
              </label>
              <input
                id="confirm"
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Подтверди пароль"
                minLength={6}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 pl-11 text-white placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>

            {error && (
              <p role="alert" className="text-center text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-primary py-3.5 font-semibold text-white shadow-[0_0_20px_rgba(34,158,217,0.3)] transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Регистрация..." : "Создать аккаунт"}
            </button>
          </form>

          <div className="mt-6 flex justify-center border-t border-white/10 pt-6">
            <Link
              href="/admin/login"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
