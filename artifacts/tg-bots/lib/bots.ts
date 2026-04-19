import { createClient } from "@/lib/supabase/server"
import type { Bot, BotWithCategory, Category } from "@/lib/types"

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("categories").select("*").order("id", { ascending: true })
  if (error) {
    console.log("[v0] getCategories error:", error.message)
    return []
  }
  return (data ?? []) as Category[]
}

export async function getBots(): Promise<BotWithCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("bots")
    .select("*, category:categories(*)")
    .order("monthly_users", { ascending: false })
  if (error) {
    console.log("[v0] getBots error:", error.message)
    return []
  }
  return (data ?? []) as BotWithCategory[]
}

export async function getBotById(id: number): Promise<BotWithCategory | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("bots")
    .select("*, category:categories(*)")
    .eq("id", id)
    .maybeSingle()
  if (error) {
    console.log("[v0] getBotById error:", error.message)
    return null
  }
  return (data as BotWithCategory) ?? null
}

export async function getCategoryCounts(): Promise<Record<number, number>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("bots").select("category_id")
  if (error) return {}
  const counts: Record<number, number> = {}
  for (const row of (data ?? []) as Pick<Bot, "category_id">[]) {
    counts[row.category_id] = (counts[row.category_id] ?? 0) + 1
  }
  return counts
}
