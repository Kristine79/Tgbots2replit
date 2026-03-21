import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { botsTable, categoriesTable } from "@workspace/db/schema";
import { ilike, eq, desc, asc, sql } from "drizzle-orm";
import {
  ListBotsResponse,
  GetBotResponse,
  ListCategoriesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/bots", async (req, res) => {
  const { category, search, sortBy } = req.query as {
    category?: string;
    search?: string;
    sortBy?: string;
  };

  let query = db.select().from(botsTable).$dynamic();

  if (category) {
    const cat = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.slug, category))
      .limit(1);
    if (cat.length > 0) {
      query = query.where(eq(botsTable.categoryId, cat[0].id));
    }
  }

  if (search) {
    query = query.where(
      sql`(${botsTable.name} ILIKE ${"%" + search + "%"} OR ${botsTable.description} ILIKE ${"%" + search + "%"} OR ${botsTable.username} ILIKE ${"%" + search + "%"})`
    );
  }

  if (sortBy === "name") {
    query = query.orderBy(asc(botsTable.name));
  } else if (sortBy === "popular") {
    query = query.orderBy(desc(botsTable.monthlyUsers));
  } else {
    query = query.orderBy(desc(botsTable.rating));
  }

  const bots = await query;
  const parsed = ListBotsResponse.parse(bots);
  res.json(parsed);
});

router.get("/bots/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid bot id" });
    return;
  }

  const [bot] = await db
    .select()
    .from(botsTable)
    .where(eq(botsTable.id, id))
    .limit(1);

  if (!bot) {
    res.status(404).json({ message: "Bot not found" });
    return;
  }

  const parsed = GetBotResponse.parse(bot);
  res.json(parsed);
});

router.get("/categories", async (_req, res) => {
  const categories = await db
    .select()
    .from(categoriesTable)
    .orderBy(asc(categoriesTable.name));

  const parsed = ListCategoriesResponse.parse(categories);
  res.json(parsed);
});

export default router;
