"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Filter, Search, Sparkles, Star, TrendingUp, X } from "lucide-react"
import { BotCard } from "./bot-card"
import type { BotWithCategory, Category } from "@/lib/types"

type SortBy = "popular" | "rating" | "name"

export function Catalog({
  bots,
  categories,
  categoryCounts,
}: {
  bots: BotWithCategory[]
  categories: Category[]
  categoryCounts: Record<number, number>
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | undefined>(undefined)
  const [sortBy, setSortBy] = useState<SortBy>("popular")

  const filteredBots = useMemo(() => {
    let result = bots.slice()

    if (selectedCategorySlug) {
      const cat = categories.find((c) => c.slug === selectedCategorySlug)
      if (cat) result = result.filter((b) => b.category_id === cat.id)
    }

    const term = searchTerm.trim().toLowerCase()
    if (term) {
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(term) ||
          b.username.toLowerCase().includes(term) ||
          b.description.toLowerCase().includes(term) ||
          b.tags.some((t) => t.toLowerCase().includes(term)),
      )
    }

    switch (sortBy) {
      case "rating":
        result.sort((a, b) => Number(b.rating) - Number(a.rating))
        break
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name, "ru"))
        break
      case "popular":
      default:
        result.sort((a, b) => b.monthly_users - a.monthly_users)
    }

    return result
  }, [bots, categories, searchTerm, selectedCategorySlug, sortBy])

  const sortOptions: { value: SortBy; label: string; icon: typeof TrendingUp }[] = [
    { value: "popular", label: "Популярные", icon: TrendingUp },
    { value: "rating", label: "По рейтингу", icon: Star },
    { value: "name", label: "А-Я", icon: Filter },
  ]

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 mt-4 flex flex-col items-center text-center"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          <span>Полезные боты из Telegram 2026</span>
        </div>

        <h1 className="mb-6 text-balance font-display text-4xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 md:text-6xl">
          Прокачай свой <br className="hidden md:block" />
          <span className="text-glow bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Telegram до предела
          </span>
        </h1>

        <p className="mb-8 max-w-2xl text-pretty text-muted-foreground md:text-lg">
          Живой каталог ботов: поиск, фильтрация по категориям и открытие в Telegram в один клик.
        </p>

        <div className="relative w-full max-w-2xl">
          <div className="glass-panel relative flex items-center rounded-2xl p-2 transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">
            <Search className="ml-3 h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="bot-search" className="sr-only">
              Поиск ботов
            </label>
            <input
              id="bot-search"
              type="text"
              placeholder="Поиск ботов, категорий или ключевых слов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border-none bg-transparent px-4 py-3 text-white placeholder:text-muted-foreground/70 focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="mr-2 flex items-center gap-1 rounded-xl p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Очистить</span>
              </button>
            )}
          </div>
        </div>
      </motion.section>

      <div className="relative mb-8">
        <div className="hide-scrollbar -mx-4 flex items-center gap-3 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
          <button
            type="button"
            onClick={() => setSelectedCategorySlug(undefined)}
            className={`flex-shrink-0 rounded-2xl border px-5 py-2.5 font-medium transition-all duration-300 ${
              selectedCategorySlug === undefined
                ? "border-primary bg-primary text-white shadow-[0_0_15px_rgba(34,158,217,0.4)]"
                : "glass-panel border-white/10 text-muted-foreground hover:text-white"
            }`}
          >
            Все боты
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategorySlug(category.slug)}
              className={`flex flex-shrink-0 items-center gap-2 rounded-2xl border px-5 py-2.5 font-medium transition-all duration-300 ${
                selectedCategorySlug === category.slug
                  ? "border-primary bg-primary text-white shadow-[0_0_15px_rgba(34,158,217,0.4)]"
                  : "glass-panel border-white/10 text-muted-foreground hover:text-white"
              }`}
            >
              <span aria-hidden="true">{category.emoji}</span>
              <span>{category.name}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  selectedCategorySlug === category.slug ? "bg-white/20" : "bg-white/5"
                }`}
              >
                {categoryCounts[category.id] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="font-display text-xl font-semibold text-white">
          {searchTerm
            ? "Результаты поиска"
            : selectedCategorySlug
              ? "Боты категории"
              : "Популярные боты"}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            {filteredBots.length}
          </span>
        </h2>

        <div
          role="tablist"
          aria-label="Сортировка"
          className="hide-scrollbar flex items-center gap-2 self-stretch overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-1 sm:self-auto"
        >
          {sortOptions.map((option) => {
            const Icon = option.icon
            const active = sortBy === option.value
            return (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSortBy(option.value)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="whitespace-nowrap">{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {filteredBots.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBots.map((bot, i) => (
            <motion.div
              key={bot.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 12) * 0.04 }}
            >
              <BotCard bot={bot} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <Search className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="mb-2 font-display text-xl font-semibold text-white">Боты не найдены</h3>
          <p className="max-w-md text-muted-foreground">
            Попробуй другие ключевые слова или выбери другую категорию.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("")
              setSelectedCategorySlug(undefined)
            }}
            className="mt-6 rounded-xl border border-primary/20 bg-primary/10 px-6 py-3 font-medium text-primary transition-colors hover:bg-primary/20"
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </>
  )
}
