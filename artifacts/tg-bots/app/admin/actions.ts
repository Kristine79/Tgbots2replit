"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

type BotPayload = {
  username: string
  name: string
  description: string
  category_id: number
  rating: number
  review_count: number
  is_verified: boolean
  is_premium: boolean
  tags: string[]
  monthly_users: number
  icon_emoji: string
  telegram_url: string
}

function toNumber(value: FormDataEntryValue | null, fallback = 0): number {
  const n = Number.parseFloat(String(value ?? ""))
  return Number.isFinite(n) ? n : fallback
}

function toInt(value: FormDataEntryValue | null, fallback = 0): number {
  const n = Number.parseInt(String(value ?? ""), 10)
  return Number.isFinite(n) ? n : fallback
}

function parseTags(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
}

function parseForm(formData: FormData): BotPayload {
  return {
    username: String(formData.get("username") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? ""),
    category_id: toInt(formData.get("category_id"), 1),
    rating: Math.max(0, Math.min(5, toNumber(formData.get("rating"), 0))),
    review_count: Math.max(0, toInt(formData.get("review_count"), 0)),
    is_verified: formData.get("is_verified") === "on",
    is_premium: formData.get("is_premium") === "on",
    tags: parseTags(formData.get("tags")),
    monthly_users: Math.max(0, toInt(formData.get("monthly_users"), 0)),
    icon_emoji: String(formData.get("icon_emoji") ?? "🤖").trim() || "🤖",
    telegram_url: String(formData.get("telegram_url") ?? "").trim(),
  }
}

async function assertAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) redirect("/admin/login")
  return supabase
}

export async function createBotAction(formData: FormData) {
  const supabase = await assertAdmin()
  const payload = parseForm(formData)
  if (!payload.username || !payload.name || !payload.telegram_url) {
    return { error: "Пожалуйста, заполни username, название и Telegram URL." }
  }
  const { error } = await supabase.from("bots").insert(payload)
  if (error) return { error: error.message }
  revalidatePath("/admin")
  revalidatePath("/")
  return { ok: true as const }
}

export async function updateBotAction(id: number, formData: FormData) {
  const supabase = await assertAdmin()
  const payload = parseForm(formData)
  const { error } = await supabase.from("bots").update(payload).eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath(`/bot/${id}`)
  return { ok: true as const }
}

export async function deleteBotAction(id: number) {
  const supabase = await assertAdmin()
  const { error } = await supabase.from("bots").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin")
  revalidatePath("/")
  return { ok: true as const }
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}
