# Arquitectura del Sistema — Smart Campus UCE Modulo 5

## Diagrama de Componentes

```mermaid
graph TB
    subgraph "Capa de Cliente"
        CLIENT["Cliente Web/Movil"]
    end

    subgraph "Capa de API Gateway"
        NGINX["Nginx API Gateway<br/>Puerto 80"]
    end

    subgraph "Capa de Microservicios"
        direction LR
        S1["internship-service"]
        S2["document-service"]
        S3["approval-workflow"]
        S4["report-hours"]
        S5["notification-service"]
        S6["company-service"]
        S7["audit-log-service"]
        S8["scheduling-service"]
        S9["evaluation-service"]
        S10["compliance-service"]
    end

    subgraph "Capa de Middleware"
        REDIS["Redis<br/>Cache"]
        RABBIT["RabbitMQ<br/>Message Broker"]
    end

    subgraph "Capa de Persistencia"
        direction LR
        PG["PostgreSQL x5<br/>Datos relacionales"]
        MG["MongoDB x3<br/>Documentos y auditoria"]
    end

    CLIENT --> NGINX
    NGINX --> S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S9 & S10
    S1 & S3 & S4 & S6 & S8 & S9 --> PG
    S2 & S5 & S7 & S10 --> MG
    S5 --> RABBIT
    S8 --> REDIS
    S4 --> REDIS
```

## Diagrama de Secuencia — Flujo de Aprobacion Multinivel

```mermaid
sequenceDiagram
    participant E as Estudiante
    participant IS as internship-service
    participant AW as approval-workflow
    participant RMQ as RabbitMQ
    participant NS as notification-service
    participant T as Tutor
    participant C as Coordinador
    participant D as Decano

    E->>IS: POST /internship (crear solicitud)
    IS-->>E: 201 Created (status: pending_review)

    E->>AW: POST /approval/start
    AW->>AW: Crear Approval (step: tutor, status: pending)
    AW->>RMQ: Publicar evento notification.tutor

    RMQ->>NS: Evento: notificar al tutor
    NS->>T: WebSocket: Nueva solicitud pendiente

    T->>AW: PUT /approval/:id/approve (tutor)
    AW->>AW: Avanzar step: coordinator
    AW->>RMQ: Publicar evento notification.coordinator

    RMQ->>NS: Evento: notificar al coordinador
    NS->>C: WebSocket: Solicitud para revisar

    C->>AW: PUT /approval/:id/approve (coordinator)
    AW->>AW: Avanzar step: dean
    AW->>RMQ: Publicar evento notification.dean

    RMQ->>NS: Evento: notificar al decano
    NS->>D: WebSocket: Solicitud final

    D->>AW: PUT /approval/:id/approve (dean)
    AW->>AW: Status final: approved
    AW->>IS: Actualizar internship status
    IS-->>E: Pratica aprobada
```

## Diagrama de Secuencia — Registro de Horas

```mermaid
sequenceDiagram
    participant E as Estudiante
    participant RH as report-hours
    participant IS as internship-service
    participant REDIS as Redis Cache
    participant DB as PostgreSQL

    E->>RH: POST /reports/hours (cedula, horas, descripcion)
    RH->>RH: Validar cedula (algoritmo modulo 10)
    RH->>DB: Insertar HourLog
    RH-->>E: 201 Created

    E->>IS: POST /internship/:id/hours (coordenadas GPS)
    IS->>DB: Insertar HourLog con lat/lng
    IS-->>E: 201 Created

    E->>RH: GET /reports/report/hours/{cedula}
    RH->>REDIS: Verificar cache
    alt Cache hit
        REDIS-->>RH: Datos cached
    else Cache miss
        RH->>DB: Consultar horas consolidadas
        RH->>REDIS: Guardar en cache (TTL 300s)
    end
    RH-->>E: Reporte consolidado
```

## Diagrama de Secuencia — Notificaciones en Tiempo Real

```mermaid
sequenceDiagram
    participant S as Servicio fuente
    participant RMQ as RabbitMQ
    participant NS as notification-service
    participant WS as WebSocket Gateway
    participant C as Cliente

    S->>RMQ: Publicar evento (topic: notifications)
    RMQ->>NS: Consumir mensaje (routing: notification.{userId})
    NS->>NS: Guardar notificacion en MongoDB
    NS->>WS: Emitir evento notification:new
    WS->>C: Push notification via WebSocket
    C-->>NS: PATCH /notification/:id (marcar leida)
```

