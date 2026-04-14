# Admin Panel - Quick Reference

## 🚀 Quick Start

```bash
# 1. Run tests (no server needed)
node test-admin-panel.js

# 2. Start server
DATABASE_URL="postgresql://..." PORT=3000 npm start

# 3. Test endpoints
curl -X POST http://localhost:3000/api/admin/login \
  -H 'Content-Type: application/json' \
  -d '{"password":"admin2026"}'
```

---

## 📍 Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /admin/login | ❌ | Get token |
| GET | /admin/stats | ✅ | View stats |
| POST | /admin/bots | ✅ | Create bot |
| PUT | /admin/bots/:id | ✅ | Update bot |
| DELETE | /admin/bots/:id | ✅ | Delete bot |

---

## 🔐 Auth

```javascript
// 1. Get token
POST /admin/login
{ "password": "admin2026" }
→ { "token": "admin-token-admin2026" }

// 2. Use token
Authorization: Bearer admin-token-admin2026
```

---

## 🎯 Default Credentials

- **Password**: `admin2026` (from env: `ADMIN_PASSWORD`)
- **Token Format**: `admin-token-{password}`

---

## ⚠️ Known Issues

| Issue | Severity | Status |
|-------|----------|--------|
| N+1 SQL queries | 🔴 High | Needs fix |
| No rate limiting | 🔴 High | Needs fix |
| Password in code | 🟡 Medium | Should fix |
| No audit logs | 🟡 Medium | Should add |
| Token not hashed | 🟡 Medium | Should fix |

---

## 📁 Test Files Created

1. **ADMIN_PANEL_TEST_REPORT.md** - Full analysis
2. **test-admin-panel.js** - Automated tests
3. **ADMIN_PANEL_CURL_EXAMPLES.sh** - curl examples
4. **admin-panel-postman.json** - Postman collection
5. **ADMIN_PANEL_CHECK_SUMMARY.md** - Executive summary

---

## ✅ What Works

- ✅ Basic CRUD operations
- ✅ Token-based authentication
- ✅ Protected endpoints
- ✅ Request validation (Zod schemas)
- ✅ Category counter management
- ✅ Bot statistics aggregation

---

## ⚠️ What Needs Attention

- ⚠️ Performance optimization (N+1 queries)
- ⚠️ Security hardening (rate limit, hashing)
- ⚠️ Audit logging
- ⚠️ Environment variable validation
- ⚠️ Unique constraints

---

## 🔍 Test Coverage

- 11 integration tests included
- Tests check: auth, validation, errors, responses
- Run with: `node test-admin-panel.js`
- Requires server on http://localhost:3000

---

## 📊 Status Summary

| Category | Status |
|----------|--------|
| **Functionality** | ✅ Works |
| **Security** | ⚠️ Needs work |
| **Performance** | ⚠️ Needs optimization |
| **Production Ready** | ❌ Not yet |

---

**Last Updated**: April 14, 2026
