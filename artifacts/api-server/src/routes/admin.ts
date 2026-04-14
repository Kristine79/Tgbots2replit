import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { db } from "@workspace/db";
import { botsTable, categoriesTable, botViewsTable } from "@workspace/db/schema";
import { eq, sql, gte, and, count, countDistinct } from "drizzle-orm";
import {
  AdminLoginBody,
  AdminLoginResponse,
  CreateBotBody,
  UpdateBotBody,
  UpdateBotResponse,
  DeleteBotResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

// ✅ Требовать обязательную переменную ADMIN_PASSWORD
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  throw new Error(
    "ADMIN_PASSWORD environment variable is required. Please set it before starting the server."
  );
}

const ADMIN_TOKEN = `admin-token-${ADMIN_PASSWORD}`;

// ✅ Rate limiting для защиты от брутфорса (максимум 5 попыток за 15 минут)
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // максимум 5 попыток
  message: "Too many login attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => {
    // Не применяем rate limit для других методов или путей
    return req.method !== "POST";
  },
});

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const token = auth.slice(7);
  if (token !== ADMIN_TOKEN) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
  next();
}

router.post("/admin/login", loginRateLimiter, (req, res) => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid request body" });
    return;
  }
  if (parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ message: "Invalid password" });
    return;
  }
  const response = AdminLoginResponse.parse({
    token: ADMIN_TOKEN,
    message: "Login successful",
  });
  res.json(response);
});

router.post("/admin/bots", requireAdmin, async (req, res) => {
  const parsed = CreateBotBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Validation error: " + parsed.error.message });
    return;
  }

  const data = parsed.data;
  const [cat] = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.id, data.categoryId))
    .limit(1);

  if (!cat) {
    res.status(400).json({ message: "Category not found" });
    return;
  }

  const [bot] = await db
    .insert(botsTable)
    .values({
      username: data.username,
      name: data.name,
      description: data.description,
      category: cat.name,
      categoryId: data.categoryId,
      rating: data.rating,
      reviewCount: data.reviewCount,
      isVerified: data.isVerified,
      isPremium: data.isPremium,
      tags: data.tags,
      monthlyUsers: data.monthlyUsers,
      iconEmoji: data.iconEmoji,
      telegramUrl: data.telegramUrl,
    })
    .returning();

  await db.execute(
    sql`UPDATE categories SET count = count + 1 WHERE id = ${data.categoryId}`
  );

  res.status(201).json(bot);
});

router.put("/admin/bots/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid bot id" });
    return;
  }

  const parsed = UpdateBotBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Validation error: " + parsed.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(botsTable)
    .where(eq(botsTable.id, id))
    .limit(1);

  if (!existing) {
    res.status(404).json({ message: "Bot not found" });
    return;
  }

  const data = parsed.data;
  const [cat] = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.id, data.categoryId))
    .limit(1);

  if (!cat) {
    res.status(400).json({ message: "Category not found" });
    return;
  }

  const [updated] = await db
    .update(botsTable)
    .set({
      username: data.username,
      name: data.name,
      description: data.description,
      category: cat.name,
      categoryId: data.categoryId,
      rating: data.rating,
      reviewCount: data.reviewCount,
      isVerified: data.isVerified,
      isPremium: data.isPremium,
      tags: data.tags,
      monthlyUsers: data.monthlyUsers,
      iconEmoji: data.iconEmoji,
      telegramUrl: data.telegramUrl,
    })
    .where(eq(botsTable.id, id))
    .returning();

  if (existing.categoryId !== data.categoryId) {
    await db.execute(
      sql`UPDATE categories SET count = GREATEST(count - 1, 0) WHERE id = ${existing.categoryId}`
    );
    await db.execute(
      sql`UPDATE categories SET count = count + 1 WHERE id = ${data.categoryId}`
    );
  }

  const response = UpdateBotResponse.parse(updated);
  res.json(response);
});

router.delete("/admin/bots/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid bot id" });
    return;
  }

  const [existing] = await db
    .select()
    .from(botsTable)
    .where(eq(botsTable.id, id))
    .limit(1);

  if (!existing) {
    res.status(404).json({ message: "Bot not found" });
    return;
  }

  await db.delete(botsTable).where(eq(botsTable.id, id));

  await db.execute(
    sql`UPDATE categories SET count = GREATEST(count - 1, 0) WHERE id = ${existing.categoryId}`
  );

  const response = DeleteBotResponse.parse({
    success: true,
    message: "Bot deleted successfully",
  });
  res.json(response);
});

router.get("/admin/stats", requireAdmin, async (_req, res) => {
  const now = new Date();
  const days7ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const days30ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  try {
    // ✅ Оптимизация: Один запрос для получения всех агрегированных данных
    const botsData = await db
      .select({
        botId: botsTable.id,
        botName: botsTable.name,
        botEmoji: botsTable.iconEmoji,
        totalViews: sql<number>`count(${botViewsTable.id})::int`,
        uniqueVisitors: sql<number>`count(distinct ${botViewsTable.ipHash})::int`,
        last7Days: sql<number>`count(case when ${botViewsTable.viewedAt} >= ${days7ago} then 1 end)::int`,
        last30Days: sql<number>`count(case when ${botViewsTable.viewedAt} >= ${days30ago} then 1 end)::int`,
      })
      .from(botsTable)
      .leftJoin(botViewsTable, eq(botViewsTable.botId, botsTable.id))
      .groupBy(botsTable.id, botsTable.name, botsTable.iconEmoji);

    // ✅ Параллельно получаем ежедневные просмотры за 30 дней
    const dailyViews = await db
      .select({
        botId: botViewsTable.botId,
        date: sql<string>`to_char(date_trunc('day', ${botViewsTable.viewedAt}), 'YYYY-MM-DD')`,
        views: sql<number>`count(*)::int`,
      })
      .from(botViewsTable)
      .where(gte(botViewsTable.viewedAt, days30ago))
      .groupBy(botViewsTable.botId, sql`date_trunc('day', ${botViewsTable.viewedAt})`)
      .orderBy(sql`date_trunc('day', ${botViewsTable.viewedAt})`);

    // ✅ Параллельно получаем географический разбор
    const geoBreakdown = await db
      .select({
        botId: botViewsTable.botId,
        country: sql<string>`coalesce(${botViewsTable.country}, 'Неизвестно')`,
        countryCode: sql<string>`coalesce(${botViewsTable.countryCode}, 'XX')`,
        views: sql<number>`count(*)::int`,
      })
      .from(botViewsTable)
      .groupBy(botViewsTable.botId, botViewsTable.country, botViewsTable.countryCode)
      .orderBy(sql`count(*) desc`);

    // ✅ Объединяем данные в one pass (вместо N+1 запросов)
    const result = botsData
      .map((bot) => ({
        botId: bot.botId,
        botName: bot.botName,
        botEmoji: bot.botEmoji,
        totalViews: bot.totalViews,
        uniqueVisitors: bot.uniqueVisitors,
        last7Days: bot.last7Days,
        last30Days: bot.last30Days,
        dailyViews: dailyViews
          .filter((d) => d.botId === bot.botId)
          .map((d) => ({ date: d.date, views: d.views })),
        geoBreakdown: geoBreakdown
          .filter((g) => g.botId === bot.botId)
          .map((g) => ({
            country: g.country,
            countryCode: g.countryCode,
            views: g.views,
          })),
      }))
      .sort((a, b) => b.totalViews - a.totalViews);

    res.json(result);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