## Topologia de Red — AWS

```mermaid
graph TB
    subgraph "Internet"
        USER[Usuario]
    end

    subgraph "AWS Cloud - us-east-1"
        subgraph "VPC 10.0.0.0/16"
            subgraph "Public Subnet 10.0.1.0/24 - AZ a"
                EC2["EC2 Instance<br/>t3.small / t2.micro"]
            end
            subgraph "Public Subnet 10.0.2.0/24 - AZ b (Prod)"
                EC2B["EC2 Instance<br/>t2.micro (ASG)"]
            end
            IGW["Internet Gateway"]
            RT["Route Table"]
        end
        EIP["Elastic IP"]
        SG["Security Group<br/>SSH:22, HTTP:80, Services:3000-15672"]
    end

    USER --> EIP
    EIP --> EC2
    EC2 --> SG
    SG --> EC2
    EC2 --> IGW
    IGW --> RT
    RT --> EC2
```

## Patrones Arquitectonicos

### Microservicios
Cada servicio es desplegable independientemente, tiene su propia base de datos, y se comunica via REST API a traves del API Gateway.

| Servicio | Responsabilidad | Base de Datos | Patron |
|---|---|---|---|
| internship-service | Practicas y horas | PostgreSQL | CRUD |
| document-service | Documentos institucionales | MongoDB | File Storage |
| approval-workflow | Aprobacion multinivel | PostgreSQL | State Machine |
| report-hours | Consolidacion y certificados | PostgreSQL | Report Generation |
| notification-service | Notificaciones | MongoDB | Event-Driven |
| company-service | Catalogo de empresas | PostgreSQL | Catalog |
| audit-log-service | Auditoria del sistema | MongoDB | Event Sourcing |
| scheduling-service | Horarios | PostgreSQL | CQRS (cache) |
| evaluation-service | Evaluaciones | PostgreSQL | CRUD |
| compliance-service | Cumplimiento | MongoDB | Status Tracking |

### Event-Driven (RabbitMQ)
- Exchange: `notifications` (topic)
- Routing Key: `notification.{userId}`
- Producer: Servicios que generan eventos (approval-workflow)
- Consumer: notification-service

### CQRS (Command Query Responsibility Segregation)
Implementado implicitamente mediante:
- **Commands**: Endpoints POST/PUT/DELETE para escritura
- **Queries**: Endpoints GET para lectura
- **Read Model**: Redis cache en scheduling-service y report-hours

### API Gateway (Nginx)
- Punto de entrada unico
- Reverse proxy a los 10 microservicios
- Health check en `/health`
- Headers: Host, X-Real-IP para trazabilidad

## Decisiones Arquitectonicas (ADR)

### ADR-001: Monorepo con pnpm workspaces
- **Decision**: Usar monorepo en lugar de repositorios separados
- **Razon**: Facilita desarrollo local, CI/CD compartido, y despliegue atomico
- **Consecuencias**: Acoplamiento entre servicios, pero simplifica el workflow

### ADR-002: Polyglot (NestJS + Python FastAPI)
- **Decision**: Usar NestJS para servicios CRUD y Python para servicios de ML/analytics
- **Razon**: NestJS optimizado para APIs REST, Python para procesamiento de datos y validacion de cedula
- **Consecuencias**: Doble stack de mantenimiento, pero optimizacion por dominio

### ADR-003: PostgreSQL + MongoDB
- **Decision**: PostgreSQL para datos relacionales, MongoDB para documentos y auditoria
- **Razon**: PostgreSQL para integridad referencial (practicas, empresas), MongoDB para flexibilidad (documentos, logs)
- **Consecuencias**: Consistencia en transacciones criticas, flexibilidad en datos semiestructurados

### ADR-004: Docker Compose en lugar de Kubernetes
- **Decision**: Docker Compose para orquestacion
- **Razon**: Proyecto academico, simplicidad de operacion, un solo servidor EC2
- **Consecuencias**: Sin auto-healing ni auto-scaling a nivel de contenedor (usar ASG de AWS)
