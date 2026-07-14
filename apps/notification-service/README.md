# Notification Service

## What is it?
Microservice for real-time notifications. Allows sending notifications to users via REST API, broadcasting them through WebSocket for instant delivery, and publishing events via RabbitMQ for async processing.

## Tech Stack
- **Runtime:** Node.js 20 (NestJS 11)
- **Database:** MongoDB 7
- **ODM:** Mongoose
- **Message Broker:** RabbitMQ
- **Real-time:** WebSocket (Socket.IO)
- **Docs:** Swagger (`/api/docs`)

## Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/notification` | Create a notification |
| GET | `/notification` | List all notifications |
| GET | `/notification/:id` | Get notification by ID |
| PATCH | `/notification/:id` | Update notification (mark as read) |
| DELETE | `/notification/:id` | Delete notification |

## WebSocket Events

| Event | Direction | Description |
|---|---|---|
| `notification:new` | Server → Client | New notification delivered in real-time |

Clients connect with `?userId=XXX` query parameter.

## RabbitMQ

| Exchange | Routing Key | Description |
|---|---|---|
| `notifications` | `notification.{userId}` | Notification events for async processing |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| MONGO_URI | `mongodb://localhost:27019/notification_db` | MongoDB connection string |
| RABBITMQ_URI | `amqp://guest:guest@localhost:5672` | RabbitMQ connection string |

## How to run locally

```bash
# 1. Start MongoDB
docker run -d -p 27019:27017 --name notification-db mongo:7

# 2. Start RabbitMQ
docker run -d -p 5672:5672 -p 15672:15672 --name rabbitmq rabbitmq:3-management

# 3. Set env and start service
$env:MONGO_URI="mongodb://localhost:27019/notification_db"
pnpm --filter notification-service run start:dev

# 4. Open Swagger
# http://localhost:3005/api/docs