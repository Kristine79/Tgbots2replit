import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { createClient } from "@/lib/supabase/server"
import { getBots, getCategories } from "@/lib/bots"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const [bots, categories] = await Promise.all([getBots(), getCategories()])

  return <AdminDashboard bots={bots} categories={categories} userEmail={user.email ?? ""} />
}
