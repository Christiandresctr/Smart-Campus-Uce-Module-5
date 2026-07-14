# Audit Log Service

## What is it?
Microservice for event auditing and logging. Records all actions performed across the system (create, update, delete) for compliance and traceability.

## Tech Stack
- **Runtime:** Node.js 20 (NestJS 11)
- **Database:** MongoDB 7
- **ODM:** Mongoose
- **Docs:** Swagger (`/api/docs`)

## Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/audit` | Create an audit log entry |
| GET | `/audit` | List all audit logs |
| GET | `/audit/:id` | Get audit log by ID |
| GET | `/audit/entity/:entity` | Logs by entity type |
| DELETE | `/audit/:id` | Delete audit log |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| MONGO_URI | `mongodb://localhost:27018/audit_db` | MongoDB connection string |

## How to run locally

```bash
# 1. Start MongoDB
docker run -d -p 27018:27017 --name audit-db mongo:7

# 2. Start service
pnpm --filter audit-log-service run start:dev

# 3. Open Swagger
# http://localhost:3007/api/docs