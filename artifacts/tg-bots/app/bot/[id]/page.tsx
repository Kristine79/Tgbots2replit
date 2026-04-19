import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Info,
  LayoutGrid,
  Sparkles,
  Star,
  Users,
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { SiteShell } from "@/components/site-shell"
import { getBotById } from "@/lib/bots"
import { formatCount } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function BotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const botId = Number.parseInt(id, 10)
  if (!Number.isFinite(botId)) notFound()

  const bot = await getBotById(botId)
  if (!bot) notFound()

  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            <span>Назад к каталогу</span>
          </Link>
        </div>

        <div className="relative mb-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]"
          />

          <GlassCard className="relative z-10 flex flex-col items-center gap-8 p-6 text-center sm:flex-row sm:items-start sm:p-10 sm:text-left">
            <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 text-7xl shadow-2xl sm:h-40 sm:w-40">
              <span aria-hidden="true">{bot.icon_emoji}</span>
              {bot.is_verified && (
                <div className="absolute -bottom-2 -right-2 rounded-full bg-background p-1 shadow-lg">
                  <CheckCircle className="h-8 w-8 fill-primary/20 text-primary" aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="mb-3 flex flex-col justify-center gap-3 sm:flex-row sm:items-center sm:gap-4 sm:justify-start">
                <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {bot.name}
                </h1>
                {bot.is_premium && (
                  <span className="mx-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-3 py-1 text-sm font-semibold text-amber-400 sm:mx-0">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Премиум
                  </span>
                )}
              </div>

              <p className="mb-6 text-xl font-medium text-primary">@{bot.username}</p>

              <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium sm:justify-start sm:gap-8">
                <Stat
                  icon={<Star className="h-5 w-5 fill-amber-400 text-amber-400" aria-hidden="true" />}
                  value={Number(bot.rating).toFixed(1)}
                  label={`${formatCount(bot.review_count)} отзывов`}
                />
                <div className="hidden h-8 w-px bg-white/10 sm:block" />
                <Stat
                  icon={<Users className="h-5 w-5 text-blue-400" aria-hidden="true" />}
                  value={formatCount(bot.monthly_users)}
                  label="польз./мес."
                />
                <div className="hidden h-8 w-px bg-white/10 sm:block" />
                <Stat
                  icon={<LayoutGrid className="h-5 w-5 text-sky-300" aria-hidden="true" />}
                  value={bot.category?.name ?? "—"}
                  label="категория"
                />
              </div>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto">
              <a
                href={bot.telegram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-[0_0_20px_rgba(34,158,217,0.4)] transition-all hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(34,158,217,0.6)] active:scale-95 sm:w-auto"
              >
                Открыть в Telegram
                <ExternalLink className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href={`${bot.telegram_url}?startgroup=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 font-medium text-white transition-colors hover:bg-white/[0.08] sm:w-auto"
              >
                Добавить в группу
              </a>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-8 md:col-span-2">
            <GlassCard className="p-6 sm:p-8">
              <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-white">
                <Info className="h-5 w-5 text-primary" aria-hidden="true" />
                О боте
              </h2>
              <p className="whitespace-pre-wrap text-base leading-relaxed text-muted-foreground sm:text-lg">
                {bot.description}
              </p>
            </GlassCard>
          </div>

          <div className="space-y-8">
            <GlassCard className="p-6">
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Теги
              </h3>
              <div className="flex flex-wrap gap-2">
                {bot.tags.length === 0 && (
                  <span className="text-sm text-muted-foreground">Нет тегов</span>
                )}
                {bot.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="border-t-primary/30 bg-gradient-to-b from-primary/10 to-transparent p-6">
              <h3 className="mb-2 flex items-center gap-2 font-display font-semibold text-white">
                <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
                Совет
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Добавь бота в свою группу, чтобы открыть функции для совместной работы.
              </p>
              <a
                href={`${bot.telegram_url}?startgroup=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-xl bg-white/10 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-white/20"
              >
                Добавить в группу
              </a>
            </GlassCard>
          </div>
        </div>
      </div>
    </SiteShell>
  )
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">{icon}</div>
      <div className="flex flex-col text-left">
        <span className="mb-1 text-base leading-none text-white">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}
