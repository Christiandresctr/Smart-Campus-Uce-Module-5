# Smart Campus UCE — Módulo 5

Vinculación con la Sociedad y Prácticas Preprofesionales

## 📋 Descripción

Sistema de gestión de prácticas preprofesionales que permite a los estudiantes solicitar, documentar y dar seguimiento a sus prácticas, con flujo de aprobación multinivel, registro de horas y evaluación.

## 🏗️ Arquitectura — Monorepo

Proyecto gestionado con **pnpm workspaces** como monorepo.
smart-campus-uce-modulo5/ ├── apps/ │ ├── internship-service/ # NestJS + PostgreSQL │ └── document-service/ # NestJS + MongoDB ├── libs/ │ └── shared-types/ ├── pnpm-workspace.yaml ├── package.json └── README.md


### Comandos del monorepo

```bash
# Ejecutar todos los servicios en paralelo
pnpm run dev

# Construir todos los servicios
pnpm run build

# Ejecutar pruebas de todos los servicios
pnpm run test

# Listar servicios del monorepo
pnpm ls -r --depth -1

🚀 Microservicio 1: internship-service
Stack: NestJS + PostgreSQL + TypeORM + Swagger

Responsabilidad: Gestión de prácticas preprofesionales y registro de horas diarias.

Endpoints
Método	Endpoint	                            Descripción
POST	/api/v1/internship	                    Crear solicitud de práctica
GET	    /api/v1/internship	                    Listar todas las prácticas
GET	    /api/v1/internship/{id} 	            Obtener detalle de una práctica
GET	    /api/v1/internship/student/{studentId}	Listar prácticas de un estudiante
PUT	    /api/v1/internship/{id}	                Actualizar datos de una práctica
DELETE	/api/v1/internship/{id}	                Eliminar una práctica
POST	/api/v1/internship/{id}/hours	        Registrar horas diarias
GET	    /api/v1/internship/{id}/hours	        Ver horas registradas
DELETE	/api/v1/internship/{id}/hours/{hourId}	Eliminar registro de horas

Swagger
http://localhost:3001/api/docs

Variables de entorno
DB_HOST=localhost
DB_PORT=5432
DB_USER=user
DB_PASSWORD=pass
DB_NAME=internship_db

Ejecutar
cd apps/internship-service
pnpm run start

🚀 Microservicio 2: document-service

Stack: NestJS + MongoDB + Mongoose + Swagger + Multer
Responsabilidad: Subida, validación, almacenamiento y recuperación de documentos institucionales.

Endpoints
Método	Endpoint	                                Descripción
POST	/api/v1/document/upload	                    Subir documento (multipart/form-data)
GET	    /api/v1/document/{id}	                    Descargar un documento
GET	    /api/v1/document/internship/{internshipId}	Listar documentos de una práctica
DELETE	/api/v1/document/{id}	                    Eliminar un documento

Swagger
http://localhost:3002/api/docs

Variables de entorno
MONGO_URI=mongodb://localhost:27017/document_db

Ejecutar
cd apps/document-service
pnpm run start

🐳 Docker Compose
Para ejecutar ambos servicios con sus bases de datos:

docker compose -f docker/docker-compose.yml up -d
Servicios incluidos:

internship-db — PostgreSQL 16 (puerto 5432)
document-db — MongoDB 7 (puerto 27017)
internship-service — NestJS (puerto 3001)
document-service — NestJS (puerto 3002)

🧪 Pruebas
# Unitarias (Jest)
pnpm test

# End-to-end (Supertest)
pnpm run test:e2e

🔄 CI/CD

GitHub Actions
CI: Build + Test en cada push y PR (.github/workflows/ci.yml)
Deploy: Build Docker → Push a Docker Hub → Deploy SSH a AWS EC2 (.github/workflows/deploy.yml)
Ambientes
Rama	Ambiente AWS	Propósito
dev	Account 1 (Dev)	Desarrollo
test	Account 2 (QA)	Validación
main	Account 3 (Prod)	Producción

👥 Roles y Permisos
Rol	        Crear solicitud	Ver docs	     Aprobar	        Registrar horas	Ver reportes
Estudiante	✅	            ✅ (propios)	    ❌	                     ✅	    ✅ (propios)
Tutor	    ❌	            ✅ (asignados)	✅ (1er nivel)	         ❌	    ✅ (tutelados)
Coordinador	❌	            ✅ (todos)	    ✅ (2do nivel)	         ❌     	✅ (por carrera)
Decano	    ❌	            ✅ (todos)	    ✅ (final)	             ❌     	✅ (facultad)
Admin	    ❌	            ✅ (todos)	    ❌	                     ❌     	✅ (completos)

📦 Dependencias principales

internship-service
@nestjs/core — Framework NestJS
@nestjs/typeorm + typeorm + pg — ORM + PostgreSQL
class-validator / class-transformer — Validación de DTOs
@nestjs/swagger — Documentación OpenAPI
document-service
@nestjs/core — Framework NestJS
@nestjs/mongoose + mongoose — ODM + MongoDB
multer — Subida de archivos
class-validator / class-transformer — Validación

📁 Estructura de carpetas (por servicio)
src/
├── main.ts                    # Punto de entrada
├── app.module.ts              # Módulo raíz
├── database/                  # Configuración de BD
│   └── database.module.ts
├── modules/                   # Módulos funcionales
│   ├── internship/            # (o document/)
│   │   ├── internship.entity.ts
│   │   ├── create-internship.dto.ts
│   │   ├── internship.service.ts
│   │   ├── internship.controller.ts
│   │   └── internship.module.ts
│   └── hour-log/
│       ├── hour-log.entity.ts
│       ├── create-hour-log.dto.ts
│       ├── hour-log.service.ts
│       ├── hour-log.controller.ts
│       └── hour-log.module.ts
└── common/                    # Guardias, filtros, interceptors

📝 Licencia

Proyecto académico Universitario — Universidad Central del Ecuador.