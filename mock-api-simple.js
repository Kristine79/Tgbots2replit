/**
 * Mock API Server для администраторской панели
 * Использует встроенные модули Node.js - зависимости не требуются
 * Запустите: node mock-api-simple.js
 */

const http = require("http");
const url = require("url");

const PORT = 3001;

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
  {
    id: 4,
    username: "@alertokens_bot",
    name: "Alert tokens",
    description: "Мониторинг и оповещения о токенах",
    category: "IT",
    categoryId: 11,
    rating: 5.0,
    reviewCount: 1000,
    isVerified: true,
    isPremium: true,
    tags: ["tokens", "alerts", "monitoring"],
    monthlyUsers: 1000,
    iconEmoji: "🔔",
    telegramUrl: "https://t.me/alertokens_bot",
  },
  {
    id: 5,
    username: "@WifiFreeMap_bot",
    name: "Карта WI-FI Калужской области",
    description: "Найди бесплатные точки WI-FI в Калужской области",
    category: "Путешествия",
    categoryId: 9,
    rating: 4.9,
    reviewCount: 500,
    isVerified: true,
    isPremium: true,
    tags: ["wifi", "map", "kaluga", "free"],
    monthlyUsers: 500,
    iconEmoji: "📶",
    telegramUrl: "https://t.me/WifiFreeMap_bot",
  },
  {
    id: 6,
    username: "@barcodegeneratorfree_bot",
    name: "Генератор QR кодов",
    description: "Создавай QR коды бесплатно и быстро",
    category: "IT",
    categoryId: 11,
    rating: 4.8,
    reviewCount: 500,
    isVerified: true,
    isPremium: false,
    tags: ["qr", "barcode", "generator", "free"],
    monthlyUsers: 500,
    iconEmoji: "📱",
    telegramUrl: "https://t.me/barcodegeneratorfree_bot",
  },
  {
    id: 7,
    username: "@cheapQuickVpn_bot",
    name: "Быстрый VPN",
    description: "Быстрый и надежный VPN сервис",
    category: "AI & Нейросети",
    categoryId: 1,
    rating: 4.5,
    reviewCount: 100,
    isVerified: true,
    isPremium: false,
    tags: ["vpn", "security", "fast"],
    monthlyUsers: 100,
    iconEmoji: "🔒",
    telegramUrl: "https://t.me/cheapQuickVpn_bot",
  },
  {
    id: 8,
    username: "@qrcodeauto_bot",
    name: "CarQR - цифровая визитка для авто",
    description: "Цифровая визитка для вашего автомобиля",
    category: "AI & Нейросети",
    categoryId: 1,
    rating: 4.5,
    reviewCount: 50,
    isVerified: false,
    isPremium: false,
    tags: ["car", "qr", "business-card", "auto"],
    monthlyUsers: 50,
    iconEmoji: "🚗",
    telegramUrl: "https://t.me/qrcodeauto_bot",
  },
  {
    id: 9,
    username: "@avtovikupkaluga_bot",
    name: "Автовыкуп Калуга, Тула, Обнинск",
    description: "Скупка автомобилей в Калуге, Туле и Обнинске",
    category: "Бизнес",
    categoryId: 12,
    rating: 4.0,
    reviewCount: 25,
    isVerified: false,
    isPremium: false,
    tags: ["cars", "buyout", "kaluga", "tula", "obninsk"],
    monthlyUsers: 25,
    iconEmoji: "🚘",
    telegramUrl: "https://t.me/avtovikupkaluga_bot",
  },
];

const categories = [
  { id: 1, name: "AI & Нейросети", slug: "ai", emoji: "🤖", count: 6 },
  { id: 2, name: "Продуктивность", slug: "productivity", emoji: "⚡", count: 4 },
  { id: 3, name: "Развлечения", slug: "entertainment", emoji: "🎮", count: 2 },
  { id: 4, name: "Новости", slug: "news", emoji: "📰", count: 2 },
  { id: 5, name: "Финансы", slug: "finance", emoji: "💰", count: 2 },
  { id: 6, name: "Образование", slug: "education", emoji: "📚", count: 2 },
  { id: 7, name: "Музыка", slug: "music", emoji: "🎵", count: 2 },
  { id: 8, name: "Шопинг", slug: "shopping", emoji: "🛍️", count: 3 },
  { id: 9, name: "Путешествия", slug: "travel", emoji: "✈️", count: 3 },
  { id: 10, name: "Здоровье", slug: "health", emoji: "💪", count: 2 },
  { id: 11, name: "IT", slug: "it", emoji: "💻", count: 3 },
  { id: 12, name: "Бизнес", slug: "business", emoji: "💼", count: 1 },
];

// Helper function for JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

