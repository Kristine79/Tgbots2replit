import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import { botsTable, categoriesTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";
import {
  AdminLoginBody,
  AdminLoginResponse,
  CreateBotBody,
  UpdateBotBody,
  UpdateBotResponse,
  DeleteBotResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin2026";
const ADMIN_TOKEN = `admin-token-${ADMIN_PASSWORD}`;

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

router.post("/admin/login", (req, res) => {
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
  const id = parseInt(req.params.id);
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
  const id = parseInt(req.params.id);
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

export default router;
