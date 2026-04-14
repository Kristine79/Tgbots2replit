"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot as BotIcon, Search,
  ShieldCheck, Star, Users, CheckCircle, Sparkles,
  Eye, TrendingUp, Calendar, X, Plus, Edit, Loader,
} from "lucide-react";
import { bots as allBots, categories as allCategories, type Bot } from "@/lib/mock-data";

type Tab = "bots" | "stats";

interface BotForm {
  username: string;
  name: string;
  description: string;
  categoryId: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isPremium: boolean;
  tags: string;
  monthlyUsers: number;
  iconEmoji: string;
  telegramUrl: string;
}

const API_URL = "http://localhost:3001/api";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("bots");
  const [search, setSearch] = useState("");
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBotId, setEditingBotId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<BotForm>({
    username: "",
    name: "",
    description: "",
    categoryId: 1,
    rating: 5,
    reviewCount: 0,
    isVerified: false,
    isPremium: false,
    tags: "",
    monthlyUsers: 0,
    iconEmoji: "🤖",
    telegramUrl: "",
  });

  // Загрузить ботов при загрузке компонента
  useEffect(() => {
    const loadBots = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/bots`);
        if (!response.ok) throw new Error("Failed to load bots");
        const data = await response.json();
        setBots(data);
      } catch (err) {
        console.error("Error loading bots:", err);
        setError("Не удалось загрузить ботов. Убедитесь, что API сервер запущен на http://localhost:3001");
        // Fallback to mock data
        setBots(allBots);
      } finally {
        setLoading(false);
      }
    };
    loadBots();
  }, []);

  const filteredBots = bots.filter(bot =>
    !search || bot.name.toLowerCase().includes(search.toLowerCase()) ||
    bot.username.toLowerCase().includes(search.toLowerCase())
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const resetForm = () => {
    setFormData({
      username: "",
      name: "",
      description: "",
      categoryId: 1,
      rating: 5,
      reviewCount: 0,
      isVerified: false,
      isPremium: false,
      tags: "",
      monthlyUsers: 0,
      iconEmoji: "🤖",
      telegramUrl: "",
    });
  };

  const handleAddClick = () => {
    resetForm();
    setEditingBotId(null);
    setShowAddModal(true);
  };

  const handleEditClick = (bot: Bot) => {
    setEditingBotId(bot.id);
    setFormData({
      username: bot.username,
      name: bot.name,
      description: bot.description,
      categoryId: bot.categoryId,
      rating: bot.rating,
      reviewCount: bot.reviewCount,
      isVerified: bot.isVerified,
      isPremium: bot.isPremium,
      tags: bot.tags.join(", "),
      monthlyUsers: bot.monthlyUsers,
      iconEmoji: bot.iconEmoji,
      telegramUrl: bot.telegramUrl,
    });
    setShowEditModal(true);
  };

  const handleSaveBot = async () => {
    if (!formData.name || !formData.username) {
      alert("Пожалуйста, заполните название и username");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map(t => t.trim()).filter(t => t),
        category: allCategories.find(c => c.id === formData.categoryId)?.name || "Other",
      };

      let response;
      if (editingBotId) {
        // Обновить существующего бота
        response = await fetch(`${API_URL}/admin/bots/${editingBotId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Создать нового бота
        response = await fetch(`${API_URL}/admin/bots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save bot");
      }

      // Перезагрузить список ботов
      const botsResponse = await fetch(`${API_URL}/bots`);
      if (botsResponse.ok) {
        const data = await botsResponse.json();
        setBots(data);
      }

      setShowAddModal(false);
      setShowEditModal(false);
      resetForm();
      alert(editingBotId ? "✅ Бот успешно обновлен" : "✅ Бот успешно добавлен");
    } catch (err) {
      console.error("Error saving bot:", err);
      alert("❌ Ошибка при сохранении бота");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этого бота?")) return;

    try {
      const response = await fetch(`${API_URL}/admin/bots/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete bot");
      }

      // Перезагрузить список ботов
      const botsResponse = await fetch(`${API_URL}/bots`);
      if (botsResponse.ok) {
        const data = await botsResponse.json();
        setBots(data);
      }

      alert("✅ Бот успешно удален");
    } catch (err) {
      console.error("Error deleting bot:", err);
      alert("❌ Ошибка при удалении бота");
    }
  };

  const BotFormModal = ({ isOpen, isEditing }: { isOpen: boolean; isEditing: boolean }) => {
    if (!isOpen) return null;

    const onClose = isEditing ? () => setShowEditModal(false) : () => setShowAddModal(false);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="glass-panel rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 glass-panel border-b border-white/10 p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {isEditing ? "✏️ Редактировать бота" : "➕ Добавить нового бота"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Emoji & Username Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Emoji Иконка</label>
                <input
                  type="text"
                  maxLength={2}
                  value={formData.iconEmoji}
                  onChange={(e) => setFormData({ ...formData, iconEmoji: e.target.value })}
                  placeholder="🤖"
                  disabled={isSubmitting}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="@mybotname"
                  disabled={isSubmitting}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Name & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Название</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Bot"
                  disabled={isSubmitting}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Категория</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                  disabled={isSubmitting}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                >
                  {allCategories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-slate-900">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Описание бота..."
                disabled={isSubmitting}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none disabled:opacity-50"
              />
            </div>

            {/* Rating & Reviews */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Рейтинг (0-5)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  disabled={isSubmitting}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Количество отзывов</label>
                <input
                  type="number"
                  min="0"
                  value={formData.reviewCount}
                  onChange={(e) => setFormData({ ...formData, reviewCount: parseInt(e.target.value) })}
                  disabled={isSubmitting}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Users & Telegram URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Пользователей в месяц</label>
                <input
                  type="number"
                  min="0"
                  value={formData.monthlyUsers}
                  onChange={(e) => setFormData({ ...formData, monthlyUsers: parseInt(e.target.value) })}
                  disabled={isSubmitting}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Telegram URL</label>
                <input
                  type="url"
                  value={formData.telegramUrl}
                  onChange={(e) => setFormData({ ...formData, telegramUrl: e.target.value })}
                  placeholder="https://t.me/..."
                  disabled={isSubmitting}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Теги (через запятую)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="utility, fun, productivity"
                disabled={isSubmitting}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
              />
            </div>

            {/* Status Checkboxes */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isVerified}
                  onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                  disabled={isSubmitting}
                  className="w-4 h-4 rounded border-white/20 disabled:opacity-50"
                />
                <span className="text-sm text-white">✓ Проверен</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPremium}
                  onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                  disabled={isSubmitting}
                  className="w-4 h-4 rounded border-white/20 disabled:opacity-50"
                />
                <span className="text-sm text-white">⭐ Премиум</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 glass-panel border-t border-white/10 p-6 flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              onClick={handleSaveBot}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>{isEditing ? "💾 Сохранить" : "➕ Добавить"}</>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
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
              <BotIcon className="w-4 h-4" />
              <span className="hidden sm:block">Каталог</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
          >
            ⚠️ {error}
          </motion.div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Всего ботов", value: bots.length, icon: BotIcon, color: "text-primary" },
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

        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 w-fit">
            <button
              onClick={() => setActiveTab("bots")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === "bots" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"}`}
            >
              <BotIcon className="w-4 h-4" />
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
            <button
              onClick={handleAddClick}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70 transition-all font-medium shadow-[0_0_15px_rgba(34,158,217,0.3)] disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Добавить бота
            </button>
          )}
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
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm disabled:opacity-50"
              />
            </div>

            {loading ? (
              <div className="glass-panel rounded-2xl border border-white/10 p-12 flex flex-col items-center justify-center gap-4">
                <Loader className="w-8 h-8 text-primary animate-spin" />
                <p className="text-muted-foreground">Загрузка ботов...</p>
              </div>
            ) : (
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
                      {filteredBots.length > 0 ? (
                        filteredBots.map((bot) => (
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
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditClick(bot)}
                                  className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 text-muted-foreground hover:text-blue-400 transition-all border border-white/10 hover:border-blue-500/30"
                                  title="Редактировать"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(bot.id)}
                                  className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all border border-white/10 hover:border-red-500/30"
                                  title="Удалить"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                            Нет ботов для отображения
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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

      {/* Modals */}
      <BotFormModal isOpen={showAddModal} isEditing={false} />
      <BotFormModal isOpen={showEditModal} isEditing={true} />
    </div>
  );
}
