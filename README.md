# Spring AI E-Commerce Assistant

A production-grade e-commerce backend built with **Java 17**, **Spring Boot 3.3**, **Spring AI** (OpenAI function calling), **PostgreSQL**, and **Redis**. Includes a lightweight React frontend for demo purposes.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│               React Frontend (Vite)              │
│  Products │ Cart │ Orders │ AI Chat              │
└──────────────────┬──────────────────────────────┘
                   │ HTTP / REST
┌──────────────────▼──────────────────────────────┐
│          Spring Boot 3.3 REST API                │
│                                                  │
│  ProductController  CartController               │
│  OrderController    AiAssistantController        │
│                                                  │
│  Services ──→ Repositories ──→ PostgreSQL        │
│  CartService ──────────────→  Redis              │
│  AiAssistantService ──→ OpenAI (GPT-4o-mini)     │
│    └── searchProducts()  function calling        │
│    └── getProductDetails() function calling      │
│                                                  │
│  Resilience4j circuit breaker on AI calls        │
│  Flyway migrations │ Spring Cache (Redis)        │
└─────────────────────────────────────────────────┘
```

---

## Features

| Area | Details |
|---|---|
| **Product Catalog** | Full CRUD, pagination, search by keyword / category / price range |
| **Shopping Cart** | Redis-backed per-user cart with TTL, stock validation |
| **Order Management** | Atomic stock decrement, status lifecycle, cart-to-order checkout |
| **AI Assistant** | Spring AI + OpenAI function calling — searches live product data |
| **Resilience** | Resilience4j circuit breaker with graceful fallback on AI failures |
| **Validation** | Jakarta Bean Validation on all request DTOs |
| **Error Handling** | `@RestControllerAdvice` with structured JSON error responses |
| **API Docs** | Swagger UI at `/swagger-ui.html` |
| **Database** | Flyway migrations, JPA with PostgreSQL, optimized indexes |
| **Security** | Spring Security stateless config, CORS enabled for frontend |
| **Testing** | Mockito unit tests (services), MockMvc controller tests |
| **Docker** | Multi-stage Dockerfile, `docker-compose.yml` with health checks |

---

## Quick Start

### Option A — Docker Compose (recommended)

```bash
# 1. Copy and fill in your OpenAI key
cp .env.example .env
# OPENAI_API_KEY=sk-...

# 2. Start everything
docker-compose up -d

# 3. API is live at http://localhost:8080
# 4. Swagger UI: http://localhost:8080/swagger-ui.html
```

### Option B — Local development

**Prerequisites:** Java 17, Maven 3.9+, PostgreSQL 15+, Redis 7+

```bash
# 1. Create database
psql -U postgres -c "CREATE USER ecommerce_user WITH PASSWORD 'ecommerce_pass';"
psql -U postgres -c "CREATE DATABASE ecommerce_db OWNER ecommerce_user;"

# 2. Set environment variables (or edit application.yml)
export OPENAI_API_KEY=sk-...
export DB_USERNAME=ecommerce_user
export DB_PASSWORD=ecommerce_pass

# 3. Run the application
mvn spring-boot:run

# 4. Start frontend (separate terminal)
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## API Reference

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all (paginated) |
| GET | `/api/products/{id}` | Get by ID |
| GET | `/api/products/search?keyword=&categoryId=&minPrice=&maxPrice=` | Search |
| GET | `/api/products/latest` | 10 newest products |
| POST | `/api/products` | Create |
| PUT | `/api/products/{id}` | Update |
| DELETE | `/api/products/{id}` | Delete |

### Cart (Redis-backed)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart/{userId}` | Get cart |
| POST | `/api/cart/{userId}/items` | Add item |
| PUT | `/api/cart/{userId}/items/{productId}?quantity=` | Update quantity |
| DELETE | `/api/cart/{userId}/items/{productId}` | Remove item |
| DELETE | `/api/cart/{userId}` | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order from cart |
| GET | `/api/orders/{id}` | Get order |
| GET | `/api/orders/user/{userId}` | User's order history |
| PATCH | `/api/orders/{id}/status?status=` | Update status |

### AI Assistant
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Chat with AI — uses function calling to query products |

**Example AI chat request:**
```json
POST /api/ai/chat
{
  "message": "I'm looking for wireless headphones under $100. What do you have?",
  "sessionId": "optional-session-id"
}
```

---

## Key Design Decisions

**Why Redis for cart?**  
Carts are ephemeral, user-scoped, and read-heavy. Redis gives O(1) access with automatic TTL expiry (24h), eliminating abandoned cart cleanup jobs.

**Why Spring AI function calling?**  
Instead of hardcoding product data into the prompt, the AI calls `searchProducts()` and `getProductDetails()` at inference time. This means the AI always works with live, accurate data from the database.

**Why Resilience4j circuit breaker on AI?**  
OpenAI API calls can fail or be slow. The circuit breaker trips after 50% failure rate and returns a graceful fallback response, keeping the rest of the app healthy.

**Why Flyway?**  
Schema changes are versioned, reproducible, and auditable — critical for team environments and CI/CD pipelines.

---

## Running Tests

```bash
mvn test
```

Tests include:
- `ProductServiceTest` — unit tests with Mockito
- `CartServiceTest` — unit tests with mocked RedisTemplate
- `OrderServiceTest` — stock decrement, empty cart, status transition edge cases
- `ProductControllerTest` — MockMvc with validation and error response assertions

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | *(required)* | Your OpenAI API key |
| `DB_USERNAME` | `ecommerce_user` | PostgreSQL username |
| `DB_PASSWORD` | `ecommerce_pass` | PostgreSQL password |
| `REDIS_HOST` | `localhost` | Redis hostname |
| `REDIS_PORT` | `6379` | Redis port |

---

## Tech Stack

- **Java 17** + **Spring Boot 3.3.2**
- **Spring AI 1.0.0** — OpenAI integration with function calling
- **Spring Data JPA** + **Hibernate** — ORM layer
- **PostgreSQL 16** — primary data store
- **Redis 7** — cart cache, Spring Cache L2
- **Flyway** — database migrations
- **Resilience4j** — circuit breaker pattern
- **Springdoc OpenAPI** — Swagger UI
- **Lombok** — boilerplate reduction
- **JUnit 5** + **Mockito** — testing

---

## Project Structure

```
src/main/java/com/maxwell/ecommerce/
├── EcommerceApplication.java
├── ai/                     # Spring AI function calling beans
├── config/                 # Redis, Security, CORS, OpenAPI
├── controller/             # REST controllers (5)
├── dto/
│   ├── request/            # Validated input DTOs
│   └── response/           # Output DTOs
├── exception/              # Custom exceptions + GlobalExceptionHandler
├── model/                  # JPA entities
├── repository/             # Spring Data repositories
└── service/                # Business logic (5 services)
```
