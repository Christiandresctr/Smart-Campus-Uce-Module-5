# Guia de Contribution — Smart Campus UCE Modulo 5

## Primeros Pasos

### 1. Clonar el repositorio

```bash
git clone https://github.com/Christiandresctr/Smart-Campus-Uce-Module-5.git
cd Smart-Campus-Uce-Module-5
```

### 2. Instalar dependencias

```bash
# Requiere pnpm 10.27.0+
corepack enable
corepack prepare pnpm@10.27.0 --activate
pnpm install
```

### 3. Ejecutar servicios en desarrollo

```bash
# Todos los servicios en paralelo
pnpm run dev

# Un solo servicio
cd apps/internship-service
pnpm run start:dev
```

### 4. Ejecutar con Docker Compose

```bash
docker compose -f docker/docker-compose.yml up -d
```

## Estructura del Monorepo

```
smart-campus-uce-modulo5/
├── apps/                    # Microservicios
│   ├── internship-service/  # NestJS + PostgreSQL
│   ├── document-service/    # NestJS + MongoDB
│   ├── ...                  # Otros servicios
├── docker/                  # Docker Compose y configuracion
├── Terraform/               # Infraestructura AWS
├── .github/                 # CI/CD workflows
├── docs/                    # Documentacion
├── package.json             # Scripts del monorepo
└── pnpm-workspace.yaml      # Configuracion workspaces
```

## Convenciones de Codigo

### NestJS Services

```typescript
// Estructura de un modulo
src/
├── main.ts
├── app.module.ts
└── modules/
    └── [feature]/
        ├── [feature].entity.ts
        ├── create-[feature].dto.ts
        ├── [feature].service.ts
        ├── [feature].controller.ts
        └── [feature].module.ts
```

- Usar **DTOs** para validacion con `class-validator`
- Documentar endpoints con **Swagger** (`@ApiTags`, `@ApiOperation`)
- Usar **TypeORM** para PostgreSQL, **Mongoose** para MongoDB
- Seguir principios **SOLID**

### Python Services (FastAPI)

```python
# Estructura
app/
├── main.py           # FastAPI app
├── models.py         # SQLAlchemy/PyMongo models
├── schemas.py        # Pydantic schemas
├── routes/           # Endpoints
└── tests/            # Pruebas pytest
```

- Usar **Pydantic** para validacion
- Documentar con **FastAPI auto-docs**
- Usar **SQLAlchemy** para PostgreSQL, **PyMongo** para MongoDB

## Crear un Nuevo Servicio

### 1. Crear directorio

```bash
mkdir apps/mi-servicio
cd apps/mi-servicio
```

### 2. Inicializar proyecto

```bash
# Para NestJS
nest new mi-servicio --package-manager pnpm

# Para Python FastAPI
python -m venv venv
pip install fastapi uvicorn sqlalchemy
```

### 3. Configurar Docker

Crear `Dockerfile` con multi-stage build:

```dockerfile
# NestJS example
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main"]
```

### 4. Agregar al docker-compose.yml

```yaml
  mi-servicio-db:
    image: postgres:16-alpine
    # ... configuracion

  mi-servicio:
    image: camaisincho/mi-servicio:latest
    expose:
      - "3011"
    depends_on:
      - mi-servicio-db
    environment:
      DB_HOST: mi-servicio-db
    networks:
      - modulo5-net
```

### 5. Agregar al nginx.conf

```nginx
upstream mi-servicio {
    server mi-servicio:3011;
}

location /api/v1/mi-servicio/ {
    proxy_pass http://mi-servicio;
}
```

### 6. Actualizar README

Agregar documentacion del nuevo servicio en el README raiz.

## Proceso de Pull Request

1. **Crear branch** desde `dev`:
   ```bash
   git checkout -b feat/mi-feature dev
   ```

2. **Hacer cambios** siguiendo las convenciones de codigo

3. **Ejecutar tests**:
   ```bash
   pnpm run test
   ```

4. **Ejecutar lint**:
   ```bash
   pnpm run lint
   ```

5. **Commit** con formato convencional:
   ```bash
   git commit -m "feat(mi-servicio): add new endpoint"
   ```

6. **Push** y crear PR:
   ```bash
   git push origin feat/mi-feature
   ```

7. **Usar el PR template** (`.github/PULL_REQUEST_TEMPLATE.md`)

8. **Esperar review** y CI pipeline

## Comandos Utiles

```bash
# Monorepo
pnpm run dev          # Ejecutar todos los servicios
pnpm run build        # Construir todos
pnpm run test         # Tests de todos
pnpm run lint         # Lint de todos

# Docker
docker compose -f docker/docker-compose.yml up -d
docker compose -f docker/docker-compose.yml down
docker compose -f docker/docker-compose.yml logs -f [servicio]

# Terraform
cd Terraform
terraform init
terraform plan
terraform apply

# Git
git log --oneline -10    # Ver ultimos commits
git branch -v            # Ver branches
```

## Documentacion

- [Arquitectura](docs/ARCHITECTURE.md)
- [Diagramas](docs/DIAGRAMS.md)
- [Costos AWS](docs/COST-ANALYSIS.md)
- [Principios de Diseno](docs/DESIGN-PRINCIPLES.md)
- [Convenciones de Commits](docs/CONVENTIONAL-COMMITS.md)
