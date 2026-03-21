import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, LogOut, Bot, Search,
  ShieldCheck, Star, Users, CheckCircle, Sparkles, X
} from "lucide-react";
import {
  useListBots, useListCategories, deleteBot,
  getListBotsQueryKey, getListCategoriesQueryKey,
} from "@workspace/api-client-react";
import type { Bot as BotType, Category } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getAdminToken, clearAdminToken, isAdminLoggedIn } from "@/lib/admin-auth";
import { BotForm } from "@/components/admin/bot-form";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
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

  const handleLogout = () => {
    clearAdminToken();
    navigate("/");
  };

  const handleDelete = async (bot: BotType) => {
    if (!token) return;
    setDeletingId(bot.id);
    try {
      await deleteBot(bot.id, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await queryClient.invalidateQueries({ queryKey: getListBotsQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
      setDeleteConfirm(null);
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBot(null);
  };

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
              <span className="text-muted-foreground text-xs block leading-none">Telegram Боты</span>
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
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Всего ботов", value: bots?.length ?? "—", icon: Bot, color: "text-primary" },
            { label: "Категорий", value: categories?.length ?? "—", icon: ShieldCheck, color: "text-purple-400" },
            { label: "Verified", value: bots?.filter((b) => b.isVerified).length ?? "—", icon: CheckCircle, color: "text-green-400" },
            { label: "Premium", value: bots?.filter((b) => b.isPremium).length ?? "—", icon: Sparkles, color: "text-amber-400" },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel rounded-2xl p-4 border border-white/10">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
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

        {/* Bots Table */}
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
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
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
                            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20">Verified</span>
                          )}
                          {bot.isPremium && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20">Premium</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => { setEditingBot(bot); setShowForm(true); }}
                            className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-all opacity-0 group-hover:opacity-100"
                            title="Редактировать"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(bot)}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
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
