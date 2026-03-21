import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Save, Loader2 } from "lucide-react";
import { createBot, updateBot } from "@workspace/api-client-react";
import type { Bot, Category } from "@workspace/api-client-react";

interface BotFormProps {
  bot: Bot | null;
  categories: Category[];
  token: string;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_FORM = {
  username: "",
  name: "",
  description: "",
  categoryId: 0,
  rating: 4.5,
  reviewCount: 0,
  isVerified: false,
  isPremium: false,
  tags: "",
  monthlyUsers: 0,
  iconEmoji: "🤖",
  telegramUrl: "",
};

export function BotForm({ bot, categories, token, onClose, onSuccess }: BotFormProps) {
  const isEditing = !!bot;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    if (bot) {
      setForm({
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
    } else {
      setForm({ ...DEFAULT_FORM, categoryId: categories[0]?.id ?? 0 });
    }
  }, [bot, categories]);

  const set = (field: keyof typeof DEFAULT_FORM, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      username: form.username.replace("@", ""),
      name: form.name,
      description: form.description,
      categoryId: Number(form.categoryId),
      rating: Number(form.rating),
      reviewCount: Number(form.reviewCount),
      isVerified: form.isVerified,
      isPremium: form.isPremium,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      monthlyUsers: Number(form.monthlyUsers),
      iconEmoji: form.iconEmoji,
      telegramUrl: form.telegramUrl || `https://t.me/${form.username.replace("@", "")}`,
    };

    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (isEditing && bot) {
        await updateBot(bot.id, payload, { headers });
      } else {
        await createBot(payload, { headers });
      }
      onSuccess();
    } catch (err: any) {
      const msg = err?.message || "Произошла ошибка. Попробуйте снова.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const labelCls = "block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider";
  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 md:pt-16 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-panel rounded-2xl border border-white/10 w-full max-w-2xl mb-8"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="font-bold text-white text-lg">
            {isEditing ? `Редактировать: ${bot?.name}` : "Добавить нового бота"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Row 1: Emoji + Name + Username */}
          <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr_1fr] gap-4">
            <div>
              <label className={labelCls}>Эмодзи</label>
              <input
                type="text"
                value={form.iconEmoji}
                onChange={(e) => set("iconEmoji", e.target.value)}
                className={inputCls + " text-center text-2xl"}
                maxLength={4}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Название</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="ChatGPT"
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Username (@)</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => set("username", e.target.value)}
                placeholder="ChatGPT_Bot"
                className={inputCls}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Описание</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Краткое описание бота..."
              className={inputCls + " min-h-[90px] resize-y"}
              required
            />
          </div>

          {/* Category + Rating + Reviews */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Категория</label>
              <select
                value={form.categoryId}
                onChange={(e) => set("categoryId", Number(e.target.value))}
                className={inputCls + " cursor-pointer"}
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#0f1929]">
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Рейтинг (0–5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) => set("rating", e.target.value)}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Кол-во отзывов</label>
              <input
                type="number"
                min="0"
                value={form.reviewCount}
                onChange={(e) => set("reviewCount", e.target.value)}
                className={inputCls}
                required
              />
            </div>
          </div>

          {/* Monthly Users + Telegram URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Пользователей в месяц</label>
              <input
                type="number"
                min="0"
                value={form.monthlyUsers}
                onChange={(e) => set("monthlyUsers", e.target.value)}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Ссылка на Telegram</label>
              <input
                type="url"
                value={form.telegramUrl}
                onChange={(e) => set("telegramUrl", e.target.value)}
                placeholder="https://t.me/botname"
                className={inputCls}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelCls}>Теги (через запятую)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="AI, Чат, Перевод"
              className={inputCls}
            />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => set("isVerified", !form.isVerified)}
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${form.isVerified ? "bg-primary border-primary" : "border-white/20 bg-white/5 group-hover:border-white/40"}`}
              >
                {form.isVerified && <span className="text-white text-xs font-bold">✓</span>}
              </div>
              <span className="text-sm text-white">Проверен (Verified)</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => set("isPremium", !form.isPremium)}
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${form.isPremium ? "bg-amber-500 border-amber-500" : "border-white/20 bg-white/5 group-hover:border-white/40"}`}
              >
                {form.isPremium && <span className="text-white text-xs font-bold">✓</span>}
              </div>
              <span className="text-sm text-white">Премиум (Premium)</span>
            </label>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl glass-panel border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(34,158,217,0.3)] flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Сохранение...</>
              ) : (
                <><Save className="w-4 h-4" /> {isEditing ? "Сохранить" : "Добавить"}</>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
