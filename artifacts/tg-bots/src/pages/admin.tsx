import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, LogOut, Bot, Search,
  ShieldCheck, Star, Users, CheckCircle, Sparkles,
  BarChart3, Eye, TrendingUp, Calendar, Globe,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  useListBots, useListCategories, useGetBotStats, deleteBot,
  getListBotsQueryKey, getListCategoriesQueryKey,
} from "@workspace/api-client-react";
import type { Bot as BotType } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getAdminToken, clearAdminToken, isAdminLoggedIn } from "@/lib/admin-auth";
import { BotForm } from "@/components/admin/bot-form";

type Tab = "bots" | "stats";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("bots");
  const [search, setSearch] = useState("");
  const [editingBot, setEditingBot] = useState<BotType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<BotType | null>(null);
  const token = getAdminToken();

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const { data: bots, isLoading } = useListBots({ search: search || undefined });
  const { data: categories } = useListCategories();
  const { data: stats, isLoading: isLoadingStats } = useGetBotStats({
    request: { headers: { Authorization: `Bearer ${token}` } },
  });

  const handleLogout = () => {
    clearAdminToken();
    navigate("/");
  };

  const handleDelete = async (bot: BotType) => {
    if (!token) return;
    setDeletingId(bot.id);
    try {
      await deleteBot(bot.id, { headers: { Authorization: `Bearer ${token}` } });
      await queryClient.invalidateQueries({ queryKey: getListBotsQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
      setDeleteConfirm(null);
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormClose = () => { setShowForm(false); setEditingBot(null); };
  const handleFormSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: getListBotsQueryKey() });
    await queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
    handleFormClose();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  if (!isAdminLoggedIn()) return null;

  const totalViews = stats?.reduce((s, b) => s + b.totalViews, 0) ?? 0;
  const uniqueVisitors = stats?.reduce((s, b) => s + (b.uniqueVisitors ?? 0), 0) ?? 0;
  const views7 = stats?.reduce((s, b) => s + b.last7Days, 0) ?? 0;
  const views30 = stats?.reduce((s, b) => s + b.last30Days, 0) ?? 0;
  const topBots = stats?.filter((b) => b.totalViews > 0).slice(0, 10) ?? [];

  // Aggregate geo across all bots
  const geoMap: Record<string, { country: string; countryCode: string; views: number }> = {};
  stats?.forEach((stat) => {
    stat.geoBreakdown?.forEach((geo) => {
      const key = geo.countryCode || "XX";
      if (!geoMap[key]) geoMap[key] = { country: geo.country, countryCode: key, views: 0 };
      geoMap[key].views += geo.views;
    });
  });
  const topGeo = Object.values(geoMap).sort((a, b) => b.views - a.views).slice(0, 10);
  const totalGeoViews = topGeo.reduce((s, g) => s + g.views, 0) || 1;

  function flagEmoji(code: string) {
    if (!code || code === "XX") return "🌍";
    return code.toUpperCase().split("").map((c) => String.fromCodePoint(127397 + c.charCodeAt(0))).join("");
  }

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(circle at 50% 0%, #122040 0%, #080c17 60%)" }}>
      {/* Header */}
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
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm text-muted-foreground hover:text-white transition-all border border-white/10 hover:border-white/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Всего ботов", value: bots?.length ?? "—", icon: Bot, color: "text-primary" },
            { label: "Категорий", value: categories?.length ?? "—", icon: ShieldCheck, color: "text-purple-400" },
            { label: "Проверенных", value: bots?.filter((b) => b.isVerified).length ?? "—", icon: CheckCircle, color: "text-green-400" },
            { label: "Премиум", value: bots?.filter((b) => b.isPremium).length ?? "—", icon: Sparkles, color: "text-amber-400" },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel rounded-2xl p-4 border border-white/10">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
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
            <BarChart3 className="w-4 h-4" />
            Статистика
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* ── BOTS TAB ── */}
          {activeTab === "bots" && (
            <motion.div key="bots" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Поиск ботов..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                  />
                </div>
                <button
                  onClick={() => { setEditingBot(null); setShowForm(true); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(34,158,217,0.3)] hover:shadow-[0_0_25px_rgba(34,158,217,0.5)] whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Добавить бота
                </button>
              </div>

              <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
                {isLoading ? (
                  <div className="p-8 text-center text-muted-foreground">Загрузка...</div>
                ) : bots && bots.length > 0 ? (
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
                        {bots.map((bot) => (
                          <motion.tr
                            key={bot.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
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
                              <div className="flex items-center gap-2 justify-end">
                                <button
                                  onClick={() => { setEditingBot(bot); setShowForm(true); }}
                                  className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-muted-foreground hover:text-white transition-all border border-white/10 hover:border-white/20"
                                  title="Редактировать"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(bot)}
                                  className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all border border-white/10 hover:border-red-500/30"
                                  title="Удалить"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-white font-medium">Боты не найдены</p>
                    <p className="text-muted-foreground text-sm mt-1">Добавьте первого бота</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── STATS TAB ── */}
          {activeTab === "stats" && (
            <motion.div key="stats" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
              {/* Visit summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Всего просмотров", value: totalViews, icon: Eye, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
                  { label: "Уник. посетителей", value: uniqueVisitors, icon: Users, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
                  { label: "За 7 дней", value: views7, icon: Calendar, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
                  { label: "За 30 дней", value: views30, icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
                ].map((card) => (
                  <div key={card.label} className={`glass-panel rounded-2xl p-5 border ${card.bg}`}>
                    <card.icon className={`w-6 h-6 ${card.color} mb-3`} />
                    <div className="text-3xl font-bold text-white mb-1">{isLoadingStats ? "—" : formatNumber(card.value)}</div>
                    <div className="text-sm text-muted-foreground">{card.label}</div>
                  </div>
                ))}
              </div>

              {/* Bar chart — top bots */}
              <div className="glass-panel rounded-2xl border border-white/10 p-6">
                <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Топ ботов по просмотрам (за всё время)
                </h3>
                {isLoadingStats ? (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">Загрузка...</div>
                ) : topBots.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-muted-foreground gap-3">
                    <Eye className="w-10 h-10 opacity-30" />
                    <p className="text-sm">Данные о просмотрах появятся после первых посещений страниц ботов</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={topBots} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <XAxis
                        dataKey="botEmoji"
                        tick={{ fill: "#94a3b8", fontSize: 18 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(15,25,41,0.95)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 12,
                          color: "#fff",
                          fontSize: 13,
                        }}
                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                        formatter={(value: number, _: string, props: any) => [
                          `${value} просм.`,
                          props.payload.botName,
                        ]}
                        labelFormatter={() => ""}
                      />
                      <Bar dataKey="totalViews" radius={[6, 6, 0, 0]}>
                        {topBots.map((_, i) => (
                          <Cell
                            key={i}
                            fill={i === 0 ? "#229ED9" : i === 1 ? "#3b82f6" : i === 2 ? "#6366f1" : "rgba(255,255,255,0.15)"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Geo breakdown */}
              <div className="glass-panel rounded-2xl border border-white/10 p-6">
                <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  География посетителей
                </h3>
                {isLoadingStats ? (
                  <div className="h-32 flex items-center justify-center text-muted-foreground">Загрузка...</div>
                ) : topGeo.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <Globe className="w-8 h-8 opacity-30" />
                    <p className="text-sm">Данные о географии появятся после первых посещений</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {topGeo.map((geo) => {
                      const pct = Math.round((geo.views / totalGeoViews) * 100);
                      return (
                        <div key={geo.countryCode} className="flex items-center gap-3">
                          <span className="text-2xl w-8 shrink-0 text-center">{flagEmoji(geo.countryCode)}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-white truncate">{geo.country}</span>
                              <span className="text-xs text-muted-foreground ml-2 shrink-0">{geo.views} · {pct}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <div
                                className="h-1.5 rounded-full bg-gradient-to-r from-primary to-blue-400 transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Stats table */}
              <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Просмотры по ботам
                  </h3>
                </div>
                {isLoadingStats ? (
                  <div className="p-8 text-center text-muted-foreground">Загрузка...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Бот</th>
                          <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">За 7 дн.</th>
                          <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">За 30 дн.</th>
                          <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Всего</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(stats ?? []).map((stat, i) => {
                          const maxViews = Math.max(...(stats ?? []).map((s) => s.totalViews), 1);
                          const pct = Math.round((stat.totalViews / maxViews) * 100);
                          return (
                            <tr key={stat.botId} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-muted-foreground w-5 text-right shrink-0">{i + 1}</span>
                                  <span className="text-xl">{stat.botEmoji}</span>
                                  <div>
                                    <div className="text-sm font-medium text-white">{stat.botName}</div>
                                    <div className="mt-1 h-1 rounded-full bg-white/5 w-32">
                                      <div
                                        className="h-1 rounded-full bg-primary transition-all"
                                        style={{ width: `${pct}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className={`text-sm font-medium ${stat.last7Days > 0 ? "text-green-400" : "text-muted-foreground"}`}>
                                  {stat.last7Days > 0 ? `+${stat.last7Days}` : "—"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className={`text-sm font-medium ${stat.last30Days > 0 ? "text-amber-400" : "text-muted-foreground"}`}>
                                  {stat.last30Days > 0 ? `+${stat.last30Days}` : "—"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="text-sm font-bold text-white">{stat.totalViews > 0 ? stat.totalViews : "—"}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bot Form Modal */}
      <AnimatePresence>
        {showForm && (
          <BotForm
            bot={editingBot}
            categories={categories ?? []}
            token={token!}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel rounded-2xl p-6 border border-white/10 w-full max-w-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl">
                  {deleteConfirm.iconEmoji}
                </div>
                <div>
                  <h3 className="font-bold text-white">Удалить бота?</h3>
                  <p className="text-muted-foreground text-sm">{deleteConfirm.name}</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-6">
                Это действие необратимо. Бот будет удалён из каталога.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl glass-panel border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deletingId === deleteConfirm.id}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  {deletingId === deleteConfirm.id ? "Удаление..." : "Удалить"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