// Helper function to parse request body
function parseBody(req, callback) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    try {
      callback(body ? JSON.parse(body) : {});
    } catch (e) {
      callback({});
    }
  });
}

// Create server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  console.log(`${new Date().toISOString()} ${method} ${pathname}`);

  // Handle OPTIONS for CORS
  if (method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  // Health check
  if (pathname === "/api/health" && method === "GET") {
    return sendJSON(res, 200, { status: "ok", message: "Mock API is running" });
  }

  // Admin Login
  if (pathname === "/api/admin/login" && method === "POST") {
    return parseBody(req, (data) => {
      if (data.password === "admin2026") {
        sendJSON(res, 200, {
          token: "admin-token-admin2026",
          message: "Login successful",
        });
      } else {
        sendJSON(res, 401, { message: "Invalid password" });
      }
    });
  }

  // Get all bots
  if (pathname === "/api/bots" && method === "GET") {
    return sendJSON(res, 200, bots);
  }

  // Get bot by ID
  if (pathname.match(/^\/api\/bot\/\d+$/)) {
    const id = parseInt(pathname.split("/").pop());
    const bot = bots.find((b) => b.id === id);
    if (bot) {
      return sendJSON(res, 200, bot);
    } else {
      return sendJSON(res, 404, { message: "Bot not found" });
    }
  }

  // Create bot
  if (pathname === "/api/admin/bots" && method === "POST") {
    return parseBody(req, (data) => {
      const newBot = {
        id: Math.max(...bots.map((b) => b.id), 0) + 1,
        ...data,
        tags: Array.isArray(data.tags) ? data.tags : [],
      };
      bots.push(newBot);
      console.log("✅ Bot created:", newBot.name);
      sendJSON(res, 201, newBot);
    });
  }

  // Update bot
  if (pathname.match(/^\/api\/admin\/bots\/\d+$/) && method === "PUT") {
    const id = parseInt(pathname.split("/").pop());
    const botIndex = bots.findIndex((b) => b.id === id);

    if (botIndex === -1) {
      return sendJSON(res, 404, { message: "Bot not found" });
    }

    return parseBody(req, (data) => {
      bots[botIndex] = {
        ...bots[botIndex],
        ...data,
        id: bots[botIndex].id,
        tags: Array.isArray(data.tags) ? data.tags : bots[botIndex].tags,
      };
      console.log("✏️ Bot updated:", bots[botIndex].name);
      sendJSON(res, 200, bots[botIndex]);
    });
  }

  // Delete bot
  if (pathname.match(/^\/api\/admin\/bots\/\d+$/) && method === "DELETE") {
    const id = parseInt(pathname.split("/").pop());
    const botIndex = bots.findIndex((b) => b.id === id);

    if (botIndex === -1) {
      return sendJSON(res, 404, { message: "Bot not found" });
    }

    const deletedBot = bots.splice(botIndex, 1)[0];
    console.log("🗑️ Bot deleted:", deletedBot.name);
    sendJSON(res, 200, {
      success: true,
      message: "Bot deleted successfully",
    });
  }

  // Get stats
  if (pathname === "/api/admin/stats") {
    return sendJSON(
      res,
      200,
      bots.map((bot) => ({
        botId: bot.id,
        botName: bot.name,
        botEmoji: bot.iconEmoji,
        totalViews: Math.floor(Math.random() * 10000),
        uniqueVisitors: Math.floor(Math.random() * 5000),
        last7Days: Math.floor(Math.random() * 1000),
        last30Days: Math.floor(Math.random() * 5000),
      }))
    );
  }

  // List categories
  if (pathname === "/api/categories") {
    return sendJSON(res, 200, categories);
  }

  // 404
  sendJSON(res, 404, { message: "Not found" });
});

server.listen(PORT, () => {
  console.log(`\n📡 Mock API Server запущен на http://localhost:${PORT}`);
  console.log(`\nДоступные endpoints:`);
  console.log(`  GET    /api/health                - Проверка статуса`);
  console.log(`  POST   /api/admin/login           - Вход`);
  console.log(`  GET    /api/bots                  - Список ботов`);
  console.log(`  GET    /api/bot/:id               - Получить бота`);
  console.log(`  POST   /api/admin/bots            - Создать бота`);
  console.log(`  PUT    /api/admin/bots/:id        - Обновить бота`);
  console.log(`  DELETE /api/admin/bots/:id        - Удалить бота`);
  console.log(`  GET    /api/admin/stats           - Статистика`);
  console.log(`  GET    /api/categories            - Категории`);
  console.log(`\nТестовые учетные данные:`);
  console.log(`  Login:    POST /api/admin/login`);
  console.log(`  Password: admin2026`);
  console.log(`  Token:    admin-token-admin2026\n`);
});
