# document-service

Microservicio de subida, validacion, almacenamiento y recuperacion de documentos institucionales.

## Stack

- **Framework**: NestJS 11
- **ODM**: Mongoose
- **Base de datos**: MongoDB 7
- **Upload**: Multer
- **Documentacion**: Swagger/OpenAPI

## Puerto

- **Desarrollo**: 3002
- **Docker**: 3002 (interno)

## Endpoints

| Metodo | Endpoint | Descripcion |
|---|---|---|
| POST | /api/v1/document/upload | Subir documento (multipart/form-data) |
| GET | /api/v1/document/:id | Descargar documento |
| GET | /api/v1/document/internship/:internshipId | Documentos de una practica |
| DELETE | /api/v1/document/:id | Eliminar documento |

## Swagger

```
http://localhost:3002/api/docs
```

## Variables de Entorno

```env
MONGO_URI=mongodb://localhost:27017/document_db
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
docker build -t document-service .

# Con Docker Compose (desde la raiz)
docker compose -f docker/docker-compose.yml up document-service
```

## Entidades

### Document

| Campo | Tipo | Descripcion |
|---|---|---|
| _id | ObjectId | Identificador unico MongoDB |
| internship_id | String | ID de la practica asociada |
| document_type | Enum | aval_academico, carta_aceptacion, informe, certificado |
| file_name | String | Nombre original del archivo |
| file_url | String | URL/ruta del archivo almacenado |
| file_size | Number | Tamano del archivo en bytes |
| file_hash | String | Hash SHA-256 del archivo (integridad) |
| version | Number | Version del documento (default: 1) |
| uploaded_by | String | ID del usuario que subio el documento |
| correction_of | ObjectId | Referencia a documento corregido (opcional) |

## Tipos de Documento

| Tipo | Descripcion |
|---|---|
| aval_academico | Aval academico para la practica |
| carta_aceptacion | Carta de aceptacion de la empresa |
| informe | Informe de practicas |
| certificado | Certificado de finalizacion |

## Caracteristicas

- **Integridad**: Cada archivo tiene un hash SHA-256 para verificar que no fue modificado
- **Versionado**: Los documentos mantienen historial de versiones
- **Clasificacion**: Los documentos se clasifican por tipo (aval, carta, informe, certificado)
- **Correccion**: Soporte para documentos de correccion referenciando al original

## Licencia

Proyecto academico — Universidad Central del Ecuador.
