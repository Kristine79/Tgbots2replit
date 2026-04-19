"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import type { BotWithCategory, Category } from "@/lib/types"
import { createBotAction, updateBotAction } from "@/app/admin/actions"

export function BotForm({
  bot,
  categories,
  onDone,
}: {
  bot?: BotWithCategory
  categories: Category[]
  onDone: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError(null)
    startTransition(async () => {
      const result = bot ? await updateBotAction(bot.id, formData) : await createBotAction(formData)
      if (result && "error" in result && result.error) {
        setError(result.error)
        return
      }
      onDone()
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Username" id="username">
          <input
            id="username"
            name="username"
            required
            defaultValue={bot?.username ?? ""}
            placeholder="openai_bot"
            className={inputClass}
          />
        </Field>

        <Field label="Название" id="name">
          <input
            id="name"
            name="name"
            required
            defaultValue={bot?.name ?? ""}
            placeholder="OpenAI Assistant"
            className={inputClass}
          />
        </Field>

        <Field label="Telegram URL" id="telegram_url">
          <input
            id="telegram_url"
            name="telegram_url"
            required
            type="url"
            defaultValue={bot?.telegram_url ?? ""}
            placeholder="https://t.me/openai_bot"
            className={inputClass}
          />
        </Field>

        <Field label="Emoji" id="icon_emoji">
          <input
            id="icon_emoji"
            name="icon_emoji"
            defaultValue={bot?.icon_emoji ?? "🤖"}
            maxLength={4}
            className={inputClass}
          />
        </Field>

        <Field label="Категория" id="category_id">
          <select
            id="category_id"
            name="category_id"
            defaultValue={bot?.category_id ?? categories[0]?.id ?? 1}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-card">
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Рейтинг (0-5)" id="rating">
          <input
            id="rating"
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            defaultValue={bot?.rating ?? 5}
            className={inputClass}
          />
        </Field>

        <Field label="Количество отзывов" id="review_count">
          <input
            id="review_count"
            name="review_count"
            type="number"
            min="0"
            defaultValue={bot?.review_count ?? 0}
            className={inputClass}
          />
        </Field>

        <Field label="Пользователей/мес." id="monthly_users">
          <input
            id="monthly_users"
            name="monthly_users"
            type="number"
            min="0"
            defaultValue={bot?.monthly_users ?? 0}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Описание" id="description">
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={bot?.description ?? ""}
          placeholder="Краткое описание бота"
          className={`${inputClass} resize-y`}
        />
      </Field>

      <Field label="Теги (через запятую)" id="tags">
        <input
          id="tags"
          name="tags"
          defaultValue={bot?.tags.join(", ") ?? ""}
          placeholder="ai, productivity, chat"
          className={inputClass}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-white">
          <input
            type="checkbox"
            name="is_verified"
            defaultChecked={bot?.is_verified ?? false}
            className="h-4 w-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary"
          />
          Верифицирован
        </label>
        <label className="flex items-center gap-2 text-sm text-white">
          <input
            type="checkbox"
            name="is_premium"
            defaultChecked={bot?.is_premium ?? false}
            className="h-4 w-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary"
          />
          Премиум
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={onDone}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(34,158,217,0.3)] transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {bot ? "Сохранить" : "Добавить"}
        </button>
      </div>
    </form>
  )
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  )
}
