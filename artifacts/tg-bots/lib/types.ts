export type Category = {
  id: number
  name: string
  slug: string
  emoji: string
}

export type Bot = {
  id: number
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
  created_at: string
  updated_at: string
}

export type BotWithCategory = Bot & {
  category: Category | null
}
