# internship-service

Microservicio de gestion de practicas preprofesionales y registro de horas diarias.

## Stack

- **Framework**: NestJS 11
- **ORM**: TypeORM
- **Base de datos**: PostgreSQL 16
- **Documentacion**: Swagger/OpenAPI

## Puerto

- **Desarrollo**: 3001
- **Docker**: 3001 (interno)

## Endpoints

| Metodo | Endpoint | Descripcion |
|---|---|---|
| POST | /api/v1/internship | Crear solicitud de practica |
| GET | /api/v1/internship | Listar todas las practicas |
| GET | /api/v1/internship/:id | Obtener detalle de una practica |
| GET | /api/v1/internship/student/:studentId | Practicas de un estudiante |
| PUT | /api/v1/internship/:id | Actualizar practica |
| DELETE | /api/v1/internship/:id | Eliminar practica |
| POST | /api/v1/internship/:id/hours | Registrar horas diarias |
| GET | /api/v1/internship/:id/hours | Ver horas registradas |
| DELETE | /api/v1/internship/:id/hours/:hourId | Eliminar registro de horas |

## Swagger

```
http://localhost:3001/api/docs
```

## Variables de Entorno

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=user
DB_PASSWORD=pass
DB_NAME=internship_db
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
docker build -t internship-service .

# Con Docker Compose (desde la raiz)
docker compose -f docker/docker-compose.yml up internship-service
```

## Entidades

### Internship

| Campo | Tipo | Descripcion |
|---|---|---|
| id | UUID | Identificador unico |
| student_id | String | ID del estudiante |
| company_name | String | Nombre de la empresa |
| company_address | String | Direccion de la empresa (opcional) |
| start_date | Date | Fecha de inicio |
| end_date | Date | Fecha de fin |
| total_hours_required | Int | Horas requeridas (default: 320) |
| total_hours_completed | Decimal | Horas completadas |
| status | Enum | draft, pending_review, approved, rejected, completed |

### HourLog

| Campo | Tipo | Descripcion |
|---|---|---|
| id | UUID | Identificador unico |
| internship_id | UUID | FK a Internship |
| log_date | Date | Fecha del registro |
| hours | Decimal | Horas registradas |
| description | String | Descripcion de la actividad |
| location_lat | Float | Latitud GPS |
| location_lng | Float | Longitud GPS |
| approved | Boolean | Aprobado por tutor |

## Licencia

Proyecto academico — Universidad Central del Ecuador.
