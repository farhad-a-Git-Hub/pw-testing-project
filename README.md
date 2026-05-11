# Playwright E2E Test Automation Framework — OWASP Juice Shop

A scalable, type-safe test automation framework built with **Playwright** and **TypeScript**, targeting the [OWASP Juice Shop](https://pwning.owasp-juice.shop/) application. Designed to grow from API validation into a full end-to-end solution covering UI flows and database integrity checks.

---

## Architecture

### Fluent Interface / Request Builder Pattern

The core of the framework is a `RequestHandler` class built on a **fluent interface design**. Each configuration method returns `this`, enabling method chaining that reads like a domain-specific language rather than imperative setup code.

```typescript
await api
  .url('http://localhost:3000')
  .path('/api/Products')
  .params({ q: 'lemon' })
  .headers({ Authorization: `Bearer ${token}` })
  .get();
```

This pattern keeps test code declarative, reduces boilerplate, and isolates HTTP concerns from test logic.

### Fixture-Based Dependency Injection

Playwright's `test.extend()` is used to inject a pre-configured `RequestHandler` instance into every spec file via a custom `api` fixture. Tests never instantiate framework classes directly — the fixture layer owns that responsibility.

```typescript
// fixture.ts
export const test = base.extend<{ api: RequestHandler }>({
  api: async ({}, use) => {
    await use(new RequestHandler());
  }
});
```

---

## Project Structure

```
├── tests/                   # Test spec files
├── utils/
│   └── request-handler.ts   # Core fluent API client
├── fixtures/
│   └── fixture.ts           # Playwright fixture definitions
├── data/                    # Test payloads and constants
├── playwright.config.ts     # Global config (baseURL, timeouts, reporters)
└── README.md
```

---

## Target Application

**OWASP Juice Shop** running locally via Docker on `http://localhost:3000`

Exposes:
- REST API endpoints (`/api/*`, `/rest/*`)
- Browser UI
- SQLite database (accessible via Docker)

---

## API Coverage

| Category | Method | Endpoint | Description |
|---|---|---|---|
| Products | GET | `/api/Products` | Retrieve all products |
| Products | GET | `/api/Products/:id` | Get specific product |
| Products | GET | `/rest/products/search?q=` | Search products by keyword |
| Comments | POST | `/api/Comments` | Add a comment to a product |
| Feedback | POST | `/api/Feedbacks` | Submit user feedback |
| Feedback | DELETE | `/api/Feedbacks/:id` | Delete a feedback entry |

---

## Setup & Execution

**Prerequisites:** Node.js, Docker (for Juice Shop)

```bash
# Start Juice Shop
docker run -d -p 3000:3000 bkimminich/juice-shop

# Install dependencies
npm install

# Run all tests
npx playwright test

# Run specific suite
npx playwright test tests/smokeTest.spec.ts

# View HTML report
npx playwright show-report
```

---

## Roadmap

### In Progress
- [x] `RequestHandler` — fluent API client (url, path, params, headers, body)
- [x] Custom Playwright fixtures (`api`)
- [x] URL builder with default base URL fallback
- [ ] HTTP methods on `RequestHandler` (GET, POST, PUT, DELETE)
- [ ] Response wrapper (status code, body, headers)

### Planned — API Layer
- [ ] Schema validation with **AJV** (JSON Schema-based response shape assertions)
- [ ] Structured logger (request/response logging per test)
- [ ] Auth helper (login flow, token extraction, header injection)
- [ ] Centralized test data management
- [ ] *(Enhancement)* Migrate schema validation from AJV to **Zod** for native TypeScript type inference

### Planned — UI Layer
- [ ] Page Object Model (POM) structure
- [ ] Playwright browser fixtures
- [ ] UI smoke tests for core Juice Shop flows

### Planned — Database Layer
- [ ] SQLite connection utility (Docker exec or direct driver)
- [ ] DB query helper for post-API data integrity checks
- [ ] E2E assertions: API action → DB state verification

### Planned — Infrastructure
- [ ] GitHub Actions CI pipeline
- [ ] Environment config (`.env` support, multi-env targeting)
- [ ] Playwright HTML + Allure reporting

---

## Design Decisions

**Why fluent interface?**
Keeps test setup readable and composable. Adding or removing a header/param is a single chained call, not a separate configuration object mutation.

**Why AJV for schema validation (initial)?**
AJV validates against JSON Schema — a widely adopted standard that maps directly to API contracts and OpenAPI specs. It's explicit, fast, and framework-agnostic. Chosen as the first implementation for its low setup cost and portability.

**Why migrate to Zod later?**
Zod is native TypeScript — schemas double as type definitions via `z.infer<>`, eliminating duplicate interface declarations and giving compile-time safety alongside runtime validation. Planned as an enhancement once the validation layer is established.

**Why fixture-based DI over direct instantiation?**
Fixtures guarantee consistent setup and teardown, enforce separation of concerns, and make it trivial to swap implementations (e.g., authenticated vs unauthenticated client) without touching test code.

---

## Notes

- Juice Shop intentionally contains vulnerabilities — do not expose the Docker instance outside localhost.
- Default base URL: `http://localhost:3000` (overridable via `RequestHandler.url()`)
