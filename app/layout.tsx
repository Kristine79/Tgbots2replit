import type { Metadata, Viewport } from "next"
import { Inter, Outfit } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter", display: "swap" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" })

export const metadata: Metadata = {
  title: "Лучшие Telegram Боты — Каталог 2026",
  description:
    "Открывай полезных Telegram-ботов 2026. AI, продуктивность, финансы, развлечения и многое другое — в одном каталоге.",
}

export const viewport: Viewport = {
  themeColor: "#080c17",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${outfit.variable} bg-background`}>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
