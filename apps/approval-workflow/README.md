# approval-workflow

Microservicio de flujo de aprobacion multinivel para practicas preprofesionales.

## Stack

- **Framework**: NestJS 11
- **ORM**: TypeORM
- **Base de datos**: PostgreSQL 16
- **Message Broker**: RabbitMQ
- **PDF**: PDFKit (con Chromium)
- **Documentacion**: Swagger/OpenAPI

## Puerto

- **Desarrollo**: 3003
- **Docker**: 3003 (interno)

## Endpoints

| Metodo | Endpoint | Descripcion |
|---|---|---|
| POST | /api/v1/approval/start | Iniciar flujo de aprobacion |
| GET | /api/v1/approval | Listar todas las aprobaciones |
| GET | /api/v1/approval/:id | Obtener aprobacion por ID |
| GET | /api/v1/approval/status/:internshipId | Estado por practica |
| PUT | /api/v1/approval/:id/approve | Aprobar (avanza al siguiente paso) |
| PUT | /api/v1/approval/:id/reject | Rechazar |

## Swagger

```
http://localhost:3003/api/docs
```

## Variables de Entorno

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=user
DB_PASSWORD=pass
DB_NAME=approval_db
RABBITMQ_URI=amqp://guest:guest@localhost:5672
```

## Ejecutar

```bash
# Instalar dependencias
pnpm install

# Desarrollo
pnpm run start:dev

# Produccion
pnpm run start:prod
```

## Tests

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Coverage
pnpm run test:cov
```

## Docker

```bash
# Solo el servicio
docker build -t approval-workflow .

# Con Docker Compose (desde la raiz)
docker compose -f docker/docker-compose.yml up approval-workflow
```

## Flujo de Aprobacion

```mermaid
stateDiagram-v2
    [*] --> tutor_pending : Iniciar flujo

    tutor_pending --> coordinator_pending : Tutor aprueba
    tutor_pending --> rejected : Tutor rechaza

    coordinator_pending --> dean_pending : Coordinador aprueba
    coordinator_pending --> rejected : Coordinador rechaza

    dean_pending --> approved : Decano aprueba
    dean_pending --> rejected : Decano rechaza

    rejected --> tutor_pending : Reenviar

    approved --> [*]
```

### Pasos

1. **Tutor** (1er nivel): Revisa la solicitud del estudiante asignado
2. **Coordinador** (2do nivel): Revisa todas las solicitudes de su carrera
3. **Decano** (nivel final): Aprobacion final de la facultad

### Estados

| Estado | Descripcion |
|---|---|
| pending | Esperando revision en el paso actual |
| approved | Aprobado en todos los pasos |
| rejected | Rechazado en algun paso |

## Entidades

### Approval

| Campo | Tipo | Descripcion |
|---|---|---|
| id | UUID | Identificador unico |
| internship_id | UUID | ID de la practica asociada |
| current_step | Enum | tutor, coordinator, dean |
| status | Enum | pending, approved, rejected |
| signatures | JSONB | Firmas digitales por paso |
| metadata | JSONB | Datos adicionales |
| created_at | Timestamp | Fecha de creacion |
| updated_at | Timestamp | Fecha de actualizacion |

### Estructura de signatures

```json
{
  "tutor": {
    "signed_at": "2026-07-14T10:00:00Z",
    "comment": "Aprobado por tutor"
  },
  "coordinator": {
    "signed_at": "2026-07-14T11:00:00Z",
    "comment": "Aprobado por coordinador"
  },
  "dean": {
    "signed_at": "2026-07-14T12:00:00Z",
    "comment": "Aprobado por decano"
  }
}
```

## RabbitMQ

- **Exchange**: `notifications` (topic)
- **Routing Key**: `notification.{userId}`
- **Eventos publicados**: Cuando un paso se aprueba o rechaza, se publica un evento para notificar al siguiente aprobador

## PDF Generation

El servicio genera PDFs con PDFKit para documentos de aprobacion. Requiere Chromium instalado en el contenedor Docker.

## Licencia

Proyecto academico — Universidad Central del Ecuador.
