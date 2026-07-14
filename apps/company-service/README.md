# Company Service

## What is it?
Microservice for managing companies that participate in the internship program. Handles company registration, contact info, and partnership status.

## Tech Stack
- **Runtime:** Node.js 20 (NestJS 11)
- **Database:** PostgreSQL 16
- **ORM:** TypeORM
- **Docs:** Swagger (`/api/docs`)

## Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/company` | Create a company |
| GET | `/company` | List all companies |
| GET | `/company/:id` | Get company by ID |
| PATCH | `/company/:id` | Update company |
| DELETE | `/company/:id` | Delete company |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| DB_HOST | `localhost` | PostgreSQL host |
| DB_PORT | `5432` | Port |
| DB_USER | `user` | Username |
| DB_PASSWORD | `pass` | Password |
| DB_NAME | `company_db` | Database name |

## How to run locally

```bash
# 1. Start PostgreSQL
docker run -d -p 5435:5432 --name company-db \
  -e POSTGRES_DB=company_db \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=pass \
  postgres:16-alpine

# 2. Start service
pnpm --filter company-service run start:dev

# 3. Open Swagger
# http://localhost:3006/api/docs