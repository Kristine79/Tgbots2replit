#!/usr/bin/env node

/**
 * Тесты для админ панели
 * Требует запущенный сервер на http://localhost:3000
 *
 * Запуск: node test-admin-panel.js
 */

const base = 'http://localhost:3000/api';
const ADMIN_PASSWORD = 'admin2026';
const VALID_TOKEN = `admin-token-${ADMIN_PASSWORD}`;

// ANSI цвета для вывода
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
};

let testsPassed = 0;
let testsFailed = 0;

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logTest(name) {
  log(`\n${colors.bold}[TEST] ${name}${colors.reset}`);
}

function logSuccess(message = 'Passed') {
  testsPassed++;
  log(`  ✓ ${message}`, colors.green);
}

function logError(message) {
  testsFailed++;
  log(`  ✗ ${message}`, colors.red);
}

function logInfo(message) {
  log(`  ℹ ${message}`, colors.blue);
}

// Запросы
async function request(method, endpoint, body = null, headers = {}) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${base}${endpoint}`, options);
    const data = await response.json().catch(() => ({}));

    return {
      status: response.status,
      ok: response.ok,
      data,
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
    };
  }
}

// Тесты
async function runTests() {
  log('\n╔════════════════════════════════════════════╗', colors.bold);
  log('║     Admin Panel Integration Tests         ║', colors.bold);
  log('╚════════════════════════════════════════════╝', colors.bold);

  logInfo(`Target: ${base}`);
  logInfo(`Testing admin-token validation and endpoints\n`);

  // 1. Health check
  logTest('1. Health Check');
  const health = await request('GET', '/health');
  if (health.ok) {
    logSuccess(`Server is running (${health.status})`);
  } else {
    logError(`Server not responding or health check failed (${health.status})`);
    log(`\nℹ️  Hint: Make sure the API server is running on port 3000`, colors.yellow);
    log(`   Command: PORT=3000 node --enable-source-maps ./artifacts/api-server/dist/index.mjs`, colors.yellow);
    log(`   Note: Requires DATABASE_URL environment variable set\n`, colors.yellow);
    process.exit(1);
  }

  // 2. Admin Login - Success
  logTest('2. Admin Login - Valid Password');
  const loginValid = await request('POST', '/admin/login', {
    password: ADMIN_PASSWORD,
  });

  if (loginValid.status === 200 && loginValid.data.token) {
    logSuccess(`Login successful with correct password`);
    logInfo(`Token received: ${loginValid.data.token.substring(0, 20)}...`);
  } else {
    logError(`Expected 200 status, got ${loginValid.status}`);
    logInfo(`Response: ${JSON.stringify(loginValid.data)}`);
  }

  // 3. Admin Login - Wrong Password
  logTest('3. Admin Login - Invalid Password');
  const loginInvalid = await request('POST', '/admin/login', {
    password: 'wrongpassword',
  });

  if (loginInvalid.status === 401) {
    logSuccess(`Correctly rejected invalid password (401)`);
  } else {
    logError(`Expected 401 status, got ${loginInvalid.status}`);
  }

  // 4. Admin Login - Bad Request
  logTest('4. Admin Login - Missing Password');
  const loginBad = await request('POST', '/admin/login', {});

  if (loginBad.status === 400) {
    logSuccess(`Correctly rejected malformed request (400)`);
  } else {
    logError(`Expected 400 status, got ${loginBad.status}`);
  }

  // 5. Admin Stats - Without Token
  logTest('5. Admin Stats - No Authentication');
  const statsNoAuth = await request('GET', '/admin/stats');

  if (statsNoAuth.status === 401) {
    logSuccess(`Correctly rejected request without token (401)`);
  } else {
    logError(`Expected 401 status, got ${statsNoAuth.status}`);
  }

  // 6. Admin Stats - With Invalid Token
  logTest('6. Admin Stats - Invalid Token');
  const statsInvalidToken = await request('GET', '/admin/stats', null, {
    'Authorization': 'Bearer invalid-token-123',
  });

  if (statsInvalidToken.status === 401) {
    logSuccess(`Correctly rejected invalid token (401)`);
  } else {
    logError(`Expected 401 status, got ${statsInvalidToken.status}`);
  }

  // 7. Admin Stats - With Valid Token
  logTest('7. Admin Stats - Valid Token');
  const statsValid = await request('GET', '/admin/stats', null, {
    'Authorization': `Bearer ${VALID_TOKEN}`,
  });

  if (statsValid.status === 200 && Array.isArray(statsValid.data)) {
    logSuccess(`Successfully retrieved stats (${statsValid.data.length} bots)`);
    if (statsValid.data.length > 0) {
      logInfo(`Example bot: ${statsValid.data[0].botName} - ${statsValid.data[0].totalViews} views`);
    }
  } else {
    if (statsValid.error?.includes('DATABASE_URL')) {
      logInfo(`Database not configured (expected in dev)`);
    } else {
      logError(`Expected 200 status, got ${statsValid.status}`);
    }
  }

  // 8. Authorization Header Variations
  logTest('8. Authorization - Bearer Token Format');
  const statsBearerFormat = await request('GET', '/admin/stats', null, {
    'Authorization': `Bearer ${VALID_TOKEN}`,
  });

  if (statsBearerFormat.status !== 401) {
    logSuccess(`Accepts Bearer token format`);
  } else {
    logError(`Failed to accept Bearer token format`);
  }

  logTest('9. Authorization - No Bearer Prefix');
  const statsNoBearer = await request('GET', '/admin/stats', null, {
    'Authorization': VALID_TOKEN,
  });

  if (statsNoBearer.status === 401) {
    logSuccess(`Correctly requires "Bearer" prefix (401)`);
  } else {
    logError(`Expected 401 status without "Bearer", got ${statsNoBearer.status}`);
  }

  // 10. Create Bot - Valid Request Structure
  logTest('10. Admin Bot CRUD - Token Auth Validation');
  const createBotNoAuth = await request('POST', '/admin/bots', {
    username: '@testbot',
    name: 'Test Bot',
    description: 'A test bot',
    categoryId: 1,
    rating: 4.5,
    reviewCount: 10,
    isVerified: false,
    isPremium: false,
    tags: ['test'],
    monthlyUsers: 1000,
    iconEmoji: '🤖',
    telegramUrl: 'https://t.me/testbot',
  });

  if (createBotNoAuth.status === 401) {
    logSuccess(`Bot creation requires authentication (401)`);
  } else {
    logError(`Expected 401 status for unauthenticated POST, got ${createBotNoAuth.status}`);
  }

  logTest('11. Admin Bot CRUD - Protected Endpoints');
  const deleteBotNoAuth = await request('DELETE', '/admin/bots/1');

  if (deleteBotNoAuth.status === 401) {
    logSuccess(`Bot deletion requires authentication (401)`);
  } else {
    logError(`Expected 401 status for unauthenticated DELETE, got ${deleteBotNoAuth.status}`);
  }

  // Summary
  log('\n╔════════════════════════════════════════════╗', colors.bold);
  log('║              Test Summary                 ║', colors.bold);
  log('╚════════════════════════════════════════════╝', colors.bold);

  const total = testsPassed + testsFailed;
  const passRate = ((testsPassed / total) * 100).toFixed(1);

  log(`\nTests Passed: ${testsPassed}/${total}`, testsFailed === 0 ? colors.green : colors.yellow);
  log(`Pass Rate: ${passRate}%\n`);

  if (testsFailed > 0) {
    log(`Tests Failed: ${testsFailed}/${total}`, colors.red);
    process.exit(1);
  } else {
    log('✓ All tests passed!', colors.green);
    process.exit(0);
  }
}

// Запуск
runTests().catch(error => {
  log(`\n❌ Unexpected error: ${error.message}`, colors.red);
  process.exit(1);
});
