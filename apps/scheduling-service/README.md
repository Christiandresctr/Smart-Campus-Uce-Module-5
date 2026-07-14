# Scheduling Service

## What is it?
Microservice for managing internship schedules. Allows assigning students to companies with specific days and times, with Redis caching for fast lookups.

## Tech Stack
- **Runtime:** Node.js 20 (NestJS 11)
- **Database:** PostgreSQL 16
- **ORM:** TypeORM
- **Cache:** Redis 7
- **Docs:** Swagger (`/api/docs`)

## Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/schedule` | Create a schedule |
| GET | `/schedule` | List all schedules |
| GET | `/schedule/:id` | Get schedule by ID |
| GET | `/schedule/student/:studentId` | Schedules by student (cached) |
| PATCH | `/schedule/:id` | Update schedule |
| DELETE | `/schedule/:id` | Delete schedule |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| DB_HOST | `localhost` | PostgreSQL host |
| DB_PORT | `5432` | PostgreSQL port |
| DB_USER | `user` | Username |
| DB_PASSWORD | `pass` | Password |
| DB_NAME | `scheduling_db` | Database name |
| REDIS_HOST | `localhost` | Redis host |

## How to run locally

```bash
# 1. Start PostgreSQL
docker run -d -p 5436:5432 --name scheduling-db \
  -e POSTGRES_DB=scheduling_db \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=pass \
  postgres:16-alpine

# 2. Start Redis
docker run -d -p 6379:6379 --name redis redis:7-alpine

# 3. Start service
$env:DB_PORT="5436"; $env:DB_NAME="scheduling_db"; pnpm --filter scheduling-service run start:dev

# 4. Open Swagger
# http://localhost:3008/api/docs
Caching
Schedules by student are cached in Redis for 300 seconds (TTL). Cache is invalidated on create, update, or delete.

Dependencies
scheduling-db (PostgreSQL)
redis (Redis 7)
Tests
pnpm --filter scheduling-service run test