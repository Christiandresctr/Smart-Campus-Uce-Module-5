# Principios de Diseno — Smart Campus UCE Modulo 5

## SOLID

### S — Single Responsibility Principle (Principio de Responsabilidad Unica)

Cada microservicio tiene una unica responsabilidad bien definida:

| Servicio | Responsabilidad Unica |
|---|---|
| internship-service | Gestionar practicas y horas |
| document-service | Almacenar y recuperar documentos |
| approval-workflow | Ejecutar flujo de aprobacion |
| report-hours | Consolidar horas y generar certificados |
| notification-service | Enviar notificaciones |
| company-service | Gestionar catalogo de empresas |
| audit-log-service | Registrar eventos de auditoria |
| scheduling-service | Gestionar horarios |
| evaluation-service | Evaluar desempeno |
| compliance-service | Verificar cumplimiento |

**Ejemplo en codigo**: En `internship-service`, el `InternshipService` solo maneja logica de practicas, y el `HourLogService` (si existiera separado) solo maneja horas. No hay un "SuperService" que haga todo.

### O — Open/Closed Principle (Principio Abierto/Cerrado)

Los modulos NestJS son abiertos para extension pero cerrados para modificacion:

- **Extension**: Agregar un nuevo endpoint no requiere modificar endpoints existentes
- **Modulo nuevo**: Crear un nuevo modulo NestJS sin modificar los existentes
- **DTOs**: Nuevos campos se agregan como opcionales, sin romper validaciones existentes

### L — Liskov Substitution Principle (Principio de Sustitucion de Liskov)

Los servicios pueden ser reemplazados sin afectar al sistema:

- Cada servicio tiene su propia base de datos (puede migrar de PostgreSQL a MongoDB sin afectar a otros)
- El API Gateway puede redirigir a un servicio reemplazado sin cambio en clientes
- Los DTOs de entrada/salida son consistentes entre versiones

### I — Interface Segregation Principle (Principio de Segregacion de Interfaces)

DTOs segregados por operacion:

```typescript
// No hay un DTO gigante para todo
CreateInternshipDto    // Solo para crear
UpdateInternshipDto    // Solo para actualizar (todos opcionales)
CreateHourLogDto       // Solo para horas
ApproveRejectDto       // Solo para aprobacion
```

### D — Dependency Inversion Principle (Principio de Inversion de Dependencias)

NestJS inyecta dependencias via constructor:

```typescript
// El controller depende de la abstraccion (service), no de la implementacion
@Controller('internship')
class InternshipController {
  constructor(private readonly internshipService: InternshipService) {}
}
```

- Los modulos definen interfaces (providers)
- Los controllers no conocen la implementacion de los services
- Facil para testing con mocks

---

## DRY — Don't Repeat Yourself

- **Docker Compose**: Un solo archivo `docker-compose.yml` define toda la infraestructura
- **GitHub Actions**: Workflows reutilizan jobs (discover, build, test)
- **Swagger**: Configuracion compartida en cada servicio NestJS
- **Validaciones**: DTOs con `class-validator` reutilizan validaciones estandar

---

## KISS — Keep It Simple, Stupid

- **Endpoints REST simples**: CRUD directo sin sobre-ingenieria
- **Sin framework pesado**: NestJS para NestJS services, FastAPI para Python
- **Docker Compose**: En lugar de Kubernetes (suficiente para el caso de uso)
- **Synchronize: true**: Para desarrollo rapido (con warning de produccion)

---

## YAGNI — You Aren't Gonna Need It

- Solo funcionalidades implementadas, sin features hypotheticals
- Sin sistema de autenticacion JWT (aun no requerido por la rubrica)
- Sin frontend (aun no requerido)
- Sin gRPC (REST es suficiente para la comunicacion actual)
- Sin CQRS completo (solo separacion implicita)

---

## Low Coupling — Bajo Acoplamiento

| Estrategia | Implementacion |
|---|---|
| Bases de datos separadas | Cada servicio tiene su propia DB |
| Comunicacion via REST | Servicios se comunican solo via HTTP |
| API Gateway | Punto de entrada unico, servicios no exuestos directamente |
| Eventos asincronos | RabbitMQ para desacoplar notificaciones |
| Docker network | Red aislada `modulo5-net` |

**Beneficios**:
- Un servicio puede caer sin afectar a otros
- Despliegue independiente por servicio
- Escalabilidad selectiva (escalar solo el servicio cargado)

---

## High Cohesion — Alta Cohesion

| Servicio | Logica Agrupada |
|---|---|
| internship-service | Practicas + Horas + GPS (mismo dominio) |
| document-service | Upload + Storage + Versioning + Hash (mismo dominio) |
| approval-workflow | Flujo + Firmas + PDF + RabbitMQ (mismo dominio) |
| report-hours | Horas + Certificados + Validacion cedula (mismo dominio) |
| notification-service | REST + WebSocket + RabbitMQ (mismo dominio) |

**Cada servicio agrupa toda la logica relacionada** con su dominio de negocio, sin dispersar responsabilidades en multiples servicios.

---

## Otros Patrones Aplicados

### Repository Pattern (TypeORM)
```typescript
// TypeORM actua como repository abstraction
@Entity()
class Internship {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
```

### DTO Pattern (Data Transfer Objects)
```typescript
// DTOs para validacion de entrada
class CreateInternshipDto {
  @IsString()
  student_id: string;

  @IsDateString()
  start_date: Date;
}
```

### Controller-Service Pattern
```typescript
// Separacion de responsabilidades
@Controller('internship')
class InternshipController {
  // Solo maneja HTTP
}

class InternshipService {
  // Solo logica de negocio
}
```

### Event-Driven Pattern (RabbitMQ)
```typescript
// Publicar eventos sin conocer consumidores
await this.channel.publish('notifications', 'notification.userId', message);
```

### Cache-Aside Pattern (Redis)
```typescript
// Cache transparente para lecturas
const cached = await redis.get(key);
if (cached) return JSON.parse(cached);
const data = await db.query(...);
await redis.setex(key, 300, JSON.stringify(data));
```
