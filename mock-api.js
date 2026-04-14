/**
 * Mock API Server для администраторской панели
 * Запустите: node mock-api.js
 */

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock данные
let bots = [
  {
    id: 1,
    username: "@botfather",
    name: "BotFather",
    description: "Создавай Telegram ботов без кода",
    category: "Developer Tools",
    categoryId: 1,
    rating: 4.8,
    reviewCount: 2451,
    isVerified: true,
    isPremium: true,
    tags: ["developer", "bots", "official"],
    monthlyUsers: 5000000,
    iconEmoji: "👨‍🍳",
    telegramUrl: "https://t.me/botfather",
  },
  {
    id: 2,
    username: "@stickers",
    name: "Stickers",
    description: "Реши полиэдры и получай стикеры",
    category: "Entertainment",
    categoryId: 2,
    rating: 4.5,
    reviewCount: 1200,
    isVerified: true,
    isPremium: false,
    tags: ["stickers", "fun", "entertainment"],
    monthlyUsers: 2000000,
    iconEmoji: "🎨",
    telegramUrl: "https://t.me/stickers",
  },
  {
    id: 3,
    username: "@videodownloaderbot",
    name: "Video Downloader",
    description: "Скачивай видео из YouTube, TikTok и Instagram",
    category: "Utilities",
    categoryId: 3,
    rating: 4.2,
    reviewCount: 890,
    isVerified: false,
    isPremium: false,
    tags: ["download", "video", "utility"],
    monthlyUsers: 1500000,
    iconEmoji: "📹",
    telegramUrl: "https://t.me/videodownloaderbot",
  },
];

const categories = [
  { id: 1, name: "Developer Tools", slug: "dev-tools", emoji: "🛠️", count: 45 },
  { id: 2, name: "Entertainment", slug: "entertainment", emoji: "🎬", count: 120 },
  { id: 3, name: "Utilities", slug: "utilities", emoji: "⚙️", count: 89 },
  { id: 4, name: "News & Media", slug: "news", emoji: "📰", count: 67 },
];

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Mock API is running" });
});

// Admin Login
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === "admin2026") {
    res.json({
      token: "admin-token-admin2026",
      message: "Login successful",
    });
  } else {
    res.status(401).json({ message: "Invalid password" });
  }
});

// Get all bots
app.get("/api/admin/stats", (req, res) => {
  // Return stats for all bots
  res.json(
    bots.map((bot) => ({
      botId: bot.id,
      botName: bot.name,
      botEmoji: bot.iconEmoji,
      totalViews: Math.floor(Math.random() * 10000),
      uniqueVisitors: Math.floor(Math.random() * 5000),
      last7Days: Math.floor(Math.random() * 1000),
      last30Days: Math.floor(Math.random() * 5000),
      dailyViews: [
        { date: "2026-04-14", views: Math.floor(Math.random() * 500) },
        { date: "2026-04-13", views: Math.floor(Math.random() * 500) },
        { date: "2026-04-12", views: Math.floor(Math.random() * 500) },
      ],
      geoBreakdown: [
        { country: "Russia", countryCode: "RU", views: Math.floor(Math.random() * 5000) },
        { country: "Ukraine", countryCode: "UA", views: Math.floor(Math.random() * 2000) },
        { country: "USA", countryCode: "US", views: Math.floor(Math.random() * 1000) },
      ],
    }))
  );
});

// Create new bot
app.post("/api/admin/bots", (req, res) => {
  const newBot = {
    id: Math.max(...bots.map((b) => b.id), 0) + 1,
    ...req.body,
    tags: Array.isArray(req.body.tags) ? req.body.tags : [],
  };

  bots.push(newBot);
  console.log("✅ Bot created:", newBot.name);
  res.status(201).json(newBot);
});

// Update bot
app.put("/api/admin/bots/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const botIndex = bots.findIndex((b) => b.id === id);

  if (botIndex === -1) {
    return res.status(404).json({ message: "Bot not found" });
  }

  bots[botIndex] = {
    ...bots[botIndex],
    ...req.body,
    id: bots[botIndex].id, // Don't change ID
    tags: Array.isArray(req.body.tags) ? req.body.tags : bots[botIndex].tags,
  };

  console.log("✏️ Bot updated:", bots[botIndex].name);
  res.json(bots[botIndex]);
});

// Delete bot
app.delete("/api/admin/bots/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const botIndex = bots.findIndex((b) => b.id === id);

  if (botIndex === -1) {
    return res.status(404).json({ message: "Bot not found" });
  }

  const deletedBot = bots.splice(botIndex, 1)[0];
  console.log("🗑️ Bot deleted:", deletedBot.name);

  res.json({
    success: true,
    message: "Bot deleted successfully",
  });
});

// List all bots
app.get("/api/bots", (req, res) => {
  res.json(bots);
});

// Get bot by ID
app.get("/api/bot/:id", (req, res) => {
  const bot = bots.find((b) => b.id === parseInt(req.params.id));
  if (!bot) {
    return res.status(404).json({ message: "Bot not found" });
  }
  res.json(bot);
});

// List categories
app.get("/api/categories", (req, res) => {
  res.json(categories);
});

// Error handling
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`\n📡 Mock API Server запущен на http://localhost:${PORT}`);
  console.log(`\nДоступные endpoints:`);
  console.log(`  POST   /api/admin/login           - Вход`);
  console.log(`  GET    /api/admin/stats           - Статистика`);
  console.log(`  POST   /api/admin/bots            - Создать бота`);
  console.log(`  PUT    /api/admin/bots/:id        - Обновить бота`);
  console.log(`  DELETE /api/admin/bots/:id        - Удалить бота`);
  console.log(`  GET    /api/bots                  - Список ботов`);
  console.log(`  GET    /api/bot/:id               - Получить бота`);
  console.log(`  GET    /api/categories            - Категории`);
  console.log(`\nТестовые учетные данные:`);
  console.log(`  Login:    POST /api/admin/login`);
  console.log(`  Password: admin2026`);
  console.log(`  Token:    admin-token-admin2026\n`);
});
