# Testing — Smart Campus UCE Modulo 5

## Tipos de Testing

| Tipo | Herramienta | Descripcion |
|---|---|---|
| Unit Tests | Jest (NestJS), pytest (Python) | Pruebas aisladas de servicios y controladores |
| E2E / Functional Tests | Supertest (NestJS), TestClient (Python) | Pruebas de endpoints HTTP con logica de negocio |
| Load Tests | k6 | Pruebas de carga y rendimiento |

## Ejecutar Tests

### Unit Tests

```bash
# Todos los servicios NestJS
pnpm run test

# Un solo servicio
cd apps/internship-service && pnpm test

# Python services
cd apps/report-hours && pytest tests/ -v
cd apps/compliance-service && pytest tests/ -v
cd apps/evaluation-service && pytest tests/ -v
```

### E2E / Functional Tests

```bash
# Un solo servicio (requiere DB corriendo)
cd apps/internship-service && pnpm run test:e2e
cd apps/document-service && pnpm run test:e2e
cd apps/approval-workflow && pnpm run test:e2e
cd apps/company-service && pnpm run test:e2e
cd apps/notification-service && pnpm run test:e2e
cd apps/scheduling-service && pnpm run test:e2e
cd apps/audit-log-service && pnpm run test:e2e
```

### Load Tests (k6)

```bash
# Instalar k6
# macOS: brew install k6
# Linux: sudo apt-get install k6
# Windows: choco install k6

# Ejecutar load tests (requiere servicios corriendo en :80)
k6 run tests/load/k6-internship.js
k6 run tests/load/k6-company.js
k6 run tests/load/k6-report-hours.js

# Con URL personalizada
k6 run --env BASE_URL=http://your-server:80 tests/load/k6-internship.js
```

### Coverage

```bash
# NestJS coverage
cd apps/internship-service && pnpm run test:cov

# Python coverage
cd apps/report-hours && pytest tests/ --cov=app --cov-report=html
```

## CI/CD

Los tests se ejecutan automaticamente en:

| Workflow | Trigger | Que ejecuta |
|---|---|---|
| `ci.yml` | push/PR | Unit tests por servicio (matrix) |
| `test.yml` | push/PR | Unit tests (NestJS + Python) + E2E tests |
| `test.yml` (load-test) | push a main | k6 load tests |
| `deploy.yml` | PR merged | Tests antes de deploy |

### Estructura de Tests

```
tests/
├── load/
│   ├── k6-internship.js      # Load test: internship-service
│   ├── k6-company.js         # Load test: company-service
│   └── k6-report-hours.js    # Load test: report-hours

apps/
├── internship-service/
│   ├── src/modules/
│   │   ├── internship/
│   │   │   └── internship.service.spec.ts    # Unit tests
│   │   └── hour-log/
│   │       └── hour-log.service.spec.ts      # Unit tests
│   └── test/
│       └── app.e2e-spec.ts                   # E2E tests
├── document-service/
│   ├── src/modules/document/
│   │   └── document.service.spec.ts          # Unit tests
│   └── test/
│       └── app.e2e-spec.ts                   # E2E tests
├── approval-workflow/
│   ├── src/modules/approval/
│   │   └── approval.service.spec.ts          # Unit tests
│   └── test/
│       └── app.e2e-spec.ts                   # E2E tests
├── company-service/
│   ├── src/company/
│   │   ├── company.controller.spec.ts        # Unit tests
│   │   └── company.service.spec.ts           # Unit tests
│   └── test/
│       └── app.e2e-spec.ts                   # E2E tests
├── notification-service/
│   ├── src/modules/notification/
│   │   └── notification.service.spec.ts      # Unit tests
│   └── test/
│       └── app.e2e-spec.ts                   # E2E tests
├── scheduling-service/
│   ├── src/modules/schedule/
│   │   └── schedule.service.spec.ts          # Unit tests
│   └── test/
│       └── app.e2e-spec.ts                   # E2E tests
├── audit-log-service/
│   ├── src/audit/
│   │   ├── audit.controller.spec.ts          # Unit tests
│   │   └── audit.service.spec.ts             # Unit tests
│   └── test/
│       └── app.e2e-spec.ts                   # E2E tests
├── report-hours/
│   └── tests/
│       ├── test_main.py                      # Health tests
│       ├── test_services.py                  # Cedula validation
│       └── conftest.py                       # DB fixtures
├── evaluation-service/
│   └── tests/
│       ├── test_evaluation.py                # CRUD tests
│       └── conftest.py                       # DB fixtures
└── compliance-service/
    └── tests/
        ├── test_compliance.py                # CRUD tests
        └── conftest.py                       # DB fixtures
```

## Cobertura de Tests por Servicio

| Servicio | Unit Tests | E2E Tests | Total |
|---|---|---|---|
| internship-service | ~10 | ~10 | ~20 |
| document-service | ~4 | ~5 | ~9 |
| approval-workflow | ~8 | ~9 | ~17 |
| company-service | ~8 | ~5 | ~13 |
| notification-service | ~5 | ~5 | ~10 |
| scheduling-service | ~5 | ~6 | ~11 |
| audit-log-service | ~4 | ~4 | ~8 |
| report-hours | ~6 | - | ~6 |
| evaluation-service | ~6 | - | ~6 |
| compliance-service | ~7 | - | ~7 |
| **Total** | **~63** | **~44** | **~107** |
