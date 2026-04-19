import { Catalog } from "@/components/catalog"
import { SiteShell } from "@/components/site-shell"
import { getBots, getCategories, getCategoryCounts } from "@/lib/bots"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [bots, categories, categoryCounts] = await Promise.all([
    getBots(),
    getCategories(),
    getCategoryCounts(),
  ])

  return (
    <SiteShell>
      <Catalog bots={bots} categories={categories} categoryCounts={categoryCounts} />
    </SiteShell>
  )
}
