import { useState } from "react";
import { Search, Filter, Sparkles, TrendingUp, Star, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useListBots, useListCategories } from "@workspace/api-client-react";
import type { ListBotsSortBy } from "@workspace/api-client-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Layout } from "@/components/layout";
import { BotCard } from "@/components/bot-card";
import { GlassCard } from "@/components/ui/glass-card";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<ListBotsSortBy>("popular");

  const { data: categories, isLoading: isLoadingCategories } = useListCategories();
  const { data: bots, isLoading: isLoadingBots } = useListBots({
    search: debouncedSearch || undefined,
    category: selectedCategory,
    sortBy: sortBy
  });

  const sortOptions = [
    { value: "popular", label: "Популярные", icon: TrendingUp },
    { value: "rating", label: "По рейтингу", icon: Star },
    { value: "name", label: "А-Я", icon: Filter },
  ];

  return (
    <Layout>
      {/* Hero Search Section */}
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

      {/* Categories Horizontal Scroll */}
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
          
          {isLoadingCategories ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-32 h-11 rounded-2xl glass-panel animate-pulse" />
            ))
          ) : (
            categories?.map(category => (
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

      {/* Controls Bar */}
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
                onClick={() => setSortBy(option.value as ListBotsSortBy)}
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

      {/* Bots Grid */}
      <AnimatePresence mode="wait">
        {isLoadingBots ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array(6).fill(0).map((_, i) => (
              <GlassCard key={i} className="h-[220px] p-5">
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-white/5 rounded-md w-3/4 animate-pulse" />
                    <div className="h-4 bg-white/5 rounded-md w-1/2 animate-pulse" />
                    <div className="h-3 bg-white/5 rounded-md w-2/3 animate-pulse mt-2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-white/5 rounded-md w-full animate-pulse" />
                  <div className="h-3 bg-white/5 rounded-md w-4/5 animate-pulse" />
                </div>
              </GlassCard>
            ))}
          </motion.div>
        ) : bots && bots.length > 0 ? (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {bots.map((bot, i) => (
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
