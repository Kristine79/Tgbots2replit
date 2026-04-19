"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CheckCircle,
  Edit,
  Loader2,
  Plus,
  Search,
  Shield,
  Sparkles,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { BotForm } from "./bot-form"
import { deleteBotAction, signOutAction } from "@/app/admin/actions"
import { formatCount } from "@/lib/utils"
import type { BotWithCategory, Category } from "@/lib/types"

type Mode = { kind: "idle" } | { kind: "create" } | { kind: "edit"; bot: BotWithCategory }

export function AdminDashboard({
  bots,
  categories,
  userEmail,
}: {
  bots: BotWithCategory[]
  categories: Category[]
  userEmail: string
}) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [mode, setMode] = useState<Mode>({ kind: "idle" })
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return bots
    return bots.filter(
      (b) =>
        b.name.toLowerCase().includes(term) ||
        b.username.toLowerCase().includes(term) ||
        b.tags.some((t) => t.toLowerCase().includes(term)),
    )
  }, [bots, search])

  const totals = useMemo(() => {
    const total = bots.length
    const verified = bots.filter((b) => b.is_verified).length
    const premium = bots.filter((b) => b.is_premium).length
    const users = bots.reduce((acc, b) => acc + b.monthly_users, 0)
    return { total, verified, premium, users }
  }, [bots])

  function onDone() {
    setMode({ kind: "idle" })
    router.refresh()
  }

  function handleDelete(bot: BotWithCategory) {
    if (!confirm(`Удалить бота «${bot.name}»?`)) return
    setDeletingId(bot.id)
    startTransition(async () => {
      await deleteBotAction(bot.id)
      setDeletingId(null)
      router.refresh()
    })
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-white"
          >
            ← К каталогу
          </Link>
          <h1 className="font-display text-3xl font-bold text-white">Админ-панель</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Вошёл как <span className="text-white">{userEmail}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMode({ kind: "create" })}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(34,158,217,0.3)] transition-all hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Добавить бота
          </button>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              Выйти
            </button>
          </form>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={<Shield className="h-5 w-5 text-primary" />} label="Всего ботов" value={formatCount(totals.total)} />
        <StatCard
          icon={<CheckCircle className="h-5 w-5 text-emerald-400" />}
          label="Верифицировано"
          value={formatCount(totals.verified)}
        />
        <StatCard
          icon={<Sparkles className="h-5 w-5 text-amber-400" />}
          label="Премиум"
          value={formatCount(totals.premium)}
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-sky-300" />}
          label="Пользователей/мес."
          value={formatCount(totals.users)}
        />
      </div>

      <GlassCard className="mb-6 flex items-center gap-3 p-3">
        <Search className="ml-2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="admin-search" className="sr-only">
          Поиск ботов
        </label>
        <input
          id="admin-search"
          type="text"
          placeholder="Поиск по имени, username или тегам"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border-none bg-transparent py-2 text-white placeholder:text-muted-foreground focus:outline-none"
        />
        <span className="mr-2 rounded-full bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
          {filtered.length}
        </span>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5 text-sm">
            <thead className="bg-white/[0.02] text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Бот</th>
                <th className="px-4 py-3 font-medium">Категория</th>
                <th className="px-4 py-3 font-medium">Рейтинг</th>
                <th className="px-4 py-3 font-medium">Пользователи</th>
                <th className="px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3 font-medium text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-muted-foreground">
                    Боты не найдены
                  </td>
                </tr>
              )}
              {filtered.map((bot) => {
                const isDeleting = deletingId === bot.id && isPending
                return (
                  <tr key={bot.id} className="transition-colors hover:bg-white/[0.03]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-2xl">
                          <span aria-hidden="true">{bot.icon_emoji}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-medium text-white">{bot.name}</div>
                          <div className="truncate text-xs text-primary">@{bot.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{bot.category?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                        <span className="text-white">{Number(bot.rating).toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({formatCount(bot.review_count)})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/90">{formatCount(bot.monthly_users)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {bot.is_verified && <Badge color="emerald">verified</Badge>}
                        {bot.is_premium && <Badge color="amber">premium</Badge>}
                        {!bot.is_verified && !bot.is_premium && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setMode({ kind: "edit", bot })}
                          className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                          aria-label={`Редактировать ${bot.name}`}
                        >
                          <Edit className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(bot)}
                          disabled={isDeleting}
                          className="rounded-lg p-2 text-white/70 transition-colors hover:bg-destructive/20 hover:text-red-300 disabled:opacity-50"
                          aria-label={`Удалить ${bot.name}`}
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          ) : (
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {mode.kind !== "idle" && (
        <BotFormModal
          title={mode.kind === "create" ? "Добавить бота" : `Редактировать: ${mode.bot.name}`}
          onClose={() => setMode({ kind: "idle" })}
        >
          <BotForm
            bot={mode.kind === "edit" ? mode.bot : undefined}
            categories={categories}
            onDone={onDone}
          />
        </BotFormModal>
      )}
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <GlassCard className="p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">{icon}</div>
      <div className="font-display text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </GlassCard>
  )
}

function Badge({ color, children }: { color: "emerald" | "amber"; children: React.ReactNode }) {
  const cls =
    color === "emerald"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : "border-amber-500/30 bg-amber-500/10 text-amber-300"
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${cls}`}>
      {children}
    </span>
  )
}

function BotFormModal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center"
    >
      <div className="glass-panel relative w-full max-w-3xl rounded-3xl p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
