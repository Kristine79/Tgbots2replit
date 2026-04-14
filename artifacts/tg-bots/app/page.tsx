"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Sparkles, TrendingUp, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { categories, bots as allBots, type Bot } from "@/lib/mock-data";
import { Layout } from "@/components/layout";
import { BotCard } from "@/components/bot-card";
import { GlassCard } from "@/components/ui/glass-card";

type SortBy = "popular" | "rating" | "name";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortBy>("popular");

  const filteredBots = useMemo(() => {
    let result = [...allBots];

    if (selectedCategory) {
      const cat = categories.find(c => c.slug === selectedCategory);
      if (cat) {
        result = result.filter(bot => bot.categoryId === cat.id);
      }
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(bot =>
        bot.name.toLowerCase().includes(term) ||
        bot.description.toLowerCase().includes(term) ||
        bot.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "popular":
      default:
        result.sort((a, b) => b.monthlyUsers - a.monthlyUsers);
    }

    return result;
  }, [searchTerm, selectedCategory, sortBy]);

  const sortOptions: { value: SortBy; label: string; icon: typeof TrendingUp }[] = [
    { value: "popular", label: "Популярные", icon: TrendingUp },
    { value: "rating", label: "По рейтингу", icon: Star },
    { value: "name", label: "А-Я", icon: Filter },
  ];

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center mb-12 mt-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Полезные боты из Telegram 2026</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-6 leading-tight">
          Прокачай свой <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 text-glow">Telegram до предела</span>
        </h1>
        
        <div className="w-full max-w-2xl relative group">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center glass-panel rounded-2xl p-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
            <Search className="w-6 h-6 text-muted-foreground ml-3" />
            <input 
              type="text"
              placeholder="Поиск ботов, категорий или ключевых слов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none text-white px-4 py-3 focus:outline-none focus:ring-0 placeholder:text-muted-foreground/70"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="p-2 mr-2 rounded-xl hover:bg-white/10 text-muted-foreground transition-colors"
              >
                Очистить
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="mb-8 relative">
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-2xl font-medium transition-all duration-300 border ${
              selectedCategory === undefined 
                ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(34,158,217,0.4)]' 
                : 'glass-panel text-muted-foreground hover:text-white'
            }`}
          >
            Все боты
          </button>
          
          {(
            categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-2xl font-medium flex items-center gap-2 transition-all duration-300 border ${
                  selectedCategory === category.slug
                    ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(34,158,217,0.4)]'
                    : 'glass-panel text-muted-foreground hover:text-white'
                }`}
              >
                <span>{category.emoji}</span>
                <span>{category.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedCategory === category.slug ? 'bg-white/20' : 'bg-white/5'
                }`}>
                  {category.count}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-display font-semibold text-white">
          {searchTerm ? 'Результаты поиска' : selectedCategory ? 'Боты категории' : 'Популярные боты'}
        </h2>
        
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 self-stretch sm:self-auto overflow-x-auto hide-scrollbar">
          {sortOptions.map(option => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  sortBy === option.value 
                    ? 'bg-white/10 text-white shadow-sm' 
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredBots.length > 0 ? (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredBots.map((bot, i) => (
              <motion.div
                key={bot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <BotCard bot={bot} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-20 text-center flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-4 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-semibold text-white mb-2">Боты не найдены</h3>
            <p className="text-muted-foreground max-w-md">
              Не удалось найти боты по вашему запросу. Попробуйте другие ключевые слова или выберите другую категорию.
            </p>
            <button 
              onClick={() => { setSearchTerm(""); setSelectedCategory(undefined); }}
              className="mt-6 px-6 py-3 rounded-xl bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors border border-primary/20"
            >
              Сбросить фильтры
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
