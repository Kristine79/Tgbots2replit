"use client";

import { Star, CheckCircle, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "./ui/glass-card";
import type { Bot } from "@workspace/api-client-react";

export function BotCard({ bot }: { bot: Bot }) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <Link href={`/bot/${bot.id}`} className="block outline-none">
      <GlassCard hoverable className="h-full flex flex-col p-5 group">
        <div className="absolute -inset-2 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 z-0" />
        
        <div className="relative z-10 flex gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl shadow-lg relative shrink-0 group-hover:scale-105 transition-transform duration-300">
            {bot.iconEmoji}
            {bot.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                <CheckCircle className="w-5 h-5 text-primary fill-primary/20" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-lg text-white truncate flex items-center gap-2">
              {bot.name}
              {bot.isPremium && <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />}
            </h3>
            <p className="text-primary text-sm font-medium truncate mb-1">@{bot.username}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-medium text-white">{bot.rating.toFixed(1)}</span>
                <span className="opacity-70">({formatNumber(bot.reviewCount)})</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{formatNumber(bot.monthlyUsers)}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {bot.description}
        </p>

        <div className="flex items-center gap-2 mt-auto overflow-hidden">
          {bot.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-medium text-white/80 whitespace-nowrap">
              {tag}
            </span>
          ))}
          {bot.tags.length > 3 && (
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-medium text-white/50">
              +{bot.tags.length - 3}
            </span>
          )}
        </div>
      </GlassCard>
    </Link>
  );
}
