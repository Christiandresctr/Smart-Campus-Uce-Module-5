# Convenciones de Commits — Smart Campus UCE Modulo 5

## Formato

```
<type>(<scope>): <descripcion corta>

[descripcion opcional mas detallada]

[footer opcional: referencia a Jira]
```

## Tipos de Commit

| Tipo | Descripcion | Emoji |
|---|---|---|
| `feat` | Nueva funcionalidad | ✨ |
| `fix` | Correccion de bug | 🐛 |
| `docs` | Solo cambios en documentacion | 📚 |
| `style` | Formato, puntos y comas, etc (sin cambio de logica) | 💅 |
| `refactor` | Refactorizacion de codigo (sin cambio de funcionalidad) | 🔨 |
| `test` | Agregar o corregir pruebas | 🧪 |
| `chore` | Tareas de mantenimiento (dependencias, configs, etc) | 🔧 |
| `ci` | Cambios en configuracion de CI/CD | 🔄 |
| `build` | Cambios que afectan el build o dependencias externas | 📦 |
| `perf` | Mejora de rendimiento | ⚡ |
| `revert` | Revertir un commit anterior | ⏪ |

## Scopes Disponibles

| Scope | Servicio/Area |
|---|---|
| `internship` | internship-service (practicas y horas) |
| `document` | document-service (documentos institucionales) |
| `approval` | approval-workflow (flujo de aprobacion) |
| `report` | report-hours (consolidacion y certificados) |
| `notification` | notification-service (notificaciones) |
| `company` | company-service (catalogo de empresas) |
| `audit` | audit-log-service (auditoria) |
| `scheduling` | scheduling-service (horarios) |
| `evaluation` | evaluation-service (evaluaciones) |
| `compliance` | compliance-service (cumplimiento) |
| `terraform` | Infraestructura AWS |
| `docker` | Docker Compose y Dockerfiles |
| `ci` | GitHub Actions workflows |
| `docs` | Documentacion general |
| `deps` | Dependencias del monorepo |

## Ejemplos del Proyecto

### Feature (nueva funcionalidad)
```
feat(internship): add GPS coordinates to hour log endpoint
feat(approval): implement three-level approval workflow
feat(notification): add WebSocket gateway for real-time notifications
feat(report): add Ecuadorian cedula validation algorithm
feat(company): add RUC validation and slot management
```

### Fix (correccion de bug)
```
fix(document): resolve file hash calculation for large files
fix(scheduling): fix Redis cache invalidation on update
fix(notification): resolve WebSocket disconnect on user logout
fix(evaluation): fix pagination skip/limit parameters
fix(compliance): fix MongoDB connection string for shared instance
```

### Docs (documentacion)
```
docs: update README with all 10 microservices
docs(architecture): add sequence diagrams for approval workflow
docs(cost): add AWS cost analysis
docs(contributing): add development guide
```

### Refactor
```
refactor(audit): extract audit logging to shared interceptor
refactor(internship): simplify hour log validation logic
refactor(company): use TypeORM query builder for complex queries
```

### Test
```
test(internship): add unit tests for hour log service
test(report): add cedula validation edge cases
test(evaluation): add integration tests for CRUD operations
test(compliance): add MongoDB connection tests
```

### Chore
```
chore(deps): update NestJS to v11
chore(docker): optimize multi-stage Dockerfile builds
chore(terraform): update AMI to latest Amazon Linux 2023
```

### CI/CD
```
ci: add dedicated test workflow for Python services
ci(deploy): add Jira transition on PR merge
ci: add matrix build for all 10 microservices
```

## Reglas

1. **Maximo 50 caracteres** en la descripcion del titulo
2. **Usar imperativo**: "add feature" no "added feature"
3. **No capitalizar** la primera letra despues del tipo
4. **No punto** al final de la descripcion
5. **Scope en minusculas**: `feat(internship)` no `feat(Internship)`
6. **Referenciar Jira** en el footer cuando aplique: `Ref: PROYECTO-123`

## Commits con Jira

Los commits pueden incluir la referencia a Jira en el mensaje:

```
feat(internship): add hour log endpoint

Implement POST /internship/:id/hours with GPS coordinates
and PUT /internship/:id/hours/:hourId for approval.

Ref: PROYECTO-45
```

El workflow de CI (`ci.yml`) extrae automaticamente la clave de Jira del commit y transiciona el ticket a "En curso".

## Commits de Merge (PR)

Al hacer merge de un PR, el workflow de CD transiciona el ticket de Jira segun la rama:

| Rama destino | Transicion Jira |
|---|---|
| dev | En curso (21) |
| test | En QA (31) |
| main | Desplegado (41) |
