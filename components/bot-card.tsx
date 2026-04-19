import Link from "next/link"
import { CheckCircle, Sparkles, Star, Users } from "lucide-react"
import { GlassCard } from "./glass-card"
import { formatCount } from "@/lib/utils"
import type { BotWithCategory } from "@/lib/types"

export function BotCard({ bot }: { bot: BotWithCategory }) {
  return (
    <Link href={`/bot/${bot.id}`} className="group block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl">
      <GlassCard hoverable className="flex h-full flex-col p-5">
        <div className="relative z-10 mb-4 flex gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-4xl shadow-lg transition-transform duration-300 group-hover:scale-105">
            <span aria-hidden="true">{bot.icon_emoji}</span>
            {bot.is_verified && (
              <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                <CheckCircle className="h-5 w-5 fill-primary/20 text-primary" aria-hidden="true" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="flex items-center gap-2 truncate font-display text-lg font-bold text-white">
              <span className="truncate">{bot.name}</span>
              {bot.is_premium && <Sparkles className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />}
            </h3>
            <p className="mb-1 truncate text-sm font-medium text-primary">@{bot.username}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                <span className="font-medium text-white">{Number(bot.rating).toFixed(1)}</span>
                <span className="opacity-70">({formatCount(bot.review_count)})</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{formatCount(bot.monthly_users)}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">{bot.description}</p>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          {bot.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="whitespace-nowrap rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/80"
            >
              {tag}
            </span>
          ))}
          {bot.tags.length > 3 && (
            <span className="rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/50">
              +{bot.tags.length - 3}
            </span>
          )}
        </div>
      </GlassCard>
    </Link>
  )
}
