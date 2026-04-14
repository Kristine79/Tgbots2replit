"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot, Search,
  ShieldCheck, Star, Users, CheckCircle, Sparkles,
  Eye, TrendingUp, Calendar,
} from "lucide-react";
import { bots as allBots, categories as allCategories, type Bot } from "@/lib/mock-data";

type Tab = "bots" | "stats";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("bots");
  const [search, setSearch] = useState("");
  const [bots, setBots] = useState<Bot[]>(allBots);

  const filteredBots = bots.filter(bot => 
    !search || bot.name.toLowerCase().includes(search.toLowerCase()) || 
    bot.username.toLowerCase().includes(search.toLowerCase())
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const handleDelete = (id: number) => {
    setBots(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(circle at 50% 0%, #122040 0%, #080c17 60%)" }}>
      <header className="sticky top-0 z-40 glass-panel border-x-0 border-t-0 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary/80 to-primary flex items-center justify-center shadow-[0_0_15px_rgba(34,158,217,0.4)]">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white">Панель администратора</span>
              <span className="text-muted-foreground text-xs block leading-none">Полезные Боты</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-1.5">
              <Bot className="w-4 h-4" />
              <span className="hidden sm:block">Каталог</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Всего ботов", value: bots.length, icon: Bot, color: "text-primary" },
            { label: "Категорий", value: allCategories.length, icon: ShieldCheck, color: "text-purple-400" },
            { label: "Проверенных", value: bots.filter((b) => b.isVerified).length, icon: CheckCircle, color: "text-green-400" },
            { label: "Премиум", value: bots.filter((b) => b.isPremium).length, icon: Sparkles, color: "text-amber-400" },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel rounded-2xl p-4 border border-white/10">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 mb-6 w-fit">
          <button
            onClick={() => setActiveTab("bots")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === "bots" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"}`}
          >
            <Bot className="w-4 h-4" />
            Боты
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === "stats" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"}`}
          >
            <TrendingUp className="w-4 h-4" />
            Статистика
          </button>
        </div>

        {activeTab === "bots" && (
          <motion.div key="bots" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск ботов..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
              />
            </div>

            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Бот</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Категория</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Рейтинг</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Пользователи</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Статус</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBots.map((bot) => (
                      <tr
                        key={bot.id}
                        className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
                              {bot.iconEmoji}
                            </div>
                            <div>
                              <div className="font-medium text-white text-sm">{bot.name}</div>
                              <div className="text-xs text-primary">@{bot.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">{bot.category}</span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-sm text-white">{bot.rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="w-3.5 h-3.5" />
                            {formatNumber(bot.monthlyUsers)}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            {bot.isVerified && (
                              <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20">Проверен</span>
                            )}
                            {bot.isPremium && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20">Премиум</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete(bot.id)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all border border-white/10 hover:border-red-500/30"
                            title="Удалить"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "stats" && (
          <motion.div key="stats" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Всего просмотров", value: 0, icon: Eye, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
                { label: "Уник. посетителей", value: 0, icon: Users, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
                { label: "За 7 дней", value: 0, icon: Calendar, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
                { label: "За 30 дней", value: 0, icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
              ].map((card) => (
                <div key={card.label} className={`glass-panel rounded-2xl p-5 border ${card.bg}`}>
                  <card.icon className={`w-6 h-6 ${card.color} mb-3`} />
                  <div className="text-3xl font-bold text-white mb-1">{formatNumber(card.value)}</div>
                  <div className="text-sm text-muted-foreground">{card.label}</div>
                </div>
              ))}
            </div>

            <div className="glass-panel rounded-2xl border border-white/10 p-6">
              <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Статистика скоро появится
              </h3>
              <div className="h-64 flex flex-col items-center justify-center text-muted-foreground gap-3">
                <TrendingUp className="w-10 h-10 opacity-30" />
                <p className="text-sm">Для отображения статистики необходима база данных</p>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
