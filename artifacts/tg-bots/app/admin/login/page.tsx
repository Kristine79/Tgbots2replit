"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Bot, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get("next") || "/admin"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push(nextPath)
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Не удалось войти"
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
              <ShieldCheck className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Панель администратора</h1>
            <p className="mt-1 text-sm text-muted-foreground">Войди с email и паролем</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 pl-11 text-white placeholder:text-muted-foreground transition-all focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                <Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 pl-11 pr-12 text-white placeholder:text-muted-foreground transition-all focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-4 flex items-center text-muted-foreground transition-colors hover:text-white"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <p role="alert" className="text-center text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full rounded-2xl bg-primary py-3.5 font-semibold text-white shadow-[0_0_20px_rgba(34,158,217,0.3)] transition-all hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(34,158,217,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-3 border-t border-white/10 pt-6">
            <Link
              href="/admin/sign-up"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Нет аккаунта? Зарегистрируйся
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Bot className="h-4 w-4" aria-hidden="true" />
              Вернуться к каталогу
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
